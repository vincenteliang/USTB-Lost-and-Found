var app = getApp();

Page({

  data: {
    itemList: [],
  },

  onLoad: function(options) {
    var self = this;
    wx.request({
      url: app.globalData.api + '/api/user/lost/list',
      method: 'GET',
      header: {
        'api-token': app.globalData.api_token
      },
      success: function(res) {
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
      url: '/pages/detail/detail?owner=true&id=' + id,
    })
    console.log(id)
  },
})