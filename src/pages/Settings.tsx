import { useState } from 'react'
import { User, Bell, Shield, Palette, HelpCircle, LogOut, ChevronRight, Plus, X } from 'lucide-react'

function Settings() {
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [priceConfigs, setPriceConfigs] = useState([
    { id: '1', courseName: '数学一对一', price: 200 },
    { id: '2', courseName: '英语一对一', price: 180 },
    { id: '3', courseName: '物理一对一', price: 220 },
    { id: '4', courseName: '化学一对一', price: 200 },
  ])

  const [newPriceConfig, setNewPriceConfig] = useState({
    courseName: '',
    price: 200,
  })

  const handleAddPriceConfig = () => {
    if (!newPriceConfig.courseName) return
    setPriceConfigs([
      ...priceConfigs,
      {
        id: Date.now().toString(),
        courseName: newPriceConfig.courseName,
        price: newPriceConfig.price,
      },
    ])
    setNewPriceConfig({ courseName: '', price: 200 })
    setShowPriceModal(false)
  }

  const handleDeletePriceConfig = (id: string) => {
    setPriceConfigs(priceConfigs.filter((config) => config.id !== id))
  }

  const settingGroups = [
    {
      title: '账号设置',
      items: [
        { icon: User, label: '个人信息', description: '修改姓名、头像等信息' },
        { icon: Shield, label: '安全设置', description: '修改密码、绑定手机号' },
      ],
    },
    {
      title: '通知设置',
      items: [
        { icon: Bell, label: '课表提醒', description: '课程开始前推送提醒' },
        { icon: Bell, label: '调课通知', description: '收到调课通知提醒' },
      ],
    },
    {
      title: '偏好设置',
      items: [
        { icon: Palette, label: '主题设置', description: '切换深色/浅色模式' },
      ],
    },
    {
      title: '帮助与支持',
      items: [
        { icon: HelpCircle, label: '使用帮助', description: '查看使用教程和FAQ' },
        { icon: HelpCircle, label: '反馈意见', description: '提交您的建议和问题' },
      ],
    },
  ]

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">设置</h2>
        <p className="text-slate-500 mt-1">管理您的账号和偏好设置</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {settingGroups.map((group) => (
            <div key={group.title} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">{group.title}</h3>
              </div>
              <div>
                {group.items.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-100">
              <h3 className="font-semibold text-slate-800">课程单价配置</h3>
              <button
                onClick={() => setShowPriceModal(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-light transition-colors"
              >
                <Plus className="w-4 h-4" />
                添加
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {priceConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{config.courseName}</p>
                      <p className="text-sm text-green-600">¥{config.price}/节</p>
                    </div>
                    <button
                      onClick={() => handleDeletePriceConfig(config.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-4 hover:bg-slate-50 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-600">退出登录</p>
                  <p className="text-sm text-slate-500">安全退出当前账号</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-1">张老师</h3>
            <p className="text-sm text-slate-500 mb-4">高级数学教师</p>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-500">注册时间</span>
                <span className="text-sm text-slate-800">2024-01-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-500">授课总量</span>
                <span className="text-sm text-slate-800">128节</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPriceModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPriceModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md mx-4 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">添加课程单价</h3>
              <button
                onClick={() => setShowPriceModal(false)}
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
                  value={newPriceConfig.courseName}
                  onChange={(e) => setNewPriceConfig({ ...newPriceConfig, courseName: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="如：语文一对一"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">单价（元/节）</label>
                <input
                  type="number"
                  value={newPriceConfig.price}
                  onChange={(e) => setNewPriceConfig({ ...newPriceConfig, price: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="200"
                />
              </div>

              <button
                onClick={handleAddPriceConfig}
                disabled={!newPriceConfig.courseName}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  !newPriceConfig.courseName
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                添加配置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
