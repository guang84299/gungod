const {ccclass, property} = cc._decorator;
var gg = window["gg"];

export const audio = {
    playSoundTime:0,


    playMusic: function(music,yinliang)
    {
        if(gg.storage.getStorage(gg.storage.music) == 1)
        {
            this.stopMusic();

            cc.loader.loadRes(music, function (err, clip)
            {
                if(!err)
                {
                    if(!yinliang) yinliang = 0.3;
                    cc.audioEngine.play(clip, true, yinliang);
                }
                else
                {
                    console.log(err);
                }
            });
        }
    },

    pauseMusic: function()
    {
        if(gg.storage.getStorage(gg.storage.music) == 1)
        cc.audioEngine.pauseAll();
    },

    resumeMusic: function()
    {
        if(gg.storage.getStorage(gg.storage.music) == 1)
        cc.audioEngine.resumeAll();
    },

    stopMusic: function()
    {
        cc.audioEngine.stopAll();
    },

    playSound: function(sound)
    {
        if(gg.storage.getStorage(gg.storage.sound) == 1)
        {
            var now = new Date().getTime();
            if(now-this.playSoundTime>20)
            {
                this.playSoundTime = now;
                cc.loader.loadRes(sound, function (err, clip)
                {
                    if(!err)
                    {
                        cc.audioEngine.play(clip, false, 1);
                    }
                    else
                    {
                        //console.log(err);
                    }
                });
            }

        }
    }
}
