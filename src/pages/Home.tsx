import { Button } from '@/components/ui/button'
import { Heart, Users, Calendar, Shield, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import useDocumentTitle from '@/hooks/useDocumentTitle'

const Home = () => {
  const { isAuthenticated } = useAuthStore()

  useDocumentTitle({ title: 'ITM System - Hệ thống Quản lý Điều trị Hiếm muộn' })

  return (
    <div className='min-h-[calc(100vh-128px)]'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br from-background via-background/95 to-primary/5'>
        <div className='container mx-auto px-4 py-16 lg:py-24'>
          <div className='grid items-center gap-12 lg:grid-cols-2'>
            <div className='space-y-8'>
              <div className='space-y-4'>
                <div className='inline-flex items-center rounded-full border px-3 py-1 text-sm'>
                  <Heart className='mr-2 h-4 w-4 text-primary' />
                  Hệ thống Quản lý Điều trị Hiếm muộn
                </div>
                <h1 className='text-4xl font-bold tracking-tight lg:text-6xl'>
                  Đồng hành cùng <span className='text-primary'>hành trình</span> làm cha mẹ
                </h1>
                <p className='max-w-xl text-lg text-muted-foreground'>
                  Hệ thống quản lý toàn diện cho quá trình điều trị hiếm muộn, từ tư vấn ban đầu đến theo dõi kết quả
                  điều trị.
                </p>
              </div>

              <div className='flex flex-col gap-4 sm:flex-row'>
                {!isAuthenticated ? (
                  <>
                    <Button size='lg' asChild>
                      <Link to='/register'>
                        Đăng ký tư vấn
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </Link>
                    </Button>
                    <Button variant='outline' size='lg' asChild>
                      <Link to='/login'>Đăng nhập</Link>
                    </Button>
                  </>
                ) : (
                  <Button size='lg' asChild>
                    <Link to='/dashboard'>
                      Vào hệ thống
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </Link>
                  </Button>
                )}
              </div>
            </div>

            <div className='relative'>
              <div className='aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8'>
                <div className='flex h-full w-full items-center justify-center rounded-xl border bg-background/80 backdrop-blur-sm'>
                  <div className='space-y-4 text-center'>
                    <div className='mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10'>
                      <Heart className='h-10 w-10 text-primary' />
                    </div>
                    <div>
                      <h3 className='text-2xl font-bold'>ITM System</h3>
                      <p className='text-muted-foreground'>Infertility Treatment Management</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='py-16 lg:py-24'>
        <div className='container mx-auto px-4'>
          <div className='mb-16 space-y-4 text-center'>
            <h2 className='text-3xl font-bold lg:text-4xl'>Tại sao chọn hệ thống của chúng tôi?</h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Chúng tôi cung cấp giải pháp toàn diện cho việc quản lý và theo dõi quá trình điều trị hiếm muộn
            </p>
          </div>

          <div className='grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
            <div className='group rounded-lg border bg-card p-6 transition-all hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Users className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Đội ngũ chuyên gia</h3>
              <p className='text-muted-foreground'>
                Được hỗ trợ bởi đội ngũ bác sĩ chuyên khoa hiếm muộn giàu kinh nghiệm và tận tâm
              </p>
            </div>

            <div className='group rounded-lg border bg-card p-6 transition-all hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Calendar className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Quản lý lịch hẹn</h3>
              <p className='text-muted-foreground'>
                Hệ thống đặt lịch thông minh, nhắc nhở tự động và quản lý cuộc hẹn hiệu quả
              </p>
            </div>

            <div className='group rounded-lg border bg-card p-6 transition-all hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Shield className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Bảo mật thông tin</h3>
              <p className='text-muted-foreground'>
                Đảm bảo tuyệt đối bảo mật thông tin y tế và dữ liệu cá nhân của bệnh nhân
              </p>
            </div>

            <div className='group rounded-lg border bg-card p-6 transition-all hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <CheckCircle className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Theo dõi tiến trình</h3>
              <p className='text-muted-foreground'>
                Theo dõi chi tiết từng giai đoạn điều trị, kết quả xét nghiệm và tiến độ chữa trị
              </p>
            </div>

            <div className='group rounded-lg border bg-card p-6 transition-all hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <Heart className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Hỗ trợ 24/7</h3>
              <p className='text-muted-foreground'>
                Đội ngũ hỗ trợ luôn sẵn sàng tư vấn và giải đáp mọi thắc mắc của bệnh nhân
              </p>
            </div>

            <div className='group rounded-lg border bg-card p-6 transition-all hover:shadow-lg'>
              <div className='mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10'>
                <ArrowRight className='h-6 w-6 text-primary' />
              </div>
              <h3 className='mb-2 text-xl font-semibold'>Quy trình minh bạch</h3>
              <p className='text-muted-foreground'>
                Quy trình điều trị rõ ràng, minh bạch với chi phí được tư vấn cụ thể từ đầu
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Treatment Methods Section */}
      <div className='bg-muted/50 py-16 lg:py-24'>
        <div className='container mx-auto px-4'>
          <div className='mb-16 space-y-4 text-center'>
            <h2 className='text-3xl font-bold lg:text-4xl'>Phương pháp điều trị</h2>
            <p className='mx-auto max-w-2xl text-lg text-muted-foreground'>
              Chúng tôi cung cấp các phương pháp điều trị hiếm muộn hiện đại và hiệu quả
            </p>
          </div>

          <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-2'>
            <div className='rounded-lg border bg-card p-8'>
              <div className='space-y-4 text-center'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20'>
                  <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>IUI</span>
                </div>
                <h3 className='text-xl font-semibold'>Thụ tinh nhân tạo trong tử cung</h3>
                <p className='text-muted-foreground'>
                  Phương pháp đưa tinh trùng đã được xử lý trực tiếp vào tử cung để tăng khả năng thụ thai tự nhiên
                </p>
                <ul className='space-y-1 text-left text-sm text-muted-foreground'>
                  <li>• Ít xâm lấn, đơn giản</li>
                  <li>• Chi phí thấp hơn IVF</li>
                  <li>• Phù hợp với nhiều trường hợp</li>
                </ul>
              </div>
            </div>

            <div className='rounded-lg border bg-card p-8'>
              <div className='space-y-4 text-center'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20'>
                  <span className='text-2xl font-bold text-purple-600 dark:text-purple-400'>IVF</span>
                </div>
                <h3 className='text-xl font-semibold'>Thụ tinh ống nghiệm</h3>
                <p className='text-muted-foreground'>
                  Phương pháp thụ tinh ngoài cơ thể, sau đó chuyển phôi vào tử cung để phát triển
                </p>
                <ul className='space-y-1 text-left text-sm text-muted-foreground'>
                  <li>• Tỷ lệ thành công cao</li>
                  <li>• Phù hợp với nhiều nguyên nhân hiếm muộn</li>
                  <li>• Có thể kết hợp với các kỹ thuật hỗ trợ</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className='py-16 lg:py-24'>
        <div className='container mx-auto px-4'>
          <div className='mx-auto max-w-3xl space-y-8 text-center'>
            <h2 className='text-3xl font-bold lg:text-4xl'>Sẵn sàng bắt đầu hành trình?</h2>
            <p className='text-lg text-muted-foreground'>
              Đăng ký ngay hôm nay để được tư vấn miễn phí với các chuyên gia của chúng tôi
            </p>
            {!isAuthenticated && (
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button size='lg' asChild>
                  <Link to='/register'>
                    Đăng ký tư vấn miễn phí
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button variant='outline' size='lg' asChild>
                  <Link to='/login'>Đã có tài khoản</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
