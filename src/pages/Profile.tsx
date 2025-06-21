import useDocumentTitle from '@/hooks/useDocumentTitle'
import { ProfileForm } from '@/components/dashboard/ProfileForm'
import { useAuthStore } from '@/stores/auth.store'
import { LoadingPage } from '@/components/ui/loading'

const Profile = () => {
  const { profile } = useAuthStore()
  useDocumentTitle({ title: 'Thông tin cá nhân - ITM System' })

  if (!profile) {
    return <LoadingPage message='Đang tải thông tin...' />
  }

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
                    src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${profile.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
                    alt='avatar'
                    className='h-full w-full rounded-full bg-gray-100 object-cover'
                  />
                </div>
                <div className='flex-grow'>
                  <div className='font-semibold text-card-foreground'>{profile.fullName}</div>
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
                    <div className='cursor-pointer text-primary'>Hồ sơ</div>
                    <div className='cursor-pointer text-muted-foreground hover:text-foreground'>Bảo mật</div>
                    <div className='cursor-pointer text-muted-foreground hover:text-foreground'>Đổi mật khẩu</div>
                    <div className='cursor-pointer text-muted-foreground hover:text-foreground'>Cài đặt</div>
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
                    <span className='cursor-pointer font-medium hover:text-foreground'>Lịch sử điều trị</span>
                  </div>
                </div>

                <div className='space-y-2'>
                  <div className='flex items-center text-muted-foreground'>
                    <svg className='mr-3 h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3a4 4 0 118 0v4m-4 6v6m-6-6h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z'
                      />
                    </svg>
                    <span className='cursor-pointer font-medium hover:text-foreground'>Quyền riêng tư</span>
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

              <div className='mt-8'>
                <ProfileForm onUpdate={() => {}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
