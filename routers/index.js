const router = require('koa-router')();
const request = require('superagent');
const checkSignature = require('../until');
const TOKEN='xuyan';
// 测试api接口
router.get('/', async (ctx, next) => {
  const query  = ctx.request.query;
  console.log(query);
  console.log("token :",TOKEN);
  if(!checkSignature(query,TOKEN)){
    //如果签名不对，结束请求并返回
    ctx.body = 'signature fail';
  }
  ctx.body = query.echostr;
});

module.exports = router;
