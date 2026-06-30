import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  firstName: string;
  role: string;
  temporaryPassword?: string;
}

export const WelcomeEmail = ({
  firstName,
  role,
  temporaryPassword,
}: WelcomeEmailProps) => {
  const roleDisplay = role.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <Html>
      <Head />
      <Preview>Welcome to Hospital MIS - Your account has been created</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={headingWhite}>Hospital MIS</Heading>
          </Section>
          
          <Section style={content}>
            <Heading style={heading}>Welcome, {firstName}!</Heading>
            <Text style={paragraph}>
              Your account has been successfully created in the Hospital Management
              Information System.
            </Text>
            
            <Section style={detailsBox}>
              <Text style={detailLabel}>Role:</Text>
              <Text style={detailValue}>{roleDisplay}</Text>
              
              {temporaryPassword && (
                <>
                  <Text style={detailLabel}>Temporary Password:</Text>
                  <Text style={passwordValue}>{temporaryPassword}</Text>
                </>
              )}
            </Section>

            <Text style={paragraph}>
              Please login to your account and change your password immediately.
            </Text>

            <Button
              style={button}
              href={`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`}
            >
              Login to Your Account
            </Button>

            <Text style={footer}>
              This is an automated message. Please do not reply to this email.
              If you have any questions, contact your system administrator.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  borderRadius: '8px',
  overflow: 'hidden',
};

const header = {
  padding: '32px 48px',
  backgroundColor: '#2563eb',
};

const headingWhite = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff',
  textAlign: 'center' as const,
  margin: '0',
};

const content = {
  padding: '32px 48px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  color: '#1a1a1a',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
  color: '#555',
  margin: '0 0 16px',
};

const detailsBox = {
  backgroundColor: '#f4f7fa',
  borderRadius: '4px',
  padding: '24px',
  marginBottom: '24px',
};

const detailLabel = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 4px',
};

const detailValue = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  margin: '0 0 12px',
};

const passwordValue = {
  fontSize: '16px',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  color: '#2563eb',
  margin: '0 0 12px',
  backgroundColor: '#e8f0fe',
  padding: '8px 12px',
  borderRadius: '4px',
  display: 'inline-block',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  margin: '24px 0',
};

const footer = {
  fontSize: '12px',
  color: '#8898aa',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '20px 0 0',
};