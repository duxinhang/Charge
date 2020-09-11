// miniprogram/pages/chart/chart.js
import {utils} from '../../js/utils'

let wxCharts = require('../../js/wxcharts.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 日，月，年
    datetype:{
      title:['年','月','日'],
      list:2
    },
    //当前选择日期
    currentDate: '',
    // 收入支出
    pricetext:[
      {
        title:'收入',
        price:0,
        type:'shouru',
        isActive:true
      },
      {
        title:'支出',
        price:0,
        type:'zhichu',
        isActive:false
      }
    ],
    //开始日期-结束日期
    date: {
      start: '2019-01-01',
      end: ''
    },
    // 总数据
    datalist:[],
    // 收入数据
    shourulist:[],
    // 支出数据
    zhichulist:[],
    // 收入金额
    shouruprice:0,
    // 支出金额
    zhichuprice:0,
    //每月31号
    day31: ['01', '03', '05', '07', '08', '10', '12'],
    //canvas宽度
    canvasWidth: 0,
    isHas:true
  },

  onLoad(){
    this.getOnlineDate();
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    this.setData({
      currentDate:year + '-' + month + '-' + day
    })
    // if(this.data.datetype.list == 2){
    //   // 按日查询
    //   this.getRuserData(this.data.currentDate);
    //   // console.log(this.data.shouruprice);
    // }
    // this.getBookingDataByDate();

  },

  // 初始化日期
  onShow(){

    // if(this.data.datetype.list == 2){
    //   // 按日查询
    //   this.getRuserData(this.data.currentDate);
    // }
    //获取屏幕宽度
    const res = wx.getSystemInfoSync();

    this.setData({
      canvasWidth: res.screenWidth
    })

    this.getBookingDataByDate();

    
  },

  getOnlineDate(){
    this.setData({
      date:{
        start: '2019-01-01',
        end:utils.formatDate(new Date(), 'yyyy-MM-dd')
      }
    })
  },

  // 年月日
  addtype: function(){
    let datetype = this.data.datetype;
    datetype.list = datetype.list == datetype.title.length - 1 ? 0 : datetype.list + 1;
    this.setData({
      datetype
    })
    // 按日查询
    // if(this.data.datetype.list == 2){
    //   this.getRuserData(this.data.currentDate);
    // }
    this.getBookingDataByDate();
  },

  // 选择日期
  selectDate(e){
    if(this.data.currentDate !==  e.detail.value){
      this.setData({
        currentDate: e.detail.value
      })
      // if(this.data.datetype.list == 2){
      //   // 按日查询
      //   this.getRuserData(this.data.currentDate);
      // }
      this.getBookingDataByDate();
    }
  },

  // 切换收入支出
  toggleTitle(e){
    if(e.currentTarget.dataset.active){
      return
    }
    console.log(e.currentTarget.dataset.index)
    // for(let i=0;i<this.data.pricetext.length;i++){
      if(this.data.pricetext[e.currentTarget.dataset.index].price == 0){
        this.setData({
          isHas:false
        })
      }else{
        this.setData({
          isHas:true
        })
      }
    // }
    // if(this.data.pricetext[1].price == 0){
    //   // console.log("555",this.data.pricetext[1].price == 0)
    //   this.setData({
    //     isHas:false
    //   })
    //   // console.log(this.data.isHas)
    //   // this.drawPie(data)
    // }else{
    //   this.setData({
    //     isHas:true
    //   })
    // }

    for(let i=0;i<this.data.pricetext.length;i++){
      if(this.data.pricetext[i].isActive){
        this.data.pricetext[i].isActive = false;
        break;
      }
    }
    this.data.pricetext[e.currentTarget.dataset.index].isActive = true;

    this.setData({
      pricetext: this.data.pricetext
    })
    // if(this.data.datetype.list == 2){
    //   // 按日查询
    //   this.getRuserData(this.data.currentDate);
    // }
    this.getBookingDataByDate();

    
    //绘制饼图
    // console.log(this.data.pricetext[0].isActive,"ooo")
    // if(this.data.pricetext[0].isActive){
    //   this.drawPie(this.data.shourulist);
    // }else{
    //   this.drawPie(this.data.zhichulist);
    // }
  },

  //绘制饼图
  drawPie: function (data) {
    // console.log(data,"ppp");
    if (data.length == 0) {
      return;
    }
    new wxCharts({
      canvasId: 'pieCanvas',
      type: 'pie',

      //饼图数据
      series: data,
      width: this.data.canvasWidth,
      height: 300,
      dataLabel: true
    });
  },

  //根据日期查询记账数据 （年月日）
  getBookingDataByDate: function () {

    //获取当前日期
    let current = utils.formatDate(new Date(), 'yyyy-MM-dd');

    let date = current.split('-');
    

    let currentDate = this.data.currentDate.split('-');

    
    
    //start
    //end
    //日期条件范围
    let dateCondition = {
      start: '',
      end: ''
    }
    
    //按日查询, 条件 date = yyyy-MM-dd
    if (this.data.datetype.list == 2) {
      
      dateCondition.start = this.data.currentDate;

    } 
    else if (this.data.datetype.list == 1) {
      //按月查询, 条件 yyyy-MM-01 <= date <= yyyy-MM-dd

      dateCondition.start = currentDate[0] + '-' + currentDate[1] + '-01';

      //判断是否同年
      if (date[0] == currentDate[0]) {
        

        //同月
        if (date[1] == currentDate[1]) {
          dateCondition.end = current;
        } else {

          //不同月, 月的天数可能是 28, 29, 30, 31
          if (currentDate[1] == '02') {

            //判断年份是否为闰年
            if (currentDate[0] % 400 == 0 || (currentDate[0] % 4 == 0 && currentDate[0] % 100 != 0)) {
              dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-29';
            } else {
              dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-28';
            }
          } else {

            //不是2月份, 先判断是否为含有31号
            if (this.data.day31.indexOf(currentDate[1]) > -1) {
              dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-31';
            } else {
              dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-30';
            }


          }

        }

      } else {

        //不同年按月查询
        if (currentDate[1] == '02') {

          //判断年份是否为闰年
          if (currentDate[0] % 400 == 0 || (currentDate[0] % 4 == 0 && currentDate[0] % 100 != 0)) {
            dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-29';
          } else {
            dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-28';
          }
        } else {

          //不是2月份, 先判断是否为含有31号
          if (this.data.day31.indexOf(currentDate[1]) > -1) {
            dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-31';
          } else {
            dateCondition.end = currentDate[0] + '-' + currentDate[1] + '-30';
          }


        }


      }



    } else {
      //按年查询
      dateCondition.start = currentDate[0] + '-01-01';

      //判断是否同年
      if (date[0] == currentDate[0]) {
        //同年
        dateCondition.end = current;
      } else {
        //不同年
        dateCondition.end = currentDate[0] + '-12-31';
      }

    }

    

    // 根据日期查询和收入-支出类型查询记账数据
    // console.log(dateCondition);
    this.getRuserData(dateCondition);


  },

  // 按日查询
  getRuserData(date){
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    wx.cloud.callFunction({
      name: 'get_user_data',
      data: {
        start: date.start,
        end: date.end
      },
      success: res => {
        wx.hideLoading();
        // console.log(res,'res==>')
        this.setData({
          datalist:res.result.data
        })
        // console.log(this.data.datalist)
        if(this.data.datalist.length > 0){
          this.setData({
            shourulist:[],
            zhichulist:[]
          })
          // 遍历数据
          this.data.datalist.forEach(v=>{
            if(v.account.type == "shouru"){
              this.data.shourulist.push(v)
            }else{
              this.data.zhichulist.push(v)
            }
          })
          
          this.data.shouruprice = 0;

          // 遍历收入金额
          if(this.data.shourulist.length > 0){
            this.data.shourulist.forEach(v=>{
              this.data.shouruprice += Number(v.userInfo.price)
            })
          }
          
          this.setData({
            shouruprice:this.data.shouruprice
          })

          this.data.zhichuprice = 0;
          // 遍历支出金额
          if(this.data.zhichulist.length > 0){
            this.data.zhichulist.forEach(v=>{
              this.data.zhichuprice += Number(v.userInfo.price)
            })
          }

          this.setData({
            zhichuprice:this.data.zhichuprice
          })

          for(let i=0;i<this.data.pricetext.length;i++){
            if(i==0){
              this.data.pricetext[i].price = this.data.shouruprice;
            }else{
              this.data.pricetext[i].price = this.data.zhichuprice;
            }
          }

          this.setData({
            pricetext:this.data.pricetext
          })

          if(this.data.pricetext[0].isActive){
            // 收入-支出统计分类 (餐饮, 出行 ....)
            let type = []
            for(let key in this.data.shourulist){
              type.push(this.data.shourulist[key].type.title);
            }
            // 数组去重
            for(let i=0;i<type.length;i++){
              for(let j=i+1;j<type.length;j++){
                if(type[i] == type[j]){
                  type.splice(j,1);
                  j--
                }
              }
            }
            let ruserlist = [];
            ruserlist = this.data.shourulist;

            let arr = [];
            for(let i=0;i<type.length;i++){
              arr.push({
                title:type[i],
                list:[],
                src:'',
                price:0,
                ids:''
              })
            }
            for(let i=0;i<arr.length;i++){
              for(let j=0;j<ruserlist.length;j++){
                if(arr[i].title == ruserlist[j].type.title){
                  arr[i].list.push(ruserlist[j])
                  arr[i].src = ruserlist[j].type.url
                  arr[i].ids = ruserlist[j]._id
                }
              }
            }
            for(let i=0;i<arr.length;i++){
              arr[i].list.forEach(v=>{
                arr[i].price += Number(v.userInfo.price)
              })
            }
            this.data.shourulist = []
            arr.forEach(v=>{
              //随机生成颜色
              let rgb = [];
              for (let i = 0; i < 3; i++) {
                //在0-255之间生成随机数据
                let random = Math.ceil(Math.random() * 255);
                rgb.push(random);
              }
              rgb = 'rgb(' + rgb.join(',') + ')';
              let o = {
                shouru:[],
                //笔数
                count: 0,
                //当前类型总金额
                total: 0,
                //类型标题: 餐饮、出行、....
                title: '',
                //图标路径
                url: '',
                //收入-支出标题
                costTitle: '',
                //百分比
                percent: '',
                //记账的id集合
                ids: [],
                //饼图数据结构
                //总金额
                data: 0,
                //类型标题: 餐饮、出行、....
                name: '',
                //饼图块的颜色
                color: rgb,
                //格式化饼图文本内容
                format(value) {
                  return ' ' + this.name + ' ' + (value * 100).toFixed(3) + '% ';
                }
              };
              // console.log(arr)
              arr.forEach(v1=>{
                if(v.title == v1.title){
                  o.shouru.push(v1.list);
                  o.count = v.list.length;
                  o.total = v.price;
                  o.data = v.price;
                  for(let i=0;i<v1.list.length;i++){
                    o.ids.push(v1.list[i]._id);
                  }
                  if (o.shouru.length == 1) {
                    o.title = v1.title;
                    o.url = v1.src;
  
                    o.name = v1.title;
                    o.costTitle = '收入';
                  }
                }
              })
              o.percent = (o.total / this.data.shouruprice * 100).toFixed(2) + '%';

              o.total = utils.thousandthPlace(o.total.toFixed(2));

              o.ids = o.ids.join('-');

              this.data.shourulist.push(o);

              this.setData({
                shourulist:this.data.shourulist
              })
            })
            // console.log(this.data.shourulist)
            //绘制饼图
            this.drawPie(this.data.shourulist);

          }else{
            // 收入-支出统计分类 (餐饮, 出行 ....)
            let type = []
            for(let key in this.data.zhichulist){
              type.push(this.data.zhichulist[key].type.title);
            }
            // 数组去重
            for(let i=0;i<type.length;i++){
              for(let j=i+1;j<type.length;j++){
                if(type[i] == type[j]){
                  type.splice(j,1);
                  j--
                }
              }
            }
            // console.log(this.data.zhichulist,"zhichulist=>>")
            let ruserlist = [];
            ruserlist = this.data.zhichulist;

            let arr = [];
            for(let i=0;i<type.length;i++){
              arr.push({
                title:type[i],
                list:[],
                src:'',
                price:0,
                ids:''
              })
            }
            // console.log(ruserlist);
            for(let i=0;i<arr.length;i++){
              for(let j=0;j<ruserlist.length;j++){
                if(arr[i].title == ruserlist[j].type.title){
                  arr[i].list.push(ruserlist[j])
                  arr[i].src = ruserlist[j].type.url
                  arr[i].ids = ruserlist[j]._id
                }
              }
            }
            // console.log(arr);
            for(let i=0;i<arr.length;i++){
              arr[i].list.forEach(v=>{
                arr[i].price += Number(v.userInfo.price)
              })
            }
            // console.log(arr)
            this.data.zhichulist = []
            arr.forEach(v=>{
              //随机生成颜色
              let rgb = [];
              for (let i = 0; i < 3; i++) {
                //在0-255之间生成随机数据
                let random = Math.ceil(Math.random() * 255);
                rgb.push(random);
              }
              rgb = 'rgb(' + rgb.join(',') + ')';
              let o = {
                zhichu:[],
                //笔数
                count: 0,
                //当前类型总金额
                total: 0,
                //类型标题: 餐饮、出行、....
                title: '',
                //图标路径
                url: '',
                //收入-支出标题
                costTitle: '',
                //百分比
                percent: '',
                //记账的id集合
                ids: [],
                //饼图数据结构
                //总金额
                data: 0,
                //类型标题: 餐饮、出行、....
                name: '',
                //饼图块的颜色
                color: rgb,
                //格式化饼图文本内容
                format(value) {
                  return ' ' + this.name + ' ' + (value * 100).toFixed(3) + '% ';
                }
              };
              // console.log(arr)
              arr.forEach(v1=>{
                if(v.title == v1.title){
                  o.zhichu.push(v1.list);
                  o.count = v.list.length;
                  o.total = v.price;
                  o.data = v.price;
                  for(let i=0;i<v1.list.length;i++){
                    o.ids.push(v1.list[i]._id);
                  }
                  if (o.zhichu.length == 1) {
                    o.title = v1.title;
                    o.url = v1.src;
  
                    o.name = v1.title;
                    o.costTitle = '收入';
                  }
                }
              })
              o.percent = (o.total / this.data.zhichuprice * 100).toFixed(2) + '%';
              
              o.total = utils.thousandthPlace(o.total.toFixed(2));
              
              o.ids = o.ids.join('-');
              // console.log(o)
              this.data.zhichulist.push(o);

              this.setData({
                zhichulist:this.data.zhichulist
              })
              // console.log(this.data.zhichulist)
            })
            //绘制饼图
            this.drawPie(this.data.zhichulist);
          }
          
          
          

        }
        // for(let i=0;i<this.data.pricetext.length;i++){
        //   console.log(this.data.pricetext[i].isActive,this.data.pricetext[i].price)
        //   if(this.data.pricetext[i].isActive == true){
        //     if(this.data.pricetext[i].price == 0){
        //       this.setData({
        //         isHas:false
        //       })
        //     }else{
        //       this.setData({
        //         isHas:true
        //       })
        //     }
        //   }
        // }
      },
      fail: err => {
        wx.hideLoading();
        console.log('err ==> ', err);
      }
  })
  },

  //跳转
  tiaoz(e){
    //参数ID序列化
    let query = ''
    let ids = e.currentTarget.dataset.item.ids;
    let costTitle = e.currentTarget.dataset.item.costTitle;
    let name = e.currentTarget.dataset.item.name;
    let arr = {
      ids,
      costTitle,
      name,
    }
    for (let key in arr) {
      query += key + '=' + arr[key] + '&';
    }
    query = query.slice(0, -1);
    // console.log(query)

    //跳转到记账详情页面
    wx.navigateTo({
      url: '../detail/detail?' + query
    })
  }
})