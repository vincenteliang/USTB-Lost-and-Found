import regeneratorRuntime from '../../utils/runtime';
const {
  $Message
} = require('../../dist/base/index');
var util = require('../../utils/util.js');
var app = getApp();

Page({

  data: {
    img_length: 0,
    tempFilePaths: [],
    // 选择器
    statuas: [{
      id: 1,
      name: '我丢失的',
    }, {
      id: 2,
      name: '我发现的'
    }],
    date_today: '',
    date: '',
    time: '',
    thingTypeArray: ['饭卡', '钥匙', '钱包', '书籍', '电脑', '其他'],
    thingKindArray: ['我丢失的', '我发现的'],
    thingTypeIndex: [],
    thingKindIndex: [],
    placeArray: [
      ['教学区', '宿舍区'],
      ['逸夫楼', '教学楼', '机电信息楼', '土木环境楼', '冶金楼']
    ],
    placeIndex: [],
    isOk: false,
    // 上传数据
    kind: 'lost',
    title: '',
    content: '',
    detail: '',
    category: '',
    Location0: '',
    Location1: '',
    date: '',
    time: '',
    phone: '',
    img_length: 0,
    imgList: [],
  },

  refresh: function() {
    console.log("执行函数: refresh");
    var self = this;
    self.setData({
      img_length: 0,
      tempFilePaths: [],
      // 选择器
      statuas: [{
        id: 1,
        name: '我丢失的',
      }, {
        id: 2,
        name: '我发现的'
      }],
      date_today: '',
      date: '',
      time: '',
      thingTypeArray: ['饭卡', '钥匙', '钱包', '书籍', '电脑', '其他'],
      thingKindArray: ['我丢失的', '我发现的'],
      thingTypeIndex: [],
      thingKindIndex: [],
      placeArray: [
        ['教学区', '宿舍区'],
        ['逸夫楼', '教学楼', '机电信息楼', '土木环境楼', '冶金楼']
      ],
      placeIndex: [],
      isOk: false,
      // 上传数据
      kind: 'lost',
      title: '',
      content: '',
      detail: '',
      category: '',
      Location0: '',
      Location1: '',
      date: '',
      time: '',
      phone: '',
      img_length: 0,
      imgList: [],
    });
  },

  onLoad: function() {
    console.log("执行函数: onLoad");
    if (app.globalData.api_token) {
      this.refresh();
      var DATE = util.formatDate(new Date());
      this.setData({
        date_today: DATE
      });
    } else {
      wx.switchTab({
        url: "/pages/user/user"
      });
    }
  },

  onShow: function() {
    if (!app.globalData.api_token) {
      wx.switchTab({
        url: "/pages/user/user"
      });
    }
  },

  // 单选框函数
  handleFruitChange({
    detail = {}
  }) {
    console.log("执行函数: handleFruitChange");
    var status = 0;
    if (detail.value == "我丢失的") {
      console.log('您选择了我丢失的')
      status = 'lost';
    } else if (detail.value == "我发现的") {
      console.log('您选择了我发现的')
      status = 'found';
    } else {
      console.log('radio errer')
    }
    this.setData({
      current: detail.value,
      status: status
    });
  },

  // 添加图片
  addImg: function() {
    var self = this;
    var item = '';
    this.data.tempFilePaths.length > 2 ? wx.showModal({
      content: "哎呦，超过三张图就放不下了≧﹏≦"
    }) : wx.chooseImage({
      count: 1,
      success: function(res) {
        console.log(res)
        if (res) { //需要改
          self.setData({
            tempFilePaths: self.data.tempFilePaths.concat(res.tempFilePaths),
            // img_length: self.data.tempFilePaths.length
          });
          console.log(self.data.img_length);
          console.log(self.data.tempFilePaths);
          self.upLoadImg(self.data.tempFilePaths[self.data.tempFilePaths.length - 1]);
        } else {
          // TODO 图片选择失败
        }
      }
    });
    // this.uploadimage();
    this.dataEditOk();
  },

  deleteAllImg: function(res) {
    var self = this;
    self.setData({
      tempFilePaths: [],
      img_length: 0
      // img_length: self.data.img_length-1,
    });
    this.dataEditOk();
  },

  upLoadImg: function(item) {
    console.log(item)
    var self = this;
    var api_token = app.globalData.api_token;
    console.log(app.globalData)
    wx.uploadFile({
      url: app.globalData.api + '/api/image',
      filePath: item,
      name: 'image',
      formData: {
        api_token: api_token
      },
      success(res) {
        var data = res.data;
        self.setData({
          imgList: self.data.imgList.concat(res.data)
        })
        console.log(self.data.imgList)
      }
    })
  },

  inputTitle: function(e) {
    this.setData({
      title: e.detail.value
    });
    this.dataEditOk();
  },

  inputDetail: function(e) {
    this.setData({
      detail: e.detail.value
    });
    this.dataEditOk();
  },

  selectThingType: function(e) {
    this.setData({
      thingTypeIndex: e.detail.value,
      category: this.data.thingTypeArray[e.detail.value],
    });
    this.dataEditOk();
  },

  selectThingKind: function(e) {
    this.setData({
      thingKindIndex: e.detail.value
    });
    if (e.detail.value == 0) {
      this.setData({
        kind: 'lost'
      });
    } else {
      this.setData({
        kind: 'found'
      });
    }
    this.dataEditOk();
  },

  placeChange: function(e) {
    this.setData({
      placeIndex: e.detail.value,
      Location0: [this.data.placeArray[0][e.detail.value[0]]],
      Location1: [this.data.placeArray[1][e.detail.value[1]]],
      // Location: [this.data.Location0, this.data.Location1]
    });
    this.dataEditOk();
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

  bindDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    });
    this.dataEditOk();
  },

  bindTimeChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    });
    this.dataEditOk();
  },

  inputContact: function(t) {
    var a = t.detail.value;
    /^1[0-9]{10}$/.test(a) || "" == a || wx.showToast({
      title: "请输入正确的手机号码",
      icon: "loading",
      duration: 1500
    });
  },

  inputPhone: function(t) {
    var a = this;
    a.setData({
      phone: t.detail.value
    }), a.dataEditOk();
  },

  onInputContact: function(t) {
    var a = this,
      e = t.detail.value,
      n = /^1[0-9]{10}$/;
    11 == e.length && n.test(e) && (a.setData({
      phone: e
    }), a.dataEditOk());
  },

  dataEditOk: function() {
    var self = this;
    if (self.data.title &&
      self.data.detail &&
      self.data.kind &&
      self.data.Location0 &&
      self.data.Location1 &&
      self.data.date &&
      self.data.time &&
      self.data.phone &&
      self.data.tempFilePaths
    ) {
      self.setData({
        isOk: true,
      });
    } else {
      self.setData({
        isOk: false,
      });
    }
  },

  // 发帖
  // 发帖
  // 发帖
  upLoadForm: function() {
    var self = this;
    wx.request({
      url: app.globalData.api + '/api/item',
      data: {
        kind: self.data.kind,
        title: self.data.title,
        detail: self.data.detail,
        category: self.data.category,
        location: [self.data.Location0, self.data.Location1],
        time: self.data.date + ' ' + self.data.time + ':01',
        phone: self.data.phone,
        imageList: self.data.imgList,
      },
      header: {
        'api-token': app.globalData.api_token
      },
      method: 'POST',
      success(res) {
        if (res.data.status) {
          self.upLoadSuccess();
          self.onLoad();
        } else {
          wx.showModal({
            title: '上传失败',
            content: res.data.error,
          })
        }
      }
    })
  },

  // 交互函数
  upLoadSuccess() {
    $Message({
      content: '上传成功',
      type: 'success'
    });
  },

})