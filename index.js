'use strict'

const https = require('https')
const AWS = require('aws-sdk')


exports.handler = (event, context, callback) => {
    console.log('EVENT:', event)
    if (event.payload.channels && event.payload.channels[1].value > 40) {
        //LINE BOT SEND
        const params = {
            TableName: 'line_user_id',
            KeyContitionExpression: "#PartitionKey = :partition"
        }

        var postata = JSON.stringify({
            'messages': [{
                'type': 'text',
                'text': `臭い: ${event.payload.channels[1].value}`
            }],
            'to': 'Ua3fb0b553167fb6aef02f3c07f787ca7'
        })

        var ChannelAccessToken = 'zTQ2T7ySLtuHVt0UWFWi0SRNNhak06Edk6bzvTtfc36hD0OLMKIrfU2+d7u2bA+5Q/mTRnWn8zzcmV000WfUwbY4TZGbN7SNpWNKnHYHIthR2WSd3TVzZ9pX04T+ircRWnwnbIocpqYIE/7xjGTGOgdB04t89/1O/w1cDnyilFU='

        var options = {
            hostname: 'api.line.me',
            path: '/v2/bot/message/push',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData),
                'Authorization': 'Bearer ' + ChannelAccessToken
            },
            method: 'POST'
        }

        var req = https.request(options, function(res) {
            res.setEncoding('utf-8')
            res.on('data', function(body) {
                console.log(`data: ${body}`)
                context.succeed('handler complete')
            })
        }).on('error', function(error){
            console.log(`error: ${error}`)
            context.done('error', error)
        })

        req.on('error', function(e) {
            var message = "通知に失敗しました. LINEから次のエラーが返りました: " + e.message;
            console.error(message);
            context.fail(message);
        })

        req.write(postData)
        req.on('data', function(body) {
            console.log(body)
        })
        req.end()
        callback(null, 'Success!')
    } else {
        callback(null, 'No events')
    }
}