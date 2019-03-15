var app = getApp();

Page({

  data: {
    itemList: [],
  },

  onLoad: function (options) {
    var self = this;
    wx.request({
      url: app.globalData.api + '/api/user/found/list',
      method: 'GET',
      header: {
        'api-token': app.globalData.api_token
      },
      success: function (res) {
        console.log('res.data')
        console.log(res.data)
        if (res.data.length) {
          self.setData({
            itemList: self.data.itemList.concat(res.data),
          });
        }
      }
    });
  },

  goToDetail: function (event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
    console.log(id)
  },
})