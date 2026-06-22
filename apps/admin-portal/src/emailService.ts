import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_cah390f';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_02rsq5w';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'gLgjzhisMJr7zuqXm';

emailjs.init(EMAILJS_PUBLIC_KEY);

// ── Reply to contact message ──────────────────────────────────────────────────
export async function sendReplyEmail(
  recipientEmail: string,
  recipientName: string,
  subject: string,
  replyMessage: string,
  originalMessage: string
): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: recipientEmail,
      to_name: recipientName,
      subject,
      reply_message: replyMessage,
      original_message: originalMessage,
    });
    return true;
  } catch (error) {
    console.error('Failed to send reply email:', error);
    return false;
  }
}

// ── Notify BICC staff when a booking is submitted ─────────────────────────────
export async function sendBookingNotificationEmail(booking: {
  refNumber: string;
  institutionName: string;
  firstName: string;
  lastName: string;
  email: string;
  primaryPhone: string;
  eventType: string;
  startDate: string;
  endDate: string;
  participants: string;
}): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: 'info@bicc.gm',
      to_name: 'BICC Admin',
      subject: `New Booking Request [${booking.refNumber}] — ${booking.institutionName}`,
      reply_message:
        `A new booking request has been submitted.\n\n` +
        `Reference: ${booking.refNumber}\n` +
        `Institution: ${booking.institutionName}\n` +
        `Contact: ${booking.firstName} ${booking.lastName}\n` +
        `Email: ${booking.email}\n` +
        `Phone: ${booking.primaryPhone}\n` +
        `Event Type: ${booking.eventType}\n` +
        `Dates: ${booking.startDate} → ${booking.endDate}\n` +
        `Participants: ${booking.participants}\n\n` +
        `Log in to the admin panel to review and update the status.`,
      original_message: '',
    });
    return true;
  } catch (error) {
    console.error('Failed to send booking notification:', error);
    return false;
  }
}

// ── Confirmation email to the person who booked ───────────────────────────────
export async function sendBookingConfirmationEmail(booking: {
  refNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  institutionName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  participants: string;
}): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: booking.email,
      to_name: `${booking.firstName} ${booking.lastName}`,
      subject: `Booking Request Received [${booking.refNumber}] — BICC`,
      reply_message:
        `Dear ${booking.firstName},\n\n` +
        `Thank you for submitting a venue booking request to the Banjul International Convention Centre.\n\n` +
        `Your booking reference number is: ${booking.refNumber}\n\n` +
        `Details:\n` +
        `• Institution: ${booking.institutionName}\n` +
        `• Event Type: ${booking.eventType}\n` +
        `• Dates: ${booking.startDate} → ${booking.endDate}\n` +
        `• Participants: ${booking.participants}\n\n` +
        `Our team will review your request and contact you within 1–2 business days to confirm availability.\n\n` +
        `For urgent enquiries, please call us at +220 7784425 or email info@bicc.gm.\n\n` +
        `Best regards,\nBanjul International Convention Centre`,
      original_message: '',
    });
    return true;
  } catch (error) {
    console.error('Failed to send booking confirmation:', error);
    return false;
  }
}

// ── Auto-email when booking status is changed by admin ───────────────────────
export async function sendBookingStatusEmail(booking: {
  refNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  institutionName: string;
  eventType: string;
  startDate: string;
  endDate: string;
  status: string;
  adminMessage?: string;
}): Promise<boolean> {
  const isApproved = booking.status === 'Approved';
  const isRejected = booking.status === 'Rejected';

  const statusLine = isApproved
    ? 'We are pleased to inform you that your booking request has been APPROVED.'
    : isRejected
    ? 'We regret to inform you that your booking request has been DECLINED.'
    : `Your booking status has been updated to: ${booking.status}.`;

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: booking.email,
      to_name: `${booking.firstName} ${booking.lastName}`,
      subject: `Booking ${booking.status} [${booking.refNumber}] — BICC`,
      reply_message:
        `Dear ${booking.firstName},\n\n` +
        `${statusLine}\n\n` +
        `Booking Reference: ${booking.refNumber}\n` +
        `Institution: ${booking.institutionName}\n` +
        `Event Type: ${booking.eventType}\n` +
        `Dates: ${booking.startDate} → ${booking.endDate}\n\n` +
        (booking.adminMessage ? `Message from BICC:\n${booking.adminMessage}\n\n` : '') +
        `For enquiries, please contact us at info@bicc.gm or +220 7784425.\n\n` +
        `Best regards,\nBanjul International Convention Centre`,
      original_message: `Booking Reference: ${booking.refNumber}`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send booking status email:', error);
    return false;
  }
}

// ── Auto-confirmation email when a contact form is submitted ─────────────────
export async function sendContactConfirmationEmail(contact: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: contact.email,
      to_name: contact.name,
      subject: `Message Received: ${contact.subject} — BICC`,
      reply_message:
        `Dear ${contact.name},\n\n` +
        `Thank you for contacting the Banjul International Convention Centre. ` +
        `We have received your message and will get back to you as soon as possible.\n\n` +
        `Your message:\n"${contact.message}"\n\n` +
        `For urgent enquiries, please call us at +220 7784425 or email info@bicc.gm.\n\n` +
        `Best regards,\nBanjul International Convention Centre`,
      original_message: contact.message,
    });
    return true;
  } catch (error) {
    console.error('Failed to send contact confirmation:', error);
    return false;
  }
}

// ── Notify BICC staff when a contact form is submitted ───────────────────────
export async function sendContactNotificationEmail(contact: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: 'info@bicc.gm',
      to_name: 'BICC Admin',
      subject: `New Contact Message: ${contact.subject}`,
      reply_message:
        `A new contact message has been submitted via the website.\n\n` +
        `Name: ${contact.name}\n` +
        `Email: ${contact.email}\n` +
        `Phone: ${contact.phone || 'Not provided'}\n` +
        `Subject: ${contact.subject}\n\n` +
        `Message:\n${contact.message}\n\n` +
        `Log in to the admin panel to view and reply.`,
      original_message: '',
    });
    return true;
  } catch (error) {
    console.error('Failed to send contact notification:', error);
    return false;
  }
}

// ── Reply to a booking request from admin ────────────────────────────────────
export async function sendBookingReplyEmail(
  recipientEmail: string,
  recipientName: string,
  subject: string,
  replyMessage: string,
  refNumber: string
): Promise<boolean> {
  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email: recipientEmail,
      to_name: recipientName,
      subject,
      reply_message: replyMessage,
      original_message: `Booking Reference: ${refNumber}`,
    });
    return true;
  } catch (error) {
    console.error('Failed to send booking reply:', error);
    return false;
  }
}
