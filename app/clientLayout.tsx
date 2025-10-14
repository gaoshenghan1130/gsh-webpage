'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionContainer from '@/components/SectionContainer'
import { SearchProvider, SearchConfig } from 'pliny/search'
import siteMetadata from '@/data/siteMetadata'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideLayout = ['/login', '/signup', '/blank', '/', '/documents']
  const noLayout = hideLayout.includes(pathname)
  if (noLayout) {
    return <>{children}</>
  }

  return (
    <SectionContainer>
      <SearchProvider searchConfig={siteMetadata.search ?? ({ provider: 'kbar' } as SearchConfig)}>
        <Header />
        <main className="mb-auto">{children}</main>
      </SearchProvider>
      <Footer />
    </SectionContainer>
  )
}
