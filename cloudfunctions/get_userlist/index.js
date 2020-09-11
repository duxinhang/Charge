// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

//获取查询指令引用
const db = cloud.database();

const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {

  console.log(event,"event>==999");
  try{
    return await db.collection('userData').where({
      userInfo:{
        date:_.gte(event.start).and(_.lte(event.end))
      }
    }).get();
  }catch(err){
    console.log(err,"err222")
  }
  // const wxContext = cloud.getWXContext()

  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}