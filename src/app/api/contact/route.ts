import { NextResponse } from 'next/server';
import * as z from 'zod';
import { sendEmail } from '@/lib/nodemailer';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(100),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = contactFormSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input.', issues: parsedData.error.issues }, { status: 400 });
    }

    const { name, email, message } = parsedData.data;

    // Prepare email content
    const emailSubject = `New Contact Form Submission from ${name}`;
    const emailTextContent = `
      You have received a new message from your portfolio contact form:
      Name: ${name}
      Email: ${email}
      Message:
      ${message}
    `;
    const emailHtmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Message:</strong></p>
        <p style="padding: 10px; border-left: 3px solid #eee; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p style="font-size: 0.9em; color: #777;">This email was sent from your portfolio contact form.</p>
      </div>
    `;

    try {
      await sendEmail({
        to: 'haziqsumaid4@gmail.com', // Your receiving email address
        subject: emailSubject,
        text: emailTextContent,
        html: emailHtmlContent,
      });
      
      console.log('Contact form submission processed and email sent to haziqsumaid4@gmail.com:', parsedData.data);
      return NextResponse.json({ message: 'Message received and email sent successfully!' }, { status: 200 });

    } catch (emailError) {
      console.error('Failed to send contact email:', emailError);
      // Return a more generic error to the client but log the specific one
      return NextResponse.json({ error: 'Message received, but there was an issue sending the notification email. Please try contacting directly if urgent.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error processing contact form:', error);
    if (error instanceof z.ZodError) { // Should be caught by safeParse, but good practice
      return NextResponse.json({ error: 'Invalid input.', issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred processing your request.' }, { status: 500 });
  }
}
