//app.js app.json中pages配置第一项为首页
import { formatRelativeTime } from './utils/util.js'

App({
  onLaunch() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  onShow(){
    console.log('show')
  },
  onHide(){
    console.log('hide')
  },
  globalData: {
    userInfo: null
  },
  formatRelativeTime
})
