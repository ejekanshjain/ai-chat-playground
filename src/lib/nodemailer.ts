import nodemailer, { SentMessageInfo } from 'nodemailer'
import { env } from '~/env'

const transporter = nodemailer.createTransport({
  host: env.EMAIL_SERVER_HOST,
  port: parseInt(env.EMAIL_SERVER_PORT),
  secure: parseInt(env.EMAIL_SERVER_PORT) === 465, // Use secure for port 465, false for other ports
  auth: {
    user: env.EMAIL_SERVER_USER,
    pass: env.EMAIL_SERVER_PASSWORD
  }
})

interface SendEmailParams {
  to: string
  subject: string
  text?: string
  html?: string
}

export const sendEmail = async ({
  to,
  subject,
  text,
  html
}: SendEmailParams): Promise<SentMessageInfo> => {
  'use step'

  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text,
      html
    })

    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}
