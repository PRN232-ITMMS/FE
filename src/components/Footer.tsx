const Footer = () => {
  return (
    <footer className='border-t bg-muted/50'>
      <div className='container mx-auto py-8'>
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          <div className='space-y-4'>
            <div className='flex items-center space-x-2'>
              {/* <div className='flex h-6 w-6 items-center justify-center rounded bg-primary'>
                <span className='text-xs font-bold text-primary-foreground'>EXE</span>
              </div> */}
              <span className='font-semibold text-foreground'>Startup Project</span>
            </div>
            <p className='text-sm text-muted-foreground'>© 2025 Sporta. Tất cả các quyền được bảo lưu.</p>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>Liên kết</h3>
            <div className='space-y-2'>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Về chúng tôi
              </a>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Chính sách bảo mật
              </a>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Điều khoản sử dụng
              </a>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='text-sm font-semibold text-foreground'>Hỗ trợ</h3>
            <div className='space-y-2'>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Trung tâm trợ giúp
              </a>
              <a href='#' className='block text-sm text-muted-foreground transition-colors hover:text-foreground'>
                Liên hệ
              </a>
              <p className='text-sm text-muted-foreground'>Email: support@exe-project.com</p>
            </div>
          </div>
        </div>

        <div className='mt-8 border-t pt-8 text-center'>
          <p className='text-sm text-muted-foreground'>Made with ❤️ using React 19 + ShadcnUI + Zustand</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
