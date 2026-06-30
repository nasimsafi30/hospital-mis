import { NextResponse } from 'next/server';

export async function GET() {
  const apiDocs = {
    openapi: '3.0.0',
    info: {
      title: 'Hospital MIS API',
      version: '1.0.0',
      description: 'Complete API documentation for Hospital Management Information System',
      contact: {
        name: 'API Support',
        email: 'support@hospital.com',
      },
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || 'http://localhost:3000',
        description: 'Production server',
      },
    ],
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths: {
      '/api/patients': {
        get: {
          tags: ['Patients'],
          summary: 'Get all patients',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'search',
              in: 'query',
              schema: { type: 'string' },
              description: 'Search term',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
            },
          ],
          responses: {
            '200': {
              description: 'List of patients',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Patient' },
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
        post: {
          tags: ['Patients'],
          summary: 'Create new patient',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PatientInput' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Patient created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Patient' },
                },
              },
            },
            '400': {
              description: 'Validation error',
            },
            '401': {
              description: 'Unauthorized',
            },
          },
        },
      },
      '/api/patients/{id}': {
        get: {
          tags: ['Patients'],
          summary: 'Get patient by ID',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': {
              description: 'Patient details',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Patient' },
                },
              },
            },
            '404': {
              description: 'Patient not found',
            },
          },
        },
        put: {
          tags: ['Patients'],
          summary: 'Update patient',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PatientInput' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Patient updated',
            },
          },
        },
        delete: {
          tags: ['Patients'],
          summary: 'Delete patient',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': {
              description: 'Patient deleted',
            },
            '404': {
              description: 'Patient not found',
            },
          },
        },
      },
      '/api/appointments': {
        get: {
          tags: ['Appointments'],
          summary: 'Get all appointments',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'date',
              in: 'query',
              schema: { type: 'string', format: 'date' },
            },
            {
              name: 'status',
              in: 'query',
              schema: { type: 'string' },
            },
            {
              name: 'doctorId',
              in: 'query',
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': {
              description: 'List of appointments',
            },
          },
        },
        post: {
          tags: ['Appointments'],
          summary: 'Create appointment',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AppointmentInput' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Appointment created',
            },
          },
        },
      },
      // Add more endpoints as needed...
    },
    components: {
      schemas: {
        Patient: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            patientId: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            bloodGroup: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        PatientInput: {
          type: 'object',
          required: ['firstName', 'lastName', 'dateOfBirth', 'gender', 'phone'],
          properties: {
            firstName: { type: 'string', minLength: 2 },
            lastName: { type: 'string', minLength: 2 },
            dateOfBirth: { type: 'string', format: 'date' },
            gender: { type: 'string', enum: ['male', 'female', 'other'] },
            bloodGroup: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string', minLength: 10 },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string' },
            patientType: { type: 'string', enum: ['inpatient', 'outpatient', 'emergency'] },
          },
        },
        AppointmentInput: {
          type: 'object',
          required: ['patientId', 'doctorId', 'appointmentDate', 'appointmentTime'],
          properties: {
            patientId: { type: 'integer' },
            doctorId: { type: 'integer' },
            departmentId: { type: 'integer' },
            appointmentDate: { type: 'string', format: 'date' },
            appointmentTime: { type: 'string' },
            type: { type: 'string' },
            symptoms: { type: 'string' },
            notes: { type: 'string' },
            priority: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            code: { type: 'string' },
            details: { type: 'array' },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };

  return NextResponse.json(apiDocs);
}