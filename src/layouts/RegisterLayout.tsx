import Footer from '@/components/Footer'
import RegisterHeader from '@/components/RegisterHeader'

type RegisterLayoutProps = {
  children: React.ReactNode
}

const RegisterLayout = ({ children }: RegisterLayoutProps) => {
  return (
    <div className='flex min-h-screen flex-col'>
      <RegisterHeader />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  )
}

export default RegisterLayout
