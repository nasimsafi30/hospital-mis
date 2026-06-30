import { eq } from 'drizzle-orm';
import { db } from '../src/lib/db';
import {
  users, departments, doctors, patients, rooms, beds,
  appointments, admissions, vitals, medicalRecords,
  prescriptions, labTests, bills, payments, inventory,
  inventoryTransactions, notifications, settings,
} from '../src/lib/db/schema';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('🌱 Starting database seed...\n');

  // ==================== SETTINGS ====================
  console.log('Creating settings...');
  await db.insert(settings).values({
    hospitalName: 'City General Hospital',
    address: '123 Healthcare Blvd, Medical District, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'info@citygeneralhospital.com',
    website: 'https://citygeneralhospital.com',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    language: 'en',
    currency: 'USD',
    currencySymbol: '$',
    appointmentDuration: 30,
    maxAppointmentsPerDay: 50,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });
  console.log('✅ Settings created\n');

  // ==================== USERS ====================
  console.log('Creating users...');
  const password = await bcrypt.hash('Password@123', 12);

  const usersData = [
    { email: 'admin@hospital.com', password, role: 'admin' as const, firstName: 'System', lastName: 'Administrator', phone: '+1000000000' },
    { email: 'john.smith@hospital.com', password, role: 'doctor' as const, firstName: 'John', lastName: 'Smith', phone: '+1000000001' },
    { email: 'sarah.johnson@hospital.com', password, role: 'doctor' as const, firstName: 'Sarah', lastName: 'Johnson', phone: '+1000000002' },
    { email: 'michael.chen@hospital.com', password, role: 'doctor' as const, firstName: 'Michael', lastName: 'Chen', phone: '+1000000003' },
    { email: 'emily.williams@hospital.com', password, role: 'doctor' as const, firstName: 'Emily', lastName: 'Williams', phone: '+1000000004' },
    { email: 'james.brown@hospital.com', password, role: 'doctor' as const, firstName: 'James', lastName: 'Brown', phone: '+1000000005' },
    { email: 'linda.davis@hospital.com', password, role: 'nurse' as const, firstName: 'Linda', lastName: 'Davis', phone: '+1000000006' },
    { email: 'robert.wilson@hospital.com', password, role: 'nurse' as const, firstName: 'Robert', lastName: 'Wilson', phone: '+1000000007' },
    { email: 'patricia.taylor@hospital.com', password, role: 'nurse' as const, firstName: 'Patricia', lastName: 'Taylor', phone: '+1000000008' },
    { email: 'reception@hospital.com', password, role: 'receptionist' as const, firstName: 'Maria', lastName: 'Garcia', phone: '+1000000009' },
    { email: 'pharmacy@hospital.com', password, role: 'pharmacist' as const, firstName: 'David', lastName: 'Martinez', phone: '+1000000010' },
    { email: 'lab@hospital.com', password, role: 'lab_technician' as const, firstName: 'Amanda', lastName: 'Anderson', phone: '+1000000011' },
  ];

  const createdUsers = [];
  for (const user of usersData) {
    const [created] = await db.insert(users).values(user).returning();
    createdUsers.push(created);
  }
  console.log('✅ Users created\n');

  // ==================== DEPARTMENTS ====================
  console.log('Creating departments...');
  const departmentsData = [
    { name: 'Cardiology', description: 'Heart and cardiovascular system', floor: '2nd Floor', building: 'Main Building', phone: '+1234567890', email: 'cardio@hospital.com' },
    { name: 'Neurology', description: 'Brain and nervous system', floor: '3rd Floor', building: 'Main Building', phone: '+1234567891', email: 'neuro@hospital.com' },
    { name: 'Orthopedics', description: 'Bones, joints, and muscles', floor: '1st Floor', building: 'East Wing', phone: '+1234567892', email: 'ortho@hospital.com' },
    { name: 'Pediatrics', description: 'Child healthcare', floor: '4th Floor', building: 'Main Building', phone: '+1234567893', email: 'pedia@hospital.com' },
    { name: 'Emergency Medicine', description: 'Emergency medical services', floor: 'Ground Floor', building: 'ER Building', phone: '+1234567894', email: 'er@hospital.com' },
    { name: 'Radiology', description: 'Imaging and diagnostics', floor: '1st Floor', building: 'Diagnostic Center', phone: '+1234567895', email: 'radio@hospital.com' },
    { name: 'Pharmacy', description: 'Medication and dispensing', floor: 'Ground Floor', building: 'Main Building', phone: '+1234567896', email: 'pharmacy@hospital.com' },
    { name: 'Laboratory', description: 'Clinical laboratory services', floor: '1st Floor', building: 'Diagnostic Center', phone: '+1234567897', email: 'lab@hospital.com' },
  ];

  const createdDepartments = [];
  for (const dept of departmentsData) {
    const [created] = await db.insert(departments).values(dept).returning();
    createdDepartments.push(created);
  }
  console.log('✅ Departments created\n');

  // ==================== DOCTORS ====================
  console.log('Creating doctors...');
  const doctorsData = [
    { userId: createdUsers[1].id, firstName: 'John', lastName: 'Smith', specialization: 'Cardiologist', qualification: 'MD, FACC', licenseNumber: 'LIC-001', experience: 15, departmentId: createdDepartments[0].id, consultationFee: '200.00', availableDays: ['Monday', 'Wednesday', 'Friday'], availableTimeStart: '09:00', availableTimeEnd: '17:00', maxPatientsPerDay: 20, phone: '+1000000001', email: 'john.smith@hospital.com' },
    { userId: createdUsers[2].id, firstName: 'Sarah', lastName: 'Johnson', specialization: 'Neurologist', qualification: 'MD, PhD', licenseNumber: 'LIC-002', experience: 12, departmentId: createdDepartments[1].id, consultationFee: '250.00', availableDays: ['Tuesday', 'Thursday', 'Saturday'], availableTimeStart: '10:00', availableTimeEnd: '18:00', maxPatientsPerDay: 15, phone: '+1000000002', email: 'sarah.johnson@hospital.com' },
    { userId: createdUsers[3].id, firstName: 'Michael', lastName: 'Chen', specialization: 'Orthopedic Surgeon', qualification: 'MD, MS', licenseNumber: 'LIC-003', experience: 10, departmentId: createdDepartments[2].id, consultationFee: '300.00', availableDays: ['Monday', 'Tuesday', 'Thursday'], availableTimeStart: '08:00', availableTimeEnd: '16:00', maxPatientsPerDay: 18, phone: '+1000000003', email: 'michael.chen@hospital.com' },
    { userId: createdUsers[4].id, firstName: 'Emily', lastName: 'Williams', specialization: 'Pediatrician', qualification: 'MD, FAAP', licenseNumber: 'LIC-004', experience: 8, departmentId: createdDepartments[3].id, consultationFee: '180.00', availableDays: ['Monday', 'Wednesday', 'Friday'], availableTimeStart: '09:00', availableTimeEnd: '17:00', maxPatientsPerDay: 25, phone: '+1000000004', email: 'emily.williams@hospital.com' },
    { userId: createdUsers[5].id, firstName: 'James', lastName: 'Brown', specialization: 'Emergency Physician', qualification: 'MD, FACEP', licenseNumber: 'LIC-005', experience: 20, departmentId: createdDepartments[4].id, consultationFee: '350.00', availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], availableTimeStart: '06:00', availableTimeEnd: '18:00', maxPatientsPerDay: 40, phone: '+1000000005', email: 'james.brown@hospital.com' },
  ];

  const createdDoctors = [];
  for (const doctor of doctorsData) {
    const [created] = await db.insert(doctors).values(doctor).returning();
    createdDoctors.push(created);
  }

  // Update head doctors for departments
  await db.update(departments).set({ headDoctorId: createdDoctors[0].id }).where(eq(departments.id, createdDepartments[0].id));
  await db.update(departments).set({ headDoctorId: createdDoctors[1].id }).where(eq(departments.id, createdDepartments[1].id));
  console.log('✅ Doctors created\n');

  // ==================== ROOMS & BEDS ====================
  console.log('Creating rooms and beds...');
  const roomsData = [
    { roomNumber: '101', roomType: 'general' as const, floor: '1st Floor', building: 'Main Building', dailyRate: '150.00' },
    { roomNumber: '102', roomType: 'general' as const, floor: '1st Floor', building: 'Main Building', dailyRate: '150.00' },
    { roomNumber: '201', roomType: 'semi_private' as const, floor: '2nd Floor', building: 'Main Building', dailyRate: '250.00' },
    { roomNumber: '301', roomType: 'private' as const, floor: '3rd Floor', building: 'Main Building', dailyRate: '500.00' },
    { roomNumber: 'ICU-1', roomType: 'icu' as const, floor: '2nd Floor', building: 'ICU Wing', dailyRate: '1000.00' },
    { roomNumber: 'DLX-1', roomType: 'deluxe' as const, floor: '5th Floor', building: 'Premium Wing', dailyRate: '800.00' },
  ];

  for (const room of roomsData) {
    const [createdRoom] = await db.insert(rooms).values(room).returning();
    
    // Create 2-4 beds per room
    const bedCount = room.roomType === 'icu' ? 1 : room.roomType === 'private' ? 1 : 2;
    for (let i = 1; i <= bedCount; i++) {
      await db.insert(beds).values({
        bedNumber: `${room.roomNumber}-B${i}`,
        roomId: createdRoom.id,
        isOccupied: false,
      });
    }
  }
  console.log('✅ Rooms and beds created\n');

  // ==================== PATIENTS ====================
  console.log('Creating patients...');
  const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack',
    'Karen', 'Leo', 'Mia', 'Noah', 'Olivia', 'Paul', 'Quinn', 'Rose', 'Sam', 'Tina',
    'Uma', 'Victor', 'Wendy', 'Xander', 'Yara', 'Zack', 'Anna', 'Ben', 'Chloe', 'Dan'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson',
    'Taylor', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris',
    'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright'];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
  const createdPatients = [];

  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[i];
    const lastName = lastNames[i];
    const gender = i % 2 === 0 ? 'male' : 'female';
    const dob = new Date(1960 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const bloodGroup = bloodGroups[Math.floor(Math.random() * 8)];

    const [patient] = await db.insert(patients).values({
      patientId: `PAT-${String(i + 1).padStart(4, '0')}`,
      firstName,
      lastName,
      dateOfBirth: dob.toISOString().split('T')[0],
      gender: gender as 'male' | 'female',
      bloodGroup,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      address: `${Math.floor(Math.random() * 9999) + 1} ${['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd'][Math.floor(Math.random() * 4)]}`,
      city: 'New York',
      state: 'NY',
      zipCode: String(Math.floor(Math.random() * 90000) + 10000),
      emergencyContact: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      emergencyName: `Emergency Contact for ${firstName}`,
      relationship: ['Spouse', 'Parent', 'Sibling', 'Child'][Math.floor(Math.random() * 4)],
      allergies: Math.random() > 0.7 ? ['Penicillin', 'Latex', 'Pollen', 'Nuts'][Math.floor(Math.random() * 4)] : null,
      patientType: Math.random() > 0.8 ? 'inpatient' : 'outpatient',
      isActive: true,
    }).returning();
    
    createdPatients.push(patient);
  }
  console.log('✅ Patients created\n');

  // ==================== APPOINTMENTS ====================
  console.log('Creating appointments...');
  const appointmentStatuses = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'] as const;
  const appointmentTypes = ['consultation', 'follow_up', 'emergency', 'checkup', 'surgery'];
  const priorities = ['normal', 'urgent', 'stat'] as const;

  const createdAppointments = [];
  for (let i = 0; i < 100; i++) {
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) - 10);
    const hours = 8 + Math.floor(Math.random() * 10);
    const minutes = Math.random() > 0.5 ? '00' : '30';
    
    const [appointment] = await db.insert(appointments).values({
      appointmentNumber: `APT-${String(i + 1).padStart(4, '0')}`,
      patientId: createdPatients[Math.floor(Math.random() * 50)].id,
      doctorId: createdDoctors[Math.floor(Math.random() * 5)].id,
      departmentId: createdDepartments[Math.floor(Math.random() * 8)].id,
      appointmentDate: appointmentDate.toISOString().split('T')[0],
      appointmentTime: `${String(hours).padStart(2, '0')}:${minutes}`,
      status: appointmentStatuses[Math.floor(Math.random() * 6)],
      type: appointmentTypes[Math.floor(Math.random() * 5)],
      symptoms: ['Headache', 'Fever', 'Back pain', 'Chest pain', 'Cough', 'Fatigue', 'Joint pain'][Math.floor(Math.random() * 7)],
      notes: 'Regular consultation',
      priority: priorities[Math.floor(Math.random() * 3)],
      duration: 30,
    }).returning();
    
    createdAppointments.push(appointment);
  }
  console.log('✅ Appointments created\n');

  // ==================== ADMISSIONS ====================
  console.log('Creating admissions...');
  const createdAdmissions = [];
  for (let i = 0; i < 10; i++) {
    const admissionDate = new Date();
    admissionDate.setDate(admissionDate.getDate() - Math.floor(Math.random() * 10));
    
    const [admission] = await db.insert(admissions).values({
      admissionId: `ADM-${String(i + 1).padStart(4, '0')}`,
      patientId: createdPatients[Math.floor(Math.random() * 50)].id,
      doctorId: createdDoctors[Math.floor(Math.random() * 5)].id,
      roomId: i + 1, // Assuming rooms 1-6 exist
      bedId: i + 1,  // Assuming beds 1-10 exist
      admissionDate,
      diagnosis: ['Pneumonia', 'Fracture', 'Appendicitis', 'COVID-19', 'Heart Condition'][Math.floor(Math.random() * 5)],
      status: Math.random() > 0.3 ? 'under_treatment' : 'ready_for_discharge',
      diet: ['Regular', 'Low sodium', 'Diabetic', 'Soft', 'Liquid'][Math.floor(Math.random() * 5)],
      precautions: ['Monitor vitals every 4 hours', 'Bed rest', 'Physical therapy required'],
    }).returning();
    
    createdAdmissions.push(admission);

    // Update bed occupancy
    await db.update(beds).set({ isOccupied: true }).where(eq(beds.id, i + 1));
    await db.update(rooms).set({ isOccupied: true }).where(eq(rooms.id, i + 1));
  }
  console.log('✅ Admissions created\n');

  // ==================== VITALS ====================
  console.log('Creating vitals...');
  for (const admission of createdAdmissions) {
    await db.insert(vitals).values({
      admissionId: admission.id,
      temperature: 97 + Math.random() * 5,
      heartRate: 60 + Math.floor(Math.random() * 40),
      bloodPressureSystolic: 110 + Math.floor(Math.random() * 40),
      bloodPressureDiastolic: 70 + Math.floor(Math.random() * 20),
      oxygenLevel: 95 + Math.random() * 5,
      respiratoryRate: 12 + Math.floor(Math.random() * 8),
      recordedBy: createdUsers[6].id, // Nurse
    });
  }
  console.log('✅ Vitals created\n');

  // ==================== MEDICAL RECORDS ====================
  console.log('Creating medical records...');
  const createdRecords = [];
  for (let i = 0; i < 50; i++) {
    const [record] = await db.insert(medicalRecords).values({
      recordNumber: `REC-${String(i + 1).padStart(4, '0')}`,
      patientId: createdPatients[Math.floor(Math.random() * 50)].id,
      doctorId: createdDoctors[Math.floor(Math.random() * 5)].id,
      appointmentId: createdAppointments[i]?.id,
      diagnosis: ['Hypertension', 'Diabetes Type 2', 'Migraine', 'Bronchitis', 'Arthritis'][Math.floor(Math.random() * 5)],
      symptoms: ['Headache, dizziness', 'Fatigue, thirst', 'Severe pain', 'Cough, fever', 'Joint stiffness'][Math.floor(Math.random() * 5)],
      treatment: ['Medication prescribed', 'Physical therapy', 'Rest and fluids', 'Antibiotics course'][Math.floor(Math.random() * 4)],
      followUpDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    }).returning();
    
    createdRecords.push(record);
  }
  console.log('✅ Medical records created\n');

  // ==================== PRESCRIPTIONS ====================
  console.log('Creating prescriptions...');
  const medicines = [
    { name: 'Paracetamol 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' },
    { name: 'Amoxicillin 250mg', dosage: '250mg', frequency: 'Three times daily', duration: '10 days' },
    { name: 'Omeprazole 20mg', dosage: '20mg', frequency: 'Once daily', duration: '30 days' },
    { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily', duration: '90 days' },
    { name: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once daily', duration: '90 days' },
    { name: 'Atorvastatin 20mg', dosage: '20mg', frequency: 'Once daily at bedtime', duration: '90 days' },
    { name: 'Albuterol Inhaler', dosage: '2 puffs', frequency: 'Every 6 hours as needed', duration: '30 days' },
    { name: 'Prednisone 10mg', dosage: '10mg', frequency: 'Once daily', duration: '14 days' },
  ];

  for (let i = 0; i < 80; i++) {
    const medicine = medicines[Math.floor(Math.random() * 8)];
    await db.insert(prescriptions).values({
      prescriptionNumber: `PRX-${String(i + 1).padStart(4, '0')}`,
      recordId: createdRecords[Math.floor(Math.random() * 50)].id,
      patientId: createdPatients[Math.floor(Math.random() * 50)].id,
      doctorId: createdDoctors[Math.floor(Math.random() * 5)].id,
      medicineName: medicine.name,
      dosage: medicine.dosage,
      frequency: medicine.frequency,
      duration: medicine.duration,
      instructions: 'Take with food. Complete the full course.',
      quantity: 10 + Math.floor(Math.random() * 30),
      refills: Math.floor(Math.random() * 3),
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
    });
  }
  console.log('✅ Prescriptions created\n');

  // ==================== LAB TESTS ====================
  console.log('Creating lab tests...');
  const labTestData = [
    { name: 'Complete Blood Count (CBC)', category: 'Hematology', normalRange: '4.5-11.0', unit: '10^9/L' },
    { name: 'Blood Glucose', category: 'Chemistry', normalRange: '70-100', unit: 'mg/dL' },
    { name: 'Lipid Panel', category: 'Chemistry', normalRange: '<200', unit: 'mg/dL' },
    { name: 'Liver Function Test', category: 'Chemistry', normalRange: '10-40', unit: 'U/L' },
    { name: 'Urinalysis', category: 'Microbiology', normalRange: 'Negative', unit: '' },
    { name: 'Chest X-Ray', category: 'Radiology', normalRange: 'Normal', unit: '' },
    { name: 'ECG', category: 'Cardiology', normalRange: 'Normal sinus', unit: '' },
  ];

  for (let i = 0; i < 30; i++) {
    const test = labTestData[Math.floor(Math.random() * 7)];
    await db.insert(labTests).values({
      testNumber: `LAB-${String(i + 1).padStart(4, '0')}`,
      patientId: createdPatients[Math.floor(Math.random() * 50)].id,
      doctorId: createdDoctors[Math.floor(Math.random() * 5)].id,
      testName: test.name,
      category: test.category,
      status: ['pending', 'in_progress', 'completed'][Math.floor(Math.random() * 3)] as any,
      priority: Math.random() > 0.8 ? 'urgent' : 'normal',
      normalRange: test.normalRange,
      unit: test.unit,
      result: Math.random() > 0.5 ? String(parseFloat(test.normalRange) * (0.5 + Math.random())) : null,
    });
  }
  console.log('✅ Lab tests created\n');

  // ==================== BILLS & PAYMENTS ====================
  console.log('Creating bills and payments...');
  for (let i = 0; i < 60; i++) {
    const totalAmount = (100 + Math.random() * 2000).toFixed(2);
    const status = ['pending', 'paid', 'partial', 'refunded'][Math.floor(Math.random() * 4)] as any;
    let paidAmount = '0';
    
    if (status === 'paid') paidAmount = totalAmount;
    else if (status === 'partial') paidAmount = (parseFloat(totalAmount) * 0.6).toFixed(2);
    
    const items = [
      { description: 'Consultation Fee', quantity: 1, unitPrice: 150, total: 150, category: 'Consultation' },
      { description: 'Lab Tests', quantity: 2, unitPrice: 75, total: 150, category: 'Laboratory' },
      { description: 'Medication', quantity: 3, unitPrice: 25, total: 75, category: 'Pharmacy' },
    ];

    const [bill] = await db.insert(bills).values({
      billNumber: `BILL-${String(i + 1).padStart(4, '0')}`,
      patientId: createdPatients[Math.floor(Math.random() * 50)].id,
      appointmentId: createdAppointments[i]?.id,
      totalAmount,
      paidAmount,
      discount: (Math.random() * 50).toFixed(2),
      tax: (parseFloat(totalAmount) * 0.1).toFixed(2),
      paymentStatus: status,
      paymentMethod: ['cash', 'card', 'insurance', 'bank_transfer'][Math.floor(Math.random() * 4)],
      description: 'Medical services and consultation',
      billDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dueDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items,
      createdBy: createdUsers[9].id, // Receptionist
    }).returning();

    // Create payment if not pending
    if (status === 'paid' || status === 'partial') {
      await db.insert(payments).values({
        paymentNumber: `PAY-${String(i + 1).padStart(4, '0')}`,
        billId: bill.id,
        amount: paidAmount,
        paymentMethod: ['cash', 'card', 'insurance'][Math.floor(Math.random() * 3)],
        referenceNumber: `REF-${Math.random().toString(36).substring(7).toUpperCase()}`,
        notes: 'Payment received',
        receivedBy: createdUsers[9].id,
      });
    }
  }
  console.log('✅ Bills and payments created\n');

  // ==================== INVENTORY ====================
  console.log('Creating inventory...');
  const inventoryItems = [
    { name: 'Paracetamol 500mg', category: 'Medicine', unit: 'tablets', price: '0.50', reorderLevel: 100 },
    { name: 'Amoxicillin 250mg', category: 'Medicine', unit: 'capsules', price: '0.75', reorderLevel: 80 },
    { name: 'Surgical Masks', category: 'Supplies', unit: 'pieces', price: '0.25', reorderLevel: 200 },
    { name: 'Disposable Gloves', category: 'Supplies', unit: 'boxes', price: '5.00', reorderLevel: 50 },
    { name: 'Syringes 5ml', category: 'Equipment', unit: 'pieces', price: '0.30', reorderLevel: 150 },
    { name: 'Blood Pressure Monitor', category: 'Equipment', unit: 'units', price: '45.00', reorderLevel: 5 },
    { name: 'Bandages', category: 'Supplies', unit: 'rolls', price: '2.00', reorderLevel: 75 },
    { name: 'Antiseptic Solution', category: 'Medicine', unit: 'bottles', price: '3.50', reorderLevel: 40 },
    { name: 'IV Fluids', category: 'Medicine', unit: 'bags', price: '8.00', reorderLevel: 60 },
    { name: 'Cotton Swabs', category: 'Supplies', unit: 'packets', price: '1.50', reorderLevel: 100 },
    { name: 'Thermometer', category: 'Equipment', unit: 'units', price: '12.00', reorderLevel: 10 },
    { name: 'Stethoscope', category: 'Equipment', unit: 'units', price: '85.00', reorderLevel: 3 },
    { name: 'Pain Relief Gel', category: 'Medicine', unit: 'tubes', price: '6.00', reorderLevel: 30 },
    { name: 'Vitamin C Tablets', category: 'Medicine', unit: 'tablets', price: '0.30', reorderLevel: 120 },
    { name: 'Hand Sanitizer', category: 'Supplies', unit: 'bottles', price: '4.00', reorderLevel: 80 },
  ];

  const createdInventory: any[] = [];
  for (const item of inventoryItems) {
    const [inventoryItem]: any[] = await db.insert(inventory).values({
      itemCode: `INV-${String(createdInventory.length + 1).padStart(4, '0')}`,
      itemName: item.name,
      category: item.category,
      description: `Hospital grade ${item.name.toLowerCase()}`,
      quantity: Math.floor(Math.random() * 300) + 10,
      unit: item.unit,
      unitPrice: item.price,
      supplier: `Medical Supplies Co. ${Math.floor(Math.random() * 5) + 1}`,
      supplierContact: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      reorderLevel: item.reorderLevel,
      expiryDate: new Date(Date.now() + Math.random() * 365 * 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      batchNumber: `BATCH-${Math.random().toString(36).substring(7).toUpperCase()}`,
      location: `${['Shelf A', 'Shelf B', 'Cabinet 1', 'Cabinet 2', 'Refrigerator'][Math.floor(Math.random() * 5)]}-${Math.floor(Math.random() * 10) + 1}`,
      isActive: true,
    }).returning();
    
    createdInventory.push(inventoryItem);

    // Create initial stock entry
    await db.insert(inventoryTransactions).values({
      transactionNumber: `TXN-${String(createdInventory.length).padStart(4, '0')}`,
      itemId: inventoryItem.id,
      type: 'in',
      quantity: inventoryItem.quantity,
      unitPrice: item.price,
      totalAmount: (inventoryItem.quantity * parseFloat(item.price)).toFixed(2),
      referenceType: 'purchase',
      notes: 'Initial stock',
      performedBy: createdUsers[10].id, // Pharmacist
    });
  }
  console.log('✅ Inventory created\n');

  // ==================== NOTIFICATIONS ====================
  console.log('Creating notifications...');
  const notificationTypes = ['appointment', 'lab', 'pharmacy', 'billing', 'system', 'patient'];
  const notificationMessages = [
    'New appointment scheduled for tomorrow',
    'Lab results are ready for review',
    'Low stock alert: Paracetamol',
    'Payment received from patient',
    'System maintenance scheduled',
    'New patient registration completed',
  ];

  for (let i = 0; i < 20; i++) {
    await db.insert(notifications).values({
      userId: createdUsers[Math.floor(Math.random() * 12)].id,
      title: notificationTypes[i % 6].charAt(0).toUpperCase() + notificationTypes[i % 6].slice(1) + ' Notification',
      message: notificationMessages[i % 6],
      type: notificationTypes[i % 6],
      isRead: Math.random() > 0.5,
      link: '/dashboard',
    });
  }
  console.log('✅ Notifications created\n');

  // ==================== SUMMARY ====================
  console.log('🎉 Database seed completed successfully!');
  console.log('\n📊 SEED SUMMARY:');
  console.log('═══════════════════════════════════════');
  console.log('✅ Settings: 1');
  console.log('✅ Users: 12 (1 admin, 5 doctors, 3 nurses, 1 receptionist, 1 pharmacist, 1 lab tech)');
  console.log('✅ Departments: 8');
  console.log('✅ Doctors: 5');
  console.log('✅ Patients: 50');
  console.log('✅ Rooms: 6');
  console.log('✅ Beds: 10');
  console.log('✅ Appointments: 100');
  console.log('✅ Admissions: 10');
  console.log('✅ Medical Records: 50');
  console.log('✅ Prescriptions: 80');
  console.log('✅ Lab Tests: 30');
  console.log('✅ Bills: 60');
  console.log('✅ Inventory Items: 15');
  console.log('✅ Notifications: 20');
  console.log('═══════════════════════════════════════');
  console.log('📈 Total Records: 447');
  console.log('\n📧 DEFAULT LOGIN CREDENTIALS:');
  console.log('───────────────────────────────────────────────');
  console.log('Admin:         admin@hospital.com / Password@123');
  console.log('Doctor:        john.smith@hospital.com / Password@123');
  console.log('Nurse:         linda.davis@hospital.com / Password@123');
  console.log('Receptionist:  reception@hospital.com / Password@123');
  console.log('Pharmacist:    pharmacy@hospital.com / Password@123');
  console.log('Lab Tech:      lab@hospital.com / Password@123');
  console.log('───────────────────────────────────────────────\n');
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });