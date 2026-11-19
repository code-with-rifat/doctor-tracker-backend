const mongoose = require('mongoose');
const { mongoUri } = require('../config/env');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { ensureDemoAdmin } = require('./createDemoAdmin');

const doctors = [
  {
    name: 'Dr. Sarah Rahman',
    specialization: 'General Medicine',
    hospital: 'Dhaka Community Clinic',
    phone: '+8801700000101',
    email: 'sarah.rahman.demo@doctortracker.com',
  },
  {
    name: 'Dr. Imran Hossain',
    specialization: 'Cardiology',
    hospital: 'City Care Hospital',
    phone: '+8801700000102',
    email: 'imran.hossain.demo@doctortracker.com',
  },
  {
    name: 'Dr. Nusrat Jahan',
    specialization: 'Pediatrics',
    hospital: 'Green Life Clinic',
    phone: '+8801700000103',
    email: 'nusrat.jahan.demo@doctortracker.com',
  },
];

const patients = [
  {
    name: 'Amina Rahman',
    age: 34,
    gender: 'Female',
    phone: '+8801700000201',
    condition: 'Hypertension',
    doctorEmail: 'imran.hossain.demo@doctortracker.com',
  },
  {
    name: 'Tariq Hasan',
    age: 52,
    gender: 'Male',
    phone: '+8801700000202',
    condition: 'Type 2 Diabetes',
    doctorEmail: 'sarah.rahman.demo@doctortracker.com',
  },
  {
    name: 'Sadia Khan',
    age: 8,
    gender: 'Female',
    phone: '+8801700000203',
    condition: 'Asthma',
    doctorEmail: 'nusrat.jahan.demo@doctortracker.com',
  },
  {
    name: 'Mahmud Karim',
    age: 46,
    gender: 'Male',
    phone: '+8801700000204',
    condition: 'Migraine',
    doctorEmail: 'sarah.rahman.demo@doctortracker.com',
  },
  {
    name: 'Jannat Islam',
    age: 12,
    gender: 'Female',
    phone: '+8801700000205',
    condition: 'Anemia',
    doctorEmail: 'nusrat.jahan.demo@doctortracker.com',
  },
  {
    name: 'Rafiq Uddin',
    age: 61,
    gender: 'Male',
    phone: '+8801700000206',
    condition: 'Coronary artery disease',
    doctorEmail: 'imran.hossain.demo@doctortracker.com',
  },
];

async function seedDemoData() {
  await mongoose.connect(mongoUri);

  try {
    await ensureDemoAdmin();

    const doctorByEmail = new Map();
    let doctorsCreated = 0;
    for (const doctorData of doctors) {
      let doctor = await Doctor.findOne({ email: doctorData.email });
      if (!doctor) {
        doctor = await Doctor.create(doctorData);
        doctorsCreated += 1;
      }
      doctorByEmail.set(doctorData.email, doctor);
    }

    let patientsCreated = 0;
    for (const patientData of patients) {
      const { doctorEmail, ...data } = patientData;
      const existingPatient = await Patient.exists({ phone: data.phone });
      if (existingPatient) continue;

      await Patient.create({
        ...data,
        doctor: doctorByEmail.get(doctorEmail)._id,
      });
      patientsCreated += 1;
    }

    console.log(
      `Demo data ready: ${doctorsCreated} doctors and ${patientsCreated} patients added.`
    );
  } finally {
    await mongoose.disconnect();
  }
}

seedDemoData().catch(async (err) => {
  console.error('Demo data setup failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
