const router = require('koa-router')()
// const config = require("../config.js")
// const rq = require("request-promise")
// const fs = require("fs")
const upload = require("../upload.js")

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})
router.post('/uploadBannerImg',upload.upload)

module.exports = router
