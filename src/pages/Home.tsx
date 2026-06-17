import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, DollarSign, BookOpen, AlertCircle, CheckCircle } from 'lucide-react'
import { useCourseStore } from '@/store'
import { dayNames, getWeekDates, formatTime } from '@/utils/helpers'
import type { Course } from '@/types'

function Home() {
  const { courses, getIncomeStats, completeCourse, markMakeupNeeded, getCoursesByDay } = useCourseStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  const weekDates = getWeekDates(currentDate)
  const today = new Date()
  const todayDayOfWeek = today.getDay()

  const stats = getIncomeStats()

  const todayCourses = courses.filter(
    (c) => c.dayOfWeek === todayDayOfWeek && c.status !== 'completed'
  )

  const todayIncome = todayCourses.reduce((sum, c) => sum + c.price, 0)

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const handleNextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const getCourseColor = (type: Course['type']) => {
    switch (type) {
      case 'normal':
        return 'bg-course-normal'
      case 'makeup':
        return 'bg-course-makeup'
      case 'temporary':
        return 'bg-course-temporary'
      default:
        return 'bg-gray-400'
    }
  }

  const getCourseBadge = (type: Course['type']) => {
    switch (type) {
      case 'normal':
        return '正常课'
      case 'makeup':
        return '补课'
      case 'temporary':
        return '临时课'
      default:
        return ''
    }
  }



  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">课表</h2>
          <p className="text-slate-500 mt-1">
            {weekDates[0].getFullYear()}年{weekDates[0].getMonth() + 1}月{weekDates[0].getDate()}日
            {' - '}
            {weekDates[6].getMonth() + 1}月{weekDates[6].getDate()}日
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevWeek}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">今日课程</p>
              <p className="text-2xl font-bold text-slate-800">{todayCourses.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">今日收入</p>
              <p className="text-2xl font-bold text-slate-800">¥{todayIncome}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">本月已完成</p>
              <p className="text-2xl font-bold text-slate-800">{stats.monthlyCourses}节</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100">
          {weekDates.map((date, index) => {
            const isToday =
              date.getDate() === today.getDate() &&
              date.getMonth() === today.getMonth() &&
              date.getFullYear() === today.getFullYear()
            return (
              <div
                key={index}
                className={`p-3 text-center border-r border-slate-100 last:border-r-0 ${
                  isToday ? 'bg-primary text-white' : 'bg-slate-50'
                }`}
              >
                <p className={`text-sm font-medium ${isToday ? 'text-white/80' : 'text-slate-500'}`}>
                  {dayNames[index]}
                </p>
                <p className={`text-lg font-bold ${isToday ? 'text-white' : 'text-slate-800'}`}>
                  {date.getDate()}
                </p>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-7 min-h-[400px]">
          {weekDates.map((_, dayIndex) => {
            const dayCourses = getCoursesByDay(dayIndex)
            return (
              <div
                key={dayIndex}
                className="border-r border-slate-100 last:border-r-0 p-2 min-h-[400px]"
              >
                {dayCourses.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-slate-300 text-sm">暂无课程</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayCourses.map((course) => (
                      <div
                        key={course.id}
                        onClick={() => setSelectedCourse(course)}
                        className={`${getCourseColor(course.type)} text-white rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                            {getCourseBadge(course.type)}
                          </span>
                          {course.status === 'pending_makeup' && (
                            <span className="text-xs bg-red-500/80 px-2 py-0.5 rounded">
                              需补课
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-sm">{course.name}</h4>
                        <p className="text-xs text-white/80 mt-1">{course.studentName}</p>
                        <p className="text-xs text-white/80 mt-1">
                          {formatTime(course.startTime)} - {formatTime(course.endTime)}
                        </p>
                        <p className="text-xs font-medium mt-1">¥{course.price}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {selectedCourse && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setSelectedCourse(null)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">课程详情</h3>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${getCourseColor(selectedCourse.type)} rounded-lg flex items-center justify-center`}>
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{selectedCourse.name}</h4>
                  <span className="text-xs text-slate-500">{getCourseBadge(selectedCourse.type)}</span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">学生</span>
                  <span className="font-medium text-slate-800">{selectedCourse.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">时间</span>
                  <span className="font-medium text-slate-800">
                    {dayNames[selectedCourse.dayOfWeek]} {formatTime(selectedCourse.startTime)} - {formatTime(selectedCourse.endTime)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">课酬</span>
                  <span className="font-medium text-green-600">¥{selectedCourse.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">状态</span>
                  <span className={`font-medium ${
                    selectedCourse.status === 'scheduled' ? 'text-blue-600' :
                    selectedCourse.status === 'completed' ? 'text-green-600' :
                    selectedCourse.status === 'pending_makeup' ? 'text-orange-600' : 'text-gray-600'
                  }`}>
                    {selectedCourse.status === 'scheduled' ? '待上课' :
                     selectedCourse.status === 'completed' ? '已完成' :
                     selectedCourse.status === 'pending_makeup' ? '待补课' : '已取消'}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                {selectedCourse.status === 'scheduled' && (
                  <>
                    <button
                      onClick={() => {
                        markMakeupNeeded(selectedCourse.id)
                        setSelectedCourse(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-orange-100 text-orange-600 rounded-lg font-medium hover:bg-orange-200 transition-colors"
                    >
                      <AlertCircle className="w-5 h-5" />
                      标记补课
                    </button>
                    <button
                      onClick={() => {
                        completeCourse(selectedCourse.id)
                        setSelectedCourse(null)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      完成课程
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
