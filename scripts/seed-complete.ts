// ==================== FIXED IMPORTS ====================
// Remove duplicate imports - keep only ONE import for financeTransactions
import { db } from '../src/lib/db';
import {
  financeTransactions, // ✅ Only import once from schema
  users, departments, doctors, patients, rooms, beds,
  appointments, admissions, vitals, medicalRecords,
  prescriptions, labTests, bills, payments, inventory,
  inventoryTransactions, notifications, settings, auditLogs,
} from '../src/lib/db/schema';
import { eq } from 'drizzle-orm'; // ✅ Only import eq, not financeTransactions
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

// ==================== TYPE DEFINITIONS ====================
type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
type Gender = 'male' | 'female' | 'other';
type PatientType = 'inpatient' | 'outpatient' | 'emergency';
type AppointmentStatus = 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
type Priority = 'normal' | 'urgent' | 'stat';
type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded';
type AdmissionStatus = 'admitted' | 'under_treatment' | 'ready_for_discharge' | 'discharged';
type LabTestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
type RoomType = 'general' | 'semi_private' | 'private' | 'icu' | 'deluxe';
type UserRole = 'admin' | 'doctor' | 'nurse' | 'receptionist' | 'pharmacist' | 'lab_technician';

// ==================== HELPER FUNCTIONS ====================
const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomFloat = (min: number, max: number, decimals: number = 2): number =>
  parseFloat((Math.random() * (max - min) + min).toFixed(decimals));

const randomElement = <T>(array: readonly T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const randomDate = (startDays: number, endDays: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + randomInt(startDays, endDays));
  return date;
};

const generateId = (prefix: string, num: number): string =>
  `${prefix}-${String(num).padStart(4, '0')}`;

// ==================== DATA ARRAYS ====================
const firstNames: readonly string[] = [
  'Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
  'Karen', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rose', 'Sam', 'Tina',
  'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack', 'Anna', 'Ben', 'Chloe', 'Dan',
  'Ella', 'Finn', 'Georgia', 'Harry', 'Isla', 'Jake', 'Kira', 'Liam', 'Maya', 'Nate',
  'Opal', 'Peter', 'Queenie', 'Ryan', 'Sophie', 'Tom', 'Ursula', 'Vince', 'Willow', 'Xena'
];

const lastNames: readonly string[] = [
  'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez',
  'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee',
  'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis',
  'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Green', 'Baker',
  'Adams', 'Nelson', 'Hill', 'Campbell', 'Mitchell', 'Roberts', 'Carter', 'Phillips',
  'Evans', 'Turner', 'Torres', 'Parker', 'Collins', 'Edwards', 'Stewart', 'Morris', 'Murphy'
];

