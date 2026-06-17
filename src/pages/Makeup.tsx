import { useState } from 'react'
import { Clock, AlertCircle, Calendar, X, CheckCircle } from 'lucide-react'
import { useCourseStore } from '@/store'
import { formatTime } from '@/utils/helpers'
import type { MakeupStatus } from '@/types'

function Makeup() {
  const { makeups, courses, scheduleMakeup, completeMakeup } = useCourseStore()
  const [selectedMakeup, setSelectedMakeup] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [filterStatus, setFilterStatus] = useState<MakeupStatus | 'all'>('all')

  const [formData, setFormData] = useState({
    makeupDate: '',
    makeupStartTime: '09:00',
    makeupEndTime: '10:30',
  })

  const filteredMakeups = makeups.filter((m) => {
    return filterStatus === 'all' || m.status === filterStatus
  })

  const handleSelectMakeup = (makeupId: string) => {
    setSelectedMakeup(makeupId)
    const makeup = makeups.find((m) => m.id === makeupId)
    if (makeup) {
      setFormData({
        makeupDate: makeup.makeupDate || '',
        makeupStartTime: makeup.makeupStartTime || '09:00',
        makeupEndTime: makeup.makeupEndTime || '10:30',
      })
    }
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!selectedMakeup || !formData.makeupDate) return

    scheduleMakeup(
      selectedMakeup,
      formData.makeupDate,
      formData.makeupStartTime,
      formData.makeupEndTime
    )

    setShowModal(false)
    setSelectedMakeup(null)
    setFormData({
      makeupDate: '',
      makeupStartTime: '09:00',
      makeupEndTime: '10:30',
    })
  }

  const getStatusText = (status: MakeupStatus) => {
    switch (status) {
      case 'pending':
        return '待安排'
      case 'scheduled':
        return '已安排'
      case 'completed':
        return '已完成'
      default:
        return ''
    }
  }

  const getStatusColor = (status: MakeupStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-600'
      case 'scheduled':
        return 'bg-blue-100 text-blue-600'
      case 'completed':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const pendingCount = makeups.filter((m) => m.status === 'pending').length
  const scheduledCount = makeups.filter((m) => m.status === 'scheduled').length
  const completedCount = makeups.filter((m) => m.status === 'completed').length

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">补课管理</h2>
        <p className="text-slate-500 mt-1">管理学生请假后的补课安排</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">待安排补课</p>
              <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已安排补课</p>
              <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">已完成补课</p>
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {(['all', 'pending', 'scheduled', 'completed'] as (MakeupStatus | 'all')[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterStatus === status
                ? 'bg-primary text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {status === 'all' ? '全部' : getStatusText(status)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">课程名称</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">学生</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">缺课日期</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">补课安排</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-600">状态</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredMakeups.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    暂无补课记录
                  </td>
                </tr>
              ) : (
                filteredMakeups.map((makeup) => {
                  const course = courses.find((c) => c.id === makeup.courseId)
                  return (
                    <tr key={makeup.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-course-makeup rounded-lg flex items-center justify-center">
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium text-slate-800">{course?.name || '未知课程'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{course?.studentName || '未知'}</td>
                      <td className="py-4 px-4 text-slate-600">{makeup.originalDate}</td>
                      <td className="py-4 px-4 text-slate-600">
                        {makeup.makeupDate ? (
                          <div>
                            <p>{makeup.makeupDate}</p>
                            <p className="text-sm text-slate-500">
                              {formatTime(makeup.makeupStartTime || '')} - {formatTime(makeup.makeupEndTime || '')}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">未安排</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(makeup.status)}`}>
                          {getStatusText(makeup.status)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          {makeup.status === 'pending' && (
                            <button
                              onClick={() => handleSelectMakeup(makeup.id)}
                              className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-light transition-colors"
                            >
                              安排补课
                            </button>
                          )}
                          {makeup.status === 'scheduled' && (
                            <button
                              onClick={() => {
                                completeMakeup(makeup.id)
                              }}
                              className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                            >
                              完成补课
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedMakeup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowModal(false)
            setSelectedMakeup(null)
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">安排补课</h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setSelectedMakeup(null)
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-slate-500 mb-2">补课课程</p>
              {(() => {
                const makeup = makeups.find((m) => m.id === selectedMakeup)
                const course = courses.find((c) => c.id === makeup?.courseId)
                return (
                  <div>
                    <h4 className="font-medium text-slate-800">{course?.name}</h4>
                    <p className="text-sm text-slate-600">
                      {course?.studentName} · 缺课日期：{makeup?.originalDate}
                    </p>
                  </div>
                )
              })()}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">补课日期</label>
                <input
                  type="date"
                  value={formData.makeupDate}
                  onChange={(e) => setFormData({ ...formData, makeupDate: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">开始时间</label>
                  <input
                    type="time"
                    value={formData.makeupStartTime}
                    onChange={(e) => setFormData({ ...formData, makeupStartTime: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">结束时间</label>
                  <input
                    type="time"
                    value={formData.makeupEndTime}
                    onChange={(e) => setFormData({ ...formData, makeupEndTime: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!formData.makeupDate}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  !formData.makeupDate
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                确认安排
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Makeup
