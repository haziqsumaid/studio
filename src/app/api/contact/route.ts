import { NextResponse } from 'next/server';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = contactFormSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: 'Invalid input.', issues: parsedData.error.issues }, { status: 400 });
    }

    // In a real application, you would save this data to a database, send an email, etc.
    // For this demo, we'll just log it and return a success response.
    console.log('Contact form submission:', parsedData.data);

    return NextResponse.json({ message: 'Message received successfully!' }, { status: 200 });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
