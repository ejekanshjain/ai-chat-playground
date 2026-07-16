import { render, toPlainText } from '@react-email/render'
import TestEmail from '~/emails/test'
import { sendEmail } from '~/lib/nodemailer'

async function sendTestMail() {
  const html = await render(
    TestEmail({
      name: 'John Doe'
    }),
    {
      pretty: true
    }
  )

  const text = toPlainText(html)

  const result = await sendEmail({
    to: 'john@example.com',
    subject: 'Test Email',
    text,
    html
  })

  console.info('Test email sent successfully', result)
}

if (import.meta.main) {
  try {
    await sendTestMail()
  } catch (err) {
    console.error('Error sending test mail:', err)
  } finally {
    process.exit(0)
  }
}
