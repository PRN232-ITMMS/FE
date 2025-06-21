import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X, SlidersHorizontal } from 'lucide-react'

export interface DoctorFilterState {
  searchQuery?: string
  specialization?: string
  availability?: boolean
  minExperience?: number
  maxFee?: number
  sortBy?: 'name' | 'experience' | 'rating' | 'fee'
  sortOrder?: 'asc' | 'desc'
}

interface DoctorFiltersProps {
  onSearch: (query: string) => void
  onFilter: (filters: DoctorFilterState) => void
  onClear: () => void
  loading?: boolean
}

const SPECIALIZATIONS = [
  'Sản phụ khoa',
  'Nam học',
  'Nội tiết sinh sản',
  'IVF/IUI',
  'Phẫu thuật nội soi',
  'Tâm lý điều trị',
  'Dinh dưỡng',
  'Y học cổ truyền',
]

const EXPERIENCE_OPTIONS = [
  { label: 'Dưới 5 năm', value: 0 },
  { label: '5-10 năm', value: 5 },
  { label: '10-15 năm', value: 10 },
  { label: 'Trên 15 năm', value: 15 },
]

const FEE_OPTIONS = [
  { label: 'Dưới 500k', value: 500000 },
  { label: '500k - 1M', value: 1000000 },
  { label: '1M - 2M', value: 2000000 },
  { label: 'Trên 2M', value: 5000000 },
]

export const DoctorFilters = ({ onSearch, onFilter, onClear, loading = false }: DoctorFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<DoctorFilterState>({})
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleFilterChange = (key: keyof DoctorFilterState, value: any) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value }
    setFilters(newFilters)
    onFilter(newFilters)
  }

  const handleClearAll = () => {
    setSearchQuery('')
    setFilters({})
    setShowAdvancedFilters(false)
    onClear()
  }

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.length > 0

  return (
    <div className='space-y-4 rounded-lg border bg-card p-4'>
      {/* Search Bar */}
      <form onSubmit={handleSearch} className='flex space-x-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground' />
          <Input
            placeholder='Tìm theo tên bác sĩ, chuyên môn...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-10'
            disabled={loading}
          />
        </div>
        <Button type='submit' size='sm' disabled={loading}>
          {loading ? 'Đang tìm...' : 'Tìm kiếm'}
        </Button>
      </form>

      {/* Quick Filters Row */}
      <div className='flex flex-wrap items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className='flex items-center'
        >
          <SlidersHorizontal className='mr-2 h-4 w-4' />
          Bộ lọc {showAdvancedFilters ? 'ẩn' : 'nâng cao'}
        </Button>

        {/* Quick filter buttons */}
        <Button
          variant={filters.availability === true ? 'default' : 'outline'}
          size='sm'
          onClick={() => handleFilterChange('availability', filters.availability === true ? undefined : true)}
          disabled={loading}
        >
          Có lịch
        </Button>

        <Button
          variant={filters.sortBy === 'rating' ? 'default' : 'outline'}
          size='sm'
          onClick={() => {
            const newSortBy = filters.sortBy === 'rating' ? undefined : 'rating'
            handleFilterChange('sortBy', newSortBy)
            if (newSortBy) handleFilterChange('sortOrder', 'desc')
          }}
          disabled={loading}
        >
          Đánh giá cao
        </Button>

        <Button
          variant={filters.sortBy === 'experience' ? 'default' : 'outline'}
          size='sm'
          onClick={() => {
            const newSortBy = filters.sortBy === 'experience' ? undefined : 'experience'
            handleFilterChange('sortBy', newSortBy)
            if (newSortBy) handleFilterChange('sortOrder', 'desc')
          }}
          disabled={loading}
        >
          Kinh nghiệm
        </Button>

        {hasActiveFilters && (
          <Button variant='ghost' size='sm' onClick={handleClearAll} disabled={loading}>
            <X className='mr-1 h-4 w-4' />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className='grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-2 lg:grid-cols-4'>
          {/* Specialization */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Chuyên môn</label>
            <Select
              value={filters.specialization || 'all'}
              onValueChange={(value) => handleFilterChange('specialization', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Tất cả chuyên môn' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả chuyên môn</SelectItem>
                {SPECIALIZATIONS.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Experience */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Kinh nghiệm</label>
            <Select
              value={filters.minExperience?.toString() || 'all'}
              onValueChange={(value) =>
                handleFilterChange('minExperience', value === 'all' ? undefined : parseInt(value))
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Tất cả kinh nghiệm' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả kinh nghiệm</SelectItem>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <SelectItem key={exp.value} value={exp.value.toString()}>
                    {exp.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fee Range */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Phí tư vấn</label>
            <Select
              value={filters.maxFee?.toString() || 'all'}
              onValueChange={(value) => handleFilterChange('maxFee', value === 'all' ? undefined : parseInt(value))}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Tất cả mức phí' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>Tất cả mức phí</SelectItem>
                {FEE_OPTIONS.map((fee) => (
                  <SelectItem key={fee.value} value={fee.value.toString()}>
                    {fee.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Sắp xếp theo</label>
            <Select
              value={filters.sortBy || 'name'}
              onValueChange={(value) => handleFilterChange('sortBy', value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder='Sắp xếp theo' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='name'>Tên A-Z</SelectItem>
                <SelectItem value='experience'>Kinh nghiệm</SelectItem>
                <SelectItem value='rating'>Đánh giá</SelectItem>
                <SelectItem value='fee'>Phí tư vấn</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2 border-t pt-2'>
          <span className='text-sm text-muted-foreground'>Bộ lọc đang áp dụng:</span>

          {searchQuery && (
            <span className='inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs text-primary'>
              Tìm kiếm: "{searchQuery}"
            </span>
          )}

          {filters.specialization && (
            <span className='inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
              {filters.specialization}
            </span>
          )}

          {filters.availability && (
            <span className='inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200'>
              Có lịch
            </span>
          )}

          {filters.minExperience && (
            <span className='inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900 dark:text-purple-200'>
              Từ {filters.minExperience} năm KN
            </span>
          )}

          {filters.sortBy && (
            <span className='inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800 dark:bg-orange-900 dark:text-orange-200'>
              Sắp xếp:{' '}
              {filters.sortBy === 'name'
                ? 'Tên'
                : filters.sortBy === 'experience'
                  ? 'Kinh nghiệm'
                  : filters.sortBy === 'rating'
                    ? 'Đánh giá'
                    : 'Phí'}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default DoctorFilters
