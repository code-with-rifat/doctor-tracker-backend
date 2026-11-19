const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalDoctors,
    totalPatients,
    patientsThisMonth,
    patientsPerDoctor,
    patientsLast30Days,
    patientsLast12Months,
    patientsByCondition,
    topSpecializations,
  ] = await Promise.all([
    Doctor.countDocuments(),
    Patient.countDocuments(),
    Patient.countDocuments({ createdAt: { $gte: startOfMonth } }),

    // Bar chart: patients per doctor (top 10)
    Patient.aggregate([
      { $group: { _id: '$doctor', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'doctors',
          localField: '_id',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: '$doctor' },
      {
        $project: {
          _id: 0,
          doctorId: '$_id',
          name: '$doctor.name',
          count: 1,
        },
      },
    ]),

    // Line: patients added per day for last 30 days
    Patient.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', count: 1 } },
    ]),

    // Area: patients added per month for last 12 months
    Patient.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, month: '$_id', count: 1 } },
    ]),

    // Donut: patients by condition
    Patient.aggregate([
      { $group: { _id: '$condition', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, condition: '$_id', count: 1 } },
    ]),

    // Top specializations by patient volume
    Patient.aggregate([
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      { $unwind: '$doctor' },
      {
        $group: {
          _id: '$doctor.specialization',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
      {
        $project: {
          _id: 0,
          specialization: '$_id',
          count: 1,
        },
      },
    ]),
  ]);

  const averagePatientsPerDoctor =
    totalDoctors === 0 ? 0 : Math.round((totalPatients / totalDoctors) * 10) / 10;

  // Fill missing days in the 30-day series so the chart is continuous
  const dayMap = new Map(patientsLast30Days.map((d) => [d.date, d.count]));
  const filledLast30Days = [];
  for (let i = 0; i < 30; i += 1) {
    const d = new Date(thirtyDaysAgo);
    d.setDate(thirtyDaysAgo.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    filledLast30Days.push({ date: key, count: dayMap.get(key) || 0 });
  }

  // Fill missing months in the 12-month series
  const monthMap = new Map(patientsLast12Months.map((m) => [m.month, m.count]));
  const filledLast12Months = [];
  for (let i = 0; i < 12; i += 1) {
    const d = new Date(twelveMonthsAgo.getFullYear(), twelveMonthsAgo.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    filledLast12Months.push({ month: key, count: monthMap.get(key) || 0 });
  }

  return {
    cards: {
      totalDoctors,
      totalPatients,
      patientsThisMonth,
      averagePatientsPerDoctor,
    },
    charts: {
      patientsPerDoctor,
      patientsLast30Days: filledLast30Days,
      patientsLast12Months: filledLast12Months,
      patientsByCondition,
      topSpecializations,
    },
  };
}

module.exports = { getStats };
