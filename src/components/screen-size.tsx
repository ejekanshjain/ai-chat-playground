'use client'

import { FC, useEffect, useState } from 'react'

export const ScreenSize: FC = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    function updateDimensions() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    return () => {
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  const { width, height } = dimensions

  return (
    <div className="bg-foreground text-background fixed right-4 bottom-4 flex items-center gap-2 rounded-full p-2 text-xs font-medium">
      <span>
        {width.toLocaleString()} x {height.toLocaleString()}
      </span>
      <div className="bg-muted-foreground h-4 w-px" />
      <span className="sm:hidden">XS</span>
      <span className="hidden sm:inline md:hidden">SM</span>
      <span className="hidden md:inline lg:hidden">MD</span>
      <span className="hidden lg:inline xl:hidden">LG</span>
      <span className="hidden xl:inline 2xl:hidden">XL</span>
      <span className="hidden 2xl:inline">2XL</span>
    </div>
  )
}
