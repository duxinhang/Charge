
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    userInfo: {
      nickname: '未授权',
      userImg: ''
    },

    listData: [
      {title: '我的记账', url: '../myuser/myuser'},
    ]
    // {title: '疫情监控', url: '../epidemic/epidemic'}

  },

  onShow: function () {

    //如果用户授权, 则获取用户信息
      wx.getUserInfo({
        success: res => {
          console.log(res)
          this.data.userInfo = {
            nickname: res.userInfo.nickName,
            userImg: res.userInfo.avatarUrl
          }

          this.setData({
            userInfo: this.data.userInfo
          })
        },
        catch:err=>{
          console.log(err,'err')
        }
      })
  },

  goPage: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  }
})