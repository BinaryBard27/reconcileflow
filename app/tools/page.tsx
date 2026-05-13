import Header from '@/components/Header'
import ToolCard from '@/components/ToolCard'

const tools = [
  {
    name: 'Stripe Reconciliation',
    description: 'Match Stripe payouts with bank statements',
    color: 'bg-gradient-to-br from-red-500 to-orange-500',
    icon: '💳',
    href: '/',
  },
  {
    name: 'CSV Cleaner',
    description: 'Clean and format CSV data',
    color: 'bg-gradient-to-br from-violet-500 to-purple-500',
    icon: '🧹',
    href: '/clean-csv',
  },
  {
    name: 'CSV Deduplication',
    description: 'Remove duplicate rows from CSV files',
    color: 'bg-gradient-to-br from-indigo-500 to-violet-500',
    icon: '🔍',
    href: '/deduplicate-csv',
  },
  {
    name: 'Date Formatter',
    description: 'Format dates in various formats',
    color: 'bg-gradient-to-br from-teal-500 to-cyan-500',
    icon: '�',
    href: '/date-formatter',
  },
]

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            All the tools you need to work with CSV files
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Free online tools to convert, edit, and process your data. Secure, fast, and works in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <ToolCard
              key={tool.name}
              name={tool.name}
              description={tool.description}
              color={tool.color}
              icon={tool.icon}
              href={tool.href}
            />
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Work with CSV files easily</h2>
            <p className="text-lg opacity-90 mb-6">
              All tools are free, secure, and work directly in your browser. No data is uploaded to any server.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
