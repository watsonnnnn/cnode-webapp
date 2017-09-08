//index.js
//获取应用实例
import moment from '../../utils/moment.js'
var app = getApp()
Page({
  data: {
    userInfo: ['999'],
    list: [],
    types:{'ask':'问答','share':'分享','job':'工作','good':'精华'},
    hasRefresh:false,

    current:1,
    menuanimation:{},
    loading:false,
    tab:'',
  },
  onShow(){
    console.log('onshow', moment('2016-11-14T06:07:35.238Z').format('YYYY-MM-DD HH:mm:ss'))
    let that = this
    wx.createSelectorQuery().select('#menu').boundingClientRect(function(rect){
      that.setData({menuWidth: rect.width})
    }).exec();
    let animation = wx.createAnimation({ duration:200})
    this.animation = animation
  },
  //事件处理函数
  bindViewTap: function() {
    console.log('viewtap')
  },
  openmenu(){
    this.animation.translateX(0).step()
    this.setData({
      menuanimation: this.animation.export(),menuOpened:true
    })
  },
  closemenu(){
    this.animation.translateX(this.data.menuWidth).step()
    this.setData({
      menuanimation: this.animation.export(),menuOpened:false
    })
  },
  clickItem(e){
    console.log('zi',e)
    if(!this.data.menuOpened){
      wx.navigateTo({url:'/pages/detail/index?id='+e.currentTarget.dataset.id})
    }else{
      this.closemenu()
    }
  },
  requestItemsEvent(e){
    // console.log(e.currentTarget.dataset.params)
    let r = e.currentTarget.dataset.params
    this.setData({ tab: r})
    this.closemenu()
    this.requestItemsEmpty(this,r)
  },
  requestItemsEmpty(that,page=1,tab='',limit=20){
    if (page && typeof page == 'string' && tab == '') {
      tab = page
      page = 1
    }
    wx.showLoading({
      title: '获取中...',
    })
    wx.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit,
        page,
        tab: this.data.tab
      },
      success(res) {
        let data = res.data.data

        if (wx.pageScrollTo) {
          wx.pageScrollTo({
            scrollTop: 0
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
          })
        }

        data.forEach(function (item) {
          item.create_at = getApp().formatRelativeTime(item.create_at)
        })
        that.setData({ list: data, loading: false },function(){
          
          wx.hideLoading()
        })
        
      }
    })
  },
  onPageScroll(e){
  // console.log(e)
  },
  requestItems(that,page=1,tab='',limit=20){
    console.log(typeof page == 'string', typeof tab)
    if(page && typeof page == 'string' && tab == ''){
      tab = page
      page = 1
    }
    wx.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit,
        page,
        tab:this.data.tab
      },
      success(res) {
        let data = res.data.data
        data.forEach(function (item) {
          item.create_at = getApp().formatRelativeTime(item.create_at)
        })
        that.setData({ list: [...that.data.list, ...data], loading: false })
      }
    })
  },
  onLoad() {
    console.log('onLoad')

    let token = wx.getStorageSync('token') || ''

    this.requestItems(this)
  },
  onPullDownRefresh(){
    this.requestItems(this)
  },
  onReachBottom(){
    console.log('reachbottom')
    this.setData({loading: true})
    this.requestItems(this, this.data.current+1)
  },
  login(){
    let that = this
    wx.showModal({
      title:'提示',
      content:'PC端登陆cnodejs.org后，扫描设置页面的Access Token二维码即可完成登陆',
      confirmText:'我知道了',
      confirmColor:'#3157F0',
      // showCancel:false,
      success(res){
        if(res.confirm){
          wx.scanCode({
            onlyFromCamera: true,
            success(res) {
              // console.log(res,'========')
              that.setData({accessToken: res.result})
              getApp().globalData.accessToken = res.result
              wx.showLoading({
                title: '加载中...',
              })
              wx.request({
                url: 'https://cnodejs.org/api/v1/accesstoken',
                data: { accesstoken: res.result},
                method: 'POST',
                success(res){
                  console.log(res,'+++++')
                  wx.hideLoading()
                  that.closemenu()
                  getApp().globalData.userInfo = res.data
                  that.setData({userInfo: res.data})
                },
                fail(){
                  wx.showToast({
                    title: '失败',
                    icon: 'loading',
                    duration: 2000
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  clickme(){
    wx.navigateTo({
      url: "/pages/myinfo/info"
    })
    this.closemenu()
  }
})
