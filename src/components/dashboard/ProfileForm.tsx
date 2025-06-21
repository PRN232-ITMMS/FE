import { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Save, User, Phone, Camera, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DatePicker } from '@/components/ui/date-picker'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/hooks/use-toast'
import { User as UserType, Gender } from '@/types/user.type'
import profileApi, { UpdateProfileDto } from '@/apis/profile.api'
import ApiErrorHandler from '@/utils/error/apiErrorHandler'
import { AxiosError } from 'axios'

// Profile form validation schema
const profileSchema = yup.object({
  fullName: yup.string().required('Họ tên là bắt buộc'),
  email: yup.string().email('Email không hợp lệ').required('Email là bắt buộc'),
  phoneNumber: yup
    .string()
    .optional()
    .matches(/^[0-9+\-\s()]*$/, 'Số điện thoại không hợp lệ'),
  gender: yup.number().optional().oneOf([1, 2, 3], 'Giới tính không hợp lệ'),
  dateOfBirth: yup
    .date()
    .optional()
    .transform((value, originalValue) => {
      return originalValue === '' ? undefined : value
    }),
})

interface ProfileFormData {
  fullName: string
  email: string
  phoneNumber?: string
  gender?: Gender
  dateOfBirth?: Date | undefined
}

interface ProfileFormProps {
  onUpdate?: () => void
}

