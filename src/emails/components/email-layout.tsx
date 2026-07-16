import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text
} from 'react-email'

interface EmailLayoutProps {
  previewText: string
  companyName: string
  children: React.ReactNode
}

export default function EmailLayout({
  previewText,
  companyName,
  children
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          presets: [pixelBasedPreset]
        }}
      >
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-8 max-w-xl rounded-lg bg-white shadow-sm">
            {/* Header */}
            <Section className="rounded-t-lg bg-black px-8 py-6">
              <Text className="m-0 text-center text-2xl font-bold text-white">
                {companyName}
              </Text>
            </Section>

            {/* Content */}
            <Section className="px-8 py-6">{children}</Section>

            {/* Footer */}
            <Section className="rounded-b-lg bg-gray-50 px-8 py-6">
              <Hr className="my-4 border-gray-200" />
              <Text className="m-0 text-center text-sm text-gray-500">
                &copy; {new Date().getUTCFullYear()} {companyName}. All rights
                reserved.
              </Text>
              <Text className="m-0 mt-2 text-center text-xs text-gray-400">
                This is an automated email. Please do not reply directly to this
                message.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