const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const cities: string[] = ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Manhattan'];
const allergies: string[] = ['Penicillin', 'Latex', 'Pollen', 'Peanuts', 'Shellfish', 'Dairy', 'Soy', 'Eggs', 'None'];
const occupations: string[] = ['Teacher', 'Engineer', 'Artist', 'Accountant', 'Lawyer', 'Chef', 'Driver', 'Student', 'Retired', 'Business Owner'];
const maritalStatuses: string[] = ['single', 'married', 'divorced', 'widowed'];
const languages: string[] = ['English', 'Spanish', 'French', 'Mandarin', 'Arabic', 'Hindi'];
const appointmentStatuses: AppointmentStatus[] = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
const appointmentTypes: string[] = ['consultation', 'follow_up', 'emergency', 'checkup', 'surgery', 'procedure'];
const priorities: Priority[] = ['normal', 'urgent', 'stat'];
const insuranceProviders: string[] = ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealth', 'Humana', 'Kaiser'];
const paymentMethods: string[] = ['cash', 'card', 'insurance', 'bank_transfer', 'online'];
const paymentStatuses: PaymentStatus[] = ['pending', 'paid', 'partial', 'refunded'];
const symptoms: string[] = [
  'Headache and dizziness', 'Chest pain', 'Shortness of breath', 'Back pain',
  'Abdominal pain', 'Fever and chills', 'Joint pain', 'Skin rash',
  'Persistent cough', 'Fatigue', 'Numbness in limbs', 'Vision problems',
  'Ear pain', 'Sore throat', 'Muscle weakness', 'Weight loss',
  'Anxiety', 'Insomnia', 'Allergic reaction', 'Injury from fall'
];
const admissionDiagnoses: string[] = [
  'Pneumonia', 'Acute Appendicitis', 'Fractured Femur', 'COVID-19 Pneumonia',
  'Myocardial Infarction', 'Stroke', 'Severe Dehydration', 'Kidney Stone',
  'Acute Pancreatitis', 'Cellulitis', 'Pulmonary Embolism', 'Diabetic Ketoacidosis'
];
const diets: string[] = ['Regular', 'Low Sodium', 'Diabetic', 'Soft', 'Liquid', 'NPO'];
const medicalDiagnoses: string[] = [
  'Essential Hypertension', 'Type 2 Diabetes Mellitus', 'Migraine Headache',
  'Acute Bronchitis', 'Osteoarthritis', 'Gastroesophageal Reflux Disease',
  'Asthma', 'Urinary Tract Infection', 'Anxiety Disorder', 'Iron Deficiency Anemia'
];
const treatments: string[] = [
  'Prescribed medication and follow-up in 2 weeks',
  'Physical therapy recommended, 3 sessions per week',
  'Rest and increased fluid intake advised',
  'Antibiotics course for 10 days',
  'Referred to specialist for further evaluation'
];
const notificationTypes: string[] = ['appointment', 'lab', 'pharmacy', 'billing', 'system', 'patient'];
const auditActions: string[] = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT', 'EXPORT', 'PRINT'];
const auditEntities: string[] = ['PATIENT', 'DOCTOR', 'APPOINTMENT', 'BILL', 'PRESCRIPTION', 'LAB_TEST', 'INVENTORY', 'USER'];

