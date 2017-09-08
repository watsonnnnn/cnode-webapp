import WxParse from '../../static/wxParse/wxParse.js'


Page({
  data:{
    replyContent:[],
    isEditing: false,
    inputValue: ''
  },
  onShow(){
    console.log('show detail')
  },
  onLoad(){
    console.log('onload')
    this.setData({canSubmit: !!getApp().globalData.accessToken})
    wx.showLoading({
      title: '加载中...',
    })
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
          WxParse.wxParse('replyContent', 'html', item.content, that,undefined,index)
        })
        // console.log(that.data, (that.data.replyContent)[1])
        WxParse.wxParse('content','md',data.content,that)
        that.setData({ detail: data, arr: [33, 66, 99]},function(){
          wx.hideLoading()
        })
        // console.log(that.data)
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
    if(!this.data.inputValue){
      wx.showToast({
        title: '内容为空',
        duration:200,
        icon:'loading'
      })
      return false
    }
    let that = this
    let id = getCurrentPages().slice(-1)[0].options.id
    let url = `https://cnodejs.org/api/v1/topic/${id}/replies`
    wx.request({
      url,
      method:'POST',
      data:{
        accesstoken: getApp().globalData.accessToken,
        content: this.data.inputValue,
      },
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
          that.onLoad()
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
    this.setData({ inputValue: ''})
  },
  beforesubmit(e){
    this.setData({inputValue: e.detail.value})
  },
  focus(){
    this.setData({isEditing: true})
  },
  blur() {
    this.setData({ isEditing: false })
  }
})