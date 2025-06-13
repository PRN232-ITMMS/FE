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
import { Heart, Users } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'

const Login = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { setIsAuthenticated, setProfile } = useAuthStore()

  useDocumentTitle({ title: 'Đăng nhập - ITM System' })

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
        title: 'Đăng nhập thành công',
        description: 'Chào mừng bạn quay trở lại hệ thống điều trị hiếm muộn',
      })
    },
    onError: (error) => {
      if (isAxiosUnprocessableEntityError<ErrorResponse>(error)) {
        const formError = error.response?.data
        if (formError) {
          toast({
            title: 'Đăng nhập thất bại',
            description: formError.error?.message || 'Email hoặc mật khẩu không chính xác',
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: 'Lỗi đăng nhập',
          description: 'Vui lòng kiểm tra lại thông tin đăng nhập',
          variant: 'destructive',
        })
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
            <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10'>
              <Heart className='h-6 w-6 text-primary' />
            </div>
            <h1 className='text-2xl font-bold text-card-foreground'>Chào mừng trở lại</h1>
            <p className='text-sm text-muted-foreground'>Đăng nhập vào Hệ thống Quản lý Điều trị Hiếm muộn</p>
          </div>

          <form onSubmit={onSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Địa chỉ Email</Label>
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
              <Label htmlFor='password'>Mật khẩu</Label>
              <Input
                id='password'
                type='password'
                placeholder='Nhập mật khẩu của bạn'
                {...register('password')}
                className='h-11'
              />
              {errors.password?.message && <p className='text-sm text-destructive'>{errors.password.message}</p>}
            </div>

            <Button type='submit' className='h-11 w-full' disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </form>

          <div className='text-center text-sm'>
            <span className='text-muted-foreground'>Lần đầu sử dụng dịch vụ? </span>
            <Link to='/register' className='font-medium text-primary hover:underline'>
              Đăng ký tài khoản
            </Link>
          </div>

          <div className='text-center'>
            <p className='text-xs text-muted-foreground'>
              <Users className='mr-1 inline h-3 w-3' />
              Hệ thống hỗ trợ bệnh nhân điều trị hiếm muộn
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
