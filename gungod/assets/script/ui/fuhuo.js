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
            var query = "channel=groupsharemenu";
            var title = "爱玩枪神的小姐姐，身材不会差哟！";
            var imageUrl = cc.url.raw("resources/zhuanfa.jpg");
            if(this.main.GAME.sharepic)
                imageUrl = this.main.GAME.sharepic;
            if(this.main.GAME.sharetxt)
                title = this.main.GAME.sharetxt;

            wx.shareAppMessage({
                query:query,
                title: title,
                imageUrl: imageUrl,
                success: function(res)
                {
                    if(res.shareTickets && res.shareTickets.length>0)
                    {
                        wx.getShareInfo({
                            shareTicket: res.shareTickets[0],
                            success: function(res)
                            {
                                console.log("------",res);
                                self.main.qianqista.getGrpupId(res.encryptedData,res.iv,function(b,openGId,timestamp){
                                    if(b==true && storage.judgeShareGroupState(openGId,timestamp))
                                    {
                                        self.res.showToast("复活成功");

                                        self.main.GAME.fuhuonum -= 1;
                                        self.main.fuhuoEnd();
                                        self.hide();
                                    }
                                    else
                                    {
                                        self.res.showToast("每个群每天只能转发一次");
                                    }
                                });
                            }
                        });
                    }
                    else
                    {
                        self.res.showToast("请分享到群");
                    }
                    cc.log(res);
                },
                fail: function()
                {
                }
            });
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
