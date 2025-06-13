import Header from '@/components/Header'
import Footer from '@/components/Footer'

type Props = { children?: React.ReactNode }

function MainLayout({ children }: Props) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}

export default MainLayout
