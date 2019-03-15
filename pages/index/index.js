const {
  $Message
} = require('../../dist/base/index');
var app = getApp();

Page({

  data: {
    lostPage: 2,
    foundPage: 2,
    url: '/api',
    visibleNetErrer: false,
    noData: false,
    hasData: true,
    loading: true,
    noMore: true,
    index: 'lost',
    actions: [{
        name: '我想看别人丢失的',
      },
      {
        name: '我想看别人捡到的'
      }
    ],
    itemLostList: [],
    itemFoundList: [],
    placeIndex: [],
    placeArray: [
      ['教学区', '宿舍区'],
      ['逸夫楼', '教学楼', '机电信息楼', '土木环境楼', '冶金楼']
    ],
    Location0: '',
    Location1: '',
  },

  onLoad: function(options) {
    console.log("执行函数: onLoad");
    if (this.data.itemLostList) {
      this.setData({
        hasData: false,
        noData: true
      });
    } else {
      this.setData({
        noData: false,
        hasData: true
      });
    }
    this.load('lost');
    this.load('found');
  },

  load: function(index) {
    console.log("执行函数: load");
    var self = this;
    self.setData({
      url: '/api',
      loading: false,
    });
    wx.login({
      success: function(res) {
        if (res.code) {
          wx.request({
            url: app.globalData.api + self.data.url + '/item?type=' + index + '&page=1&num=6',
            method: 'GET',
            success: function(res) {
              console.log(res)
              if (res) {
                // if (self.data.index == 'lost') {
                //   self.data.lostPage++;
                // } else {
                //   self.data.foundPage++;
                // }
                self.setData({
                  loading: true,
                  noData: true,
                  hasData: false,
                  visibleNetErrer: false,
                  // visibleStatus: true
                });
                if (index == 'lost') {
                  self.setData({
                    itemLostList: self.data.itemLostList.concat(res.data)
                  });
                } else {
                  self.setData({
                    itemFoundList: self.data.itemFoundList.concat(res.data)
                  });
                };
                // console.log(self.data.itemList)
              } else {
                // 加载失败
                wx.showModal({
                  title: '登陆失败',
                  // content: res.data.error,
                })
                self.setData({
                  noData: false,
                  hasData: true,
                  visibleNetErrer: false
                });
              }
            }
          });
        } else {
          console.log('获取失败！' + res.errMsg)
        }
      }
    });
  },

  loadAgainLost: function() {
    console.log("执行函数: loadAgainLost");
    var self = this;
    self.setData({
      url: '/api',
      loading: false
    });
    wx.request({
      url: app.globalData.api + '/api/item?type=lost&page=' + self.data.lostPage + '&num=6',
      method: 'GET',
      success: function(res) {
        console.log(res)
        self.data.lostPage++;
        self.setData({
          itemLostList: self.data.itemLostList.concat(res.data),
          loading: true
        });
      }
    });
  },

  loadAgainFound: function () {
    console.log("执行函数: loadAgainFound");
    var self = this;
    self.setData({
      url: '/api',
      loading: false
    });
    wx.request({
      url: app.globalData.api + '/api/item?type=found&page=' + self.data.foundPage + '&num=6',
      method: 'GET',
      success: function (res) {
        console.log(res)
        self.data.foundPage++;
        self.setData({
          itemFoundList: self.data.itemFoundList.concat(res.data),
          loading: true
        });
      }
    });
  },

  indexChange({
    detail
  }) {
    this.setData({
      index: detail.key
    });
  },

  placeChange: function(e) {
    var self = this;
    self.setData({
      placeIndex: e.detail.value,
      Location0: [this.data.placeArray[0][e.detail.value[0]]],
      Location1: [this.data.placeArray[1][e.detail.value[1]]],
      url: '/api/search/location/',
    });
    console.log(self.data)
    wx.request({
      url: app.globalData.api + self.data.url + self.data.index + '/' + self.data.Location1[0],
      method: 'GET',
      header: {
        'api-token': app.globalData.api_token
      },
      success: function(res) {
        self.setData({
          itemList: res.data
        });
      },
      fail: function(res) {
        itemList: []
      }
    });
  },

  placeColumnChange: function(e) {
    var data = {
      placeArray: this.data.placeArray,
      placeIndex: this.data.placeIndex,
    };
    data.placeIndex[e.detail.column] = e.detail.value;
    switch (data.placeIndex[0]) {
      case 0:
        data.placeArray[1] = ['逸夫楼', '教学楼', '机电信息楼', '土木环境楼', '冶金楼'];
        break;
      case 1:
        data.placeArray[1] = ['1斋', '2斋', '3斋', '4斋', '5斋', '6斋', '7斋', '8斋', '9斋', '10斋', '11斋', '12斋'];
        break;
    }
    this.setData(data);
  },

  inputKeyword: function(e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  searchKeyword: function() {
    var self = this;
    self.setData({
      url: '/api/search/keyword/'
    });
    wx.request({
      url: app.globalData.api + self.data.url + self.data.keyword,
      method: 'GET',
      header: {
        'api-token': app.globalData.api_token
      },
      success: function(res) {
        self.setData({
          itemList: res.data
        });
        console.log(self.data.keyword)
      },
      fail: function(res) {
        itemList: []
      }
    });
  },

  goToDetail: function(event) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + id,
    })
    console.log(id)
  },

  // 交互事件：关闭网络错误弹窗
  handleNetErrerClose() {
    this.setData({
      visibleNetErrer: true
    });
  },
})