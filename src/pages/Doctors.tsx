import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import MainLayout from '@/layouts/MainLayout'
import { DoctorCard } from '@/components/doctors/DoctorCard'
import { DoctorFilters, DoctorFilterState } from '@/components/doctors/DoctorFilters'
import { LoadingPage } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
// import { doctorApi } from '@/apis/doctor.api'
import { useToast } from '@/hooks/use-toast'
import { Users, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import useDocumentTitle from '@/hooks/useDocumentTitle'

// Mock data for now - will be replaced with real API data
const mockDoctors = [
  {
    id: 1,
    user: {
      id: 1,
      fullName: 'Nguyễn Văn An',
      email: 'dr.nguyen@itm.com',
      phoneNumber: '0901234567',
    },
    licenseNumber: 'BS001',
    specialization: 'Sản phụ khoa',
    yearsOfExperience: 15,
    education: 'Tiến sĩ Y khoa - Đại học Y dược TP.HCM',
    biography:
      'Bác sĩ chuyên khoa II về điều trị hiếm muộn với hơn 15 năm kinh nghiệm. Thành thạo các kỹ thuật IVF, ICSI.',
    consultationFee: 800000,
    isAvailable: true,
    successRate: 85,
  },
  {
    id: 2,
    user: {
      id: 2,
      fullName: 'Trần Thị Bình',
      email: 'dr.tran@itm.com',
      phoneNumber: '0912345678',
    },
    licenseNumber: 'BS002',
    specialization: 'Nội tiết sinh sản',
    yearsOfExperience: 12,
    education: 'Thạc sĩ Y khoa - Đại học Y Hà Nội',
    biography: 'Chuyên gia về rối loạn nội tiết sinh sản, điều trị PCOS, rối loạn kinh nguyệt.',
    consultationFee: 600000,
    isAvailable: true,
    successRate: 78,
  },
  {
    id: 3,
    user: {
      id: 3,
      fullName: 'Lê Minh Cường',
      email: 'dr.le@itm.com',
      phoneNumber: '0923456789',
    },
    licenseNumber: 'BS003',
    specialization: 'Nam học',
    yearsOfExperience: 10,
    education: 'Bác sĩ Chuyên khoa I - Đại học Y khoa Phạm Ngọc Thạch',
    biography: 'Chuyên điều trị vô sinh nam, rối loạn chức năng sinh dục nam.',
    consultationFee: 700000,
    isAvailable: false,
    successRate: 72,
  },
  {
    id: 4,
    user: {
      id: 4,
      fullName: 'Phạm Thị Diệu',
      email: 'dr.pham@itm.com',
      phoneNumber: '0934567890',
    },
    licenseNumber: 'BS004',
    specialization: 'IVF/IUI',
    yearsOfExperience: 8,
    education: 'Thạc sĩ Y khoa - Đại học Y dược Cần Thơ',
    biography: 'Chuyên gia về kỹ thuật thụ tinh ống nghiệm, IUI với tỷ lệ thành công cao.',
    consultationFee: 750000,
    isAvailable: true,
    successRate: 82,
  },
]

const DoctorsPage = () => {
  const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<DoctorFilterState>({})
  const [searchQuery, setSearchQuery] = useState('')

  useDocumentTitle({ title: 'Danh sách Bác sĩ - ITM System' })

  // For now, use mock data. Later replace with real API call
  const {
    data: doctorsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['doctors', currentPage, filters, searchQuery],
    queryFn: async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock filtering logic
      let filteredDoctors = [...mockDoctors]

      // Search filter
      if (searchQuery) {
        filteredDoctors = filteredDoctors.filter(
          (doctor) =>
            doctor.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }

      // Specialization filter
      if (filters.specialization) {
        filteredDoctors = filteredDoctors.filter((doctor) => doctor.specialization === filters.specialization)
      }

      // Availability filter
      if (filters.availability) {
        filteredDoctors = filteredDoctors.filter((doctor) => doctor.isAvailable)
      }

      // Experience filter
      if (filters.minExperience) {
        filteredDoctors = filteredDoctors.filter((doctor) => doctor.yearsOfExperience >= filters.minExperience!)
      }

      // Fee filter
      if (filters.maxFee) {
        filteredDoctors = filteredDoctors.filter((doctor) => doctor.consultationFee <= filters.maxFee!)
      }

      // Sorting
      if (filters.sortBy) {
        filteredDoctors.sort((a, b) => {
          let aValue: any, bValue: any

          switch (filters.sortBy) {
            case 'name':
              aValue = a.user.fullName
              bValue = b.user.fullName
              break
            case 'experience':
              aValue = a.yearsOfExperience
              bValue = b.yearsOfExperience
              break
            case 'rating':
              aValue = a.successRate
              bValue = b.successRate
              break
            case 'fee':
              aValue = a.consultationFee
              bValue = b.consultationFee
              break
            default:
              return 0
          }

          if (filters.sortOrder === 'desc') {
            return bValue > aValue ? 1 : -1
          }
          return aValue > bValue ? 1 : -1
        })
      }

      // Mock pagination
      const itemsPerPage = 6
      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex)

      return {
        data: paginatedDoctors,
        pagination: {
          page: currentPage,
          limit: itemsPerPage,
          total: filteredDoctors.length,
          totalPages: Math.ceil(filteredDoctors.length / itemsPerPage),
        },
      }
    },
  })

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1) // Reset to first page
  }

  const handleFilter = (newFilters: DoctorFilterState) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setCurrentPage(1)
  }

  const handleViewDetails = (doctor: any) => {
    toast({
      title: 'Thông tin bác sĩ',
      description: `Xem chi tiết BS. ${doctor.user.fullName}`,
    })
    // TODO: Navigate to doctor detail page or open modal
  }

  const handleBookAppointment = (doctor: any) => {
    toast({
      title: 'Đặt lịch hẹn',
      description: `Đặt lịch với BS. ${doctor.user.fullName}`,
    })
    // TODO: Navigate to appointment booking page
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading) {
    return <LoadingPage message='Đang tải danh sách bác sĩ...' />
  }

  if (error) {
    return (
      <MainLayout>
        <div className='container mx-auto py-8'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-red-600'>Có lỗi xảy ra</h1>
            <p className='mt-2 text-muted-foreground'>Không thể tải danh sách bác sĩ</p>
            <Button onClick={() => refetch()} className='mt-4'>
              Thử lại
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const doctors = doctorsData?.data || []
  const pagination = doctorsData?.pagination

  return (
    <MainLayout>
      <div className='container mx-auto space-y-6 py-8'>
        {/* Page Header */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold text-foreground'>Đội ngũ Bác sĩ</h1>
          <p className='text-muted-foreground'>
            Tìm hiểu về đội ngũ bác sĩ chuyên nghiệp và giàu kinh nghiệm của chúng tôi
          </p>
        </div>

        {/* Filters */}
        <DoctorFilters
          onSearch={handleSearch}
          onFilter={handleFilter}
          onClear={handleClearFilters}
          loading={isLoading}
        />

        {/* Results Summary */}
        {pagination && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
              <Users className='h-4 w-4' />
              <span>
                Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} trong tổng số {pagination.total} bác sĩ
              </span>
            </div>

            {searchQuery && (
              <div className='text-sm text-muted-foreground'>
                Kết quả tìm kiếm cho: "<span className='font-medium'>{searchQuery}</span>"
              </div>
            )}
          </div>
        )}

        {/* Doctors Grid */}
        {doctors.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onViewDetails={handleViewDetails}
                onBookAppointment={handleBookAppointment}
                showBookButton={true}
              />
            ))}
          </div>
        ) : (
          <div className='py-12 text-center'>
            <Users className='mx-auto h-12 w-12 text-muted-foreground' />
            <h3 className='mt-4 text-lg font-medium text-foreground'>Không tìm thấy bác sĩ nào</h3>
            <p className='mt-2 text-muted-foreground'>Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm khác</p>
            <Button onClick={handleClearFilters} className='mt-4'>
              Xóa bộ lọc
            </Button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className='flex items-center justify-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className='mr-1 h-4 w-4' />
              Trang trước
            </Button>

            {/* Page numbers */}
            <div className='flex space-x-1'>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  const current = pagination.page
                  return page === 1 || page === pagination.totalPages || Math.abs(page - current) <= 1
                })
                .map((page, index, array) => (
                  <div key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className='px-2 text-muted-foreground'>...</span>
                    )}
                    <Button
                      variant={page === pagination.page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </div>
                ))}
            </div>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
            >
              Trang sau
              <ChevronRight className='ml-1 h-4 w-4' />
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className='rounded-lg bg-primary/5 p-6 text-center'>
          <Calendar className='mx-auto mb-4 h-12 w-12 text-primary' />
          <h3 className='mb-2 text-lg font-semibold text-foreground'>Sẵn sàng bắt đầu hành trình điều trị?</h3>
          <p className='mb-4 text-muted-foreground'>Đặt lịch tư vấn với bác sĩ chuyên nghiệp ngay hôm nay</p>
          <Button size='lg'>
            <Calendar className='mr-2 h-5 w-5' />
            Đặt lịch tư vấn
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}

export default DoctorsPage
