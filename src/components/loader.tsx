'use client'

import NextTopLoader from 'nextjs-toploader'

import { FC } from 'react'

export const Loader: FC = () => {
  return (
    <NextTopLoader
      color="#777777"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      shadow={`0 0 10px '#777777',0 0 5px '#777777'`}
      template='<div class="bar" role="bar"><div class="peg"></div></div> 
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
      zIndex={10000}
      showAtBottom={false}
    />
  )
}
