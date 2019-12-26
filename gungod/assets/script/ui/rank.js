var storage = require("storage");

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
        
        this.main = cc.find("Canvas").getComponent("main");
        this.res = cc.find("Canvas").getComponent("res");
        this.initUI();
        
    },
    initUI: function()
    {
        var self = this;
        this.bg = cc.find("bg",this.node);

        self.node_paiming = this.node;
        self.node_paiming_content = cc.find("bg/rankbg/scroll/view/content",self.node_paiming);
        self.node_paiming_item_me = cc.find("bg/rankbg/me_rank",self.node_paiming);

        self.node_paiming_num = cc.find("num",self.node_paiming_item_me);
        self.node_paiming_icon = cc.find("icon",self.node_paiming_item_me);
        self.node_paiming_nick = cc.find("nick",self.node_paiming_item_me);
        self.node_paiming_score = cc.find("score",self.node_paiming_item_me);
    },

    updateUI: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var attr = "score";//使用哪一种上报数据做排行，可传入score，a1，a2等
            var order = 1;     //排序的方法：[ 1: 从大到小(单局)，2: 从小到大(单局)，3: 由大到小(累积)]
            var rankType = 0; //要查询的排行榜类型，0: 好友排行榜，1: 群排行榜，2: 讨论组排行榜，3: C2C二人转 (手Q 7.6.0以上支持)
            // 必须配置好周期规则后，才能使用数据上报和排行榜功能
            BK.QQ.getRankListWithoutRoom(attr, order, rankType, function(errCode, cmd, data) {
                BK.Script.log(1,1,"-------rank a1 callback  cmd" + cmd + " errCode:" + errCode + "  data:" + JSON.stringify(data));
                // 返回错误码信息
                if (errCode != 0) {
                    BK.Script.log(1,1,'------获取排行榜数据失败!错误码：' + errCode);
                    return;
                }
                // 解析数据
                //var rd = data.data.ranking_list[i];
                // rd 的字段如下:
                //var rd = {
                //    url: '',            // 头像的 url
                //    nick: '',           // 昵称
                //    score: 1,           // 分数
                //    selfFlag: false,    // 是否是自己
                //};

                if (data) {
                    for(var i=0;i<data.data.ranking_list.length;i++)
                    {
                        var rankData = data.data.ranking_list[i];

                        var item = null;
                        if(rankData.selfFlag)
                        {
                            item = cc.instantiate(self.paimingItem2);
                        }
                        else
                        {
                            item = cc.instantiate(self.paimingItem);
                        }

                        var bg = item;
                        var num = cc.find("num",bg);
                        var icon = cc.find("icon",bg);
                        var nick = cc.find("nick",bg);
                        var score = cc.find("score",bg);


                        num.getComponent("cc.Label").string = (i+1)+"";
                        if(rankData.url && rankData.url.length>10)
                            self.loadPic(icon,rankData.url);
                        nick.getComponent("cc.Label").string = rankData.nick;
                        score.getComponent("cc.Label").string = rankData.score+"";

                        self.node_paiming_content.addChild(item);

                        if(rankData.selfFlag)
                        {
                            self.node_paiming_num.getComponent("cc.Label").string = (i+1)+"";
                            self.loadPic(self.node_paiming_icon,rankData.url);
                            self.node_paiming_nick.getComponent("cc.Label").string = rankData.nick;
                            self.node_paiming_score.getComponent("cc.Label").string = rankData.score+"";
                        }

                    }
                }

            });
        }
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

    share: function()
    {
        this.main.wxGropShare();
    }

    
});
