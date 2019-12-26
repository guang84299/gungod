
cc.Class({
    extends: cc.Component,

    properties: {
        paimingItem: {
            default: null,
            type: cc.Prefab
        },
        paimingItem2: {
            default: null,
            type: cc.Prefab
        }

    },


    onLoad: function()
    {

        this.initUI();

        this.kvdata = {
            wxgame:
            {
                score: 0,
                update_time: 0
            }
        };

        this.userInfo = null;
        this.friendRank = null;
        var self = this;


        wx.onMessage(function(data){
            if(data.message == "closeOver")
            {
                self.node_over.runAction(cc.sequence(
                    cc.scaleTo(0.2,1,0).easing(cc.easeSineOut()),
                    cc.callFunc(function(){
                        self.node_over.active = false;
                    })
                ));
            }
            else if(data.message == "closeRank")
            {
                self.node_paiming.runAction(cc.sequence(
                    cc.scaleTo(0.2,1,0).easing(cc.easeSineOut()),
                    cc.callFunc(function(){
                        self.node_paiming.active = false;
                    })
                ));
            }
            else if(data.message == "friendRank"){ //好友排行榜
                self.showPaiming();
            }
            else if(data.message == "overRank"){ //3人排行榜
                self.uploadScore(data.score);
                self.showOverRank(data.score);
            }
            else if(data.message == "loginSuccess")
            {
                self.userInfo = data.userInfo;
                self.getUserRank();
                self.getFriendRank();
            }
            else if(data.message == "updateScore")
            {
                self.updateScore(data.score);
            }

            cc.log(data.message);
        });

    },


    initUI: function()
    {
        var self = this;
        self.node_over = cc.find("Canvas/node_over");
        self.node_over_content = cc.find("bg/rankbg/scroll/view/content",self.node_over);

        self.node_paiming = cc.find("Canvas/node_rank");
        self.node_paiming_content = cc.find("bg/rankbg/scroll/view/content",self.node_paiming);
        self.node_paiming_item_me = cc.find("bg/rankbg/me_rank",self.node_paiming);

        self.node_paiming_num = cc.find("num",self.node_paiming_item_me);
        self.node_paiming_icon = cc.find("icon",self.node_paiming_item_me);
        self.node_paiming_nick = cc.find("nick",self.node_paiming_item_me);
        self.node_paiming_score = cc.find("score",self.node_paiming_item_me);
    },


    click: function(event,data)
    {

    },

    updateScore: function(score)
    {
        if(this.friendRank && this.userInfo)
        {
            this.uploadScore(score);
        }
    },

    showOverRank: function(score)
    {
        this.node_over.active = true;
        this.node_over.opacity = 0;
        this.node_over.runAction(cc.sequence(
            cc.scaleTo(0,1,0),
            cc.fadeIn(0),
            cc.scaleTo(0.3,1,1).easing(cc.easeSineOut())
        ));

        var self = this;
        this.getFriendRank(function(){
            self.showOverRank2(score);
        });
    },

    showOverRank2: function(score)
    {
        this.node_over_content.removeAllChildren();
        if(this.friendRank && this.userInfo)
        {

            for(var i=0;i<this.friendRank.length;i++)
            {
                var data = this.friendRank[i];
                var feiji_rank = data.KVDataList[0].value;
                var rank  = JSON.parse(feiji_rank);

                var item = null;
                if(data.nickname == this.userInfo.nickName &&
                    data.avatarUrl == this.userInfo.avatarUrl)
                {
                    item = cc.instantiate(this.paimingItem2);
                }
                else
                {
                    item = cc.instantiate(this.paimingItem);
                }
                var bg = item;
                var num = cc.find("num",bg);
                var icon = cc.find("icon",bg);
                var nick = cc.find("nick",bg);
                var score = cc.find("score",bg);


                num.getComponent("cc.Label").string = (i+1)+"";
                if(data.avatarUrl && data.avatarUrl.length>10)
                    this.loadPic(icon,data.avatarUrl);
                nick.getComponent("cc.Label").string = data.nickname;
                score.getComponent("cc.Label").string = rank.wxgame.score+"";

                //if(data.nickname == this.userInfo.nickName &&
                //    data.avatarUrl == this.userInfo.avatarUrl)
                //{
                //    bg.color = cc.color(90,172,236);
                //}

                this.node_over_content.addChild(item);
            }
        }
    },

    loadPic: function(sp,url)
    {
        cc.loader.load({url: url, type: 'png'}, function (err, tex) {
            if(err)
            {
                console.log(err);
            }
            else
            {
                var spriteFrame = new cc.SpriteFrame(tex);
                sp.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            }
        });
    },


    showPaiming: function()
    {
        var self = this;
        this.node_paiming.active = true;
        this.node_paiming.opacity = 0;
        this.node_paiming.runAction(cc.sequence(
            cc.scaleTo(0,1,0),
            cc.fadeIn(0),
            cc.scaleTo(0.3,1,1).easing(cc.easeSineOut())
        ));
        this.node_paiming_content.removeAllChildren();
        var selfrank = null;
        if(this.friendRank && this.userInfo)
        {

            for(var i=0;i<this.friendRank.length;i++)
            {
                var data = this.friendRank[i];
                var feiji_rank = data.KVDataList[0].value;
                var rank  = JSON.parse(feiji_rank);

                var item = null;
                if(data.nickname == this.userInfo.nickName &&
                    data.avatarUrl == this.userInfo.avatarUrl)
                {
                    item = cc.instantiate(this.paimingItem2);
                    selfrank = data;
                    selfrank.num = (i+1);
                }
                else
                {
                    item = cc.instantiate(this.paimingItem);
                }

                var bg = item;
                var num = cc.find("num",bg);
                var icon = cc.find("icon",bg);
                var nick = cc.find("nick",bg);
                var score = cc.find("score",bg);


                num.getComponent("cc.Label").string = (i+1)+"";
                if(data.avatarUrl && data.avatarUrl.length>10)
                    this.loadPic(icon,data.avatarUrl);
                nick.getComponent("cc.Label").string = data.nickname;
                score.getComponent("cc.Label").string = rank.wxgame.score+"";

                this.node_paiming_content.addChild(item);
            }
            if(selfrank)
            {
                var feiji_rank = selfrank.KVDataList[0].value;
                var rank  = JSON.parse(feiji_rank);


                this.node_paiming_num.getComponent("cc.Label").string = selfrank.num+"";
                this.loadPic(self.node_paiming_icon,selfrank.avatarUrl);
                this.node_paiming_nick.getComponent("cc.Label").string = selfrank.nickname;
                this.node_paiming_score.getComponent("cc.Label").string = rank.wxgame.score+"";
            }

        }

    },

    getUserRank: function()
    {
        var self = this;
        wx.getUserCloudStorage({
            keyList:["gungod_rank"],
            success: function(res)
            {
                cc.log(res);
                if(res.KVDataList.length == 0)
                {
                    self.setUserRank(0,new Date().getTime(),0,0,0);
                }
                else
                {
                    var feiji_rank = res.KVDataList[0].value;
                    self.kvdata = JSON.parse(feiji_rank);
                    cc.log(self.kvdata);

                }
            }
        });
    },

    uploadScore: function(score)
    {
        if(this.kvdata)
        {
            if(score > this.kvdata.wxgame.score)
            {
                this.kvdata.wxgame.score = score;
                this.setUserRank(score,new Date().getTime());
            }
        }
        else
        {
            this.getUserRank();
        }
    },

    setUserRank: function(score,update_time)
    {
        var self = this;
        var data = {
            key: "gungod_rank",
            value: "{\"wxgame\":{\"score\":"+score+",\"update_time\": "+update_time+"}}"
        };

        var kvDataList = [data];
        wx.setUserCloudStorage({
            KVDataList: kvDataList,
            success: function(res)
            {
                self.kvdata.wxgame.score = score;
                self.getFriendRank();
                cc.log(res);
            },
            fail: function(res)
            {
                cc.log(res);
            }
        });
    },


    getFriendRank: function(callback)
    {
        var self = this;
        wx.getFriendCloudStorage({
            keyList:["gungod_rank"],
            success: function(res)
            {
                console.log(res);
                self.friendRank = res.data;
                self.sortFriendRank();

                if(callback)
                    callback();
            }
        });
    },

    sortFriendRank: function()
    {
        if(this.friendRank)
        {
            this.friendRank.sort(function(a,b){
                var a_rank =JSON.parse(a.KVDataList[0].value);
                var AMaxScore=a_rank.wxgame.score;

                var b_rank =JSON.parse(b.KVDataList[0].value);
                var BMaxScore = b_rank.wxgame.score;

                return parseInt(BMaxScore) - parseInt(AMaxScore);
            });
        }
    }


});
