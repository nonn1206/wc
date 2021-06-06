// https://toiletwc.herokuapp.com/
import linebot from 'linebot'
import dotenv from 'dotenv'
import axios from 'axios'
// 若要用line flex 套件可用fs除錯
// import fs from 'fs'

dotenv.config()

// lat1 點 1 的緯度
// lon1 點 1 的經度
// lat2 點 2 的緯度
// lon2 點 2 的經度
// unit 單位，不傳是英里，K 是公里，N 是海里
// const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
//   if (lat1 === lat2 && lon1 === lon2) {
//     return 0
//   } else {
//     const radlat1 = (Math.PI * lat1) / 180
//     const radlat2 = (Math.PI * lat2) / 180
//     const theta = lon1 - lon2
//     const radtheta = (Math.PI * theta) / 180
//     let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta)
//     if (dist > 1) {
//       dist = 1
//     }
//     dist = Math.acos(dist)
//     dist = (dist * 180) / Math.PI
//     dist = dist * 60 * 1.1515
//     if (unit === 'K') {
//       dist = dist * 1.609344
//     }
//     if (unit === 'N') {
//       dist = dist * 0.8684
//     }
//     return dist
//   }
// }
// 讓套件讀取.env檔案
// 讀取後可以用process.env.變數 使用
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
})

bot.listen('/', process.env.PORT, () => {
  console.log('機器人啟動')
})

bot.on('message', async event => {
  if (event.message.type === 'text') {
    try {
      const response = await axios.get('https://data.epa.gov.tw/api/v1/fac_p_28?limit=1000&api_key=9be7b239-557b-4c10-9775-78cadfc555e9&format=json')

      const data = response.data.records.filter(data => {
        return data.Village === event.message.text
      })

      let reply = ''
      for (const d of data) {
        reply += `場所:${d.Name} \n地址:${d.Address}\n\n`
      }
      if (reply.length === 0) {
        reply = 'SORRY\n附近沒有公廁QQ\n請確定您輸入的地址在臺北市'
      }
      event.reply(reply)
    } catch (error) {
      // console.log(error)
      event.reply('error')
    }
  }
  // else if(event.message.type === 'location'){
  //   try {
  // let reply = ''
  //     const data = await axios.get('https://data.epa.gov.tw/api/v1/fac_p_21?limit=1000&api_key=9be7b239-557b-4c10-9775-78cadfc555e9&format=json')
  // https://developers.line.biz/en/reference/messaging-api/#audio-message
  //     const km = distance(d.經度,d.緯度,enent.message.latitude,enent.message.longitude)
  // 設定尋找範圍
  //  if(km<=0.5){
  //   reply += `場所:${d.Name} \n地址:${d.Address}\n\n`
  // }
  //   if(reply.length === 0)reply = '查無此地'){

  //     })
  // }
})
