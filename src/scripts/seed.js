const mongoose = require('mongoose');
const { mongoUri } = require('../config/env');
const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const CONDITIONS = [
  'Hypertension',
  'Type 2 Diabetes',
  'Asthma',
  'Migraine',
  'Lower back pain',
  'Allergic rhinitis',
  'Hypothyroidism',
  'Coronary artery disease',
  'Gastritis',
  'Anxiety disorder',
  'Osteoarthritis',
  'Chronic kidney disease',
  'Pneumonia',
  'Anemia',
  'Eczema',
];

const DOCTORS = [
  {
    name: 'Dr. Farhana Rahman',
    specialization: 'Cardiology',
    hospital: 'Square Hospital, Dhaka',
    phone: '+8801712345001',
    email: 'farhana.rahman@squarehospital.com',
  },
  {
    name: 'Dr. Imran Hossain',
    specialization: 'Neurology',
    hospital: 'United Hospital, Dhaka',
    phone: '+8801712345002',
    email: 'imran.hossain@united.com.bd',
  },
  {
    name: 'Dr. Nusrat Jahan',
    specialization: 'Pediatrics',
    hospital: 'Evercare Hospital, Dhaka',
    phone: '+8801712345003',
    email: 'nusrat.jahan@evercarebd.com',
  },
  {
    name: 'Dr. Kamal Uddin Ahmed',
    specialization: 'Orthopedics',
    hospital: 'Labaid Specialized Hospital',
    phone: '+8801712345004',
    email: 'kamal.ahmed@labaid.com.bd',
  },
  {
    name: 'Dr. Sabina Yasmin',
    specialization: 'Dermatology',
    hospital: 'Popular Diagnostic Centre, Dhanmondi',
    phone: '+8801712345005',
    email: 'sabina.yasmin@popular-bd.com',
  },
  {
    name: 'Dr. Rafiqul Islam',
    specialization: 'Gastroenterology',
    hospital: 'Ibn Sina Hospital, Panthapath',
    phone: '+8801712345006',
    email: 'rafiqul.islam@ibnsina.com',
  },
  {
    name: 'Dr. Ayesha Siddiqua',
    specialization: 'Oncology',
    hospital: 'Bangabandhu Sheikh Mujib Medical University',
    phone: '+8801712345007',
    email: 'ayesha.siddiqua@bsmmu.edu.bd',
  },
  {
    name: 'Dr. Tanvir Alam',
    specialization: 'Endocrinology',
    hospital: 'Asgar Ali Hospital, Gandaria',
    phone: '+8801712345008',
    email: 'tanvir.alam@asgarali.com',
  },
  {
    name: 'Dr. Meherun Nesa',
    specialization: 'Pulmonology',
    hospital: 'Apollo Imperial Hospital, Chattogram',
    phone: '+8801812345009',
    email: 'meherun.nesa@apolloimperial.com',
  },
  {
    name: 'Dr. Sharif Mahmud',
    specialization: 'Nephrology',
    hospital: 'Square Hospital, Dhaka',
    phone: '+8801712345010',
    email: 'sharif.mahmud@squarehospital.com',
  },
  {
    name: 'Dr. Laila Banu',
    specialization: 'Psychiatry',
    hospital: 'United Hospital, Dhaka',
    phone: '+8801712345011',
    email: 'laila.banu@united.com.bd',
  },
  {
    name: 'Dr. Habibur Rahman',
    specialization: 'Ophthalmology',
    hospital: 'Evercare Hospital, Dhaka',
    phone: '+8801712345012',
    email: 'habibur.rahman@evercarebd.com',
  },
  {
    name: 'Dr. Priya Chatterjee',
    specialization: 'Cardiology',
    hospital: 'Apollo Imperial Hospital, Chattogram',
    phone: '+8801812345013',
    email: 'priya.chatterjee@apolloimperial.com',
  },
  {
    name: 'Dr. Abdullah Al Mamun',
    specialization: 'Orthopedics',
    hospital: 'Chittagong Medical College Hospital',
    phone: '+8801812345014',
    email: 'abdullah.mamun@cmch.gov.bd',
  },
  {
    name: 'Dr. Fatema Begum',
    specialization: 'Pediatrics',
    hospital: 'Sylhet MAG Osmani Medical College Hospital',
    phone: '+8801912345015',
    email: 'fatema.begum@somch.gov.bd',
  },
  {
    name: 'Dr. James Whitfield',
    specialization: 'Neurology',
    hospital: 'Evercare Hospital, Dhaka',
    phone: '+8801712345016',
    email: 'james.whitfield@evercarebd.com',
  },
  {
    name: 'Dr. Rumana Akter',
    specialization: 'Dermatology',
    hospital: 'Labaid Specialized Hospital',
    phone: '+8801712345017',
    email: 'rumana.akter@labaid.com.bd',
  },
  {
    name: 'Dr. Nazmul Hasan',
    specialization: 'Gastroenterology',
    hospital: 'Rajshahi Medical College Hospital',
    phone: '+8801712345018',
    email: 'nazmul.hasan@rmch.gov.bd',
  },
  {
    name: 'Dr. Sarah Khan',
    specialization: 'Endocrinology',
    hospital: 'United Hospital, Dhaka',
    phone: '+8801712345019',
    email: 'sarah.khan@united.com.bd',
  },
  {
    name: 'Dr. Mahbub Alam Chowdhury',
    specialization: 'Oncology',
    hospital: 'Square Hospital, Dhaka',
    phone: '+8801712345020',
    email: 'mahbub.chowdhury@squarehospital.com',
  },
  {
    name: 'Dr. Anika Sultana',
    specialization: 'Pulmonology',
    hospital: 'Ibn Sina Hospital, Panthapath',
    phone: '+8801712345021',
    email: 'anika.sultana@ibnsina.com',
  },
  {
    name: 'Dr. Rezaul Karim',
    specialization: 'Nephrology',
    hospital: 'Bangabandhu Sheikh Mujib Medical University',
    phone: '+8801712345022',
    email: 'rezaul.karim@bsmmu.edu.bd',
  },
  {
    name: 'Dr. Helen Okonkwo',
    specialization: 'Psychiatry',
    hospital: 'Asgar Ali Hospital, Gandaria',
    phone: '+8801712345023',
    email: 'helen.okonkwo@asgarali.com',
  },
  {
    name: 'Dr. Shafiqul Islam Bhuiyan',
    specialization: 'Ophthalmology',
    hospital: 'Popular Diagnostic Centre, Dhanmondi',
    phone: '+8801712345024',
    email: 'shafiqul.bhuiyan@popular-bd.com',
  },
  {
    name: 'Dr. Nadia Chowdhury',
    specialization: 'Cardiology',
    hospital: 'Labaid Specialized Hospital',
    phone: '+8801712345025',
    email: 'nadia.chowdhury@labaid.com.bd',
  },
];

