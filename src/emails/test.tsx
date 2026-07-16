import { Button, Heading, Text } from 'react-email'
import EmailLayout from './components/email-layout'

interface TestEmailProps {
  name: string
}

export default function TestEmail({ name }: TestEmailProps) {
  return (
    <EmailLayout previewText="This is a test email" companyName="Test">
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        Test Email for {name}
      </Heading>
      <Text className="mb-4 text-base text-gray-700">
        This is a test email template to verify email functionality.
      </Text>
      <Text className="mb-6 text-base text-gray-700">
        If you're seeing this, the email system is working correctly.
      </Text>
      <Button
        href="https://example.com"
        className="rounded-md bg-black px-5 py-3 text-center text-sm font-medium text-white"
      >
        Test Button
      </Button>
    </EmailLayout>
  )
}

TestEmail.PreviewProps = {
  name: 'John Doe'
}
