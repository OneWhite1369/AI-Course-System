import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, X, BookOpen } from 'lucide-react'
import { useCourseStore } from '@/store'
import { dayNames, formatTime } from '@/utils/helpers'
import type { Course, CourseType, CourseStatus } from '@/types'

function Courses() {
  const { courses, addCourse, updateCourse, deleteCourse, checkConflict } = useCourseStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [filterType, setFilterType] = useState<CourseType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<CourseStatus | 'all'>('all')

  const [formData, setFormData] = useState({
    name: '',
    studentName: '',
    startTime: '09:00',
    endTime: '10:30',
    dayOfWeek: 1,
    price: 200,
    type: 'normal' as CourseType,
  })

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.studentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || course.type === filterType
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus
    return matchesSearch && matchesType && matchesStatus
  })

  const handleSubmit = () => {
    if (!formData.name || !formData.studentName) return

    const hasConflict = checkConflict(
      formData.dayOfWeek,
      formData.startTime,
      formData.endTime,
      editingCourse?.id
    )

    if (hasConflict) {
      alert('该时间段已有课程，请选择其他时间')
      return
    }

    if (editingCourse) {
      updateCourse(editingCourse.id, formData)
    } else {
      addCourse({ ...formData, status: 'scheduled' })
    }

    setShowModal(false)
    setEditingCourse(null)
    setFormData({
      name: '',
      studentName: '',
      startTime: '09:00',
      endTime: '10:30',
      dayOfWeek: 1,
      price: 200,
      type: 'normal',
    })
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      name: course.name,
      studentName: course.studentName,
      startTime: course.startTime,
      endTime: course.endTime,
      dayOfWeek: course.dayOfWeek,
      price: course.price,
      type: course.type,
    })
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这门课程吗？')) {
      deleteCourse(id)
    }
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

  const getStatusText = (status: Course['status']) => {
    switch (status) {
      case 'scheduled':
        return '待上课'
      case 'completed':
        return '已完成'
      case 'pending_makeup':
        return '待补课'
      case 'canceled':
        return '已取消'
      default:
        return ''
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">课程管理</h2>
          <p className="text-slate-500 mt-1">管理您的所有课程</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
        >
          <Plus className="w-5 h-5" />
          添加课程
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索课程名称或学生姓名..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as CourseType | 'all')}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">全部类型</option>
              <option value="normal">正常课</option>
              <option value="makeup">补课</option>
              <option value="temporary">临时课</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as CourseStatus | 'all')}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">全部状态</option>
              <option value="scheduled">待上课</option>
              <option value="completed">已完成</option>
              <option value="pending_makeup">待补课</option>
              <option value="canceled">已取消</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">课程名称</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">学生</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">时间</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">类型</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">课酬</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">状态</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    暂无课程
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="border-t border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${getCourseColor(course.type)} rounded-lg flex items-center justify-center`}>
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-slate-800">{course.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600">{course.studentName}</td>
                    <td className="py-4 px-4 text-slate-600">
                      {dayNames[course.dayOfWeek]} {formatTime(course.startTime)} - {formatTime(course.endTime)}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.type === 'normal' ? 'bg-blue-100 text-blue-600' :
                        course.type === 'makeup' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                      }`}>
                        {getCourseBadge(course.type)}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-medium text-green-600">¥{course.price}</td>
                    <td className="py-4 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        course.status === 'scheduled' ? 'bg-blue-100 text-blue-600' :
                        course.status === 'completed' ? 'bg-green-100 text-green-600' :
                        course.status === 'pending_makeup' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getStatusText(course.status)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowModal(false)
            setEditingCourse(null)
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">
                {editingCourse ? '编辑课程' : '添加课程'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingCourse(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">课程名称</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="如：数学一对一"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">学生姓名</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="如：张三"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">上课时间</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">下课时间</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">星期</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {dayNames.map((name, index) => (
                      <option key={index} value={index}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">课酬</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">课程类型</label>
                <div className="flex gap-2">
                  {(['normal', 'makeup', 'temporary'] as CourseType[]).map((type) => (
                    <button
                      key={type}
                      onClick={() => setFormData({ ...formData, type })}
                      className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                        formData.type === type
                          ? 'bg-primary text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {getCourseBadge(type)}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-light transition-colors"
              >
                {editingCourse ? '保存修改' : '添加课程'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Courses
