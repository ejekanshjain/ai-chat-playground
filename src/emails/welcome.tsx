import { Heading, Text } from 'react-email'
import EmailLayout from './components/email-layout'

export interface WelcomeEmailProps {
  userName: string
  companyName: string
}

export default function WelcomeEmail({
  userName,
  companyName
}: WelcomeEmailProps) {
  const previewText = `Welcome to ${companyName}! Your account has been created successfully.`

  return (
    <EmailLayout previewText={previewText} companyName={companyName}>
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        Welcome to {companyName}! 🎉
      </Heading>

      <Text className="mb-4 text-base text-gray-700">Hi {userName},</Text>

      <Text className="mb-4 text-base text-gray-700">
        Thank you for creating an account with us. We're thrilled to have you as
        part of our community!
      </Text>
    </EmailLayout>
  )
}

WelcomeEmail.PreviewProps = {
  userName: 'John Doe',
  companyName: 'Example Site'
} satisfies WelcomeEmailProps
