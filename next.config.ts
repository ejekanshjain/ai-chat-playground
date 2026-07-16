import bundleAnalyzer from '@next/bundle-analyzer'
import type { NextConfig } from 'next'
import { withWorkflow } from 'workflow/next'
import { env } from '~/env'

const nextConfig: NextConfig = {
  reactCompiler: true
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: env.ANALYZE === 'true'
})

export default withWorkflow(withBundleAnalyzer(nextConfig))
