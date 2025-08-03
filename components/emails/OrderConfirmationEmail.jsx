import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
  Section,
  Row,
  Column
} from '@react-email/components';
import * as React from 'react';

export default function OrderConfirmationEmail({ orderDetails, orderItems }) {
  const { name, orderId, total } = orderDetails;
  
  const formattedTotal = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
  }).format(total);

  const LOGO_URL = "https://your-domain.com/logo.jpg"; // Replace with your public logo URL

  return (
    <Html>
      <Head />
      <Preview>Your Gloryland order #{orderId.substring(0,8)} is confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={LOGO_URL} width="120" height="60" alt="Gloryland Logo" style={logo} />
          <Heading style={heading}>Thanks for your order, {name}!</Heading>
          <Text style={paragraph}>
            We've received your order and our team is already preparing it. We'll notify you when it's ready. Here are your order details:
          </Text>
          <Section style={{ padding: '0 20px' }}>
            <Row>
              <Column><strong>Order ID:</strong> #{orderId.substring(0,8)}</Column>
              <Column style={{ textAlign: 'right' }}><strong>Date:</strong> {new Date().toLocaleDateString('en-GH')}</Column>
            </Row>
          </Section>
          
          <Section style={itemsSection}>
            {orderItems.map(item => (
                <Row key={item.id} style={itemRow}>
                    <Column style={{ width: '60%' }}>{item.quantity} x {item.menuItem.name}</Column>
                    <Column style={{ textAlign: 'right' }}>{new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(item.price * item.quantity)}</Column>
                </Row>
            ))}
          </Section>

          <Section style={{ padding: '0 20px' }}>
              <Row style={totalRow}>
                  <Column style={{ fontWeight: 'bold' }}>Total</Column>
                  <Column style={{ textAlign: 'right', fontWeight: 'bold' }}>{formattedTotal}</Column>
              </Row>
          </Section>

          <Text style={paragraph}>
            We look forward to serving you!
          </Text>
          <Text style={footer}>Gloryland Food & Pub Joint, Aburi, Eastern Region, Ghana</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' };
const container = { margin: '0 auto', padding: '20px 0 48px', width: '580px', backgroundColor: '#ffffff', borderRadius: '8px' };
const logo = { margin: '0 auto' };
const heading = { fontSize: '24px', lineHeight: '1.3', fontWeight: '700', color: '#8B4513', textAlign: 'center', padding: '0 20px' };
const paragraph = { fontSize: '16px', lineHeight: '1.4', color: '#484848', padding: '0 20px' };
const itemsSection = { padding: '20px', margin: '20px 0', borderTop: '1px solid #eaeaea', borderBottom: '1px solid #eaeaea' };
const itemRow = { padding: '5px 0' };
const totalRow = { padding: '10px 0', borderTop: '1px solid #eaeaea', marginTop: '10px' };
const footer = { color: '#8898aa', fontSize: '12px', lineHeight: '16px', textAlign: 'center' };