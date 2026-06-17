export const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const getWeekDates = (date: Date = new Date()) => {
  const day = date.getDay()
  const diff = date.getDate() - day
  const monday = new Date(date.setDate(diff + 1))
  const dates: Date[] = []
  for (let i = 0; i < 7; i++) {
    dates.push(new Date(monday.getTime() + i * 24 * 60 * 60 * 1000))
  }
  return dates
}

export const formatDate = (date: Date) => {
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

export const formatTime = (timeStr: string) => {
  return timeStr.substring(0, 5)
}

export const calculateDuration = (startTime: string, endTime: string) => {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  const duration = (endHour - startHour) * 60 + (endMin - startMin)
  return duration / 60
}

export const isTimeOverlap = (
  time1Start: string,
  time1End: string,
  time2Start: string,
  time2End: string
) => {
  const t1s = time1Start.replace(':', '')
  const t1e = time1End.replace(':', '')
  const t2s = time2Start.replace(':', '')
  const t2e = time2End.replace(':', '')
  return !(t1e <= t2s || t2e <= t1s)
}

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
