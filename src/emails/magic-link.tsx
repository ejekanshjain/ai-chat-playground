import { Button, Heading, Text } from 'react-email'
import EmailLayout from './components/email-layout'

export interface MagicLinkEmailProps {
  magicLink: string
  companyName: string
}

export default function MagicLinkEmail({
  magicLink,
  companyName
}: MagicLinkEmailProps) {
  const previewText = `Your magic link to sign in to ${companyName}`

  return (
    <EmailLayout previewText={previewText} companyName={companyName}>
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        Sign in to {companyName}
      </Heading>

      <Text className="mb-4 text-base text-gray-700">
        Click the button below to securely sign in to your account. This link
        will expire in 5 minutes.
      </Text>

      <Button
        href={magicLink}
        className="mb-4 rounded-lg bg-black px-6 py-3 text-center text-base font-semibold text-white no-underline"
      >
        Sign In
      </Button>

      <Text className="mb-4 text-sm text-gray-600">
        Or copy and paste this link into your browser:
      </Text>

      <Text className="mb-4 text-sm break-all text-blue-600">{magicLink}</Text>

      <Text className="text-sm text-gray-500">
        If you didn't request this email, you can safely ignore it.
      </Text>
    </EmailLayout>
  )
}

MagicLinkEmail.PreviewProps = {
  magicLink: 'https://example.com/magic-link?token=abc123',
  companyName: 'Example Site'
} satisfies MagicLinkEmailProps
