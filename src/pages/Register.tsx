import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import authAPI from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { registerSchema, RegisterSchema } from '@/utils/rules'
import { useAuthStore } from '@/stores/auth.store'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'

const Register = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setIsAuthenticated, setProfile } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: yupResolver(registerSchema),
  })

  const registerMutation = useMutation({
    mutationFn: (body: RegisterSchema) => authAPI.registerAccount(body),
    onSuccess: (data) => {
      setIsAuthenticated(true)
      setProfile(data.data.data.user)
      navigate('/')
      toast({
        title: 'Thành công',
        description: 'Đăng ký thành công',
      })
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse>(error)) {
        const formError = error.response?.data
        if (formError) {
          toast({
            title: 'Lỗi',
            description: formError.error.message,
            variant: 'destructive',
          })
        }
      }
    },
  })

  const onSubmit = handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  return (
    <div className='flex min-h-[calc(100vh-128px)] items-center justify-center bg-background'>
      <div className='container mx-auto flex max-w-md flex-col items-center justify-center'>
        <div className='w-full space-y-6 rounded-lg border bg-card p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-bold text-card-foreground'>Đăng ký</h1>
            <p className='text-sm text-muted-foreground'>Tạo tài khoản mới để bắt đầu sử dụng dịch vụ</p>
          </div>

          <form onSubmit={onSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='name@example.com' {...register('email')} />
              {errors.email?.message && <p className='text-sm text-destructive'>{errors.email.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Mật khẩu</Label>
              <Input id='password' type='password' placeholder='Tạo mật khẩu mạnh' {...register('password')} />
              {errors.password?.message && <p className='text-sm text-destructive'>{errors.password.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='confirm_password'>Xác nhận mật khẩu</Label>
              <Input
                id='confirm_password'
                type='password'
                placeholder='Nhập lại mật khẩu'
                {...register('confirm_password')}
              />
              {errors.confirm_password?.message && (
                <p className='text-sm text-destructive'>{errors.confirm_password.message}</p>
              )}
            </div>

            <Button type='submit' className='w-full' disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Đang đăng ký...' : 'Đăng ký'}
            </Button>
          </form>

          <div className='text-center text-sm'>
            <span className='text-muted-foreground'>Đã có tài khoản? </span>
            <Link to='/login' className='text-primary hover:underline'>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
