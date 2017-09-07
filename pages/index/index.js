//index.js
//获取应用实例
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
    tab:''
  },
  onShow(){
    console.log('onshow')
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
    this.animation.translateX(270).step()
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
    this.setData({tab:r})
    this.requestItemsEmpty(this,r)
  },
  requestItemsEmpty(that,page=1,tab='',limit=20){
    console.log(typeof page == 'string', typeof tab)
    if (page && typeof page == 'string' && tab == '') {
      tab = page
      page = 1
    }
    wx.request({
      url: 'https://cnodejs.org/api/v1/topics',
      data: {
        limit,
        page,
        tab: this.data.tab
      },
      success(res) {
        let data = res.data.data
        data.forEach(function (item) {
          item.create_at = getApp().formatRelativeTime(item.create_at)
        })
        that.setData({ list: data, loading: false },function(){
          console.log(wx.pageScrollTo)
          wx.pageScrollTo({
            scrollTop: 0
          })
        })
        
      }
    })
  },
  onPageScroll(e){
  console.log(e)
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
})
