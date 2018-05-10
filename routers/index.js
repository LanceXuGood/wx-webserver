const router = require('koa-router')();
const request = require('superagent');
const TOKEN = 'xuyan';
const {
  checkSignature
} = require('../until/index');
const { baseConfig } = require("../config");

// 测试api接口
router.get('/', async (ctx, next) => {
  const query = ctx.request.query;
  console.log(query);
  console.log("token :", TOKEN);
  if (!checkSignature(query, TOKEN)) {
    //如果签名不对，结束请求并返回
    ctx.body = 'signature fail';
  }
  ctx.body = query.echostr;
});
router.get('wx', async (ctx, next) => {
  ctx.body = "ok";
});

//获取asses_token
router.post('wx/jsSdk', async (ctx, next) =>{

  const access_tokenData = await request.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+baseConfig.appid+'&secret='+baseConfig.secret);
  console.log('成功获取access_token');
  const access_token = access_tokenData.body.access_token;
  const js_ticketData = await request.get('https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token='+access_token+'&type=jsapi');
  console.log(js_ticketData.body);
  //签名算法
  const nonce_str = baseConfig.nonce_str; // 密钥，字符串任意，可以随机生成
  const timestamp = new Date().getTime();// 时间戳
  const url = ctx.request.body.url; // 使用接口的url链接，不包含#后的内容

  // 将请求以上字符串，先按字典排序，再以'&'拼接，如下：其中j > n > t > u，此处直接手动排序
  const str = 'jsapi_ticket=' + js_ticketData.body.ticket + '&noncestr=' + nonce_str + '×tamp=' + timestamp + '&url=' + url;

  // 用sha1加密
  const sha1 = require("crypto").createHash('sha1');
  sha1.update(str);
  const signature = sha1.digest("hex");

  ctx.body={
    data:{
      appId: baseConfig.appid,
      timestamp: timestamp,
      nonceStr: nonce_str,
      signature: signature,
    },
    status: 200
  }
});

module.exports = router;
