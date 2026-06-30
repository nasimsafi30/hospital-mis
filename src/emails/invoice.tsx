import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components';

interface Props { patientName: string; invoiceNumber: string; amount: string; dueDate: string; items: Array<{ description: string; amount: string }>; }

export const InvoiceEmail = ({ patientName, invoiceNumber, amount, dueDate, items }: Props) => (
  <Html><Head /><Preview>Invoice #{invoiceNumber} - ${amount}</Preview>
    <Body style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <Container style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px' }}>
        <Heading style={{ color: '#7c3aed' }}>Invoice #{invoiceNumber}</Heading>
        <Text>Dear {patientName},</Text>
        <Section style={{ backgroundColor: '#f5f3ff', padding: '15px', borderRadius: '5px' }}>
          {items.map((item, i) => (<Text key={i}>{item.description}: ${item.amount}</Text>))}
          <Text style={{ fontWeight: 'bold', marginTop: '10px' }}>Total: ${amount}</Text>
        </Section>
        <Text style={{ color: '#dc2626' }}>Due Date: {dueDate}</Text>
        <Text style={{ color: '#666', fontSize: '12px' }}>Thank you for choosing our services.</Text>
      </Container>
    </Body>
  </Html>
);