export const ProfileForm = ({ onUpdate }: ProfileFormProps) => {
  const { profile, setProfile } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema) as any,
    defaultValues: {
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      phoneNumber: profile?.phoneNumber || '',
      gender: profile?.gender || Gender.Female,
      dateOfBirth: undefined,
    },
  })

  const gender = watch('gender')
  const dateOfBirth = watch('dateOfBirth')

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      setValue('fullName', profile.fullName)
      setValue('email', profile.email)
      setValue('phoneNumber', profile.phoneNumber || '')
      setValue('gender', profile.gender || Gender.Female)
      // Generate Dicebear avatar URL
      const dicebearUrl = `https://api.dicebear.com/7.x/lorelei/svg?seed=${profile.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
      setAvatarUrl(dicebearUrl)
    }
  }, [profile, setValue])

  // Auto-save functionality với debounce
  useEffect(() => {
    if (!isEditing || !isDirty) return

    const timeoutId = setTimeout(() => {
      const formData = getValues()
      autoSaveMutation.mutate(formData)
    }, 3000) // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timeoutId)
  }, [watch(), isEditing, isDirty])

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const updateData: UpdateProfileDto = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
      }
      const response = await profileApi.updateProfile(profile!.id, updateData)
      return response.data.data
    },
    onSuccess: (updatedUser: UserType) => {
      setProfile(updatedUser)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật thông tin cá nhân',
      })
      setIsEditing(false)
      onUpdate?.()
      queryClient.invalidateQueries({ queryKey: ['profile', profile!.id] })
    },
    onError: (error: AxiosError) => {
      toast({
        title: 'Lỗi',
        description: ApiErrorHandler.handle(error),
        variant: 'destructive',
      })
      console.error('Error updating profile:', error)
    },
  })

  // Auto-save mutation (silent)
  const autoSaveMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const updateData: UpdateProfileDto = {
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        gender: data.gender,
      }
      const response = await profileApi.updateProfile(profile!.id, updateData)
      return response.data.data
    },
    onSuccess: () => {
      console.log('✅ Auto-saved profile successfully')
    },
    onError: (error) => {
      console.error('❌ Auto-save failed:', error)
      // Show subtle notification for auto-save failure
      toast({
        title: 'Auto-save thất bại',
        description: 'Vui lòng lưu thủ công',
        variant: 'destructive',
        duration: 3000,
      })
    },
  })

  // Upload avatar mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      const response = await profileApi.uploadAvatar(profile!.id, file)
      return response.data.data
    },
    onSuccess: (response) => {
      setAvatarUrl(response.avatarUrl)
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật avatar',
      })
      onUpdate?.()
    },
    onError: (error: AxiosError) => {
      toast({
        title: 'Lỗi',
        description: ApiErrorHandler.handle(error),
        variant: 'destructive',
      })
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    await updateProfileMutation.mutateAsync(data)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    reset()
  }

  const getGenderLabel = (value: Gender) => {
    switch (value) {
      case Gender.Male:
        return 'Nam'
      case Gender.Female:
        return 'Nữ'
      case Gender.Other:
        return 'Khác'
      default:
        return 'Không xác định'
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'Kích thước file không được vượt quá 1MB',
        variant: 'destructive',
      })
      return
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Lỗi',
        description: 'Chỉ cho phép file JPG, PNG, WEBP',
        variant: 'destructive',
      })
      return
    }

    // Preview the image locally
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    uploadAvatarMutation.mutate(file)
  }

  const generateNewAvatar = () => {
    if (profile) {
      const randomSeed = Math.random().toString(36).substring(7)
      const newAvatarUrl = `https://api.dicebear.com/7.x/lorelei/svg?seed=${randomSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
      setAvatarUrl(newAvatarUrl)
    }
  }

  if (!profile) {
    return <div>Đang tải thông tin...</div>
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Thông tin cá nhân</h3>
          <p className='text-sm text-muted-foreground'>Quản lý thông tin cá nhân và thông tin liên hệ</p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} size='sm'>
            <User className='mr-2 h-4 w-4' />
            Chỉnh sửa
          </Button>
        )}
      </div>

      <div className='flex flex-col md:flex-row md:items-start md:space-x-8'>
        {/* Form Fields */}
        <div className='flex-1'>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Basic Information */}
            <div className='space-y-4 rounded-lg border p-4'>
              <h4 className='flex items-center font-medium'>
                <User className='mr-2 h-4 w-4' />
                Thông tin cơ bản
              </h4>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='fullName'>Họ và tên *</Label>
                  {isEditing ? (
                    <Input id='fullName' placeholder='Nhập họ tên đầy đủ' {...register('fullName')} />
                  ) : (
                    <div className='rounded bg-muted p-2 text-sm'>{profile.fullName}</div>
                  )}
                  {errors.fullName && <p className='text-sm text-destructive'>{errors.fullName.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='gender'>Giới tính</Label>
                  {isEditing ? (
                    <Select
                      value={gender?.toString()}
                      onValueChange={(value) => setValue('gender', parseInt(value) as Gender)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn giới tính' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Gender.Male.toString()}>Nam</SelectItem>
                        <SelectItem value={Gender.Female.toString()}>Nữ</SelectItem>
                        <SelectItem value={Gender.Other.toString()}>Khác</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className='rounded bg-muted p-2 text-sm'>
                      {getGenderLabel(profile.gender || Gender.Female)}
                    </div>
                  )}
                </div>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='dateOfBirth'>Ngày sinh</Label>
                {isEditing ? (
                  <DatePicker
                    value={dateOfBirth}
                    onChange={(date) => setValue('dateOfBirth', date)}
                    placeholder='Chọn ngày sinh'
                  />
                ) : (
                  <div className='rounded bg-muted p-2 text-sm'>
                    {dateOfBirth ? dateOfBirth.toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className='space-y-4 rounded-lg border p-4'>
              <h4 className='flex items-center font-medium'>
                <Phone className='mr-2 h-4 w-4' />
                Thông tin liên hệ
              </h4>

              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='email'>Email *</Label>
                  {isEditing ? (
                    <Input id='email' type='email' placeholder='example@email.com' {...register('email')} />
                  ) : (
                    <div className='rounded bg-muted p-2 text-sm'>{profile.email}</div>
                  )}
                  {errors.email && <p className='text-sm text-destructive'>{errors.email.message}</p>}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phoneNumber'>Số điện thoại</Label>
                  {isEditing ? (
                    <Input id='phoneNumber' placeholder='0123 456 789' {...register('phoneNumber')} />
                  ) : (
                    <div className='rounded bg-muted p-2 text-sm'>{profile.phoneNumber || 'Chưa cập nhật'}</div>
                  )}
                  {errors.phoneNumber && <p className='text-sm text-destructive'>{errors.phoneNumber.message}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className='flex space-x-2'>
                <Button type='submit' disabled={isSubmitting || !isDirty}>
                  <Save className='mr-2 h-4 w-4' />
                  {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
                <Button type='button' variant='outline' onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            )}

            {/* Auto-save indicator */}
            {isEditing && isDirty && (
              <div className='flex items-center text-xs text-muted-foreground'>
                {autoSaveMutation.isPending ? (
                  <span className='text-blue-600'>💾 Đang tự động lưu...</span>
                ) : (
                  <span>💾 Tự động lưu sau 3 giây không có thay đổi...</span>
                )}
              </div>
            )}
            
            {/* Upload status */}
            {uploadAvatarMutation.isPending && (
              <div className='text-xs text-blue-600'>📤 Đang tải lên avatar...</div>
            )}
          </form>
        </div>

        {/* Avatar Section */}
        <div className='mt-6 w-full md:mt-0 md:w-80'>
          <div className='space-y-4 rounded-lg border p-6'>
            <h4 className='text-center font-medium'>Avatar</h4>

            <div className='flex flex-col items-center space-y-4'>
              <div className='relative'>
                <img
                  src={avatarUrl}
                  alt='Avatar'
                  className='h-24 w-24 rounded-full border-2 border-gray-200 bg-gray-100 object-cover'
                />
                {isEditing && (
                  <button
                    type='button'
                    onClick={() => fileInputRef.current?.click()}
                    className='absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-primary-foreground transition-colors hover:bg-primary/90'
                  >
                    <Camera className='h-3 w-3' />
                  </button>
                )}
              </div>

              {isEditing && (
                <div className='space-y-2 text-center'>
                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarChange}
                    className='hidden'
                  />

                  <div className='flex flex-col space-y-2'>
                    <Button type='button' variant='outline' size='sm' onClick={() => fileInputRef.current?.click()}>
                      <Upload className='mr-2 h-4 w-4' />
                      Tải ảnh lên
                    </Button>

                    <Button type='button' variant='outline' size='sm' onClick={generateNewAvatar}>
                      <User className='mr-2 h-4 w-4' />
                      Tạo avatar mới
                    </Button>
                  </div>

                  <div className='text-xs text-muted-foreground'>
                    <div>Tối đa: 1MB</div>
                    <div>JPG, PNG</div>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div className='text-center'>
                  <p className='text-sm text-muted-foreground'>Avatar tự động tạo từ Dicebear</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
