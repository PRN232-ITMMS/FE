import { useState, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Upload, FileText, Trash2, Download, Eye, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { medicalDocumentsApi } from '@/apis/medical.api'
import { useAuthStore } from '@/stores/auth.store'
import { useToast } from '@/hooks/use-toast'

interface MedicalDocumentsProps {
  onUpdate?: () => void
}

export const MedicalDocuments = ({ onUpdate }: MedicalDocumentsProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const [description, setDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { profile } = useAuthStore()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Fetch documents
  const { data: documents = [], refetch } = useQuery({
    queryKey: ['medical-documents', profile?.id],
    queryFn: () => medicalDocumentsApi.getAll(profile!.id),
    enabled: !!profile?.id,
  })

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: ({ file, description }: { file: File; description?: string }) =>
      medicalDocumentsApi.upload(profile!.id, file, description),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã tải lên tài liệu thành công',
      })
      setDescription('')
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      refetch()
      onUpdate?.()
      queryClient.invalidateQueries({ queryKey: ['medical-documents', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải lên tài liệu',
        variant: 'destructive',
      })
      console.error('Error uploading document:', error)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => medicalDocumentsApi.delete(id),
    onSuccess: () => {
      toast({
        title: 'Thành công',
        description: 'Đã xóa tài liệu',
      })
      refetch()
      onUpdate?.()
      queryClient.invalidateQueries({ queryKey: ['medical-documents', profile!.id] })
    },
    onError: (error) => {
      toast({
        title: 'Lỗi',
        description: 'Không thể xóa tài liệu',
        variant: 'destructive',
      })
      console.error('Error deleting document:', error)
    },
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'Lỗi',
        description: 'Kích thước file không được vượt quá 10MB',
        variant: 'destructive',
      })
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: 'Lỗi',
        description: 'Chỉ cho phép file PDF, JPG, PNG',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
  }

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0]
    if (!file) return

    await uploadMutation.mutateAsync({ file, description })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileText className='h-8 w-8 text-red-500' />
    } else if (fileType.includes('image')) {
      return <FileText className='h-8 w-8 text-blue-500' />
    }
    return <FileText className='h-8 w-8 text-gray-500' />
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Tài liệu y tế</h3>
          <p className='text-sm text-muted-foreground'>Tải lên và quản lý các tài liệu y tế, kết quả xét nghiệm</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()} size='sm' disabled={uploadMutation.isPending}>
          <Plus className='mr-2 h-4 w-4' />
          Tải lên
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        onChange={handleFileSelect}
        className='hidden'
      />

      {/* Upload Form */}
      {isUploading && (
        <div className='space-y-4 rounded-lg border p-4'>
          <h4 className='font-medium'>Tải lên tài liệu mới</h4>
          <div className='space-y-4'>
            <div>
              <Label>File đã chọn</Label>
              <p className='text-sm text-muted-foreground'>{fileInputRef.current?.files?.[0]?.name}</p>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description'>Mô tả tài liệu</Label>
              <Textarea
                id='description'
                placeholder='Mô tả ngắn về tài liệu này...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className='flex space-x-2'>
              <Button onClick={handleUpload} disabled={uploadMutation.isPending}>
                <Upload className='mr-2 h-4 w-4' />
                {uploadMutation.isPending ? 'Đang tải lên...' : 'Tải lên'}
              </Button>
              <Button
                variant='outline'
                onClick={() => {
                  setIsUploading(false)
                  setDescription('')
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className='space-y-3'>
        {documents.length === 0 ? (
          <div className='py-8 text-center text-muted-foreground'>
            <Upload className='mx-auto mb-4 h-12 w-12 opacity-50' />
            <p>Chưa có tài liệu nào</p>
            <p className='text-sm'>Nhấn "Tải lên" để thêm tài liệu mới</p>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className='rounded-lg border p-4'>
              <div className='flex items-start justify-between'>
                <div className='flex items-start space-x-3'>
                  {getFileIcon(doc.fileType)}
                  <div className='flex-1'>
                    <h4 className='font-medium'>{doc.fileName}</h4>
                    {doc.description && <p className='mt-1 text-sm text-muted-foreground'>{doc.description}</p>}
                    <div className='mt-2 flex items-center space-x-4 text-xs text-muted-foreground'>
                      <span>Loại: {doc.fileType}</span>
                      <span>Tải lên: {new Date(doc.uploadedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>

                <div className='ml-4 flex space-x-1'>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                    title='Xem tài liệu'
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = doc.fileUrl
                      link.download = doc.fileName
                      link.click()
                    }}
                    title='Tải xuống'
                  >
                    <Download className='h-4 w-4' />
                  </Button>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => handleDelete(doc.id!)}
                    disabled={deleteMutation.isPending}
                    title='Xóa tài liệu'
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Guidelines */}
      <div className='rounded-lg bg-muted/50 p-4'>
        <h4 className='mb-2 font-medium'>Hướng dẫn tải lên</h4>
        <ul className='space-y-1 text-sm text-muted-foreground'>
          <li>• Chỉ chấp nhận file PDF, JPG, PNG</li>
          <li>• Kích thước tối đa: 10MB</li>
          <li>• Nên đặt tên file có ý nghĩa</li>
          <li>• Thêm mô tả để dễ tìm kiếm sau này</li>
        </ul>
      </div>
    </div>
  )
}
