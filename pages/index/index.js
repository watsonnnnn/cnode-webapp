//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: ['999'],
    list: [1,2,3,4,5,6,7,8,9,10],
    types:{'ask':'问答','share':'分享','job':'工作','good':'精华'},
    hasRefresh:false,

    current:1
  },
  //事件处理函数
  bindViewTap: function() {
    console.log('viewtap')
  },
  clickItem(e){
    console.log('qqq',e)
    wx.navigateTo({url:'/pages/detail/index?id='+e.currentTarget.dataset.id})
  },
  onLoad() {
    console.log('onLoad')
    let that = this
    wx.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data:{
        limit:20,
        page:that.data.current
      },
      success(res){
        let data = res.data.data
        data.forEach(function(item){
          item.create_at = getApp().formatRelativeTime(item.create_at)
        })
        that.setData({ list: data})
      }
    })
  },
  onPullDownRefresh(){
    this.onLoad()
  }
})
