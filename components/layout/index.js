const app = getApp()

Component({

  properties: {
    active: String
  },

  methods: {
    handleChange(e) {
      console.log(app)
      const routes = [
        '/pages/index/index',
        '/pages/index/index',
        '/pages/account/index',
      ]
      wx.navigateTo({
        url: routes[e.detail]
      })
    }
  }
  
})