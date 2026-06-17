import { useState } from 'react'
import { RefreshCw, AlertTriangle, X, Calendar } from 'lucide-react'
import { useCourseStore } from '@/store'
import { dayNames, formatTime } from '@/utils/helpers'
import type { Course } from '@/types'

function Adjust() {
  const { courses, adjustments, adjustCourse, checkConflict } = useCourseStore()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)

  const [formData, setFormData] = useState({
    newDay: 1,
    newStartTime: '09:00',
    newEndTime: '10:30',
    reason: '',
  })

  const availableCourses = courses.filter((c) => c.status === 'scheduled')

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course)
    setFormData({
      newDay: course.dayOfWeek,
      newStartTime: course.startTime,
      newEndTime: course.endTime,
      reason: '',
    })
    setShowModal(true)
    setHasConflict(false)
  }

  const handleCheckConflict = () => {
    if (!selectedCourse) return
    const conflict = checkConflict(
      formData.newDay,
      formData.newStartTime,
      formData.newEndTime,
      selectedCourse.id
    )
    setHasConflict(conflict)
  }

  const handleSubmit = () => {
    if (!selectedCourse || hasConflict) return

    adjustCourse(
      selectedCourse.id,
      selectedCourse.dayOfWeek,
      selectedCourse.startTime,
      selectedCourse.endTime,
      formData.newDay,
      formData.newStartTime,
      formData.newEndTime,
      formData.reason
    )

    setShowModal(false)
    setSelectedCourse(null)
    setFormData({
      newDay: 1,
      newStartTime: '09:00',
      newEndTime: '10:30',
      reason: '',
    })
    setHasConflict(false)
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">调课中心</h2>
        <p className="text-slate-500 mt-1">灵活调整课程时间，系统自动检测冲突</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">选择课程</h3>
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </div>

          {availableCourses.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              暂无待上课的课程
            </div>
          ) : (
            <div className="space-y-3">
              {availableCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleSelectCourse(course)}
                  className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                    selectedCourse?.id === course.id
                      ? 'border-primary bg-primary/5'
                      : 'border-slate-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${getCourseColor(course.type)} rounded-lg flex items-center justify-center`}>
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800">{course.name}</h4>
                      <p className="text-sm text-slate-500">{course.studentName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-800">
                      {dayNames[course.dayOfWeek]} {formatTime(course.startTime)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      course.type === 'normal' ? 'bg-blue-100 text-blue-600' :
                      course.type === 'makeup' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {getCourseBadge(course.type)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">调课记录</h3>
            <span className="text-sm text-slate-500">共 {adjustments.length} 条</span>
          </div>

          {adjustments.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              暂无调课记录
            </div>
          ) : (
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {adjustments.slice().reverse().map((adjustment) => {
                const course = courses.find((c) => c.id === adjustment.courseId)
                return (
                  <div key={adjustment.id} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-800">
                        {course?.name || '未知课程'}
                      </span>
                      <span className="text-sm text-slate-500">
                        {adjustment.createdAt}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>
                        {dayNames[adjustment.oldDay]} {formatTime(adjustment.oldStartTime)} - {formatTime(adjustment.oldEndTime)}
                      </span>
                      <RefreshCw className="w-4 h-4 text-primary" />
                      <span className="font-medium text-primary">
                        {dayNames[adjustment.newDay]} {formatTime(adjustment.newStartTime)} - {formatTime(adjustment.newEndTime)}
                      </span>
                    </div>
                    {adjustment.reason && (
                      <p className="mt-2 text-sm text-slate-500">
                        原因：{adjustment.reason}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedCourse && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowModal(false)
            setSelectedCourse(null)
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">调整课程时间</h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedCourse(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-500 mb-2">原课程信息</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${getCourseColor(selectedCourse.type)} rounded-lg flex items-center justify-center`}>
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-slate-800">{selectedCourse.name}</h4>
                  <p className="text-sm text-slate-600">
                    {selectedCourse.studentName} · {dayNames[selectedCourse.dayOfWeek]} {formatTime(selectedCourse.startTime)} - {formatTime(selectedCourse.endTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">新时间</label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={formData.newDay}
                    onChange={(e) => {
                      setFormData({ ...formData, newDay: Number(e.target.value) })
                      handleCheckConflict()
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {dayNames.map((name, index) => (
                      <option key={index} value={index}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    value={formData.newStartTime}
                    onChange={(e) => {
                      setFormData({ ...formData, newStartTime: e.target.value })
                      handleCheckConflict()
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <input
                    type="time"
                    value={formData.newEndTime}
                    onChange={(e) => {
                      setFormData({ ...formData, newEndTime: e.target.value })
                      handleCheckConflict()
                    }}
                    className="px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {hasConflict && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm">该时间段已有其他课程，请选择其他时间</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">调课原因（可选）</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={3}
                  placeholder="如：学生时间冲突"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={hasConflict}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  hasConflict
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                确认调课
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Adjust
