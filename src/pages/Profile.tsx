const Profile = () => {
  return (
    <div className='bg-muted/50 py-8'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-12'>
          {/* Sidebar */}
          <div className='md:col-span-3'>
            <div className='rounded-lg border bg-card p-6 shadow-sm'>
              <div className='flex items-center space-x-4 border-b pb-6'>
                <div className='h-12 w-12 flex-shrink-0'>
                  <img
                    src='https://i.pinimg.com/736x/89/fa/21/89fa2105a7a5d0ef0f0cc7e434f36368.jpg'
                    alt='avatar'
                    className='h-full w-full rounded-full object-cover'
                  />
                </div>
                <div className='flex-grow'>
                  <div className='font-semibold text-card-foreground'>xì pót ta</div>
                  <div className='flex items-center text-sm text-muted-foreground'>
                    <svg className='mr-1 h-3 w-3' viewBox='0 0 12 12'>
                      <path
                        d='M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48'
                        fill='currentColor'
                        fillRule='evenodd'
                      />
                    </svg>
                    Sửa hồ sơ
                  </div>
                </div>
              </div>

              <div className='mt-6 space-y-4'>
                <div className='space-y-2'>
                  <div className='flex items-center text-primary'>
                    <svg className='mr-3 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                      />
                    </svg>
                    <span className='font-medium'>Tài khoản của tôi</span>
                  </div>
                  <div className='ml-8 space-y-2 text-sm'>
                    <div className='text-primary'>Hồ sơ</div>
                    <div className='cursor-pointer text-muted-foreground hover:text-foreground'>Ngân hàng</div>
                    <div className='cursor-pointer text-muted-foreground hover:text-foreground'>Địa chỉ</div>
                    <div className='cursor-pointer text-muted-foreground hover:text-foreground'>Đổi mật khẩu</div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center text-muted-foreground'>
                    <svg className='mr-3 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                      />
                    </svg>
                    <span className='font-medium'>Đơn mua</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className='md:col-span-9'>
            <div className='rounded-lg border bg-card p-6 shadow-sm'>
              <div className='border-b pb-6'>
                <h1 className='text-xl font-semibold text-card-foreground'>Hồ Sơ Của Tôi</h1>
                <p className='mt-1 text-sm text-muted-foreground'>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
              </div>

              <div className='mt-8 flex flex-col-reverse md:flex-row md:items-start'>
                <form className='mt-6 flex-grow space-y-6 md:mt-0 md:pr-12'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                    <div className='sm:col-span-1'>
                      <label className='text-sm font-medium text-foreground'>Email</label>
                    </div>
                    <div className='sm:col-span-3'>
                      <div className='text-sm text-muted-foreground'>d***c@gmail.com</div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                    <div className='sm:col-span-1'>
                      <label className='text-sm font-medium text-foreground'>Tên</label>
                    </div>
                    <div className='sm:col-span-3'>
                      <input
                        className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        defaultValue='Dư Thanh Dược'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                    <div className='sm:col-span-1'>
                      <label className='text-sm font-medium text-foreground'>Số điện thoại</label>
                    </div>
                    <div className='sm:col-span-3'>
                      <input
                        className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        placeholder='Nhập số điện thoại'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                    <div className='sm:col-span-1'>
                      <label className='text-sm font-medium text-foreground'>Địa chỉ</label>
                    </div>
                    <div className='sm:col-span-3'>
                      <input
                        className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
                        placeholder='Nhập địa chỉ'
                      />
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                    <div className='sm:col-span-1'>
                      <label className='text-sm font-medium text-foreground'>Ngày sinh</label>
                    </div>
                    <div className='sm:col-span-3'>
                      <div className='grid grid-cols-3 gap-2'>
                        <select className='rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                          <option>Ngày</option>
                          {Array.from({ length: 31 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </select>
                        <select className='rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                          <option>Tháng</option>
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>
                              Tháng {i + 1}
                            </option>
                          ))}
                        </select>
                        <select className='rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                          <option>Năm</option>
                          {Array.from({ length: 2024 - 1900 + 1 }, (_, i) => (
                            <option key={1900 + i} value={1900 + i}>
                              {1900 + i}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                    <div className='sm:col-span-1'></div>
                    <div className='sm:col-span-3'>
                      <button className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                        Lưu thay đổi
                      </button>
                    </div>
                  </div>
                </form>

                {/* Avatar Section */}
                <div className='flex justify-center md:w-72 md:border-l md:border-border md:pl-6'>
                  <div className='flex flex-col items-center space-y-4'>
                    <div className='h-24 w-24'>
                      <img
                        src='https://i.pinimg.com/736x/89/fa/21/89fa2105a7a5d0ef0f0cc7e434f36368.jpg'
                        alt='Profile avatar'
                        className='h-full w-full rounded-full object-cover'
                      />
                    </div>
                    <input className='hidden' type='file' accept='.jpg,.jpeg,.png' />
                    <button className='inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
                      Chọn ảnh
                    </button>
                    <div className='text-center text-xs text-muted-foreground'>
                      <div>Dung lượng file tối đa 1 MB</div>
                      <div>Định dạng: .JPEG, .PNG</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
