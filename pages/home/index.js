//index.js
//获取应用实例
const app = getApp()
const axios = require('axios')

Component({
  data: {

  },
  async ready() {
    const data = await axios.get('http://localhost/bbs/?forum-15.htm?ajax=1')
    console.log(data)
  }
})
