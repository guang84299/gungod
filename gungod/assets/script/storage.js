/**
 * Created by guang on 18/7/19.
 */
module.exports = {
    playMusic: function(music)
    {
        if(this.getMusic() == 1)
            cc.audioEngine.play(music,true,0.6);
    },

    pauseMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.pauseAll();
    },

    resumeMusic: function()
    {
        if(this.getMusic() == 1)
            cc.audioEngine.resumeAll();
    },

    stopMusic: function()
    {
        cc.audioEngine.stopAll();
    },

    playSound: function(sound)
    {
        if(this.getSound() == 1)
            cc.audioEngine.play(sound,false,1);
    },

    preloadSound: function()
    {
        
    },

    setCoin: function(coin)
    {
        cc.sys.localStorage.setItem("coin",coin);
    },
    getCoin: function()
    {
        var coin = cc.sys.localStorage.getItem("coin");
        coin = coin ? coin : 0;
        return Number(coin);
    },

    setScore: function(score)
    {
        cc.sys.localStorage.setItem("highscore",score);
    },
    getScore: function()
    {
        var currscore = cc.sys.localStorage.getItem("highscore");
        currscore = currscore ? currscore : 0;
        return Number(currscore);
    },

    setMusic: function(music)
    {
        cc.sys.localStorage.setItem("music",music);
    },
    getMusic: function()
    {
        var music = cc.sys.localStorage.getItem("music");
        music = music ? music : 0;
        return Number(music);
    },

    setSound: function(sound)
    {
        cc.sys.localStorage.setItem("sound",sound);
    },
    getSound: function()
    {
        var sound = cc.sys.localStorage.getItem("sound");
        sound = sound ? sound : 0;
        return Number(sound);
    },

    setVibrate: function(vibrate)
    {
        cc.sys.localStorage.setItem("vibrate",vibrate);
    },
    getVibrate: function()
    {
        var vibrate = cc.sys.localStorage.getItem("vibrate");
        vibrate = vibrate ? vibrate : 0;
        return Number(vibrate);
    },

    setFirst: function(first)
    {
        cc.sys.localStorage.setItem("first",first);
    },
    getFirst: function()
    {
        var vibrate = cc.sys.localStorage.getItem("first");
        vibrate = vibrate ? vibrate : 0;
        return Number(vibrate);
    },

    setCard: function(card)
    {
        cc.sys.localStorage.setItem("card",card);
    },
    getCard: function()
    {
        var card = cc.sys.localStorage.getItem("card");
        card = card ? card : 0;
        return Number(card);
    },


    setShareGroupList: function(item)
    {
        cc.sys.localStorage.setItem("shareGroupList",item);
    },
    getShareGroupList: function()
    {
        var shareGroupList = cc.sys.localStorage.getItem("shareGroupList");
        return shareGroupList;
    },
    setShareGroupTime: function(time)
    {
        cc.sys.localStorage.setItem("shareGroupTime",time);
    },
    getShareGroupTime: function()
    {
        var time = cc.sys.localStorage.getItem("shareGroupTime");
        return time;
    },

    setVideoTime: function(time)
    {
        cc.sys.localStorage.setItem("VideoTime",time);
    },
    getVideoTime: function()
    {
        var time = cc.sys.localStorage.getItem("VideoTime");
        time = time ? time : 0;
        return Number(time);
    },

    vibrate: function(isLong)
    {
        if(this.getVibrate() == 1 && (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS))
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

    judgeShareGroupState: function(openGId,timestamp)
    {
        var shareGroupList = this.getShareGroupList();
        if(!shareGroupList || shareGroupList=="" || shareGroupList == null)
        {
            this.setShareGroupList(openGId);
            this.setShareGroupTime(timestamp);
            return true;
        }
        else
        {
            if(new Date(timestamp).getDate() != new Date(this.getShareGroupTime()).getDate())
            {
                this.setShareGroupList(openGId);
                this.setShareGroupTime(timestamp);
                return true;
            }
            else
            {
                if(shareGroupList.indexOf(openGId) == -1)
                {
                    this.setShareGroupList(shareGroupList+","+openGId);
                    this.setShareGroupTime(timestamp);
                    return true;
                }
            }
        }
        return false;
    }
};