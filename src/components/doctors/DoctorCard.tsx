import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, User, Award, Clock, Heart, Phone, Mail } from 'lucide-react'

// Temporary type until we have proper Doctor type
interface Doctor {
  id: number
  user: {
    id: number
    fullName: string
    email: string
    phoneNumber?: string
    avatarUrl?: string
  }
  licenseNumber: string
  specialization: string
  yearsOfExperience: number
  education: string
  biography: string
  consultationFee: number
  isAvailable: boolean
  successRate: number
}

interface DoctorCardProps {
  doctor: Doctor
  onViewDetails: (doctor: Doctor) => void
  onBookAppointment?: (doctor: Doctor) => void
  showBookButton?: boolean
}

export const DoctorCard = ({ doctor, onViewDetails, onBookAppointment, showBookButton = true }: DoctorCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount)
  }

  const renderStars = (rating: number) => {
    // Convert successRate (0-100) to 5-star scale
    const stars = Math.round((rating / 100) * 5)
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`h-4 w-4 ${index < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
    ))
  }

  const getAvatarUrl = () => {
    return (
      doctor.user.avatarUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
    )
  }

  return (
    <Card className='h-full transition-shadow duration-200 hover:shadow-lg'>
      <CardHeader className='pb-4'>
        <div className='flex items-start space-x-4'>
          {/* Doctor Avatar */}
          <div className='relative flex-shrink-0'>
            <img
              src={getAvatarUrl()}
              alt={doctor.user.fullName}
              className='h-16 w-16 rounded-full border-2 border-gray-200 object-cover'
              onError={(e) => {
                // Fallback to Dicebear if image fails to load
                const target = e.target as HTMLImageElement
                target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctor.user.email}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
              }}
            />
            {doctor.isAvailable && (
              <div className='absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-green-500' />
            )}
          </div>

          {/* Doctor Info */}
          <div className='min-w-0 flex-1'>
            <h3 className='truncate text-lg font-semibold text-foreground'>BS. {doctor.user.fullName}</h3>

            <div className='mt-1 flex items-center space-x-1'>
              {renderStars(doctor.successRate)}
              <span className='ml-2 text-sm text-muted-foreground'>({doctor.successRate}% thành công)</span>
            </div>

            <div className='mt-1 flex items-center text-sm text-muted-foreground'>
              <Award className='mr-1 h-4 w-4 flex-shrink-0' />
              <span className='truncate'>{doctor.specialization}</span>
            </div>

            <div className='mt-1 flex items-center text-sm text-muted-foreground'>
              <Clock className='mr-1 h-4 w-4 flex-shrink-0' />
              <span>{doctor.yearsOfExperience} năm kinh nghiệm</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-4 pt-0'>
        {/* Consultation Fee */}
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Phí tư vấn:</span>
          <span className='font-semibold text-primary'>{formatCurrency(doctor.consultationFee)}</span>
        </div>

        {/* Contact Info */}
        <div className='space-y-2'>
          <div className='flex items-center text-sm text-muted-foreground'>
            <Mail className='mr-2 h-4 w-4 flex-shrink-0' />
            <span className='truncate'>{doctor.user.email}</span>
          </div>

          {doctor.user.phoneNumber && (
            <div className='flex items-center text-sm text-muted-foreground'>
              <Phone className='mr-2 h-4 w-4 flex-shrink-0' />
              <span>{doctor.user.phoneNumber}</span>
            </div>
          )}
        </div>

        {/* Education - truncated */}
        {doctor.education && (
          <div>
            <p className='line-clamp-2 text-sm text-muted-foreground'>{doctor.education}</p>
          </div>
        )}

        {/* Biography - truncated */}
        {doctor.biography && (
          <div>
            <p className='line-clamp-3 text-sm text-muted-foreground'>{doctor.biography}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex space-x-2 pt-2'>
          <Button variant='outline' size='sm' onClick={() => onViewDetails(doctor)} className='flex-1'>
            <User className='mr-2 h-4 w-4' />
            Xem chi tiết
          </Button>

          {showBookButton && doctor.isAvailable && onBookAppointment && (
            <Button size='sm' onClick={() => onBookAppointment(doctor)} className='flex-1'>
              <Heart className='mr-2 h-4 w-4' />
              Đặt lịch
            </Button>
          )}
        </div>

        {/* Availability Status */}
        {!doctor.isAvailable && (
          <div className='pt-2 text-center'>
            <span className='inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
              Hiện không có lịch
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default DoctorCard
