import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section
} from '@react-email/components';
import * as React from 'react';

export default function ContactFormEmail({ senderName, senderEmail, message }) {
  return (
    <Html>
      <Head />
      <Preview>New Inquiry from your Gloryland Website</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Customer Inquiry</Heading>
          <Text style={paragraph}>You have received a new message from your website's contact form.</Text>
          <Section style={detailsSection}>
            <Text><strong>From:</strong> {senderName}</Text>
            <Text><strong>Email:</strong> {senderEmail}</Text>
          </Section>
          <Section style={messageSection}>
            <Heading as="h2" style={subHeading}>Message:</Heading>
            <Text style={messageText}>{message}</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px', backgroundColor: '#ffffff', borderRadius: '8px' };
const heading = { fontSize: '24px', lineHeight: '1.3', fontWeight: '700', color: '#8B4513', textAlign: 'center', padding: '0 20px' };
const subHeading = { fontSize: '18px', fontWeight: '600', color: '#484848' };
const paragraph = { fontSize: '16px', lineHeight: '1.4', color: '#484848', padding: '0 20px' };
const detailsSection = { padding: '0 20px', margin: '20px 0' };
const messageSection = { padding: '20px', margin: '20px 0', backgroundColor: '#f8f8f8', borderRadius: '4px' };
const messageText = { fontSize: '16px', lineHeight: '1.5', color: '#333' };