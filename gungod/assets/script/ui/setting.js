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
        this.node_setting_music = cc.find("bg/music",this.node);
        this.node_setting_sound = cc.find("bg/sound",this.node);
        this.node_setting_vibrate = cc.find("bg/vibrate",this.node);
    },

    updateUI: function()
    {
        this.node_setting_music.getComponent("cc.Toggle").isChecked = (storage.getMusic() == 1 ? true : false);
        this.node_setting_sound.getComponent("cc.Toggle").isChecked = (storage.getSound() == 1 ? true : false);
        this.node_setting_vibrate.getComponent("cc.Toggle").isChecked = (storage.getVibrate() == 1 ? true : false);
    },

    show: function()
    {
        this.main.wxQuanState(false);
        this.node.active = true;
        this.bg.runAction(cc.sequence(
                cc.scaleTo(0.2,1.1).easing(cc.easeSineOut()),
                cc.scaleTo(0.2,1).easing(cc.easeSineOut())
            ));
        this.updateUI();
    },

    hide: function()
    {
        this.main.wxQuanState(true);
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
            this.hide();
        }
        else if(data == "music")
        {
            var m = storage.getMusic();
            m = m == 0 ? 1 : 0;
            storage.setMusic(m);
            if(storage.getMusic() == 0)
            {
                storage.stopMusic();
            }
            else
            {
                storage.playMusic(this.res.audio_mainBGM);
            }
        }
        else if(data == "sound")
        {
            var m = storage.getSound();
            m = m == 0 ? 1 : 0;
            storage.setSound(m);
        }
        else if(data == "vibrate")
        {
            var m = storage.getVibrate();
            m = m == 0 ? 1 : 0;
            storage.setVibrate(m);
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    }

    
});
