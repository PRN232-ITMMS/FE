import { queryKeys } from '@/lib/query-client'
import DashboardLayout from '@/layouts/DashboardLayout'
import Breadcrumb from '@/components/ui/breadcrumb'
import { LoadingPage } from '@/components/ui/loading'
import useDocumentTitle from '@/hooks/useDocumentTitle'
import { useAuthStore } from '@/stores/auth.store'
import { MedicalHistoryForm } from '@/components/dashboard/MedicalHistoryForm'
import { EmergencyContactForm } from '@/components/dashboard/EmergencyContactForm'
import { ProfileForm } from '@/components/dashboard/ProfileForm'
import { MedicalDocuments } from '@/components/dashboard/MedicalDocuments'
import { useQuery } from '@tanstack/react-query'
import { medicalHistoryApi, emergencyContactsApi } from '@/apis/medical.api'
import { useState } from 'react'
import {
  Activity,
  Calendar,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  User,
  Heart,
  Phone,
  FileText as FileIcon,
} from 'lucide-react'

const Dashboard = () => {
  const { profile } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'medical' | 'emergency' | 'documents'>('overview')

  useDocumentTitle({ title: 'Tổng quan - ITM System' })

  // Fetch medical history
  const { data: medicalHistory = [], refetch: refetchMedicalHistory } = useQuery({
    queryKey: queryKeys.medicalHistory(profile?.id || 0),
    queryFn: () => medicalHistoryApi.getAll(profile!.id),
    enabled: !!profile?.id,
  })

  // Fetch emergency contacts
  const { data: emergencyContacts = [], refetch: refetchEmergencyContacts } = useQuery({
    queryKey: queryKeys.emergencyContacts(profile?.id || 0),
    queryFn: () => emergencyContactsApi.getAll(profile!.id),
    enabled: !!profile?.id,
  })

  if (!profile) {
    return <LoadingPage message='Đang tải thông tin...' />
  }

  // Mock data for demo
  const getCustomerStats = () => [
    {
      title: 'Chu kỳ điều trị hiện tại',
      value: 'IVF - Chu kỳ 2',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Lịch hẹn sắp tới',
      value: '3 cuộc hẹn',
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Ngày điều trị tiếp theo',
      value: '15/06/2025',
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Tiến độ chu kỳ',
      value: '65%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]

  const getDoctorStats = () => [
    {
      title: 'Bệnh nhân hôm nay',
      value: '12 bệnh nhân',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Cuộc hẹn trong tuần',
      value: '45 cuộc hẹn',
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Chu kỳ đang theo dõi',
      value: '23 chu kỳ',
      icon: FileText,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Tỷ lệ thành công',
      value: '78%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]

  const getManagerStats = () => [
    {
      title: 'Tổng bệnh nhân',
      value: '1,234',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Cuộc hẹn hôm nay',
      value: '89',
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Chu kỳ đang hoạt động',
      value: '156',
      icon: Activity,
      color: 'text-orange-600',
      bg: 'bg-orange-100 dark:bg-orange-900/20',
    },
    {
      title: 'Doanh thu tháng',
      value: '2.4 tỷ VNĐ',
      icon: TrendingUp,
      color: 'text-purple-600',
      bg: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ]

  const getStats = () => {
    switch (profile.role) {
      case 2:
        return getDoctorStats() // Doctor
      case 3:
      case 4:
        return getManagerStats() // Manager/Admin
      default:
        return getCustomerStats() // Customer
    }
  }

  const stats = getStats()

  const getRecentActivities = () => {
    if (profile.role === 1) {
      // Customer
      return [
        {
          icon: CheckCircle2,
          title: 'Hoàn thành xét nghiệm máu',
          description: 'Kết quả đã được cập nhật vào hồ sơ',
          time: '2 giờ trước',
          color: 'text-green-600',
        },
        {
          icon: Calendar,
          title: 'Lịch hẹn khám được xác nhận',
          description: 'Ngày 18/06/2025 lúc 9:00 AM với BS. Nguyễn Văn A',
          time: '1 ngày trước',
          color: 'text-blue-600',
        },
        {
          icon: FileText,
          title: 'Bắt đầu giai đoạn kích thích buồng trứng',
          description: 'Chu kỳ IVF lần 2 - Giai đoạn 1',
          time: '3 ngày trước',
          color: 'text-purple-600',
        },
      ]
    } else {
      return [
        {
          icon: CheckCircle2,
          title: 'Hoàn thành khám cho bệnh nhân',
          description: 'Nguyễn Thị B - Tư vấn IUI lần đầu',
          time: '30 phút trước',
          color: 'text-green-600',
        },
        {
          icon: AlertCircle,
          title: 'Kết quả xét nghiệm cần xem xét',
          description: 'Trần Văn C - Hormone AMH thấp',
          time: '1 giờ trước',
          color: 'text-orange-600',
        },
        {
          icon: Calendar,
          title: 'Lịch hẹn mới được đặt',
          description: 'Lê Thị D - Khám tái khám sau IVF',
          time: '2 giờ trước',
          color: 'text-blue-600',
        },
      ]
    }
  }

  const activities = getRecentActivities()

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Grid */}
            <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
              {stats.map((stat, index) => (
                <div key={index} className='rounded-lg border bg-card p-6'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium text-muted-foreground'>{stat.title}</p>
                      <p className='mt-2 text-2xl font-bold text-foreground'>{stat.value}</p>
                    </div>
                    <div className={`rounded-full p-3 ${stat.bg}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities & Quick Actions */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {/* Activities */}
              <div className='rounded-lg border bg-card p-6'>
                <h3 className='mb-4 text-lg font-semibold text-foreground'>Hoạt động gần đây</h3>
                <div className='space-y-4'>
                  {activities.map((activity, index) => (
                    <div key={index} className='flex items-start space-x-3'>
                      <div className={`rounded-full bg-background p-2`}>
                        <activity.icon className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className='min-w-0 flex-1'>
                        <p className='text-sm font-medium text-foreground'>{activity.title}</p>
                        <p className='text-sm text-muted-foreground'>{activity.description}</p>
                        <p className='mt-1 text-xs text-muted-foreground'>{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className='rounded-lg border bg-card p-6'>
                <h3 className='mb-4 text-lg font-semibold text-foreground'>Thao tác nhanh</h3>
                <div className='space-y-3'>
                  {profile.role === 1 ? (
                    <>
                      <button className='w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent'>
                        <div className='flex items-center space-x-3'>
                          <Calendar className='h-5 w-5 text-primary' />
                          <div>
                            <p className='font-medium'>Đặt lịch hẹn</p>
                            <p className='text-sm text-muted-foreground'>Đặt lịch khám với bác sĩ</p>
                          </div>
                        </div>
                      </button>
                      <button className='w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent'>
                        <div className='flex items-center space-x-3'>
                          <FileText className='h-5 w-5 text-primary' />
                          <div>
                            <p className='font-medium'>Xem kết quả xét nghiệm</p>
                            <p className='text-sm text-muted-foreground'>Kiểm tra kết quả mới nhất</p>
                          </div>
                        </div>
                      </button>
                    </>
                  ) : (
                    <>
                      <button className='w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent'>
                        <div className='flex items-center space-x-3'>
                          <Users className='h-5 w-5 text-primary' />
                          <div>
                            <p className='font-medium'>Danh sách bệnh nhân</p>
                            <p className='text-sm text-muted-foreground'>Xem bệnh nhân hôm nay</p>
                          </div>
                        </div>
                      </button>
                      <button className='w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent'>
                        <div className='flex items-center space-x-3'>
                          <Activity className='h-5 w-5 text-primary' />
                          <div>
                            <p className='font-medium'>Báo cáo thống kê</p>
                            <p className='text-sm text-muted-foreground'>Xem báo cáo hiệu suất</p>
                          </div>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )

      case 'medical':
        return (
          <div className='rounded-lg border bg-card p-6'>
            <MedicalHistoryForm medicalHistory={medicalHistory} onUpdate={refetchMedicalHistory} />
          </div>
        )

      case 'profile':
        return (
          <div className='rounded-lg border bg-card p-6'>
            <ProfileForm onUpdate={() => {}} />
          </div>
        )

      case 'emergency':
        return (
          <div className='rounded-lg border bg-card p-6'>
            <EmergencyContactForm emergencyContacts={emergencyContacts} onUpdate={refetchEmergencyContacts} />
          </div>
        )

      case 'documents':
        return (
          <div className='rounded-lg border bg-card p-6'>
            <MedicalDocuments onUpdate={() => {}} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className='space-y-6 p-6'>
        {/* Breadcrumb */}
        <Breadcrumb />

        {/* Welcome Section */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold text-foreground'>Xin chào, {profile.fullName}!</h1>
          <p className='text-muted-foreground'>
            {profile.role === 1
              ? 'Theo dõi tiến trình điều trị và quản lý thông tin cá nhân'
              : profile.role === 2
                ? 'Quản lý bệnh nhân và lịch làm việc hôm nay'
                : 'Tổng quan hoạt động hệ thống và báo cáo'}
          </p>
        </div>

        {/* Tab Navigation - Only show for customers */}
        {profile.role === 1 && (
          <div className='border-b'>
            <nav className='flex space-x-8'>
              <button
                onClick={() => setActiveTab('overview')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className='flex items-center space-x-2'>
                  <Activity className='h-4 w-4' />
                  <span>Tổng quan</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className='flex items-center space-x-2'>
                  <User className='h-4 w-4' />
                  <span>Thông tin cá nhân</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('medical')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'medical'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className='flex items-center space-x-2'>
                  <Heart className='h-4 w-4' />
                  <span>Tiền sử bệnh lý</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('emergency')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'emergency'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className='flex items-center space-x-2'>
                  <Phone className='h-4 w-4' />
                  <span>Liên hệ khẩn cấp</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`border-b-2 px-1 py-2 text-sm font-medium ${
                  activeTab === 'documents'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className='flex items-center space-x-2'>
                  <FileIcon className='h-4 w-4' />
                  <span>Tài liệu y tế</span>
                </div>
              </button>
            </nav>
          </div>
        )}

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </DashboardLayout>
  )
}

export default Dashboard
