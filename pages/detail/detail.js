var app = getApp();

Page({

  data: {
    id: 0,
    user_id: 1,
    title: 'title',
    is_occupied: 0,
    phone: '',
    browsed: 0,
    date: "date",
    detail: 'detail',
    images: [],
    owner: false
  },

  onLoad: function(options) {
    if (app.globalData.api_token) {
      var self = this;
      var id = options.id;
      var owner = options.owner;
      this.setData({
        id: id,
        owner: owner
      });
      var item = {};
      wx.request({
        url: app.globalData.api + '/api/item/' + id,
        header: {
          'api-token': app.globalData.api_token
        },
        method: 'GET',
        success: function(res) {
          self.setData({
            images: res.data.images,
            title: res.data.title,
            date: res.data.created_at,
            detail: res.data.info.description,
            phone: res.data.info.phone
          });
        }
      });
    } else {
      wx.switchTab({
        url: "/pages/user/user"
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (!app.globalData.api_token) {
      wx.switchTab({
        url: "/pages/user/user"
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})