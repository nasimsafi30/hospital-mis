import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface Props { patientName: string; doctorName: string; date: string; time: string; appointmentNumber: string; }

export const AppointmentConfirmation = ({ patientName, doctorName, date, time, appointmentNumber }: Props) => (
  <Html><Head /><Preview>Appointment Confirmed - {appointmentNumber}</Preview>
    <Body style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <Container style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px' }}>
        <Heading style={{ color: '#2563eb' }}>Appointment Confirmed</Heading>
        <Text>Dear {patientName},</Text>
        <Text>Your appointment has been confirmed:</Text>
        <Section style={{ backgroundColor: '#f0f7ff', padding: '15px', borderRadius: '5px', margin: '15px 0' }}>
          <Text><strong>Doctor:</strong> Dr. {doctorName}</Text>
          <Text><strong>Date:</strong> {date}</Text>
          <Text><strong>Time:</strong> {time}</Text>
          <Text><strong>Appointment #:</strong> {appointmentNumber}</Text>
        </Section>
        <Text style={{ color: '#666', fontSize: '12px' }}>Please arrive 15 minutes early. Contact us if you need to reschedule.</Text>
      </Container>
    </Body>
  </Html>
);