var storage = require("storage");

cc.Class({
    extends: cc.Component,

    properties: {
      
    },

    onLoad: function()
    {
        
        this.main = cc.find("Canvas").getComponent("main");
        this.res = cc.find("Canvas").getComponent("res");
        this.initUI();
        
    },
    initUI: function()
    {
        this.bg = cc.find("bg",this.node);
        this.node_fuhuo_num = cc.find("bg/num",this.node).getComponent("cc.Label");
        this.node_fuhuo_desc = cc.find("bg/desc",this.node).getComponent("cc.Label");

        this.node_fuhuo_vedio = cc.find("bg/fuhuo_vedio",this.node);
        this.node_fuhuo_share = cc.find("bg/fuhuo_share",this.node);

        if(this.main.GAME.fuhuonum%3 == 0)
        {
            this.node_fuhuo_vedio.active = false;
            this.node_fuhuo_share.active = true;
        }
        else
        {
            this.node_fuhuo_vedio.active = true;
            this.node_fuhuo_share.active = false;
        }
    },

    updateUI: function()
    {
        this.node_fuhuo_num.string = "剩余复活次数:"+this.main.GAME.fuhuonum;
        var lv = Math.floor(this.main.GAME.maxlv-1);
        lv = lv <= 0 ? 1 : lv;
        this.node_fuhuo_desc.string = "复活可恢复到Lv."+lv;
    },

    show: function()
    {
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        this.updateUI();
    },

    hide: function()
    {
        var self = this;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            ));
    },

    click: function(event,data)
    {
        if(data == "close")
        {
            this.main.gameOver();
            this.hide();
        }
        else if(data == "fuhuo_share")
        {
            this.fuhuoShare();
        }
        else if(data == "fuhuo_vedio")
        {
            this.fuhuoVedio();
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    },

    fuhuoShare: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            //var query = "channel=groupsharemenu";
            var title = "爱玩枪神的小姐姐，身材不会差哟！";
            var imageUrl = cc.url.raw("resources/zhuanfa.jpg");
            if(this.main.GAME.sharepic)
                imageUrl = this.main.GAME.sharepic;
            if(this.main.GAME.sharetxt)
                title = this.main.GAME.sharetxt;

            var info = {};
            info.channel = "groupsharemenu";
            var query = JSON.stringify(info);

            BK.QQ.shareToArk(0, title, imageUrl, true, query,function (errCode, cmd, data) {
                if (errCode == 0) {
                    BK.Script.log(1, 1," ret:" + data.ret +  // 是否成功 (0:成功，1：不成功)
                    " aioType:" + data.aioType + // 聊天类型 （1：个人，4：群，5：讨论组，6：热聊）
                    " gameId:" + data.gameId); // 游戏 id
                    if(data.ret == 0)
                    {
                        self.res.showToast("复活成功");

                        self.main.GAME.fuhuonum -= 1;
                        self.main.fuhuoEnd();
                        self.hide();
                    }
                    else
                    {

                    }
                }
                else
                {

                }
            });

            //BK.Share.share({
            //    qqImgUrl: imageUrl,
            //    summary: title,
            //    extendInfo: query,
            //    success: function(succObj){
            //        BK.Console.log('Waaaah! share success', succObj.code, JSON.stringify(succObj.data));
            //
            //        self.res.showToast("复活成功");
            //
            //        self.main.GAME.fuhuonum -= 1;
            //        self.main.fuhuoEnd();
            //        self.hide();
            //    },
            //    fail: function(failObj){
            //        BK.Console.log('Waaaah! share fail', failObj.code, JSON.stringify(failObj.msg));
            //    },
            //    complete: function(){
            //        BK.Console.log('Waaaah! share complete');
            //    }
            //});
        }
        else
        {
            this.main.GAME.fuhuonum -= 1;
            this.main.fuhuoEnd();
            this.hide();
        }

    },

    fuhuoVedio: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            this.main.wxVideoShow(function(res){
                if(res)
                {
                    self.main.GAME.fuhuonum -= 1;
                    self.main.fuhuoEnd();
                    self.hide();
                }
                else
                {
                    self.res.showToast("复活失败！");
                }
            });
        }
        else
        {
            this.main.GAME.fuhuonum -= 1;
            this.main.fuhuoEnd();
            this.hide();
        }
    }

    
});
