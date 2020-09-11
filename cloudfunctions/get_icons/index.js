// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 获取数据库引用
const db = cloud.database();
// aeait 需要配合 async 使用
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event,"event==>",context);
  try{
    // 查询数据库
    return await db.collection('iconsData').get();
  }catch(err){
    console.log("云函数出错=>",err);
  }

  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}