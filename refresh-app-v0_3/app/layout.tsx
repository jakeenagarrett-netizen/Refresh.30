
import './globals.css';
import Link from 'next/link';
import Topbar from '@/components/Topbar';

export const metadata = { title: 'Refresh', description: 'AI publishing & design platform' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen grid grid-cols-[260px_1fr]">
          <aside className="p-6 bg-white/70 dark:bg-gray-800/60 border-r">
            <h1 className="text-2xl font-bold mb-6">Refresh</h1>
            <nav className="space-y-2 text-sm">
              <Link href="/" className="block hover:underline">Dashboard</Link>
              <div className="mt-4 text-xs uppercase tracking-wider opacity-70">Builders</div>
              <Link href="/builder/ebook" className="block hover:underline">Ebook Builder</Link>
              <Link href="/builder/business-plan" className="block hover:underline">Business Plan</Link>
              <Link href="/builder/coloring-book" className="block hover:underline">Coloring Book</Link>
              <div className="mt-4 text-xs uppercase tracking-wider opacity-70">Account</div>
              <Link href="/auth" className="block hover:underline">Sign In</Link>
              <Link href="/pricing" className="block hover:underline">Pricing</Link>
              <Link href="/projects" className="block hover:underline">My Projects</Link>
            </nav>
            <div className="mt-10 text-xs opacity-70">v0.3.0</div>
          </aside>
          <main className="p-8">
            <Topbar />
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
