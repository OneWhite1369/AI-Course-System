import { useState } from 'react'
import ReactECharts from 'echarts-for-react'
import { DollarSign, TrendingUp, Calendar, BookOpen } from 'lucide-react'
import { useCourseStore } from '@/store'
import { generateMonthlyIncomeData } from '@/utils/mockData'

function Income() {
  const { getIncomeStats, incomeRecords, courses } = useCourseStore()
  const [timeRange, setTimeRange] = useState<'month' | 'week'>('month')

  const stats = getIncomeStats()
  const monthlyData = generateMonthlyIncomeData()

  const chartOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: {
        color: '#334155',
      },
      formatter: (params: { axisValue: string; marker: string; seriesName: string; value: number }[]) => {
        let result = `<div style="font-weight: 600; margin-bottom: 8px;">${params[0].axisValue}</div>`
        params.forEach((param) => {
          result += `<div style="display: flex; align-items: center; gap: 8px; margin: 4px 0;">${param.marker}<span>${param.seriesName}: ${param.value}</span></div>`
        })
        return result
      },
    },
    legend: {
      data: ['收入', '课程数'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: monthlyData.map((d) => {
        const [, month] = d.month.split('-')
        return `${month}月`
      }),
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      axisLabel: {
        color: '#64748b',
      },
    },
    yAxis: [
      {
        type: 'value',
        name: '收入(元)',
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#3b82f6',
          },
        },
        axisLabel: {
          color: '#64748b',
        },
        splitLine: {
          lineStyle: {
            color: '#f1f5f9',
          },
        },
      },
      {
        type: 'value',
        name: '课程数',
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#f97316',
          },
        },
        axisLabel: {
          color: '#64748b',
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '收入',
        type: 'line',
        smooth: true,
        data: monthlyData.map((d) => d.income),
        lineStyle: {
          color: '#3b82f6',
          width: 3,
        },
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' },
            ],
          },
        },
      },
      {
        name: '课程数',
        type: 'bar',
        data: monthlyData.map((d) => d.courses),
        barWidth: '40%',
        itemStyle: {
          color: '#f97316',
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  }

  const groupedRecords = incomeRecords.reduce((acc, record) => {
    const date = record.date
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(record)
    return acc
  }, {} as Record<string, typeof incomeRecords>)

  const sortedDates = Object.keys(groupedRecords).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

  const getTypeText = (type: string) => {
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'normal':
        return 'bg-blue-100 text-blue-600'
      case 'makeup':
        return 'bg-orange-100 text-orange-600'
      case 'temporary':
        return 'bg-green-100 text-green-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">收入统计</h2>
        <p className="text-slate-500 mt-1">实时查看您的课酬收入</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">本月收入</p>
              <p className="text-2xl font-bold text-green-600">¥{stats.monthlyTotal}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">本周收入</p>
              <p className="text-2xl font-bold text-blue-600">¥{stats.weeklyTotal}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">本月授课</p>
              <p className="text-2xl font-bold text-purple-600">{stats.monthlyCourses}节</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">累计授课</p>
              <p className="text-2xl font-bold text-orange-600">{stats.totalCourses}节</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">收入趋势</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === 'month'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              近6个月
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === 'week'
                  ? 'bg-primary text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              本周
            </button>
          </div>
        </div>
        <div className="h-[300px]">
          <ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">收入明细</h3>
        {sortedDates.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            暂无收入记录
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => {
              const dayRecords = groupedRecords[date]
              const dayTotal = dayRecords.reduce((sum, r) => sum + r.amount, 0)
              return (
                <div key={date} className="border-b border-slate-100 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-800">{date}</span>
                    </div>
                    <span className="font-bold text-green-600">+¥{dayTotal}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {dayRecords.map((record) => {
                      const course = courses.find((c) => c.id === record.courseId)
                      return (
                        <div
                          key={record.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-slate-800">{course?.name || '未知课程'}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor(record.type)}`}>
                                {getTypeText(record.type)}
                              </span>
                              <span className="text-xs text-slate-500">
                                {course?.studentName}
                              </span>
                            </div>
                          </div>
                          <span className="font-medium text-green-600">¥{record.amount}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default Income
