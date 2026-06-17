import { create } from 'zustand'
import type { Course, Adjustment, Makeup, IncomeRecord, IncomeStats } from '@/types'
import { mockCourses, mockAdjustments, mockMakeups, mockIncomeRecords } from '@/utils/mockData'
import { generateId } from '@/utils/helpers'

interface CourseStore {
  courses: Course[]
  adjustments: Adjustment[]
  makeups: Makeup[]
  incomeRecords: IncomeRecord[]
  selectedCourseId: string | null
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateCourse: (id: string, updates: Partial<Course>) => void
  deleteCourse: (id: string) => void
  adjustCourse: (courseId: string, oldDay: number, oldStartTime: string, oldEndTime: string, newDay: number, newStartTime: string, newEndTime: string, reason: string) => void
  markMakeupNeeded: (courseId: string) => void
  scheduleMakeup: (makeupId: string, date: string, startTime: string, endTime: string) => void
  completeCourse: (courseId: string) => void
  completeMakeup: (makeupId: string) => void
  setSelectedCourseId: (id: string | null) => void
  getIncomeStats: () => IncomeStats
  getCoursesByDay: (dayOfWeek: number) => Course[]
  checkConflict: (dayOfWeek: number, startTime: string, endTime: string, excludeId?: string) => boolean
}

export const useCourseStore = create<CourseStore>((set, get) => ({
  courses: mockCourses,
  adjustments: mockAdjustments,
  makeups: mockMakeups,
  incomeRecords: mockIncomeRecords,
  selectedCourseId: null,

  addCourse: (course) => {
    const now = new Date().toISOString().split('T')[0]
    const newCourse: Course = {
      ...course,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    }
    set((state) => ({ courses: [...state.courses, newCourse] }))
  },

  updateCourse: (id, updates) => {
    const now = new Date().toISOString().split('T')[0]
    set((state) => ({
      courses: state.courses.map((course) =>
        course.id === id ? { ...course, ...updates, updatedAt: now } : course
      ),
    }))
  },

  deleteCourse: (id) => {
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
      adjustments: state.adjustments.filter((adj) => adj.courseId !== id),
      makeups: state.makeups.filter((m) => m.courseId !== id),
    }))
  },

  adjustCourse: (courseId, oldDay, oldStartTime, oldEndTime, newDay, newStartTime, newEndTime, reason) => {
    const now = new Date().toISOString().split('T')[0]
    const adjustment: Adjustment = {
      id: generateId(),
      courseId,
      oldDay,
      oldStartTime,
      oldEndTime,
      newDay,
      newStartTime,
      newEndTime,
      reason,
      createdAt: now,
    }
    set((state) => ({
      adjustments: [...state.adjustments, adjustment],
      courses: state.courses.map((course) =>
        course.id === courseId
          ? { ...course, dayOfWeek: newDay, startTime: newStartTime, endTime: newEndTime, updatedAt: now }
          : course
      ),
    }))
  },

  markMakeupNeeded: (courseId) => {
    const now = new Date().toISOString().split('T')[0]
    const course = get().courses.find((c) => c.id === courseId)
    if (course) {
      const makeup: Makeup = {
        id: generateId(),
        courseId,
        originalDate: now,
        status: 'pending',
        createdAt: now,
      }
      set((state) => ({
        makeups: [...state.makeups, makeup],
        courses: state.courses.map((c) =>
          c.id === courseId ? { ...c, status: 'pending_makeup' as const, updatedAt: now } : c
        ),
      }))
    }
  },

  scheduleMakeup: (makeupId, date, startTime, endTime) => {
    const now = new Date().toISOString().split('T')[0]
    const makeup = get().makeups.find((m) => m.id === makeupId)
    if (makeup) {
      const dayOfWeek = new Date(date).getDay()
      const course = get().courses.find((c) => c.id === makeup.courseId)
      if (course) {
        const newCourse: Course = {
          ...course,
          id: generateId(),
          dayOfWeek,
          startTime,
          endTime,
          type: 'makeup',
          status: 'scheduled',
          createdAt: now,
          updatedAt: now,
        }
        set((state) => ({
          courses: [...state.courses, newCourse],
          makeups: state.makeups.map((m) =>
            m.id === makeupId
              ? { ...m, makeupDate: date, makeupStartTime: startTime, makeupEndTime: endTime, status: 'scheduled' as const }
              : m
          ),
        }))
      }
    }
  },

  completeCourse: (courseId) => {
    const now = new Date().toISOString().split('T')[0]
    const course = get().courses.find((c) => c.id === courseId)
    if (course && course.status === 'scheduled') {
      const incomeRecord: IncomeRecord = {
        id: generateId(),
        courseId,
        amount: course.price,
        date: now,
        type: course.type,
        createdAt: now,
      }
      set((state) => ({
        incomeRecords: [...state.incomeRecords, incomeRecord],
        courses: state.courses.map((c) =>
          c.id === courseId ? { ...c, status: 'completed' as const, updatedAt: now } : c
        ),
      }))
    }
  },

  completeMakeup: (makeupId) => {
    set((state) => ({
      makeups: state.makeups.map((m) =>
        m.id === makeupId ? { ...m, status: 'completed' as const } : m
      ),
    }))
  },

  setSelectedCourseId: (id) => {
    set({ selectedCourseId: id })
  },

  getIncomeStats: () => {
    const { courses, incomeRecords } = get()
    const now = new Date()
    const currentMonth = now.toISOString().substring(0, 7)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const weekStartStr = startOfWeek.toISOString().split('T')[0]

    const monthlyRecords = incomeRecords.filter((r) => r.date.startsWith(currentMonth))
    const weeklyRecords = incomeRecords.filter((r) => r.date >= weekStartStr)

    const monthlyCourses = courses.filter((c) => {
      const courseDate = new Date(c.createdAt)
      return courseDate.toISOString().substring(0, 7) === currentMonth && c.status === 'completed'
    })

    const weeklyCourses = courses.filter((c) => {
      const courseDate = new Date(c.createdAt)
      return courseDate.toISOString().split('T')[0] >= weekStartStr && c.status === 'completed'
    })

    return {
      monthlyTotal: monthlyRecords.reduce((sum, r) => sum + r.amount, 0),
      weeklyTotal: weeklyRecords.reduce((sum, r) => sum + r.amount, 0),
      totalCourses: courses.filter((c) => c.status === 'completed').length,
      monthlyCourses: monthlyCourses.length,
      weeklyCourses: weeklyCourses.length,
    }
  },

  getCoursesByDay: (dayOfWeek) => {
    return get().courses.filter((course) => course.dayOfWeek === dayOfWeek && course.status !== 'completed').sort((a, b) => a.startTime.localeCompare(b.startTime))
  },

  checkConflict: (dayOfWeek, startTime, endTime, excludeId) => {
    const courses = get().courses.filter((c) => c.id !== excludeId && c.dayOfWeek === dayOfWeek && c.status !== 'completed')
    return courses.some((course) => {
      return !(endTime <= course.startTime || startTime >= course.endTime)
    })
  },
}))
