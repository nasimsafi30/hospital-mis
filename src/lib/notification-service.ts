import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

interface EmailConfig {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

class NotificationService {
  private emailTransporter: nodemailer.Transporter | null = null;

  constructor() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.emailTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async sendEmail(config: EmailConfig) {
    if (!this.emailTransporter) {
      console.log('Email not sent - SMTP not configured');
      console.log('To:', config.to, 'Subject:', config.subject);
      return;
    }

    try {
      const info = await this.emailTransporter.sendMail({
        from: `"Hospital MIS" <${process.env.SMTP_FROM || 'noreply@hospital.com'}>`,
        ...config,
      });
      console.log('Email sent:', info.messageId);
      return info;
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendPasswordResetEmail(user: { email: string; firstName: string; resetLink: string }) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">Password Reset</h2>
        <p>Hi ${user.firstName},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${user.resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: #fff; border-radius: 5px; text-decoration: none;">Reset Password</a>
        <p style="color: #666; font-size: 12px;">Link expires in 1 hour.</p>
      </div>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Password Reset Request',
      html: emailHtml,
    });
  }

  async sendWelcomeEmail(user: { email: string; firstName: string; role: string }) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">Welcome to Hospital MIS!</h2>
        <p>Hi ${user.firstName},</p>
        <p>Your account has been created with role: <strong>${user.role}</strong>.</p>
      </div>
    `;

    await this.sendEmail({
      to: user.email,
      subject: 'Welcome to Hospital MIS',
      html: emailHtml,
    });
  }

  async sendAppointmentConfirmation(appointment: {
    patientEmail: string;
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    appointmentNumber: string;
  }) {
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #2563eb;">Appointment Confirmed</h2>
        <p>Dear ${appointment.patientName},</p>
        <div style="background-color: #f0f7ff; padding: 15px; border-radius: 5px;">
          <p><strong>Doctor:</strong> Dr. ${appointment.doctorName}</p>
          <p><strong>Date:</strong> ${appointment.date}</p>
          <p><strong>Time:</strong> ${appointment.time}</p>
          <p><strong>Appointment #:</strong> ${appointment.appointmentNumber}</p>
        </div>
      </div>
    `;

    await this.sendEmail({
      to: appointment.patientEmail,
      subject: `Appointment Confirmation - ${appointment.appointmentNumber}`,
      html: emailHtml,
    });
  }
}

export const notificationService = new NotificationService();