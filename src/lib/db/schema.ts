import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  date,
  pgEnum,
  decimal,
  jsonb,
  real,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==================== ENUMS ====================

export const roleEnum = pgEnum('role', [
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'pharmacist',
  'lab_technician',
  'patient',
]);

export const genderEnum = pgEnum('gender', ['male', 'female', 'other']);

export const bloodGroupEnum = pgEnum('blood_group', [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-',
]);

export const appointmentStatusEnum = pgEnum('appointment_status', [
  'scheduled',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'paid',
  'partial',
  'refunded',
]);

export const patientTypeEnum = pgEnum('patient_type', [
  'inpatient',
  'outpatient',
  'emergency',
]);

export const admissionStatusEnum = pgEnum('admission_status', [
  'admitted',
  'under_treatment',
  'ready_for_discharge',
  'discharged',
]);

export const labTestStatusEnum = pgEnum('lab_test_status', [
  'pending',
  'in_progress',
  'completed',
  'cancelled',
]);

export const priorityEnum = pgEnum('priority', ['normal', 'urgent', 'stat']);

export const roomTypeEnum = pgEnum('room_type', [
  'general',
  'semi_private',
  'private',
  'icu',
  'deluxe',
]);

// ==================== USERS TABLE ====================

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: roleEnum('role').notNull(),
  firstName: varchar('first_name', { length: 200 }).notNull(),
  lastName: varchar('last_name', { length: 200 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  avatar: varchar('avatar', { length: 500 }),
  isActive: boolean('is_active').default(true),
  lastLogin: timestamp('last_login'),
  
  // Two-factor authentication
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  twoFactorCode: varchar('two_factor_code', { length: 255 }),
  twoFactorCodeExpires: timestamp('two_factor_code_expires'),
  backupCodes: jsonb('backup_codes').$type<string[]>(),
  
  // Password reset
  resetToken: varchar('reset_token', { length: 255 }),
  resetTokenExpires: timestamp('reset_token_expires'),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== DEPARTMENTS TABLE ====================

export const departments = pgTable('departments', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 500 }).notNull(),
  description: text('description'),
  headDoctorId: integer('head_doctor_id'),
  floor: varchar('floor', { length: 20 }),
  building: varchar('building', { length: 200 }),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== DOCTORS TABLE ====================

export const doctors = pgTable('doctors', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  firstName: varchar('first_name', { length: 200 }).notNull(),
  lastName: varchar('last_name', { length: 200 }).notNull(),
  specialization: varchar('specialization', { length: 500 }).notNull(),
  qualification: varchar('qualification', { length: 500 }),
  licenseNumber: varchar('license_number', { length: 200 }).unique().notNull(),
  experience: integer('experience'),
  departmentId: integer('department_id').references(() => departments.id),
  consultationFee: decimal('consultation_fee', { precision: 10, scale: 2 }),
  availableDays: jsonb('available_days').$type<string[]>(),
  availableTimeStart: varchar('available_time_start', { length: 20 }),
  availableTimeEnd: varchar('available_time_end', { length: 20 }),
  maxPatientsPerDay: integer('max_patients_per_day').default(20),
  isActive: boolean('is_active').default(true),
  bio: text('bio'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  avatar: varchar('avatar', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== PATIENTS TABLE ====================

export const patients = pgTable('patients', {
  id: serial('id').primaryKey(),
  patientId: varchar('patient_id', { length: 50 }).unique().notNull(),
  userId: integer('user_id').references(() => users.id),
  firstName: varchar('first_name', { length: 200 }).notNull(),
  lastName: varchar('last_name', { length: 200 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  gender: genderEnum('gender').notNull(),
  bloodGroup: bloodGroupEnum('blood_group'),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }).notNull(),
  address: text('address'),
  city: varchar('city', { length: 200 }),
  state: varchar('state', { length: 200 }),
  zipCode: varchar('zip_code', { length: 50 }),
  emergencyContact: varchar('emergency_contact', { length: 50 }),
  emergencyName: varchar('emergency_name', { length: 500 }),
  relationship: varchar('relationship', { length: 200 }),
  allergies: text('allergies'),
  medicalHistory: text('medical_history'),
  currentMedications: text('current_medications'),
  insuranceProvider: varchar('insurance_provider', { length: 500 }),
  insuranceNumber: varchar('insurance_number', { length: 200 }),
  patientType: patientTypeEnum('patient_type').default('outpatient'),
  isActive: boolean('is_active').default(true),
  notes: text('notes'),
  occupation: varchar('occupation', { length: 200 }),
  maritalStatus: varchar('marital_status', { length: 50 }),
  preferredLanguage: varchar('preferred_language', { length: 50 }),
  avatar: varchar('avatar', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== ROOMS TABLE ====================

export const rooms = pgTable('rooms', {
  id: serial('id').primaryKey(),
  roomNumber: varchar('room_number', { length: 20 }).unique().notNull(),
  roomType: roomTypeEnum('room_type').notNull(),
  floor: varchar('floor', { length: 20 }).notNull(),
  building: varchar('building', { length: 200 }),
  departmentId: integer('department_id').references(() => departments.id),
  isOccupied: boolean('is_occupied').default(false),
  isActive: boolean('is_active').default(true),
  dailyRate: decimal('daily_rate', { precision: 10, scale: 2 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== BEDS TABLE ====================

export const beds = pgTable('beds', {
  id: serial('id').primaryKey(),
  bedNumber: varchar('bed_number', { length: 20 }).notNull(),
  roomId: integer('room_id').references(() => rooms.id).notNull(),
  isOccupied: boolean('is_occupied').default(false),
  isActive: boolean('is_active').default(true),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== APPOINTMENTS TABLE ====================

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  appointmentNumber: varchar('appointment_number', { length: 50 }).unique().notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  departmentId: integer('department_id').references(() => departments.id),
  appointmentDate: date('appointment_date').notNull(),
  appointmentTime: varchar('appointment_time', { length: 20 }).notNull(),
  status: appointmentStatusEnum('status').default('scheduled'),
  type: varchar('type', { length: 50 }).default('consultation'),
  symptoms: text('symptoms'),
  notes: text('notes'),
  priority: priorityEnum('priority').default('normal'),
  duration: integer('duration').default(30), // in minutes
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== ADMISSIONS TABLE ====================

export const admissions = pgTable('admissions', {
  id: serial('id').primaryKey(),
  admissionId: varchar('admission_id', { length: 50 }).unique().notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  roomId: integer('room_id').references(() => rooms.id),
  bedId: integer('bed_id').references(() => beds.id),
  admissionDate: timestamp('admission_date').notNull(),
  dischargeDate: timestamp('discharge_date'),
  diagnosis: text('diagnosis'),
  status: admissionStatusEnum('status').default('admitted'),
  notes: text('notes'),
  diet: text('diet'),
  precautions: jsonb('precautions').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== VITALS TABLE ====================

export const vitals = pgTable('vitals', {
  id: serial('id').primaryKey(),
  admissionId: integer('admission_id').references(() => admissions.id).notNull(),
  temperature: real('temperature'),
  heartRate: integer('heart_rate'),
  bloodPressureSystolic: integer('blood_pressure_systolic'),
  bloodPressureDiastolic: integer('blood_pressure_diastolic'),
  oxygenLevel: real('oxygen_level'),
  respiratoryRate: integer('respiratory_rate'),
  bloodSugar: real('blood_sugar'),
  weight: real('weight'),
  height: real('height'),
  notes: text('notes'),
  recordedBy: integer('recorded_by').references(() => users.id),
  recordedAt: timestamp('recorded_at').defaultNow(),
});

// ==================== MEDICAL RECORDS TABLE ====================

export const medicalRecords = pgTable('medical_records', {
  id: serial('id').primaryKey(),
  recordNumber: varchar('record_number', { length: 50 }).unique().notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  admissionId: integer('admission_id').references(() => admissions.id),
  diagnosis: text('diagnosis'),
  symptoms: text('symptoms'),
  prescription: text('prescription'),
  treatment: text('treatment'),
  notes: text('notes'),
  followUpDate: date('follow_up_date'),
  attachments: jsonb('attachments').$type<string[]>(),
  isConfidential: boolean('is_confidential').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== PRESCRIPTIONS TABLE ====================

export const prescriptions = pgTable('prescriptions', {
  id: serial('id').primaryKey(),
  prescriptionNumber: varchar('prescription_number', { length: 50 }).unique().notNull(),
  recordId: integer('record_id').references(() => medicalRecords.id),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  medicineName: varchar('medicine_name', { length: 500 }).notNull(),
  dosage: varchar('dosage', { length: 200 }).notNull(),
  frequency: varchar('frequency', { length: 200 }).notNull(),
  duration: varchar('duration', { length: 200 }).notNull(),
  instructions: text('instructions'),
  quantity: integer('quantity').notNull(),
  refills: integer('refills').default(0),
  isActive: boolean('is_active').default(true),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  dispensedQuantity: integer('dispensed_quantity').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== LAB TESTS TABLE ====================

export const labTests = pgTable('lab_tests', {
  id: serial('id').primaryKey(),
  testNumber: varchar('test_number', { length: 50 }).unique().notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  doctorId: integer('doctor_id').references(() => doctors.id).notNull(),
  testName: varchar('test_name', { length: 500 }).notNull(),
  category: varchar('category', { length: 200 }),
  status: labTestStatusEnum('status').default('pending'),
  priority: priorityEnum('priority').default('normal'),
  instructions: text('instructions'),
  result: text('result'),
  resultValue: real('result_value'),
  normalRange: varchar('normal_range', { length: 200 }),
  unit: varchar('unit', { length: 50 }),
  resultNotes: text('result_notes'),
  performedBy: integer('performed_by').references(() => users.id),
  performedAt: timestamp('performed_at'),
  attachments: jsonb('attachments').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== BILLS TABLE ====================

export const bills = pgTable('bills', {
  id: serial('id').primaryKey(),
  billNumber: varchar('bill_number', { length: 50 }).unique().notNull(),
  patientId: integer('patient_id').references(() => patients.id).notNull(),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  admissionId: integer('admission_id').references(() => admissions.id),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal('paid_amount', { precision: 10, scale: 2 }).default('0'),
  discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
  tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
  paymentStatus: paymentStatusEnum('payment_status').default('pending'),
  paymentMethod: varchar('payment_method', { length: 50 }),
  paymentDate: timestamp('payment_date'),
  description: text('description'),
  billDate: date('bill_date').notNull(),
  dueDate: date('due_date'),
  items: jsonb('items').$type<Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    category: string;
  }>>(),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== PAYMENTS TABLE ====================

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  paymentNumber: varchar('payment_number', { length: 50 }).unique().notNull(),
  billId: integer('bill_id').references(() => bills.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  paymentDate: timestamp('payment_date').defaultNow(),
  referenceNumber: varchar('reference_number', { length: 200 }),
  notes: text('notes'),
  receivedBy: integer('received_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==================== INVENTORY TABLE ====================

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  itemCode: varchar('item_code', { length: 50 }).unique().notNull(),
  itemName: varchar('item_name', { length: 500 }).notNull(),
  category: varchar('category', { length: 200 }).notNull(),
  description: text('description'),
  quantity: integer('quantity').notNull().default(0),
  unit: varchar('unit', { length: 50 }).notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }).notNull(),
  supplier: varchar('supplier', { length: 500 }),
  supplierContact: varchar('supplier_contact', { length: 200 }),
  reorderLevel: integer('reorder_level').default(10),
  expiryDate: date('expiry_date'),
  batchNumber: varchar('batch_number', { length: 200 }),
  location: varchar('location', { length: 200 }),
  isActive: boolean('is_active').default(true),
  lastRestocked: timestamp('last_restocked'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== INVENTORY TRANSACTIONS TABLE ====================

export const inventoryTransactions = pgTable('inventory_transactions', {
  id: serial('id').primaryKey(),
  transactionNumber: varchar('transaction_number', { length: 50 }).unique().notNull(),
  itemId: integer('item_id').references(() => inventory.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(), // in, out, adjustment
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 10, scale: 2 }),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }),
  referenceType: varchar('reference_type', { length: 50 }), // purchase, dispense, return, adjustment
  referenceId: integer('reference_id'), // ID from related table
  notes: text('notes'),
  performedBy: integer('performed_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// ==================== SETTINGS TABLE ====================

export const settings = pgTable('settings', {
  id: serial('id').primaryKey(),
  hospitalName: varchar('hospital_name', { length: 500 }).default('City General Hospital'),
  address: text('address'),
  phone: varchar('phone', { length: 50 }),
  email: varchar('email', { length: 255 }),
  website: varchar('website', { length: 255 }),
  timezone: varchar('timezone', { length: 50 }).default('America/New_York'),
  dateFormat: varchar('date_format', { length: 50 }).default('MM/DD/YYYY'),
  timeFormat: varchar('time_format', { length: 50 }).default('12'),
  language: varchar('language', { length: 20 }).default('en'),
  currency: varchar('currency', { length: 20 }).default('USD'),
  currencySymbol: varchar('currency_symbol', { length: 5 }).default('$'),
  appointmentDuration: integer('appointment_duration').default(30),
  maxAppointmentsPerDay: integer('max_appointments_per_day').default(50),
  emailNotifications: boolean('email_notifications').default(true),
  smsNotifications: boolean('sms_notifications').default(false),
  pushNotifications: boolean('push_notifications').default(true),
  smtpHost: varchar('smtp_host', { length: 255 }),
  smtpPort: integer('smtp_port'),
  smtpUser: varchar('smtp_user', { length: 255 }),
  smtpPass: varchar('smtp_pass', { length: 255 }),
  smtpFrom: varchar('smtp_from', { length: 255 }),
  smsProvider: varchar('sms_provider', { length: 50 }),
  smsApiKey: varchar('sms_api_key', { length: 255 }),
  smsFromNumber: varchar('sms_from_number', { length: 50 }),
  logo: varchar('logo', { length: 500 }),
  favicon: varchar('favicon', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ==================== AUDIT LOGS TABLE ====================

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  userEmail: varchar('user_email', { length: 255 }).notNull(),
  userRole: varchar('user_role', { length: 50 }).notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  entity: varchar('entity', { length: 50 }).notNull(),
  entityId: integer('entity_id'),
  oldValue: jsonb('old_value'),
  newValue: jsonb('new_value'),
  metadata: jsonb('metadata'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// ==================== NOTIFICATIONS TABLE ====================

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: varchar('title', { length: 500 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }).notNull(), // appointment, lab, pharmacy, billing, system
  isRead: boolean('is_read').default(false),
  link: varchar('link', { length: 500 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
});


// ==================== FINANCE TABLE ====================

export const financeTransactions = pgTable('finance_transactions', {
  id: serial('id').primaryKey(),
  type: varchar('type', { length: 20 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  description: text('description'),
  date: date('date').defaultNow().notNull(),
  createdBy: integer('created_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const financeTransactionsRelations = relations(financeTransactions, ({ one }) => ({
  user: one(users, {
    fields: [financeTransactions.createdBy],
    references: [users.id],
  }),
}));
// ==================== RELATIONS ====================

export const usersRelations = relations(users, ({ many }) => ({
  doctors: many(doctors),
  patients: many(patients),
  notifications: many(notifications),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  headDoctor: one(doctors, {
    fields: [departments.headDoctorId],
    references: [doctors.id],
  }),
  doctors: many(doctors),
  rooms: many(rooms),
}));

export const doctorsRelations = relations(doctors, ({ one, many }) => ({
  user: one(users, {
    fields: [doctors.userId],
    references: [users.id],
  }),
  department: one(departments, {
    fields: [doctors.departmentId],
    references: [departments.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
  prescriptions: many(prescriptions),
  labTests: many(labTests),
  admissions: many(admissions),
}));

export const patientsRelations = relations(patients, ({ one, many }) => ({
  user: one(users, {
    fields: [patients.userId],
    references: [users.id],
  }),
  appointments: many(appointments),
  medicalRecords: many(medicalRecords),
  prescriptions: many(prescriptions),
  labTests: many(labTests),
  bills: many(bills),
  admissions: many(admissions),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  department: one(departments, {
    fields: [rooms.departmentId],
    references: [departments.id],
  }),
  beds: many(beds),
  admissions: many(admissions),
}));

export const bedsRelations = relations(beds, ({ one, many }) => ({
  room: one(rooms, {
    fields: [beds.roomId],
    references: [rooms.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one, many }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [appointments.doctorId],
    references: [doctors.id],
  }),
  department: one(departments, {
    fields: [appointments.departmentId],
    references: [departments.id],
  }),
  medicalRecords: many(medicalRecords),
  bills: many(bills),
}));

export const admissionsRelations = relations(admissions, ({ one, many }) => ({
  patient: one(patients, {
    fields: [admissions.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [admissions.doctorId],
    references: [doctors.id],
  }),
  room: one(rooms, {
    fields: [admissions.roomId],
    references: [rooms.id],
  }),
  bed: one(beds, {
    fields: [admissions.bedId],
    references: [beds.id],
  }),
  vitals: many(vitals),
  medicalRecords: many(medicalRecords),
  bills: many(bills),
}));

export const vitalsRelations = relations(vitals, ({ one }) => ({
  admission: one(admissions, {
    fields: [vitals.admissionId],
    references: [admissions.id],
  }),
  recordedByUser: one(users, {
    fields: [vitals.recordedBy],
    references: [users.id],
  }),
}));

export const medicalRecordsRelations = relations(medicalRecords, ({ one, many }) => ({
  patient: one(patients, {
    fields: [medicalRecords.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [medicalRecords.doctorId],
    references: [doctors.id],
  }),
  appointment: one(appointments, {
    fields: [medicalRecords.appointmentId],
    references: [appointments.id],
  }),
  admission: one(admissions, {
    fields: [medicalRecords.admissionId],
    references: [admissions.id],
  }),
  prescriptions: many(prescriptions),
}));

export const prescriptionsRelations = relations(prescriptions, ({ one }) => ({
  record: one(medicalRecords, {
    fields: [prescriptions.recordId],
    references: [medicalRecords.id],
  }),
  patient: one(patients, {
    fields: [prescriptions.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [prescriptions.doctorId],
    references: [doctors.id],
  }),
}));

export const labTestsRelations = relations(labTests, ({ one }) => ({
  patient: one(patients, {
    fields: [labTests.patientId],
    references: [patients.id],
  }),
  doctor: one(doctors, {
    fields: [labTests.doctorId],
    references: [doctors.id],
  }),
  performedByUser: one(users, {
    fields: [labTests.performedBy],
    references: [users.id],
  }),
}));

export const billsRelations = relations(bills, ({ one, many }) => ({
  patient: one(patients, {
    fields: [bills.patientId],
    references: [patients.id],
  }),
  appointment: one(appointments, {
    fields: [bills.appointmentId],
    references: [appointments.id],
  }),
  admission: one(admissions, {
    fields: [bills.admissionId],
    references: [admissions.id],
  }),
  createdByUser: one(users, {
    fields: [bills.createdBy],
    references: [users.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  bill: one(bills, {
    fields: [payments.billId],
    references: [bills.id],
  }),
  receivedByUser: one(users, {
    fields: [payments.receivedBy],
    references: [users.id],
  }),
}));

export const inventoryRelations = relations(inventory, ({ many }) => ({
  transactions: many(inventoryTransactions),
}));

export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ one }) => ({
  item: one(inventory, {
    fields: [inventoryTransactions.itemId],
    references: [inventory.id],
  }),
  performedByUser: one(users, {
    fields: [inventoryTransactions.performedBy],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));