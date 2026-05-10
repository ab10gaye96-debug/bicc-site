import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_cah390f';
const EMAILJS_TEMPLATE_ID = 'template_02rsq5w';
const EMAILJS_PUBLIC_KEY = 'gLgjzhisMJr7zuqXm';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export async function sendReplyEmail(
  recipientEmail: string,
  recipientName: string,
  subject: string,
  replyMessage: string,
  originalMessage: string
): Promise<boolean> {
  try {
    const templateParams = {
      to_email: recipientEmail,
      to_name: recipientName,
      subject: subject,
      reply_message: replyMessage,
      original_message: originalMessage,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}

