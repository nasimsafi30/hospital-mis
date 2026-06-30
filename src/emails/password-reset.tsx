import { Body, Container, Head, Heading, Html, Link, Preview, Text } from '@react-email/components';

interface Props { firstName: string; resetLink: string; }

export const PasswordResetEmail = ({ firstName, resetLink }: Props) => (
  <Html><Head /><Preview>Reset Your Password</Preview>
    <Body style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <Container style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center' }}>
        <Heading style={{ color: '#2563eb' }}>Password Reset</Heading>
        <Text>Hi {firstName},</Text>
        <Text>Click the link below to reset your password. This link expires in 1 hour.</Text>
        <Link href={resetLink} style={{ display: 'inline-block', padding: '12px 24px', backgroundColor: '#2563eb', color: '#fff', borderRadius: '5px', textDecoration: 'none', margin: '15px 0' }}>Reset Password</Link>
        <Text style={{ color: '#666', fontSize: '12px' }}>If you didn't request this, please ignore this email.</Text>
      </Container>
    </Body>
  </Html>
);