const FIRST_NAMES = [
  'Arif',
  'Sumaiya',
  'Karim',
  'Rasheda',
  'Mahmud',
  'Nasrin',
  'Tarek',
  'Shirin',
  'Hasan',
  'Jannat',
  'Omar',
  'Farzana',
  'Raihan',
  'Mita',
  'Sajib',
  'Keya',
  'Imtiaz',
  'Salma',
  'Nayeem',
  'Purnima',
  'Ashraf',
  'Lubna',
  'Shuvo',
  'Ruma',
  'Adnan',
  'Mariam',
  'Fahim',
  'Nilufa',
  'Parvez',
  'Tasnim',
  'Daniel',
  'Amina',
  'Victor',
  'Sabrina',
  'Rafsan',
  'Mehnaz',
  'Zahid',
  'Orchid',
  'Bappy',
  'Fariha',
];

const LAST_NAMES = [
  'Rahman',
  'Hossain',
  'Ahmed',
  'Islam',
  'Khan',
  'Akter',
  'Begum',
  'Chowdhury',
  'Siddique',
  'Mollah',
  'Talukder',
  'Biswas',
  'Sarkar',
  'Mia',
  'Uddin',
  'Hasan',
  'Karim',
  'Ali',
  'Patwary',
  'Kabir',
];

const GENDERS = ['Male', 'Female', 'Other'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(randomInt(8, 18), randomInt(0, 59), randomInt(0, 59), 0);
  return d;
}

function buildPatients(doctorIds) {
  const patients = [];
  const usedPhones = new Set();

  for (let i = 0; i < 150; i += 1) {
    let phone;
    do {
      phone = `+88017${String(randomInt(10000000, 99999999))}`;
    } while (usedPhones.has(phone));
    usedPhones.add(phone);

    const gender = randomItem(GENDERS);
    const first = randomItem(FIRST_NAMES);
    const last = randomItem(LAST_NAMES);

    patients.push({
      name: `${first} ${last}`,
      age: randomInt(1, 85),
      gender,
      phone,
      condition: randomItem(CONDITIONS),
      doctor: randomItem(doctorIds),
      createdAt: daysAgo(randomInt(0, 340)),
      updatedAt: new Date(),
    });
  }

  return patients;
}

async function seed() {
  await mongoose.connect(mongoUri);
  console.log('Connected. Clearing existing data...');

  await Promise.all([
    Patient.deleteMany({}),
    Doctor.deleteMany({}),
    Admin.deleteMany({}),
  ]);

  const admin = await Admin.create({
    name: 'System Admin',
    email: 'admin@doctortracker.com',
    password: 'Admin@123',
  });
  console.log(`Admin created: ${admin.email}`);

  const doctorsWithDates = DOCTORS.map((doc, index) => ({
    ...doc,
    createdAt: daysAgo(30 + index * 10),
    updatedAt: new Date(),
  }));

  const doctors = await Doctor.insertMany(doctorsWithDates);
  console.log(`Doctors created: ${doctors.length}`);

  const patients = buildPatients(doctors.map((d) => d._id));
  await Patient.insertMany(patients);
  console.log(`Patients created: ${patients.length}`);

  console.log('\nSeed complete.');
  console.log('Login: admin@doctortracker.com / Admin@123');
  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error('Seed failed:', err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
