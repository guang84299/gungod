const {ccclass, property} = cc._decorator;
var gg = window["gg"];
var wx = window["wx"];
var tt = window["tt"];
import { storage } from "./storage";
import { config } from "./config";


export const sdk = {
    bannerNum:0,
    isShowBanner: false,
    is_iphonex: function()
    {
        if(!this._initiphonex)
        {
            this._initiphonex = true;
            if(true) {
                var bl = (cc.view.getFrameSize().width / cc.view.getFrameSize().height);
                var bt = cc.view.getFrameSize().height/cc.view.getFrameSize().width;
                if (bl == (1125/2436) || bl == (1080/2280) || bl == (720/1520) || bl == (1080/2340) || bt > 2.0) {
                    this.isIphoneX = true;
                } else {
                    this.isIphoneX = false;
                }
            }
        }
        return this.isIphoneX;
    },

    vibrate: function(isLong)
    {
        if(storage.getStorage(storage.vibrate) == 1 && window["wx"])
        {
            if(isLong)
            {
                wx.vibrateLong({});
            }
            else
            {
                wx.vibrateShort({});
            }
        }
    },

    keepScreenOn: function()
    {
        if(window["wx"])
        {
            wx.setKeepScreenOn({
                keepScreenOn: true
            });
        }
    },

    uploadScore: function(score,callback)
    {
        if(window["wx"])
        {
            wx.postMessage({ message: "updateScore",score:Math.floor(score) });
            if(callback)
                callback();
        }
        else
        {
            if(callback)
                callback();
        }
    },

    openRank: function(worldrank)
    {
        if(window["wx"])
        {
            wx.postMessage({ message: "friendRank",worldrank:worldrank });
        }
    },
    closeRank: function()
    {
        if(window["wx"])
        {
            wx.postMessage({ message: "closeRank" });
        }
    },

    openFuhuoRank: function(score)
    {
        if(window["wx"])
        {
            //wx.postMessage({ message: "fuhuoRank",score:Math.floor(score) });
        }
    },
    closeFuhuoRank: function()
    {
        if(window["wx"])
        {
            //wx.postMessage({ message: "closeFuhuo" });
        }
    },

    getRankList: function(callback)
    {
        if(window["wx"])
        {
            if(callback)
                callback(null);
        }
        else
        {
            if(callback)
                callback(null);
        }
    },

    getChaoyueRank: function(callback,score)
    {
        var self = this;
        if(window["wx"])
        {
            if(callback)
                callback(null);
        }
        else
        {
            if(callback)
                callback(null);
        }
    },

    videoLoad: function()
    {
        var self = this;
        if(window["wx"])
        {
            this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId:config.getVideoId()});
            this.rewardedVideoAd.onLoad(function(){
                gg.GAME.hasVideo = true;
                console.log('激励视频 广告加载成功')
            });
            this.rewardedVideoAd.onClose(function(res){
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    if(self.videocallback)
                        self.videocallback(true);
                    gg.sdk.aldSendEvent("观看视频成功");    
                }
                else {
                    if(self.videocallback)
                        self.videocallback(false);
                    gg.res.showToast("视频未看完！");
                    gg.sdk.aldSendEvent("观看视频失败");
                }
                // if(gg.myscene == "main")
                gg.audio.playMusic(gg.res.audio_music);
                //storage.playMusic(cc.sdk.main.res.audio_mainBGM);
            });
            this.rewardedVideoAd.onError(function(res){
                gg.GAME.hasVideo = false;
                if(self.videocallback)
                {
                    self.videocallback(false);
                    gg.res.showToast("视频正在准备中...");
                    gg.sdk.aldSendEvent("视频加载失败");  
                }

                console.error(res);
            });


            //初始化插屏广告
            this.interstitialAd = null;

            // 创建插屏广告实例，提前初始化
            if(config.isTT())
            {
                if(tt.createInterstitialAd)
                {
                    this.interstitialAd = tt.createInterstitialAd({
                        adUnitId: config.getSpotId()
                    });
                }
            }
            else
            {
                if (wx.createInterstitialAd){
                    this.interstitialAd = wx.createInterstitialAd({
                        adUnitId: config.getSpotId()
                    });
                }
            }
            
            console.log("interstitialAd",this.interstitialAd);

        }
        this.bannerTime = 0;
    },

    showVedio: function(callback)
    {
        var self = this;
        this.videocallback = callback;
        if(window["wx"])
        {
            gg.GAME.hasVideo = false;
            this.rewardedVideoAd.show().catch(function(err){
                self.rewardedVideoAd.load().then(function(){
                    self.rewardedVideoAd.show();
                });
            });
            gg.sdk.aldSendEvent("观看视频");
            // if(gg.GAME.share)
            //    this.share(callback,"prop");
            // else
            // {
            //    if(callback)
            //        callback(false);
            //    gg.res.showToast("暂未开放！");
            // }
        }
        else
        {
            if(callback)
                callback(true);
        }
    },

    showBanner: function(node,callback,isHide)
    {

        if(window["wx"])
        {
            // if(this.bannerAd)
            // {
            //     var now = new Date().getTime();
            //     if(now - this.bannerTime<2000)
            //         return;
            // }

            if(this.bannerAd && this.bannerNum<5)
            {
                this.bannerNum ++;
                this.bannerAd.show();
                this.isShowBanner = true;
                return;
            }
            this.bannerNum  = 0;
            this.isShowBanner = true;
            // this.hideBanner();
            if(this.bannerAd) this.bannerAd.destroy();

            //var dpi = cc.view.getDevicePixelRatio();
            var s = cc.view.getFrameSize();
            var dpi = cc.winSize.width/s.width;

            var w = s.width*0.9;
            var h = 100/337*w;
            var isMoveAd = true;
            var self = this;
            if(gg.GAME.adCheck && !this.is_iphonex())
            {
                //w = w/2;
                isMoveAd = false;
                if(node && callback)
                {
                    node.runAction(cc.sequence(
                        cc.delayTime(0.01),
                        cc.callFunc(function(){
                            callback(-30*dpi);
                        })
                    ));
                }
            }
            this.bannerAd = wx.createBannerAd({
                adUnitId: config.getBannerId(),
                style: {
                    left: 0,
                    top: s.height-h,
                    width: w,
                    height:h,
                }
            });
            var bannerAd = this.bannerAd;
            this.bannerAd.onResize(function(res){
                bannerAd.style.left = s.width/2-res.width/2;
                bannerAd.style.top = s.height-res.height-1;
                bannerAd.res = res;
                if(isMoveAd && node && callback)
                {
                    node.runAction(cc.sequence(
                        cc.delayTime(0.4),
                        cc.callFunc(function(){
                            var y = node.parent.convertToWorldSpaceAR(node.position).y-(node.height*node.anchorY);
                            var dis = y - res.height*dpi;
                            //console.log(dis,y,res.height,dpi,node.y,node.height,cc.winSize.height/2);
                            callback(dis);
                        })
                    ));
                }
                if(isHide)
                {
                    bannerAd.style.top = s.height+20;
                }
                if(!self.isShowBanner)
                {
                    self.hideBanner();
                }
            });
            this.bannerAd.onError(function(res){
                console.error(res);
            });
            this.bannerAd.show();

            this.bannerTime = new Date().getTime();

            gg.sdk.aldSendEvent("banner显示");
        }
    },

    hideBanner: function()
    {
        if(window["wx"])
        {
            if(this.bannerAd)
            {
                this.bannerAd.hide();
                this.isShowBanner = false;
                // this.bannerAd = null;
            }

        }
    },

    getBannerDis: function(node)
    {
        if(window["wx"])
        {
            if(this.bannerAd && node && this.bannerAd.res)
            {
                var s = cc.view.getFrameSize();
                var dpi = cc.winSize.width/s.width;
                var y = node.parent.convertToWorldSpaceAR(node.position).y-(node.height*node.anchorY);
                var dis = y - this.bannerAd.res.height*dpi;
                return dis;
            }
        }
        return 0;
    },

    moveBanner: function()
    {
        if(window["wx"])
        {
            if(this.bannerAd && this.bannerAd.res)
            {
                var s = cc.view.getFrameSize();
                this.bannerAd.style.top = s.height-this.bannerAd.res.height-1;
            }
        }
    },

    showSpot: function()
    {
        if(window["wx"])
        {
            if (this.interstitialAd)
            {
                if(config.isTT())
                {
                    var interstitialAd = this.interstitialAd;
                    this.interstitialAd
                    .load()
                    .then(() => {
                        interstitialAd.show();
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
                else
                {
                    this.interstitialAd.show().catch(function(err) {
                        console.error(err)
                    });
                }
                
            }
        }
    },

    share: function(callback,channel)
    {
        if(window["wx"])
        {
            var query = "fromid="+gg.qianqista.openid+"&channel="+channel;
            var title = "看你怎么一步一步登上枪神之巅！";
            var imageUrl = "https://www.7q7q.top/share/gungod/share1.jpg";//cc.url.raw("resources/zhuanfa.jpg");
            if(gg.GAME.shares.length>0)
            {
                var i = Math.floor(Math.random()*gg.GAME.shares.length);
                var sdata = gg.GAME.shares[i];
                if(sdata && sdata.title && sdata.imageUrl)
                {
                    title = sdata.title;
                    imageUrl = sdata.imageUrl;
                }
            }
            if(config.isTT())
            {
                var videoPath = storage.getStorage(storage.videoPath);
                if(!videoPath.path){
                    gg.res.showToast("暂未录制视频!");
                    return;
                }
                tt.shareAppMessage({
                    channel: 'video',
                    title: title,
                    desc: title,
                    imageUrl: imageUrl,
                    templateId: '', // 替换成通过审核的分享ID
                    query: query,
                    extra: {
                      videoPath: videoPath.path, // 可替换成录屏得到的视频地址
                      videoTopics: ['全民枪神','全民枪神小游戏','抖音小游戏']
                    },
                    success() {
                        console.log('分享视频成功');
                        if(callback) callback(true);
                      },
                      fail(e) {
                        console.log('分享视频失败');
                        if(callback) callback(false);
                    }  
                });           
            }
            else
            {
                wx.shareAppMessage({
                    query:query,
                    title: title,
                    imageUrl: imageUrl,
                    // success: function(res)
                    // {
                    //     if(callback)
                    //         callback(true);
                    //     cc.log(res);
                    // },
                    // fail: function()
                    // {
                    //     if(callback)
                    //         callback(false);
                    // }
                });
                this.shareJudge(callback);
            }
            
        }
        else
        {
            if(callback)
                callback(true);
        }
    },

    shareJudge: function(callback)
    {
        gg.qianqista.sharetime = new Date().getTime();
        gg.qianqista.sharecallback = callback;
    },

    skipGame: function(gameId,url)
    {
        if(window["wx"])
        {
            if(gameId)
            {
                var pathstr = 'pages/main/main?channel=sheep';
                wx.navigateToMiniProgram({
                    appId: gameId,
                    path: pathstr,
                    extraData: {
                        foo: 'bar'
                    },
                    // envVersion: 'develop',
                    success: function(res) {
                        // 打开成功
                    }
                });
            }
            //else if(url && url.length > 5)
            //{
            //    //BK.MQQ.Webview.open(url);
            //}
        }
    },

    shortcut: function()
    {
        if(window["wx"])
        {
            //var extendInfo = "shortcut";//扩展字段
            //BK.QQ.createShortCut(extendInfo)
        }
    },

    getUserInfo: function()
    {
        if(window["wx"])
        {
            wx.getSetting({
                success: function (res) {
                    console.log(res.authSetting);
                    if(!res.authSetting["scope.userInfo"])
                    {
                        //cc.sdk.openSetting();
                        gg.qianqista.login(false);
                    }
                    else
                    {
                        wx.getUserInfo({
                            success: function(res) {
                                gg.sdk.userInfo = res.userInfo;
                                gg.qianqista.login(true,res.userInfo);
                                wx.postMessage({ message: "loginSuccess",userInfo:res.userInfo });
                            }
                        });
                    }
                }
            });


            wx.showShareMenu({
                withShareTicket: true,
                success: function (res) {
                    // 分享成功
                },
                fail: function (res) {
                    // 分享失败
                }
            });

      
            wx.onShareAppMessage(function (ops){
                return {
                    query:"channel=sharemenu",
                    withShareTicket: true,
                    title: "看你怎么一步一步登上枪神之巅！",
                    imageUrl: "https://www.7q7q.top/share/gungod/share1.jpg"
                }
            });

            wx.updateShareMenu({
                withShareTicket: true,
                success: function (res) {
                    // 分享成功
                },
                fail: function (res) {
                    // 分享失败
                }
            })
        }
        else
        {
            gg.qianqista.login(false);
        }
    },

    judgePower: function()
    {
        if(window["wx"])
        {
            return gg.qianqista.power == 1 ? true : false;
        }
        return true;
    },

    openSetting: function(callback)
    {
        if(window["wx"])
        {
            //cc.sdk.main.openQuanXian();
            //var quan = self.node_quanxian.quan;
            //var openDataContext = wx.getOpenDataContext();
            //var sharedCanvas = openDataContext.canvas;
            //var sc = sharedCanvas.width/this.dsize.width;
            //var dpi = cc.view._devicePixelRatio;

            var s = cc.view.getFrameSize();

            var pos = cc.v2(s.width/2, s.height*0.5);

            var button = wx.createUserInfoButton({
                type: 'text',
                text: '授权进入游戏',
                style: {
                    left: pos.x-60,
                    top: pos.y+20,
                    width: 120,
                    height: 40,
                    backgroundColor: '#1779a6',
                    borderColor: '#ffffff',
                    // borderWidth: 1,
                    borderRadius: 4,
                    textAlign: 'center',
                    fontSize: 12,
                    lineHeight: 40
                }
            });
            button.onTap(function(res){
                console.log(res);
                if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                    //cc.qianqista.login(false);
                    if(callback) callback(false);
                }
                else
                {
                    gg.sdk.userInfo = res.userInfo;
                    gg.qianqista.login(true,res.userInfo);
                    wx.postMessage({ message: "loginSuccess",userInfo:res.userInfo });
                    //var score = storage.getLevel();
                    //cc.sdk.uploadScore(score);
                    if(callback) callback(true);
                    //if(cc.sdk.main.quanxiansc)
                    //    cc.sdk.main.quanxiansc.hide();

                }
                button.destroy();
            });
        }
    },

    showClub: function()
    {
        if(config.isWx() && !config.isTT())
        {
            if(!this.clubBtn)
            {
                var s = cc.view.getFrameSize();
                //var dpi = cc.winSize.width/s.width;

                this.clubBtn = wx.createGameClubButton({
                    icon: 'white',
                    style: {
                        left: s.width*0.03,
                        top: s.height*0.12,
                        width: 40,
                        height: 40
                    }
                });
            }
            else
            {
                this.clubBtn.show();
            }

        }
    },

    hideClub: function()
    {
        if(this.clubBtn)
            this.clubBtn.hide()
    },

    openKefu: function()
    {
        if(window["wx"])
        {
            wx.openCustomerServiceConversation({});
        }
    },

    aldLevelStart: function(lvId)
    {
        if(config.isWx() && !config.isTT())
        {
            wx.aldStage.onStart({
                stageId   : lvId+"",     //关卡ID 该字段必传
                stageName : "第"+lvId+"关", //关卡名称  该字段必传
                // userId    : "06_bmjrPtlm6_2sgVt7hMZOPfL2M" //用户ID 可选
              })
        }
    },

    aldLevelRunning: function(lvId)
    {
        if(config.isWx() && !config.isTT())
        {
            wx.aldStage.onRunning({
                stageId   : lvId+"",     //关卡ID 该字段必传
                stageName : "第"+lvId+"关", //关卡名称  该字段必传
                // userId    : "06_bmjrPtlm6_2sgVt7hMZOPfL2M" //用户ID 可选
                event     : "revive",  //发起支付 关卡进行中，用户触发的操作    该字段必传
                params    : {    //参数
                  itemName  : "复活",  //购买商品名称  该字段必传
                  desc : "看视频复活"  //商品描述   可选
                }
              })
        }
    },

    aldLevelEnd: function(lvId,isPass)
    {
        if(config.isWx() && !config.isTT())
        {
            wx.aldStage.onEnd({
                stageId   : lvId+"",   //关卡ID 该字段必传
                stageName : "第"+lvId+"关", //关卡名称  该字段必传
                // userId    : "06_bmjrPtlm6_2sgVt7hMZOPfL2M",  //用户ID 可选
                event     : isPass ? "complete" : "fail",   //关卡完成  关卡进行中，用户触发的操作    该字段必传
                params    : {
                  desc    : isPass ? "关卡完成" : "关卡失败"  //描述
                }
              })
        }
    },

    aldSendEvent: function(eventName)
    {
        if(window["wx"])
        {
            gg.qianqista.event(eventName);
            if(config.isWx() && !config.isTT())
                wx.aldSendEvent(eventName);
        }
        
    },

    gameRecorderStart: function(){
        if(config.isTT())
        {
            if(!this.recorderManage)
            {
                var self = this;
                const recorder = tt.getGameRecorderManager();
                this.recorderManage =  recorder;
                recorder.onStart(res =>{
                    console.log('录屏开始');
                    // do somethine;
                })

                recorder.onStop(res =>{
                    storage.setStorage(storage.videoPath,{path:res.videoPath});
                    console.log(res.videoPath);
                    // do somethine;
                })
                recorder.onError(errMsg =>{
                    console.log(errMsg);
                    // do somethine;
                })
            }
            this.recorderManage.start({
                duration: 300,
            })
        }
        
    },

    gameRecorderStop: function(){
        if(config.isTT())
        {
            if(this.recorderManage)this.recorderManage.stop();
        }
    }

}