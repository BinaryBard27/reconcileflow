'use client'

import { Helmet } from 'react-helmet-async'

interface PageSeoProps {
  title: string
  description: string
}

export default function PageSeo({ title, description }: PageSeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Helmet>
  )
}
