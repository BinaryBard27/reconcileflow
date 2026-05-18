'use client'

import Link from 'next/link'
import { Helmet } from 'react-helmet-async'
import Header from '@/components/Header'

export interface LandingSection {
  title: string
  paragraphs: string[]
}

export interface RelatedLink {
  href: string
  title: string
  description: string
}

interface SeoLandingPageProps {
  title: string
  metaDescription: string
  h1: string
  subtitle?: string
  sections: LandingSection[]
  relatedLinks: RelatedLink[]
}

export default function SeoLandingPage({
  title,
  metaDescription,
  h1,
  subtitle,
  sections,
  relatedLinks,
}: SeoLandingPageProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>

      <main className="min-h-screen bg-[#fafbff]">
        <Header />

        <section className="relative overflow-hidden">
          <HeroBackground />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 font-semibold text-sm mb-6 border border-purple-100">
              <span>⚡</span> Free · Private · Browser-based
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0A0A0A] tracking-tight mb-6 leading-tight">{h1}</h1>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">{subtitle}</p>
            )}
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8 space-y-8">
          {sections.map((section, index) => (
            <article
              key={section.title}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10"
            >
              <div className="flex items-start gap-4 mb-5">
                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF3366] to-[#FF6B3D] text-white font-bold flex items-center justify-center text-sm">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl font-bold text-gray-900 pt-1">{section.title}</h2>
              </div>
              <div className="pl-0 sm:pl-14 space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-gray-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
          <div className="bg-gradient-to-r from-[#FF3366] to-[#FF6B3D] rounded-2xl p-10 sm:p-12 text-center text-white shadow-lg shadow-orange-500/20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to reconcile?</h2>
            <p className="text-white/90 mb-8 max-w-lg mx-auto">
              Upload your Stripe and bank CSVs — get matched results in about 60 seconds. No signup, no upload.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#FF3366] font-bold text-lg rounded-xl hover:bg-gray-50 transition-colors shadow-md"
            >
              Open ReconcileFlow tool →
            </Link>
          </div>
        </section>

        <section className="border-t border-gray-100 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Learn more</h2>
            <p className="text-gray-600 mb-8">Related guides for Stripe payout reconciliation</p>
            <RelatedLinksGrid relatedLinks={relatedLinks} />
          </div>
        </section>
      </main>
    </>
  )
}

function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-purple-100/50 to-blue-50/50 blur-3xl" />
      <div className="absolute top-[15%] left-[5%] w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-pink-100/40 to-purple-100/40 blur-3xl" />
    </div>
  )
}

function RelatedLinksGrid({ relatedLinks }: { relatedLinks: RelatedLink[] }) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {relatedLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group block p-6 rounded-xl border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all bg-gray-50/50 hover:bg-white"
        >
          <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 mb-2">{link.title}</h3>
          <p className="text-sm text-gray-600">{link.description}</p>
        </Link>
      ))}
    </div>
  )
}
