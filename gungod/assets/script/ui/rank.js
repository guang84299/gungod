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
    },

    updateUI: function()
    {
    },

    show: function()
    {
        this.main.wxQuanState(false);
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
        this.main.wxQuanState(true);
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
        if(data == "share")
        {
            this.share();
        }
        else if(data == "home")
        {
            this.main.wxCloseRank();
            this.hide();
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    },

    share: function()
    {
        this.main.wxGropShare();
    }

    
});
