import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, UserCheck, Trash2, Edit3, Save, X, Phone, Mail, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { emergencyContactsApi } from '@/apis/medical.api'
import { EmergencyContact, EmergencyContactFormData } from '@/types/medical.type'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/hooks/use-toast'

// Validation schema
const emergencyContactSchema = yup.object({
  fullName: yup.string().required('Họ tên là bắt buộc'),
  relationship: yup.string().required('Mối quan hệ là bắt buộc'),
  phoneNumber: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ'),
  email: yup.string().optional().email('Email không hợp lệ'),
  address: yup.string().optional(),
  isPrimary: yup.boolean().default(false),
})

const relationshipOptions = [
  { value: 'spouse', label: 'Vợ/Chồng' },
  { value: 'parent', label: 'Bố/Mẹ' },
  { value: 'child', label: 'Con' },
  { value: 'sibling', label: 'Anh/Chị/Em' },
  { value: 'relative', label: 'Người thân' },
  { value: 'friend', label: 'Bạn bè' },
  { value: 'colleague', label: 'Đồng nghiệp' },
  { value: 'other', label: 'Khác' },
]

interface EmergencyContactFormProps {
  emergencyContacts: EmergencyContact[]
  onUpdate: () => void
}

export const EmergencyContactForm = ({ emergencyContacts, onUpdate }: EmergencyContactFormProps) => {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const { profile } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyContactFormData>({
    resolver: yupResolver(emergencyContactSchema),
    defaultValues: {
      fullName: '',
      relationship: '',
      phoneNumber: '',
      email: '',
      address: '',
      isPrimary: false,
    },
  })

  const relationship = watch('relationship')

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: EmergencyContactFormData) =>
      emergencyContactsApi.create({
        userId: profile!.id,
        fullName: data.fullName,
        relationship: data.relationship,
        phoneNumber: data.phoneNumber,
        email: data.email || '',
        address: data.address || '',
        isPrimary: data.isPrimary,
      }),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã thêm người liên hệ khẩn cấp mới',
      })
      reset()
      setIsAdding(false)
      onUpdate()
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm người liên hệ khẩn cấp',
        variant: 'destructive',
      })
      console.error('Error creating emergency contact:', error)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<EmergencyContact> }) =>
      emergencyContactsApi.update(id, data),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật người liên hệ khẩn cấp',
      })
      setEditingId(null)
      onUpdate()
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật người liên hệ khẩn cấp',
        variant: 'destructive',
      })
      console.error('Error updating emergency contact:', error)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => emergencyContactsApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã xóa người liên hệ khẩn cấp',
      })
      onUpdate()
      queryClient.invalidateQueries({ queryKey: ['emergency-contacts', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa người liên hệ khẩn cấp',
        variant: 'destructive',
      })
      console.error('Error deleting emergency contact:', error)
    },
  })

  const onSubmit = async (data: EmergencyContactFormData) => {
    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data: {
          fullName: data.fullName,
          relationship: data.relationship,
          phoneNumber: data.phoneNumber,
          email: data.email,
          address: data.address,
          isPrimary: data.isPrimary,
        },
      })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const startEdit = (item: EmergencyContact) => {
    setEditingId(item.id!)
    setValue('fullName', item.fullName)
    setValue('relationship', item.relationship)
    setValue('phoneNumber', item.phoneNumber)
    setValue('email', item.email || '')
    setValue('address', item.address || '')
    setValue('isPrimary', item.isPrimary)
    setIsAdding(true)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    reset()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người liên hệ này?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const getRelationshipLabel = (value: string) => {
    return relationshipOptions.find((option) => option.value === value)?.label || value
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Người liên hệ khẩn cấp</h3>
          <p className='text-sm text-muted-foreground'>
            Thông tin người thân để liên hệ khi cần thiết
          </p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size='sm'>
            <Plus className='h-4 w-4 mr-2' />
            Thêm mới
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className='rounded-lg border p-4 space-y-4'>
          <h4 className='font-medium'>
            {editingId ? 'Chỉnh sửa người liên hệ' : 'Thêm người liên hệ khẩn cấp'}
          </h4>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='fullName'>Họ và tên *</Label>
                <Input
                  id='fullName'
                  placeholder='Nhập họ tên đầy đủ'
                  {...register('fullName')}
                />
                {errors.fullName && (
                  <p className='text-sm text-destructive'>{errors.fullName.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='relationship'>Mối quan hệ *</Label>
                <Select value={relationship} onValueChange={(value) => setValue('relationship', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn mối quan hệ' />
                  </SelectTrigger>
                  <SelectContent>
                    {relationshipOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.relationship && (
                  <p className='text-sm text-destructive'>{errors.relationship.message}</p>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='phoneNumber'>Số điện thoại *</Label>
                <Input
                  id='phoneNumber'
                  placeholder='0123 456 789'
                  {...register('phoneNumber')}
                />
                {errors.phoneNumber && (
                  <p className='text-sm text-destructive'>{errors.phoneNumber.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='example@email.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-sm text-destructive'>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='address'>Địa chỉ</Label>
              <Textarea
                id='address'
                placeholder='Nhập địa chỉ liên hệ'
                rows={2}
                {...register('address')}
              />
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='isPrimary'
                className='rounded border-gray-300'
                {...register('isPrimary')}
              />
              <Label htmlFor='isPrimary'>Đây là người liên hệ chính</Label>
            </div>

            <div className='flex space-x-2'>
              <Button type='submit' disabled={isSubmitting}>
                <Save className='h-4 w-4 mr-2' />
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button type='button' variant='outline' onClick={cancelEdit}>
                <X className='h-4 w-4 mr-2' />
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Emergency Contacts List */}
      <div className='space-y-3'>
        {emergencyContacts.length === 0 ? (
          <div className='text-center py-8 text-muted-foreground'>
            <UserCheck className='h-12 w-12 mx-auto mb-4 opacity-50' />
            <p>Chưa có thông tin người liên hệ khẩn cấp</p>
            <p className='text-sm'>Nhấn "Thêm mới" để bắt đầu</p>
          </div>
        ) : (
          emergencyContacts.map((contact) => (
            <div key={contact.id} className='rounded-lg border p-4'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center space-x-2 mb-2'>
                    <h4 className='font-medium'>{contact.fullName}</h4>
                    {contact.isPrimary && (
                      <span className='px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full'>
                        Liên hệ chính
                      </span>
                    )}
                  </div>
                  
                  <p className='text-sm text-muted-foreground mb-2'>
                    {getRelationshipLabel(contact.relationship)}
                  </p>
                  
                  <div className='space-y-1'>
                    <div className='flex items-center space-x-2 text-sm'>
                      <Phone className='h-4 w-4 text-muted-foreground' />
                      <span>{contact.phoneNumber}</span>
                    </div>
                    
                    {contact.email && (
                      <div className='flex items-center space-x-2 text-sm'>
                        <Mail className='h-4 w-4 text-muted-foreground' />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    
                    {contact.address && (
                      <div className='flex items-start space-x-2 text-sm'>
                        <MapPin className='h-4 w-4 text-muted-foreground mt-0.5' />
                        <span>{contact.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className='flex space-x-1 ml-4'>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => startEdit(contact)}
                    disabled={isAdding}
                  >
                    <Edit3 className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => handleDelete(contact.id!)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
