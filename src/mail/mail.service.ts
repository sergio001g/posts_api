import * as nodemailer from 'nodemailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SendMailDto } from './dto/send-mail.dto';

@Injectable()
export class MailService {
  async sendMail(dto: SendMailDto) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: dto.to,
        subject: dto.subject,
        html: dto.message,
      });
      return { messageId: info.messageId };
    } catch (error) {
      throw new InternalServerErrorException('No se pudo enviar el correo');
    }
  }

  async sendMailOutlook(dto: SendMailDto) {
    const primary = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      requireTLS: true,
      authMethod: 'LOGIN',
      auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
    });

    const send = async (tx: nodemailer.Transporter) =>
      tx.sendMail({
        from: process.env.MAIL_USER,
        to: dto.to,
        subject: dto.subject,
        html: dto.message,
      });

    try {
      const info = await send(primary);
      return { messageId: info.messageId };
    } catch {
      const fallback = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        requireTLS: true,
        authMethod: 'LOGIN',
        auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
      });
      try {
        const info = await send(fallback);
        return { messageId: info.messageId };
      } catch (error) {
        throw new InternalServerErrorException(
          typeof error?.message === 'string' ? error.message : 'No se pudo enviar el correo',
        );
      }
    }
  }
}
