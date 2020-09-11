// miniprogram/pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookingData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    //截取查询参数
    let ids = options.ids;
    wx.setNavigationBarTitle({
      title: options.costTitle + '-' + options.name + '记账详情'
    })
    this.getBooingDataById(ids);
  },

  //根据id查询记账数据
  getBooingDataById: function (ids) {

    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'get_user_id',
      data: {
        ids
      },
      success: res => {
        wx.hideLoading();
        this.setData({
          bookingData: res.result.data
        })
        console.log(this.data.bookingData)
      },
      fail: err => {
        wx.hideLoading();
      }
    })

  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})