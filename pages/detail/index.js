import WxParse from '../../static/wxParse/wxParse.js'

Page({
  onLoad(){
    console.log('detail load')
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
        WxParse.wxParse('content','md',data.content,that)
        that.setData({detail: data})
      }
    })
  },
  backTonew(){
    console.log('tap')
    wx.navigateBack({delta:1})
  },
  onPullDownRefresh(){
    console.log('pull down')
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