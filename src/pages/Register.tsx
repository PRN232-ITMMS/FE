import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import authAPI from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { registerSchema, RegisterSchema } from '@/utils/rules'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'
import { Heart, UserPlus } from 'lucide-react'
import { UserRole, Gender } from '@/types/user.type'
import { Controller } from 'react-hook-form'
import useDocumentTitle from '@/hooks/useDocumentTitle'

const Register = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  useDocumentTitle({ title: 'Đăng ký tài khoản - ITM System' })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: UserRole.Customer,
      gender: Gender.Female,
    },
  })

  const registerMutation = useMutation({
    mutationFn: (body: RegisterSchema) => authAPI.register(body),
    onSuccess: () => {
      toast({
        title: 'Đăng ký thành công',
        description: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.',
      })
      navigate('/login')
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse>(error)) {
        const formError = error.response?.data
        if (formError) {
          toast({
            title: 'Đăng ký thất bại',
            description: formError.message || 'Có lỗi xảy ra khi đăng ký tài khoản',
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: 'Lỗi đăng ký',
          description: 'Vui lòng kiểm tra lại thông tin và thử lại',
          variant: 'destructive',
        })
      }
    },
  })

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  return (
    <div className='flex min-h-[calc(100vh-128px)] items-center justify-center bg-background py-8'>
      <div className='container mx-auto flex max-w-2xl flex-col items-center justify-center'>
        <div className='w-full space-y-6 rounded-lg border bg-card p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
              <UserPlus className='h-6 w-6 text-primary' />
            </div>
            <h1 className='text-2xl font-bold text-card-foreground'>Đăng ký tài khoản</h1>
            <p className='text-sm text-muted-foreground'>
              Tạo tài khoản để bắt đầu hành trình điều trị hiếm muộn cùng chúng tôi
            </p>
          </div>

          <form onSubmit={onSubmit} className='space-y-6'>
            {/* Thông tin đăng nhập */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Thông tin đăng nhập</h3>

              <div className='space-y-2'>
                <Label htmlFor='email'>Địa chỉ Email *</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='benhnhan@example.com'
                  {...register('email')}
                  className='h-11'
                />
                {errors.email?.message && <p className='text-sm text-destructive'>{errors.email.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='password'>Mật khẩu *</Label>
                <Input
                  id='password'
                  type='password'
                  placeholder='Tạo mật khẩu mạnh (tối thiểu 6 ký tự)'
                  {...register('password')}
                  className='h-11'
                />
                {errors.password?.message && <p className='text-sm text-destructive'>{errors.password.message}</p>}
              </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Thông tin cá nhân</h3>

              <div className='space-y-2'>
                <Label htmlFor='fullName'>Họ và tên *</Label>
                <Input
                  id='fullName'
                  type='text'
                  placeholder='Nguyễn Văn A'
                  {...register('fullName')}
                  className='h-11'
                />
                {errors.fullName?.message && <p className='text-sm text-destructive'>{errors.fullName.message}</p>}
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='phoneNumber'>Số điện thoại</Label>
                  <Input
                    id='phoneNumber'
                    type='tel'
                    placeholder='0123456789'
                    {...register('phoneNumber')}
                    className='h-11'
                  />
                  {errors.phoneNumber?.message && (
                    <p className='text-sm text-destructive'>{errors.phoneNumber.message}</p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label>Giới tính</Label>
                  <Controller
                    name='gender'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(Number(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <SelectTrigger className='h-11'>
                          <SelectValue placeholder='Chọn giới tính' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={Gender.Female.toString()}>Nữ</SelectItem>
                          <SelectItem value={Gender.Male.toString()}>Nam</SelectItem>
                          <SelectItem value={Gender.Other.toString()}>Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Thông tin bổ sung cho bệnh nhân */}
            <div className='space-y-4'>
              <h3 className='text-lg font-medium'>Thông tin bổ sung</h3>

              <div className='space-y-2'>
                <Label htmlFor='address'>Địa chỉ</Label>
                <Input
                  id='address'
                  type='text'
                  placeholder='123 Đường ABC, Quận XYZ, TP.HCM'
                  {...register('address')}
                  className='h-11'
                />
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='maritalStatus'>Tình trạng hôn nhân</Label>
                  <Input
                    id='maritalStatus'
                    type='text'
                    placeholder='Đã kết hôn'
                    {...register('maritalStatus')}
                    className='h-11'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='occupation'>Nghề nghiệp</Label>
                  <Input
                    id='occupation'
                    type='text'
                    placeholder='Kỹ sư, Giáo viên, ...'
                    {...register('occupation')}
                    className='h-11'
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='emergencyContactName'>Người liên hệ khẩn cấp</Label>
                  <Input
                    id='emergencyContactName'
                    type='text'
                    placeholder='Tên người thân'
                    {...register('emergencyContactName')}
                    className='h-11'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='emergencyContactPhone'>SĐT người liên hệ khẩn cấp</Label>
                  <Input
                    id='emergencyContactPhone'
                    type='tel'
                    placeholder='0987654321'
                    {...register('emergencyContactPhone')}
                    className='h-11'
                  />
                </div>
              </div>
            </div>

            <Button type='submit' className='h-11 w-full' disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký tài khoản'}
            </Button>
          </form>

          <div className='text-center text-sm'>
            <span className='text-muted-foreground'>Đã có tài khoản? </span>
            <Link to='/login' className='font-medium text-primary hover:underline'>
              Đăng nhập ngay
            </Link>
          </div>

          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>
              <Heart className='mr-1 inline h-3 w-3' />
              Thông tin của bạn sẽ được bảo mật tuyệt đối
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
