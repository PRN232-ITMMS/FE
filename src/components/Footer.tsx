import { Heart, Mail, Phone, MapPin, Clock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className='border-t bg-muted/50'>
      <div className='container mx-auto py-12'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-4'>
          {/* Brand Section */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-primary'>
                <Heart className='h-6 w-6 text-primary-foreground' />
              </div>
              <div className='flex flex-col'>
                <span className='text-lg font-semibold text-foreground'>ITM System</span>
                <span className='text-xs text-muted-foreground'>Hệ thống Điều trị Hiếm muộn</span>
              </div>
            </div>
            <p className='text-sm text-muted-foreground'>
              Đồng hành cùng hành trình làm cha mẹ của bạn với dịch vụ điều trị hiếm muộn chuyên nghiệp và tận tâm.
            </p>
          </div>

          {/* Services Section */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>Dịch vụ</h3>
            <div className='space-y-2'>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Thụ tinh nhân tạo (IUI)
              </a>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Thụ tinh ống nghiệm (IVF)
              </a>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Tư vấn hiếm muộn
              </a>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Khám sức khỏe sinh sản
              </a>
            </div>
          </div>

          {/* Contact Section */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>Liên hệ</h3>
            <div className='space-y-3'>
              <div className='flex items-center space-x-2'>
                <Phone className='h-4 w-4 text-primary' />
                <span className='text-sm text-muted-foreground'>1900 123 456</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Mail className='h-4 w-4 text-primary' />
                <span className='text-sm text-muted-foreground'>support@itm-system.vn</span>
              </div>
              <div className='flex items-start space-x-2'>
                <MapPin className='h-4 w-4 text-primary mt-0.5' />
                <span className='text-sm text-muted-foreground'>
                  123 Đường Y Khoa, Phường Tân Định,<br />
                  Quận 1, TP. Hồ Chí Minh
                </span>
              </div>
            </div>
          </div>

          {/* Hours & Support Section */}
          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>Giờ làm việc</h3>
            <div className='space-y-3'>
              <div className='flex items-start space-x-2'>
                <Clock className='h-4 w-4 text-primary mt-0.5' />
                <div className='text-sm text-muted-foreground'>
                  <div>Thứ 2 - Thứ 6: 7:30 - 17:30</div>
                  <div>Thứ 7: 7:30 - 12:00</div>
                  <div>Chủ nhật: Nghỉ</div>
                </div>
              </div>
              <div className='mt-4'>
                <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                  Đặt lịch hẹn online
                </a>
                <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                  Hỗ trợ khẩn cấp 24/7
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='mt-12 border-t pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0'>
            <p className='text-sm text-muted-foreground'>
              © 2025 ITM System - Hệ thống Quản lý Điều trị Hiếm muộn. Tất cả quyền được bảo lưu.
            </p>
            <div className='flex items-center space-x-6'>
              <a href='#' className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Chính sách bảo mật
              </a>
              <a href='#' className='text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Điều khoản sử dụng
              </a>
              <div className='flex items-center space-x-1 text-sm text-muted-foreground'>
                <Heart className='h-3 w-3 text-red-500' />
                <span>Phát triển với yêu thương</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