const medicines = [
  { name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '7 days', instructions: 'Take after meals' },
  { name: 'Amoxicillin 250mg', dosage: '250mg', frequency: 'Three times daily', duration: '10 days', instructions: 'Complete full course' },
  { name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take before breakfast' },
  { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '90 days', instructions: 'Take with meals' },
  { name: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once daily', duration: '90 days', instructions: 'Take at same time each day' },
  { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Once daily at bedtime', duration: '90 days', instructions: 'Avoid grapefruit' },
  { name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'Every 6 hours as needed', duration: '30 days', instructions: 'Shake well before use' },
  { name: 'Prednisone 10mg', dosage: '10mg', frequency: 'Once daily', duration: '14 days', instructions: 'Taper as directed' },
];

const labTestTypes = [
  { name: 'Complete Blood Count (CBC)', category: 'Hematology', normalRange: '4.5-11.0', unit: '10^9/L' },
  { name: 'Basic Metabolic Panel (BMP)', category: 'Chemistry', normalRange: 'Varies', unit: 'varies' },
  { name: 'Lipid Panel', category: 'Chemistry', normalRange: '<200', unit: 'mg/dL' },
  { name: 'Liver Function Test (LFT)', category: 'Chemistry', normalRange: '10-40', unit: 'U/L' },
  { name: 'Urinalysis', category: 'Microbiology', normalRange: 'Negative', unit: '' },
  { name: 'Chest X-Ray', category: 'Radiology', normalRange: 'Normal', unit: '' },
  { name: 'ECG/EKG', category: 'Cardiology', normalRange: 'Normal sinus rhythm', unit: '' },
];

const inventoryItemsData = [
  { name: 'Paracetamol 500mg', category: 'Medicine', unit: 'tablets', price: '0.50', reorderLevel: 100, location: 'Shelf A' },
  { name: 'Amoxicillin 250mg', category: 'Medicine', unit: 'capsules', price: '0.75', reorderLevel: 80, location: 'Shelf A' },
  { name: 'Surgical Masks', category: 'Supplies', unit: 'pieces', price: '0.25', reorderLevel: 200, location: 'Cabinet 1' },
  { name: 'Disposable Gloves', category: 'Supplies', unit: 'boxes', price: '5.00', reorderLevel: 50, location: 'Cabinet 1' },
  { name: 'Syringes 5ml', category: 'Equipment', unit: 'pieces', price: '0.30', reorderLevel: 150, location: 'Cabinet 2' },
  { name: 'Blood Pressure Monitor', category: 'Equipment', unit: 'units', price: '45.00', reorderLevel: 5, location: 'Equipment Room' },
  { name: 'Bandages', category: 'Supplies', unit: 'rolls', price: '2.00', reorderLevel: 75, location: 'Cabinet 3' },
  { name: 'Antiseptic Solution', category: 'Medicine', unit: 'bottles', price: '3.50', reorderLevel: 40, location: 'Shelf B' },
  { name: 'IV Fluids (Saline)', category: 'Medicine', unit: 'bags', price: '8.00', reorderLevel: 60, location: 'Shelf B' },
  { name: 'Hand Sanitizer', category: 'Supplies', unit: 'bottles', price: '4.00', reorderLevel: 80, location: 'Cabinet 1' },
];

// ==================== SEED FUNCTION ====================
async function seedComplete() {
  console.log('🌱 Starting complete database seed...\n');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // ==================== 1. SETTINGS ====================
  console.log('📋 Creating system settings...');
  await db.insert(settings).values({
    hospitalName: 'City General Hospital',
    address: '123 Healthcare Blvd, Medical District, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@citygeneralhospital.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    language: 'en',
    currency: 'USD',
    appointmentDuration: 30,
    maxAppointmentsPerDay: 50,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });
  console.log('✅ Settings created\n');

  // ==================== 2. DEPARTMENTS ====================
  console.log('🏥 Creating departments...');
  const departmentsData = [
    { name: 'Cardiology', description: 'Heart and cardiovascular system', floor: '2nd Floor', building: 'Main Building', phone: '+1-555-1001', email: 'cardiology@hospital.com' },
    { name: 'Neurology', description: 'Brain and nervous system', floor: '3rd Floor', building: 'Main Building', phone: '+1-555-1002', email: 'neurology@hospital.com' },
    { name: 'Orthopedics', description: 'Bones, joints, and muscles', floor: '1st Floor', building: 'East Wing', phone: '+1-555-1003', email: 'orthopedics@hospital.com' },
    { name: 'Pediatrics', description: 'Child healthcare', floor: '4th Floor', building: 'Main Building', phone: '+1-555-1004', email: 'pediatrics@hospital.com' },
    { name: 'Emergency Medicine', description: 'Emergency services', floor: 'Ground Floor', building: 'ER Building', phone: '+1-555-1005', email: 'emergency@hospital.com' },
    { name: 'Radiology', description: 'Imaging and diagnostics', floor: '1st Floor', building: 'Diagnostic Center', phone: '+1-555-1006', email: 'radiology@hospital.com' },
    { name: 'Pharmacy', description: 'Medication dispensing', floor: 'Ground Floor', building: 'Main Building', phone: '+1-555-1007', email: 'pharmacy@hospital.com' },
    { name: 'Laboratory', description: 'Clinical laboratory', floor: '1st Floor', building: 'Diagnostic Center', phone: '+1-555-1008', email: 'laboratory@hospital.com' },
  ];

  const createdDepartments = [];
  for (const dept of departmentsData) {
    const [created] = await db.insert(departments).values(dept).returning();
    createdDepartments.push(created);
  }
  console.log('✅ 8 Departments created\n');

  // ==================== 3. USERS ====================
  console.log('👥 Creating users...');
  const password = await bcrypt.hash('Password@123', 12);

  const usersData = [
    { email: 'admin@hospital.com', password, role: 'admin' as UserRole, firstName: 'System', lastName: 'Administrator', phone: '+1-555-0001', isActive: true },
    { email: 'john.smith@hospital.com', password, role: 'doctor' as UserRole, firstName: 'John', lastName: 'Smith', phone: '+1-555-0011', isActive: true },
    { email: 'sarah.johnson@hospital.com', password, role: 'doctor' as UserRole, firstName: 'Sarah', lastName: 'Johnson', phone: '+1-555-0012', isActive: true },
    { email: 'michael.chen@hospital.com', password, role: 'doctor' as UserRole, firstName: 'Michael', lastName: 'Chen', phone: '+1-555-0013', isActive: true },
    { email: 'emily.williams@hospital.com', password, role: 'doctor' as UserRole, firstName: 'Emily', lastName: 'Williams', phone: '+1-555-0014', isActive: true },
    { email: 'james.brown@hospital.com', password, role: 'doctor' as UserRole, firstName: 'James', lastName: 'Brown', phone: '+1-555-0015', isActive: true },
    { email: 'nurse.wilson@hospital.com', password, role: 'nurse' as UserRole, firstName: 'Robert', lastName: 'Wilson', phone: '+1-555-0021', isActive: true },
    { email: 'nurse.davis@hospital.com', password, role: 'nurse' as UserRole, firstName: 'Patricia', lastName: 'Davis', phone: '+1-555-0022', isActive: true },
    { email: 'reception1@hospital.com', password, role: 'receptionist' as UserRole, firstName: 'Linda', lastName: 'Martinez', phone: '+1-555-0031', isActive: true },
    { email: 'pharmacist1@hospital.com', password, role: 'pharmacist' as UserRole, firstName: 'Daniel', lastName: 'White', phone: '+1-555-0041', isActive: true },
    { email: 'labtech1@hospital.com', password, role: 'lab_technician' as UserRole, firstName: 'Amanda', lastName: 'Clark', phone: '+1-555-0051', isActive: true },
  ];

  const createdUsers = [];
  for (const user of usersData) {
    const [created] = await db.insert(users).values(user).returning();
    createdUsers.push(created);
  }
  console.log('✅ 11 Users created\n');

  // ==================== 4. DOCTORS ====================
  console.log('👨‍⚕️ Creating doctor profiles...');
  const doctorsData = [
    { userId: createdUsers[1].id, firstName: 'John', lastName: 'Smith', specialization: 'Cardiologist', qualification: 'MD, FACC', licenseNumber: 'LIC-001', experience: 15, departmentId: createdDepartments[0].id, consultationFee: '200.00', availableDays: ['Monday', 'Wednesday', 'Friday'], availableTimeStart: '09:00', availableTimeEnd: '17:00', maxPatientsPerDay: 20 },
    { userId: createdUsers[2].id, firstName: 'Sarah', lastName: 'Johnson', specialization: 'Neurologist', qualification: 'MD, PhD', licenseNumber: 'LIC-002', experience: 12, departmentId: createdDepartments[1].id, consultationFee: '250.00', availableDays: ['Tuesday', 'Thursday', 'Saturday'], availableTimeStart: '10:00', availableTimeEnd: '18:00', maxPatientsPerDay: 15 },
    { userId: createdUsers[3].id, firstName: 'Michael', lastName: 'Chen', specialization: 'Orthopedic Surgeon', qualification: 'MD, MS', licenseNumber: 'LIC-003', experience: 10, departmentId: createdDepartments[2].id, consultationFee: '300.00', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableTimeStart: '08:00', availableTimeEnd: '16:00', maxPatientsPerDay: 18 },
    { userId: createdUsers[4].id, firstName: 'Emily', lastName: 'Williams', specialization: 'Pediatrician', qualification: 'MD, FAAP', licenseNumber: 'LIC-004', experience: 8, departmentId: createdDepartments[3].id, consultationFee: '180.00', availableDays: ['Monday', 'Wednesday', 'Friday'], availableTimeStart: '09:00', availableTimeEnd: '17:00', maxPatientsPerDay: 25 },
    { userId: createdUsers[5].id, firstName: 'James', lastName: 'Brown', specialization: 'Emergency Physician', qualification: 'MD, FACEP', licenseNumber: 'LIC-005', experience: 20, departmentId: createdDepartments[4].id, consultationFee: '350.00', availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], availableTimeStart: '06:00', availableTimeEnd: '18:00', maxPatientsPerDay: 40 },
  ];

  const createdDoctors = [];
  for (const doctor of doctorsData) {
    const [created] = await db.insert(doctors).values(doctor).returning();
    createdDoctors.push(created);
  }

  // Update head doctors
  await db.update(departments).set({ headDoctorId: createdDoctors[0].id }).where(eq(departments.name, 'Cardiology'));
  await db.update(departments).set({ headDoctorId: createdDoctors[1].id }).where(eq(departments.name, 'Neurology'));
  await db.update(departments).set({ headDoctorId: createdDoctors[2].id }).where(eq(departments.name, 'Orthopedics'));
  await db.update(departments).set({ headDoctorId: createdDoctors[3].id }).where(eq(departments.name, 'Pediatrics'));
  console.log('✅ 5 Doctor profiles created\n');

  // ==================== 5. ROOMS & BEDS ====================
  console.log('🛏️ Creating rooms and beds...');
  const roomsData: Array<{ roomNumber: string; roomType: RoomType; floor: string; building: string; departmentId: number; dailyRate: string }> = [
    { roomNumber: 'W101', roomType: 'general', floor: '1st Floor', building: 'West Wing', departmentId: createdDepartments[2].id, dailyRate: '150.00' },
    { roomNumber: 'W102', roomType: 'general', floor: '1st Floor', building: 'West Wing', departmentId: createdDepartments[2].id, dailyRate: '150.00' },
    { roomNumber: 'N201', roomType: 'semi_private', floor: '2nd Floor', building: 'North Wing', departmentId: createdDepartments[0].id, dailyRate: '250.00' },
    { roomNumber: 'S301', roomType: 'private', floor: '3rd Floor', building: 'South Wing', departmentId: createdDepartments[1].id, dailyRate: '500.00' },
    { roomNumber: 'ICU01', roomType: 'icu', floor: '2nd Floor', building: 'ICU Wing', departmentId: createdDepartments[4].id, dailyRate: '1000.00' },
  ];

  const createdBeds = [];
  for (const room of roomsData) {
    const [createdRoom] = await db.insert(rooms).values(room).returning();
    const bedCount = room.roomType === 'general' ? 4 : room.roomType === 'semi_private' ? 2 : 1;
    for (let i = 1; i <= bedCount; i++) {
      const [bed] = await db.insert(beds).values({
        bedNumber: `${room.roomNumber}-B${i}`,
        roomId: createdRoom.id,
        isOccupied: false,
      }).returning();
      createdBeds.push(bed);
    }
  }
  console.log('✅ 5 Rooms and 12 Beds created\n');

  // ==================== 6. PATIENTS ====================
  console.log('🏃 Creating patients...');
  const createdPatients = [];
  for (let i = 0; i < 100; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const gender: Gender = i % 2 === 0 ? 'male' : 'female';
    const dob = new Date(1950 + randomInt(0, 50), randomInt(0, 11), randomInt(1, 28));
    const bloodGroup: BloodGroup = randomElement(bloodGroups);
    const patientType: PatientType = i < 15 ? 'inpatient' : i < 20 ? 'emergency' : 'outpatient';

    const [patient] = await db.insert(patients).values({
      patientId: generateId('PAT', i + 1),
      firstName,
      lastName,
      dateOfBirth: dob.toISOString().split('T')[0],
      gender,
      bloodGroup,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
      phone: `+1${randomInt(200, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`,
      address: `${randomInt(1, 9999)} ${randomElement(['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Maple Dr', 'Cedar Ln'])}`,
      city: randomElement(cities),
      state: 'NY',
      zipCode: String(randomInt(10000, 99999)),
      emergencyContact: `+1${randomInt(200, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`,
      emergencyName: `${randomElement(firstNames)} ${randomElement(lastNames)}`,
      relationship: randomElement(['Spouse', 'Parent', 'Sibling', 'Child', 'Friend']),
      allergies: randomElement(allergies),
      insuranceProvider: randomElement(insuranceProviders),
      insuranceNumber: `INS-${randomInt(100000, 999999)}`,
      patientType,
      isActive: true,
      occupation: randomElement(occupations),
      maritalStatus: randomElement(maritalStatuses),
      preferredLanguage: randomElement(languages),
    }).returning();

    createdPatients.push(patient);
  }
  console.log('✅ 100 Patients created\n');

  // ==================== 7. APPOINTMENTS ====================
  console.log('📅 Creating appointments...');
  const createdAppointments = [];
  for (let i = 0; i < 200; i++) {
    const appointmentDate = randomDate(-10, 30);
    const hours = randomInt(8, 17);
    const minutes = randomElement(['00', '15', '30', '45']);
    const status: AppointmentStatus = randomElement(appointmentStatuses);
    const priority: Priority = randomElement(priorities);

    const [appointment] = await db.insert(appointments).values({
      appointmentNumber: generateId('APT', i + 1),
      patientId: randomElement(createdPatients).id,
      doctorId: randomElement(createdDoctors).id,
      departmentId: randomElement(createdDepartments).id,
      appointmentDate: appointmentDate.toISOString().split('T')[0],
      appointmentTime: `${String(hours).padStart(2, '0')}:${minutes}`,
      status,
      type: randomElement(appointmentTypes),
      symptoms: randomElement(symptoms),
      notes: status === 'cancelled' ? 'Patient cancelled' : 'Regular appointment',
      priority,
      duration: randomElement([15, 30, 45, 60]),
    }).returning();

    createdAppointments.push(appointment);
  }
  console.log('✅ 200 Appointments created\n');

  // ==================== 8. ADMISSIONS ====================
  console.log('🏨 Creating admissions...');
  const createdAdmissions = [];
  for (let i = 0; i < 20; i++) {
    const admissionDate = randomDate(-15, -1);
    const status: AdmissionStatus = i < 5 ? 'discharged' : i < 10 ? 'ready_for_discharge' : 'under_treatment';

    const [admission] = await db.insert(admissions).values({
      admissionId: generateId('ADM', i + 1),
      patientId: createdPatients[i].id,
      doctorId: randomElement(createdDoctors).id,
      roomId: randomInt(1, 5),
      bedId: randomInt(1, 12),
      admissionDate,
      dischargeDate: status === 'discharged' ? randomDate(1, 10) : null,
      diagnosis: randomElement(admissionDiagnoses),
      status,
      notes: 'Patient stable',
      diet: randomElement(diets),
    }).returning();

    createdAdmissions.push(admission);

    if (status !== 'discharged') {
      await db.update(beds).set({ isOccupied: true }).where(eq(beds.id, admission.bedId!));
      await db.update(rooms).set({ isOccupied: true }).where(eq(rooms.id, admission.roomId!));
    }
  }
  console.log('✅ 20 Admissions created\n');

  // ==================== 9. VITALS ====================
  console.log('💓 Creating vitals...');
  for (const admission of createdAdmissions) {
    if (admission.status !== 'discharged') {
      for (let i = 0; i < randomInt(3, 5); i++) {
        await db.insert(vitals).values({
          admissionId: admission.id,
          temperature: randomFloat(97.0, 103.0, 1),
          heartRate: randomInt(60, 110),
          bloodPressureSystolic: randomInt(100, 160),
          bloodPressureDiastolic: randomInt(60, 100),
          oxygenLevel: randomFloat(90, 100, 1),
          respiratoryRate: randomInt(12, 25),
          recordedBy: createdUsers[6].id,
          recordedAt: new Date(Date.now() - randomInt(1, 48) * 60 * 60 * 1000),
        });
      }
    }
  }
  console.log('✅ Vitals created\n');

  // ==================== 10. MEDICAL RECORDS ====================
  console.log('📋 Creating medical records...');
  const createdRecords = [];
  for (let i = 0; i < 100; i++) {
    const [record] = await db.insert(medicalRecords).values({
      recordNumber: generateId('REC', i + 1),
      patientId: randomElement(createdPatients).id,
      doctorId: randomElement(createdDoctors).id,
      appointmentId: i < 200 ? createdAppointments[i].id : null,
      diagnosis: randomElement(medicalDiagnoses),
      symptoms: randomElement(symptoms),
      treatment: randomElement(treatments),
      notes: 'Patient advised to follow up',
      followUpDate: randomDate(7, 30).toISOString().split('T')[0],
    }).returning();
    createdRecords.push(record);
  }
  console.log('✅ 100 Medical records created\n');

  // ==================== 11. PRESCRIPTIONS ====================
  console.log('💊 Creating prescriptions...');
  for (let i = 0; i < 150; i++) {
    const medicine = randomElement(medicines);
    await db.insert(prescriptions).values({
      prescriptionNumber: generateId('PRX', i + 1),
      recordId: i < 100 ? createdRecords[i].id : randomElement(createdRecords).id,
      patientId: randomElement(createdPatients).id,
      doctorId: randomElement(createdDoctors).id,
      medicineName: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      duration: medicine.duration,
      instructions: medicine.instructions,
      quantity: randomInt(10, 60),
      refills: randomInt(0, 3),
      isActive: true,
      startDate: randomDate(-60, -1).toISOString().split('T')[0],
    });
  }
  console.log('✅ 150 Prescriptions created\n');

  // ==================== 12. LAB TESTS ====================
  console.log('🔬 Creating lab tests...');
  for (let i = 0; i < 60; i++) {
    const test = randomElement(labTestTypes);
    const status: LabTestStatus = randomElement(['pending', 'in_progress', 'completed'] as LabTestStatus[]);
    const isCompleted = status === 'completed';

    await db.insert(labTests).values({
      testNumber: generateId('LAB', i + 1),
      patientId: randomElement(createdPatients).id,
      doctorId: randomElement(createdDoctors).id,
      testName: test.name,
      category: test.category,
      status,
      priority: randomElement(priorities),
      normalRange: test.normalRange,
      unit: test.unit,
      result: isCompleted ? String(randomFloat(0.5, 10, 2)) : null,
      resultValue: isCompleted ? randomFloat(0.1, 200, 1) : null,
      resultNotes: isCompleted ? 'Results within normal range' : null,
      performedBy: isCompleted ? createdUsers[10].id : null,
      performedAt: isCompleted ? new Date() : null,
    });
  }
  console.log('✅ 60 Lab tests created\n');

  // ==================== 13. BILLS ====================
  console.log('💰 Creating bills...');
  for (let i = 0; i < 100; i++) {
    const totalAmount = randomFloat(50, 5000);
    const status: PaymentStatus = randomElement(paymentStatuses);
    let paidAmount = 0;
    if (status === 'paid') paidAmount = totalAmount;
    else if (status === 'partial') paidAmount = randomFloat(totalAmount * 0.3, totalAmount * 0.8);

    const items = [
      { description: 'Consultation Fee', quantity: 1, unitPrice: randomFloat(100, 300), total: randomFloat(100, 300), category: 'Consultation' },
      { description: 'Lab Tests', quantity: randomInt(1, 3), unitPrice: randomFloat(25, 150), total: randomFloat(50, 450), category: 'Laboratory' },
      { description: 'Medication', quantity: randomInt(1, 5), unitPrice: randomFloat(10, 100), total: randomFloat(10, 500), category: 'Pharmacy' },
    ];

    const [bill] = await db.insert(bills).values({
      billNumber: generateId('BILL', i + 1),
      patientId: randomElement(createdPatients).id,
      totalAmount: totalAmount.toFixed(2),
      paidAmount: paidAmount.toFixed(2),
      discount: randomFloat(0, 50).toFixed(2),
      tax: (totalAmount * 0.1).toFixed(2),
      paymentStatus: status,
      paymentMethod: randomElement(paymentMethods),
      description: 'Medical services',
      billDate: randomDate(-30, 0).toISOString().split('T')[0],
      dueDate: randomDate(1, 30).toISOString().split('T')[0],
      items: items,
      createdBy: createdUsers[8].id,
    }).returning();

    if (status === 'paid' || status === 'partial') {
      await db.insert(payments).values({
        paymentNumber: generateId('PAY', i + 1),
        billId: bill.id,
        amount: paidAmount.toFixed(2),
        paymentMethod: randomElement(paymentMethods),
        paymentDate: new Date(),
        referenceNumber: `REF-${randomInt(100000, 999999)}`,
        receivedBy: createdUsers[8].id,
      });
    }
  }
  console.log('✅ 100 Bills created\n');

  // ==================== 14. INVENTORY ====================
  console.log('📦 Creating inventory...');
  for (const item of inventoryItemsData) {
    const quantity = randomInt(item.reorderLevel - 10, item.reorderLevel * 3);
    const [inventoryItem] = await db.insert(inventory).values({
      itemCode: generateId('INV', Math.floor(Math.random() * 100)),
      itemName: item.name,
      category: item.category,
      quantity,
      unit: item.unit,
      unitPrice: item.price,
      supplier: `MedSupply Co. ${randomInt(1, 5)}`,
      reorderLevel: item.reorderLevel,
      expiryDate: randomDate(30, 730).toISOString().split('T')[0],
      batchNumber: `BATCH-${randomInt(1000, 9999)}`,
      location: `${item.location}-${randomInt(1, 5)}`,
      isActive: true,
    }).returning();

    await db.insert(inventoryTransactions).values({
      transactionNumber: generateId('TXN', Math.floor(Math.random() * 1000)),
      itemId: inventoryItem.id,
      type: 'in',
      quantity,
      unitPrice: item.price,
      totalAmount: (quantity * parseFloat(item.price)).toFixed(2),
      referenceType: 'purchase',
      notes: 'Initial stock',
      performedBy: createdUsers[9].id,
      createdAt: randomDate(-30, -1),
    });
  }
  console.log('✅ 10 Inventory items created\n');

  // ==================== 15. NOTIFICATIONS ====================
  console.log('🔔 Creating notifications...');
  for (let i = 0; i < 50; i++) {
    await db.insert(notifications).values({
      userId: randomElement(createdUsers).id,
      title: `${randomElement(notificationTypes)} Alert`,
      message: `New notification at ${new Date().toLocaleTimeString()}`,
      type: randomElement(notificationTypes),
      isRead: randomInt(0, 1) === 1,
      link: '/dashboard',
    });
  }
  console.log('✅ 50 Notifications created\n');

  // ==================== 16. AUDIT LOGS ====================
  console.log('📝 Creating audit logs...');
  for (let i = 0; i < 100; i++) {
    const user = randomElement(createdUsers);
    await db.insert(auditLogs).values({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: randomElement(auditActions),
      entity: randomElement(auditEntities),
      entityId: randomInt(1, 100),
      ipAddress: `192.168.${randomInt(1, 255)}.${randomInt(1, 255)}`,
      userAgent: 'Mozilla/5.0',
      timestamp: randomDate(-30, -1),
    });
  }
  console.log('✅ 100 Audit logs created\n');

  // ==================== 17. FINANCE TRANSACTIONS ====================
  console.log('💰 Creating finance transactions...');
  const financeData = [
    { type: 'income', category: 'Consultation', amount: '1500.00', description: 'Patient consultation fees', date: '2025-01-15' },
    { type: 'income', category: 'Pharmacy', amount: '3200.00', description: 'Medicine sales', date: '2025-01-20' },
    { type: 'income', category: 'Laboratory', amount: '2100.00', description: 'Lab test charges', date: '2025-02-01' },
    { type: 'income', category: 'Room', amount: '5000.00', description: 'Room charges', date: '2025-02-10' },
    { type: 'expense', category: 'Salaries', amount: '8000.00', description: 'Staff salaries', date: '2025-01-30' },
    { type: 'expense', category: 'Supplies', amount: '2500.00', description: 'Medical supplies', date: '2025-02-05' },
    { type: 'expense', category: 'Equipment', amount: '4500.00', description: 'New equipment', date: '2025-02-15' },
    { type: 'expense', category: 'Utilities', amount: '1200.00', description: 'Electricity bill', date: '2025-01-25' },
    { type: 'income', category: 'Procedure', amount: '3800.00', description: 'Surgery charges', date: '2025-03-01' },
    { type: 'expense', category: 'Maintenance', amount: '1500.00', description: 'Building maintenance', date: '2025-03-10' },
  ];

  for (const item of financeData) {
    await db.insert(financeTransactions).values({
      type: item.type,
      category: item.category,
      amount: item.amount,
      description: item.description,
      date: item.date,
    });
  }
  console.log('✅ 10 Finance transactions created\n');

  // ==================== SUMMARY ====================
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🎉 DATABASE SEED COMPLETED!');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('📧 DEFAULT LOGIN CREDENTIALS:');
  console.log('─────────────────────────────────────────────────────────────────');
  console.log('Admin:         admin@hospital.com / Password@123');
  console.log('Doctor:        john.smith@hospital.com / Password@123');
  console.log('Nurse:         nurse.wilson@hospital.com / Password@123');
  console.log('Receptionist:  reception1@hospital.com / Password@123');
  console.log('Pharmacist:    pharmacist1@hospital.com / Password@123');
  console.log('Lab Tech:      labtech1@hospital.com / Password@123');
  console.log('─────────────────────────────────────────────────────────────────\n');
}

// ==================== EXECUTE ====================
seedComplete()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    console.log('Seed script execution completed.');
    process.exit(0);
  });