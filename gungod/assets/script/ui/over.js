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
        this.node_fuhuo_currscore = cc.find("bg/currscore",this.node).getComponent("cc.Label");
        this.node_fuhuo_maxscore = cc.find("bg/maxscore",this.node).getComponent("cc.Label");
    },

    updateUI: function()
    {
        this.node_fuhuo_currscore.string = "本局得分："+this.main.GAME.score;
        this.node_fuhuo_maxscore.string = "最高得分："+storage.getScore();
    },

    show: function()
    {
        this.node.active = true;
        this.bg.opacity = 0;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0,1,0),
                cc.fadeIn(0),
                cc.scaleTo(0.3,1,1).easing(cc.easeSineOut())
        ));
        this.updateUI();
    },

    hide: function()
    {
        var self = this;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1,0).easing(cc.easeSineOut()),
                cc.callFunc(function(){
                    self.node.destroy();
                })
            ));
    },

    click: function(event,data)
    {
        if(data == "again")
        {
            this.main.wxCloseOver();
            this.main.startGame();
            this.hide();
        }
        else if(data == "share")
        {
            this.share();
        }
        else if(data == "home")
        {
            this.main.wxQuanState(true);
            this.main.wxCloseOver();
            this.hide();
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    },

    share: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var query = "channel=sharexuanyao";
            var title = "玩枪神我打了"+this.main.GAME.score+"分，过来玩会啊！";
            var imageUrl = cc.url.raw("resources/zhuanfa.jpg");
            if(this.main.GAME.sharepic)
                imageUrl = this.main.GAME.sharepic;

            wx.shareAppMessage({
                query:query,
                title: title,
                imageUrl: imageUrl,
                success: function(res)
                {
                    cc.log(res);
                },
                fail: function()
                {
                }
            });
        }
    }

    
});
