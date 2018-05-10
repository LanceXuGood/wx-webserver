const router = require('koa-router')();
const request = require('superagent');
const {
  sqlData
} = require('../until/index');
// 测试api接口
router.get('/', async (ctx, next) => {
  ctx.body = {
    data: "成功",
    status: 200
  };
});


module.exports = router;
