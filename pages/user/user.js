var app = getApp();
const {
  $Toast
} = require('../../dist/base/index');
const {
  $Message
} = require('../../dist/base/index');

Page({
  data: {
    userInfo: {}, //微信自带，储存用户信息
    hasUserInfo: false, //微信自带，是否获取到了用户信息
    hasApiToken: false, //是否获取到了api_token
    canIUse: wx.canIUse('button.open-type.getUserInfo'), //微信自带函数
    email: '', //用户输入
    phone: '',
    isOk: false, //函数dataEditOk检查用户输入完成后设置为true
    login: false, //登陆时的网络状态，发送请求后设置为true，获得返回值后设置为false
    signup: false, //注册时
  },

  onLoad: function() {
    console.log("执行函数: onLoad");
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };

  },

  onShow: function() {
    if (!app.globalData.api_token) {
      $Message({
        content: '请先登陆/注册',
        type: 'warning'
      });
    }
  },

  getUserInfo: function(e) {
    console.log("执行函数: getUserInfo")
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 检查邮箱和手机是否已经填写完成
  dataEditOk: function() {
    console.log("执行函数: dataEditOk")
    var self = this;
    if (self.data.phone && self.data.email) {
      self.setData({
        isOk: true,
      });
    } else {
      self.setData({
        isOk: false,
      });
    }
  },

  // 用户登陆
  // 用户注册
  login: function(res) {
    console.log("执行函数: login")
    var self = this;
    self.dataEditOk();
    self.setData({
      login: true
    });
    if (self.data.isOk) {
      wx.login({
        success: function(res) {
          console.log(res)
          if (res.code) {
            wx.request({
              url: app.globalData.api + '/api/login',
              data: {
                code: res.code,
                name: self.data.userInfo.nickName,
                email: self.data.email,
                phone: self.data.phone,
              },
              method: 'POST',
              success(res) {
                console.log('post succcess res')
                console.log(res)
                if (res.statusCode == 200) {
                  self.setData({
                    api_token: res.data.message,
                    hasApiToken: true,
                    login: false
                  });
                  self.loginSuccess();
                  app.globalData.api_token = self.data.api_token;
                } else {
                  self.loginError();
                  console.log(res.data.errer);
                  self.setData({
                    login: false
                  });
                }
              }
            });
          } else {
            console.log('登录失败！')
            console.log(res.errMsg)
            self.setData({
              login: false
            });
          }
        }
      });
    } else {
      self.dataWarnning();
    }
    console.log(app.globalData)
  },
  signup: function(res) {
    console.log("执行函数: signup")
    var self = this;
    self.dataEditOk();
    self.setData({
      signup: true
    });
    if (self.data.isOk) {
      wx.login({
        success: function(res) {
          if (res.code) {
            wx.request({
              url: app.globalData.api + '/api/register',
              data: {
                code: res.code,
                name: self.data.userInfo.nickName,
                email: self.data.email,
                phone: self.data.phone,
              },
              method: 'POST',
              success(res) {
                if (res.data.status) {
                  self.setData({
                    api_token: res.data.message,
                    hasApiToken: true,
                    signup: false
                  });
                  self.signupSuccess();
                  app.globalData.api_token = self.data.api_token;
                } else {
                  self.signupError();
                  console.log(res.data.errer);
                  self.setData({
                    signup: false
                  });
                }
              }
            });
          } else {
            console.log('注册失败！' + res.errMsg)
            self.setData({
              signup: false
            });
          }
        }
      });
    } else {
      self.dataWarnning();
    }
  },

  // 用户输入
  // 用户输入
  inputEmail: function(e) {
    console.log(e.detail)
    this.setData({
      email: e.detail.detail.value
    });
    this.dataEditOk();
  },
  inputPhone: function(t) {
    var a = this,
      e = t.detail.detail.value,
      n = /^1[0-9]{10}$/;
    11 == e.length && n.test(e) && (a.setData({
      phone: e
    }), a.dataEditOk());
  },

  // 操作反馈提醒
  // 操作反馈提醒
  loginSuccess() {
    $Message({
      content: '登陆成功',
      type: 'success'
    });
    this.setData({
      login: false
    });
  },
  loginError() {
    $Toast({
      content: '登陆失败',
      type: 'error'
    });
    this.setData({
      login: false
    });
  },
  signupSuccess() {
    $Message({
      content: '注册成功',
      type: 'success'
    });
    this.setData({
      signup: false
    });
  },
  signupError() {
    $Toast({
      content: '注册失败',
      type: 'error'
    });
    this.setData({
      signup: false
    });
  },
  dataWarning() {
    $Toast({
      content: '请输入邮箱和电话',
      type: 'warning'
    });
    this.setData({
      login: false
    });
  },
})