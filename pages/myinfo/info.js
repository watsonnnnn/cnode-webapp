import moment from '../../utils/moment.js'

Page({
  onLoad(){
    wx.setNavigationBarTitle({
      title: getApp().globalData.userInfo.loginname,
    })
  },
  onShow(){
    let url = 'https://cnodejs.org/api/v1/user/' + getApp().globalData.userInfo.loginname
    let that = this
    wx.request({
      url,
      success(res){
        res.data.data.create_moment_at = moment('2016-11-14T06:07:35.238Z').format('YYYY-MM-DD HH:mm:ss')
        res.data.data.recent_replies.forEach(function(item,index){
          item.last_reply_fromNow = getApp().formatRelativeTime(item.last_reply_at)
        })
        that.setData({
          user: res.data.data
        })
      }
    })
  },
  logout(){
    getApp().globalData.userInfo = null
    getApp().globalData.accessToken = null
    wx.redirectTo({
      url: '/pages/index/index',
    })
  }
})