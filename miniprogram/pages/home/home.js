// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentDate:'',
    dateRange: {
      start: '',
      end: ''
    },
    userList:[],
    // 今日收入/支出
    priceList:{
      add:0,
      end:0
    },
    // 当月数据
    userInfo:{
      add:0,
      end:0
    },
    userData:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //控制日期范围，本月 01 - 当前
    let date = new Date();

    let year = date.getFullYear();

    let month = date.getMonth() + 1;
    month = month >= 10 ? month : '0' + month;

    let day = date.getDate();
    day = day >= 10 ? day : '0' + day;

    this.data.dateRange.start = year + '-' + month + '-01'
    this.data.dateRange.end = year + '-' + month + '-' + day

    this.setData({
      dateRange: this.data.dateRange,
      currentDate: month + '月' + day + '日'
    })

    console.log('this.data.dateRange ==> ', this.data.dateRange);
    
    this.getCurrentuserData(this.data.dateRange.end);

    this.getUserInfo();
  },

  // 选择日期
  selectDate:function(e){
    console.log(e);
    let date = e.detail.value.split('-');

    this.setData({
      currentDate: date[1] + '月' + date[2] + '日'
    })

    this.getCurrentuserData(e.detail.value);
  },

  // 查询当天数据
  getCurrentuserData:function(date){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name:'get_user',
      data:{
        date
      },
      success:res=>{
        wx.hideLoading();
        console.log('res==>999',res.result.data);
        
        // 收入/支出
        let add = 0;
        let end = 0;
        res.result.data.forEach(v => {
          if(v.account.type == 'shouru'){
            add += Number(v.userInfo.price);
          }else{
            end += Number(v.userInfo.price);
          }
        })

        // 设置数据
        this.setData({
          userList:res.result.data,
          priceList:{
            add,
            end
          }
        })
      },
      fail:err=>{
        wx.hideLoading();
        console.log('err==>',err);
      }
    })
  },

  // 查询当月数据
  getUserInfo:function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name:'get_userlist',
      data: this.data.dateRange,
      success:res=>{
        wx.hideLoading();
        console.log(this.data.dateRange,res,"res555")
        let add = 0;
        let end = 0;
        res.result.data.forEach(v => {
          if(v.account.type == 'shouru'){
            add += Number(v.userInfo.price)
          }else{
            end += Number(v.userInfo.price)
          }
        })
        let prices = add - end;
        this.setData({
          userInfo:{
            add,
            end
          },
          userData:prices
        })
        console.log(this.data.userInfo,"====");
      },
      fail:err=>{
        wx.hideLoading();
        console.log(err,"err444")
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
  // onShow: function () {
  //   console.log("55")
  // },

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