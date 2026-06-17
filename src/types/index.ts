export type CourseType = 'normal' | 'makeup' | 'temporary'
export type CourseStatus = 'scheduled' | 'completed' | 'canceled' | 'pending_makeup'
export type MakeupStatus = 'pending' | 'scheduled' | 'completed'

export interface Course {
  id: string
  name: string
  studentName: string
  startTime: string
  endTime: string
  dayOfWeek: number
  price: number
  type: CourseType
  status: CourseStatus
  createdAt: string
  updatedAt: string
}

export interface Adjustment {
  id: string
  courseId: string
  oldDay: number
  oldStartTime: string
  oldEndTime: string
  newDay: number
  newStartTime: string
  newEndTime: string
  reason: string
  createdAt: string
}

export interface Makeup {
  id: string
  courseId: string
  originalDate: string
  makeupDate?: string
  makeupStartTime?: string
  makeupEndTime?: string
  status: MakeupStatus
  createdAt: string
}

export interface IncomeRecord {
  id: string
  courseId: string
  amount: number
  date: string
  type: CourseType
  createdAt: string
}

export interface IncomeStats {
  monthlyTotal: number
  weeklyTotal: number
  totalCourses: number
  monthlyCourses: number
  weeklyCourses: number
}

export interface CoursePriceConfig {
  courseName: string
  price: number
}
