import WxParse from '../../static/wxParse/wxParse.js'


Page({
  data:{
  },
  onLoad(){
    let cpage = getCurrentPages().slice(-1)
    console.log(cpage)
    if(!cpage || !cpage[0] || cpage[0].options.id == 'undefined'){
      wx.showToast({
        title: '参数错误',
        icon:"loading"
      })
      return false
    }
    let that = this
    wx.request({
      url: 'https://cnodejs.org/api/v1/topic/'+cpage[0].options.id,
      success(res){
        let data = res.data.data
        data.last_reply_at = getApp().formatRelativeTime(data.last_reply_at)
        data.replies.forEach(function(item,index){
          item.create_at_relative = getApp().formatRelativeTime(item.create_at)
          WxParse.wxParse('replyContent'+index, 'html', item.content, that)
        })
        WxParse.wxParse('content','md',data.content,that)
        that.setData({detail: data})
        console.log(that.data)
      }
    })
  },
  backTonew(){
    console.log('tap')
    wx.navigateBack({delta:1})
  },
  onPullDownRefresh(){
    this.onLoad()
  },
  onReachBottom(){
    console.log('reach bottom')
  },
  submit(){
    let id = getCurrentPages().slice(-1)[0].options.id
    let url = `https://cnodejs.org/api/v1/topic/${id}/replies`
    wx.request({
      url,
      method:'POST',
      content:this.data.inputValue,
      accesstoken:'token',
      success(res){
        console.log(res.statusCode)
        if(res.statusCode != 200){
          wx.showToast({
            title: '评论失败',
            icon: 'loading'
          })
        }else{
          wx.showToast({
            title: '评论成功'
          })
        }
      },
      fail(){
        wx.showToast({
          title: '评论失败',
          icon:'loading'
        })
      }
    })
    console.log('submit', this.data.inputValue)
  },
  beforesubmit(e){
    this.setData({inputValue: e.detail.value})
  }
})