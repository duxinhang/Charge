// miniprogram/pages/charge/charge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 收入/支出
    list:[
      {
        title:"收入",
        type:"shouru",
        isActive:true
      },
      {
        title:"支出",
        type:"zhichu",
        isActive:false
      }
    ],
    // 账户选择
    account:[
      {
        title:'现金',
        isActive:true
      },
      {
        title:'支付宝',
        isActive:false
      },
      {
        title:'微信',
        isActive:false
      },
      {
        title:'信用卡',
        isActive:false
      },
      {
        title:'储蓄卡',
        isActive:false
      },
    ],
    // 图标数据
    icons:[],
    // 日期,金额,备注
    userInfo:{
      date:'选择日期',
      price:'',
      comment:''
    },
    times:"2020-09-01"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIconData();
    let time = new Date();
    // console.log(time.getFullYear(),time.getMonth() + 1,time.getDate())
    // console.log(util.formatTime(new Date()),"8888");
    this.setData({
      times:time.getFullYear() + "-" + time.getMonth() + 1 + "-" + time.getDate()
    })
  },

  // 切换标签
  addios: function(e){
    // e ==> 事件对象
    // console.log("e==>",e.currentTarget.dataset.key);
    // 判断当前已激活，拦截
    if(e.currentTarget.dataset.active){
      return
    };
    let data = this.data[e.currentTarget.dataset.key];
    // 清除激活标签
    for(let i=0;i<data.length;i++){
      if(data[i].isActive){
        data[i].isActive = false;
        break;
      }
    }
    // 激活当前标签
    data[e.currentTarget.dataset.index].isActive = true;
    // 设置页面响应数据
    this.setData({
      [e.currentTarget.dataset.key]:data
    })
  },

  // 获取图标数据
  getIconData: function(){

    // 调用云函数【get_icons】
    wx.cloud.callFunction({
      // 云函数名称
      name:'get_icons',
      // 成功执行回调函数
      success:res=>{
        this.setData({
          icons:res.result.data
        })
        // console.log("res==>",this.data.icons);
      },
      fail:err=>{
        console.log("出错了[get_icons]==>",err);
      }
    })
  },

  // 日期,金额,备注
  userInfo(e){
    let userInfo = this.data.userInfo;
    userInfo[e.currentTarget.dataset.key] = e.detail.value;
    this.setData({
      userInfo
    })
  },

  // 提交
  addlist(){
    let userList = {}

    // 验证收入/支出
    for(let i=0;i<this.data.list.length;i++){
      if(this.data.list[i].isActive){
        userList.account = {
          title:this.data.list[i].title,
          type:this.data.list[i].type
        };
        break;
      }
    }

    // 验证选择类型
    for(let i=0;i<this.data.icons.length;i++){
      if(this.data.icons[i].isActive){
        userList.type = {
          title:this.data.icons[i].title,
          name:this.data.icons[i].name,
          url:this.data.icons[i].url
        };
        break;
      }
    }

    // 账户选择
    for(let i=0;i<this.data.account.length;i++){
      if(this.data.account[i].isActive){
        userList.text = {
          title:this.data.account[i].title
        };
        break;
      }
    }

    //验证日期和金额是否填写
    if (this.data.userInfo.date == '选择日期') {
      wx.showToast({
        title: '选择日期',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    if (this.data.userInfo.price == '') {
      wx.showToast({
        title: '请输入金额',
        icon: 'none',
        duration: 2000
      })
      return;
    }

    // 日期 金额 备注
    userList.userInfo = Object.assign({}, this.data.userInfo);

    console.log("userList",userList)

     // 保存数据到云函数
    this.adduserList(userList);

    // 上传成功后初始化数据
    this.setData({
      userInfo:{
        date:'选择日期',
        price:'',
        comment:''
      }
    })
  },

  // 保存数据到云函数
  adduserList(data){
    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'user_list',
      data,
      success:res => {
        wx.hideLoading();
        // console.log('res==>',res);
      },
      fail:err => {
        wx.hideLoading();
        console.log('err==>',err)
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