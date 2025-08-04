import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import ContactFormEmail from '@/components/emails/ContactFormEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const TO_EMAIL = "your-business-email@example.com"; // IMPORTANT: Replace with your actual email
const FROM_EMAIL = "Gloryland Website <onboarding@resend.dev>";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `New Message from ${name}`,
      reply_to: email,
      react: <ContactFormEmail senderName={name} senderEmail={email} message={message} />,
    });

    return NextResponse.json({ message: 'Email sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}