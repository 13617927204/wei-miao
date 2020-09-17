const config = require("./config")
const rq = require("request-promise")
const fs = require("fs") 
 
 var upload =async function  (ctx, next) {
    var files = ctx.request.files;
    var file = files.file // 文件的二进制内容
    // console.log(file);
    try {
        // 详细介绍请登录guthup 查询request-promise
        // https://github.com/request/request-promise

        // 第一步：发起请求，拿到微信小程序全局唯一接口调用凭据access_token
        var options1 = {
            method: 'get',
            uri: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.appid}&secret=${config.secret}`,
            json: true // 自动将正文字符串为JSON
        };
        let { access_token } = await rq(options1)// 发起请求，得到微信小程序全局唯一接口调用凭据access_token
        // console.log(access_token)


        //第二步：发起请求，获取获取文件上传链接
        let fileName = Date.now() + ".jpg";// 上传文件存储后的名字，按照当时的时间戳来定义文件的名字
        let filePath = `banner/${fileName}`; // 上传文件存储后的路径
        var options2 = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/uploadfile?access_token=${access_token}`,
            body: {
                "env": "shenan-hello-ymfpu",//云平台的环境ID
                "path": filePath //文件上传后存储的路径
            },
            json: true // 自动将正文字符串为JSON
        };
        let res = await rq(options2)// 发起请求，获取文件上传的相关信息
        // console.log(res)


        // 第三步：发起请求，上传文件到云开发平台的存储当中
        var options3 = {
            method: 'POST',
            uri: res.url,
            formData: {
                'Signature': res.authorization,
                'key': filePath,//请求包中的 path 字段
                'x-cos-security-token': res.token,
                'x-cos-meta-fileid': res.cos_file_id,
                'file': {//文件的二进制内容
                    value: fs.createReadStream(file.path),// 文件的dizhi
                    options: {
                        filename: fileName,// 文件的名字
                        contentType: fileName.type,//文件的类型
                    }
                }
            },
            headers: {
                /* 'content-type': 'multipart/form-data' */ // Is set automatically
            }
        };
        let ress = await rq(options3)// 发起请求 ，上传文件到云开发控制台


        // 第四步：将上传的文件存入到数据库当中
        let file_id = res.file_id// 拿到文件上传到云控制平台存储位置的fild id
        var options4 = {
            method: 'POST',
            uri: `https://api.weixin.qq.com/tcb/databaseadd?access_token=${access_token}`,
            body: {
                "env": "shenan-hello-ymfpu",//云平台的环境ID
                "query": `db.collection(\"banner\").add({data:{fildId:\"${file_id}\"}})`

            },
            json: true // 自动将正文字符串为JSON
        }
        var resss = await rq(options4)//发起请求
        console.log(resss)


        ctx.body = {//给前端的反馈信息
            msg: 0,
            start: '上传成功'
        }

    } catch (err) {
        console.log(err.stact)
    }
}

module.exports = {
    upload
}