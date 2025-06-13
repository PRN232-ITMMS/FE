import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useNavigate } from 'react-router-dom'
import authAPI from '@/apis/auth.api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { loginSchema, LoginSchema } from '@/utils/rules'
import { useAuthStore } from '@/stores/auth.store'
import { isAxiosUnprocessableEntityError } from '@/utils/utils'
import { ErrorResponse } from '@/types/utils.type'

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setIsAuthenticated, setProfile } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: yupResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: (body: LoginSchema) => authAPI.login(body),
    onSuccess: (data) => {
      setIsAuthenticated(true)
      setProfile(data.data.data.user)
      navigate('/')
      toast({
        title: 'Thành công',
        description: 'Đăng nhập thành công',
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
    loginMutation.mutate(data)
  })

  return (
    <div className='flex min-h-[calc(100vh-128px)] items-center justify-center bg-background'>
      <div className='container mx-auto flex max-w-md flex-col items-center justify-center'>
        <div className='w-full space-y-6 rounded-lg border bg-card p-8 shadow-sm'>
          <div className='space-y-2 text-center'>
            <h1 className='text-2xl font-bold text-card-foreground'>Đăng nhập</h1>
            <p className='text-sm text-muted-foreground'>Nhập thông tin đăng nhập của bạn để tiếp tục</p>
          </div>

          <form onSubmit={onSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' placeholder='name@example.com' {...register('email')} />
              {errors.email?.message && <p className='text-sm text-destructive'>{errors.email.message}</p>}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password'>Mật khẩu</Label>
              <Input id='password' type='password' placeholder='Nhập mật khẩu' {...register('password')} />
              {errors.password?.message && <p className='text-sm text-destructive'>{errors.password.message}</p>}
            </div>

            <Button type='submit' className='w-full' disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className='text-center text-sm'>
            <span className='text-muted-foreground'>Chưa có tài khoản? </span>
            <Link to='/register' className='text-primary hover:underline'>
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
