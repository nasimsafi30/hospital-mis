import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface Props { patientName: string; doctorName: string; medicines: Array<{ name: string; dosage: string; frequency: string; duration: string }>; date: string; }

export const PrescriptionEmail = ({ patientName, doctorName, medicines, date }: Props) => (
  <Html><Head /><Preview>Your Prescription from Dr. {doctorName}</Preview>
    <Body style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <Container style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px' }}>
        <Heading style={{ color: '#059669' }}>Prescription</Heading>
        <Text>Dear {patientName},</Text>
        <Text>Dr. {doctorName} has prescribed the following on {date}:</Text>
        <Section style={{ backgroundColor: '#f0fdf4', padding: '15px', borderRadius: '5px', margin: '15px 0' }}>
          {medicines.map((med, i) => (
            <div key={i} style={{ marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
              <Text><strong>{med.name}</strong></Text>
              <Text>Dosage: {med.dosage} | Frequency: {med.frequency} | Duration: {med.duration}</Text>
            </div>
          ))}
        </Section>
        <Text style={{ color: '#666', fontSize: '12px' }}>Complete the full course. Consult your doctor before stopping.</Text>
      </Container>
    </Body>
  </Html>
);