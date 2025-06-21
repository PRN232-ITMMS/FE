import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Calendar, Trash2, Edit3, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { medicalHistoryApi } from '@/apis/medical.api'
import { MedicalHistory, MedicalHistoryFormData } from '@/types/medical.type'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/hooks/use-toast'

// Validation schema
const medicalHistorySchema = yup.object({
  condition: yup.string().required('Tình trạng bệnh lý là bắt buộc'),
  diagnosisDate: yup.string().optional(),
  treatment: yup.string().optional(),
  notes: yup.string().optional(),
})

interface MedicalHistoryFormProps {
  medicalHistory: MedicalHistory[]
  onUpdate: () => void
}

export const MedicalHistoryForm = ({ medicalHistory, onUpdate }: MedicalHistoryFormProps) => {
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
    formState: { errors, isSubmitting },
  } = useForm<MedicalHistoryFormData>({
    resolver: yupResolver(medicalHistorySchema) as any,
    defaultValues: {
      condition: '',
      diagnosisDate: '',
      treatment: '',
      notes: '',
    },
  })

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: MedicalHistoryFormData) =>
      medicalHistoryApi.create({
        userId: profile!.id,
        condition: data.condition,
        diagnosisDate: data.diagnosisDate || '',
        treatment: data.treatment || '',
        notes: data.notes || '',
        isActive: true,
      }),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã thêm tiền sử bệnh lý mới',
      })
      reset()
      setIsAdding(false)
      onUpdate()
      queryClient.invalidateQueries({ queryKey: ['medical-history', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể thêm tiền sử bệnh lý',
        variant: 'destructive',
      })
      console.error('Error creating medical history:', error)
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<MedicalHistory> }) => medicalHistoryApi.update(id, data),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật tiền sử bệnh lý',
      })
      setEditingId(null)
      onUpdate()
      queryClient.invalidateQueries({ queryKey: ['medical-history', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể cập nhật tiền sử bệnh lý',
        variant: 'destructive',
      })
      console.error('Error updating medical history:', error)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => medicalHistoryApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã xóa tiền sử bệnh lý',
      })
      onUpdate()
      queryClient.invalidateQueries({ queryKey: ['medical-history', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tiền sử bệnh lý',
        variant: 'destructive',
      })
      console.error('Error deleting medical history:', error)
    },
  })

  const onSubmit = async (data: MedicalHistoryFormData) => {
    if (editingId) {
      await updateMutation.mutateAsync({
        id: editingId,
        data: {
          condition: data.condition,
          diagnosisDate: data.diagnosisDate,
          treatment: data.treatment,
          notes: data.notes,
        },
      })
    } else {
      await createMutation.mutateAsync(data)
    }
  }

  const startEdit = (item: MedicalHistory) => {
    setEditingId(item.id!)
    setValue('condition', item.condition)
    setValue('diagnosisDate', item.diagnosisDate || '')
    setValue('treatment', item.treatment || '')
    setValue('notes', item.notes || '')
    setIsAdding(true)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setIsAdding(false)
    reset()
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tiền sử bệnh lý này?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Tiền sử bệnh lý</h3>
          <p className='text-sm text-muted-foreground'>Quản lý thông tin về các bệnh lý đã mắc phải</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} size='sm'>
            <Plus className='mr-2 h-4 w-4' />
            Thêm mới
          </Button>
        )}
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className='space-y-4 rounded-lg border p-4'>
          <h4 className='font-medium'>{editingId ? 'Chỉnh sửa tiền sử bệnh lý' : 'Thêm tiền sử bệnh lý mới'}</h4>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='condition'>Tình trạng bệnh lý *</Label>
                <Input
                  id='condition'
                  placeholder='Ví dụ: Đau lưng mãn tính, Cao huyết áp...'
                  {...register('condition')}
                />
                {errors.condition && <p className='text-sm text-destructive'>{errors.condition.message}</p>}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='diagnosisDate'>Ngày chẩn đoán</Label>
                <Input id='diagnosisDate' type='date' {...register('diagnosisDate')} />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Ghi chú</Label>
              <Textarea
                id='notes'
                placeholder='Ghi chú thêm về tình trạng bệnh lý...'
                rows={3}
                {...register('notes')}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='treatment'>Phương pháp điều trị đã áp dụng</Label>
              <Input id='treatment' placeholder='Thuốc, phẫu thuật, vật lý trị liệu...' {...register('treatment')} />
            </div>

            <div className='flex space-x-2'>
              <Button type='submit' disabled={isSubmitting}>
                <Save className='mr-2 h-4 w-4' />
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </Button>
              <Button type='button' variant='outline' onClick={cancelEdit}>
                <X className='mr-2 h-4 w-4' />
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Medical History List */}
      <div className='space-y-3'>
        {medicalHistory.length === 0 ? (
          <div className='py-8 text-center text-muted-foreground'>
            <Calendar className='mx-auto mb-4 h-12 w-12 opacity-50' />
            <p>Chưa có thông tin tiền sử bệnh lý nào</p>
            <p className='text-sm'>Nhấn "Thêm mới" để bắt đầu</p>
          </div>
        ) : (
          medicalHistory.map((item) => (
            <div key={item.id} className='rounded-lg border p-4'>
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='mb-2 flex items-center space-x-2'>
                    <h4 className='font-medium'>{item.condition}</h4>
                    {item.isActive && (
                      <span className='rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800'>
                        Đang điều trị
                      </span>
                    )}
                  </div>

                  {item.diagnosisDate && (
                    <p className='mb-1 text-sm text-muted-foreground'>
                      Chẩn đoán: {new Date(item.diagnosisDate).toLocaleDateString('vi-VN')}
                    </p>
                  )}

                  {item.notes && <p className='mb-2 text-sm text-muted-foreground'>{item.notes}</p>}

                  {item.treatment && (
                    <p className='text-sm'>
                      <span className='font-medium'>Điều trị:</span> {item.treatment}
                    </p>
                  )}
                </div>

                <div className='ml-4 flex space-x-1'>
                  <Button size='sm' variant='ghost' onClick={() => startEdit(item)} disabled={isAdding}>
                    <Edit3 className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => handleDelete(item.id!)}
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
