var storage = require("storage");
var qianqista = require("qianqista");

cc.Class({
    extends: cc.Component,

    properties: {
        node_display: cc.Node,
        display: cc.Node
    },


    onLoad: function() {
        this.dsize = cc.view.getDesignResolutionSize();
        this.subContextView = this.display.getComponent("cc.WXSubContextView");
        this.subContextView.enabled = false;

        this.subdt = 0;
        this.userInfo = {};
        this.uploadScoreDt = 0;

        this.res = cc.find("Canvas").getComponent("res");
        this.initData();
        this.initUI();
        this.addListener();
        storage.playMusic(this.res.audio_mainBGM);

        this.wxGetUserInfo();
        this.wxOpenQuan();
        this.wxVideoLoad();

        this.node_display.active = false;

        var self = this;
        this.qianqista = qianqista;
        qianqista.init("wx35c2e9513b8cc097","8a1126dfbcf8ca52750956ba8adde717","测试",function(){
            qianqista.datas(function(res){
                console.log('my datas:', res);
                if(res.state == 200)
                {
                    self.updateLocalData(res.data);
                }
            });
        });
        qianqista.control(function(res){
            console.log('my control:', res);
            if(res.state == 200)
            {
                self.GAME.control = res.data;
                self.updateUIControl();

            }
        });
    },

    initData: function()
    {
        this.GAME = {};
        this.GAME.state = "stop";
        if(storage.getFirst() == 0)
        {
            storage.setFirst(1);
            storage.setMusic(1);
            storage.setSound(1);
            storage.setVibrate(1);
            storage.setScore(0);
            storage.setShareGroupList("groups:");
            storage.setShareGroupTime(-1);
        }

    },

    initUI: function()
    {
        this.node_main = cc.find("Canvas/node_main");
        this.node_main_start = cc.find("start",this.node_main);
        this.node_main_bottom = cc.find("bottom",this.node_main);
        this.node_main_start.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.6,1.1).easing(cc.easeSineIn()),
            cc.scaleTo(0.5,1).easing(cc.easeSineOut())
        )));

        this.node_game = cc.find("Canvas/node_game");
        this.node_game_game = cc.find("game",this.node_game);
        this.node_game_score = cc.find("score",this.node_game).getComponent("cc.Label");

        this.updateUI();
    },

    updateUI: function()
    {

    },

    updateScore: function()
    {
        this.node_game_score.string = this.GAME.score + "";
    },

    updateLocalData: function(data)
    {
        if(data)
        {
            var datas = JSON.parse(data);
            if(datas.score)
                storage.setScore(parseInt(datas.score));
        }
        else
        {
            this.uploadData();
        }
    },

    updateData: function()
    {
        var self = this;
        qianqista.datas(function(res){
            console.log('my datas:', res);
            if(res.state == 200)
            {
                self.updateLocalData(res.data);
            }
        });
    },

    uploadData: function()
    {
        var datas = {};
        datas.score = storage.getScore();
        var data = JSON.stringify(datas);
        var self = this;
        qianqista.uploaddatas(data,function(res){
            console.log("--uploaddatas:",res);
            if(res && res.state == 200)
                self.updateData();
        });
    },

    updateUIControl: function()
    {
        this.GAME.share = false;
        this.GAME.sharepic = null;
        this.GAME.sharetxt = null;
        if(this.GAME.control.length>0)
        {
            for(var i=0;i<this.GAME.control.length;i++)
            {
                var con = this.GAME.control[i];
                if(con.id == "share2")
                {
                    if(con.value == "1")
                    {
                        this.GAME.share = true;
                    }
                }
                else if(con.id == "sharepic")
                {
                    this.GAME.sharepic = con.value;
                }
                else if(con.id == "sharetxt")
                {
                    this.GAME.sharetxt = con.value;
                }
            }
        }
    },

    click: function(event,data)
    {
        if(data == "start")
        {
            this.startGame();
        }
        else if(data == "setting")
        {
            this.openSetting();
        }
        else if(data == "rank")
        {
            this.openRank();
        }
        else if(data == "pk")
        {
            this.wxGropShare();
        }
        storage.playSound(this.res.audio_button);
        cc.log(data);
    },

    openSetting: function()
    {
        var node_setting = cc.instantiate(this.res.node_setting);
        this.node.addChild(node_setting);
        this.setting = node_setting.getComponent("setting");
        this.setting.show();
    },

    openFuhuo: function()
    {
        var node_fuhuo = cc.instantiate(this.res.node_fuhuo);
        this.node.addChild(node_fuhuo);
        this.fuhuo = node_fuhuo.getComponent("fuhuo");
        this.fuhuo.show();

        this.wxBannerShow();
    },

    openOver: function()
    {
        this.wxOverRank();
        var node_over = cc.instantiate(this.res.node_over);
        this.node.addChild(node_over);
        this.over = node_over.getComponent("over");
        this.over.show();

        this.wxBannerHide();
    },

    openRank: function()
    {
        this.wxRank();
        var node_rank = cc.instantiate(this.res.node_rank);
        this.node.addChild(node_rank);
        this.rank = node_rank.getComponent("rank");
        this.rank.show();
    },


    startGame: function()
    {
        this.wxQuanState(false);
        this.node_main.active = false;
        this.node_game_game.destroyAllChildren();

        this.hero = this.res.newHero();
        this.node_game_game.addChild(this.hero);

        this.GAME.state = "start";
        this.GAME.score = 0;
        this.GAME.fuhuonum = 3;
        this.GAME.maxlv = 1;
        this.GAME.currLv = 0;
        var levelData = JSON.stringify(this.res.levels[this.GAME.currLv]);
        this.GAME.currLvConfig = JSON.parse(levelData);
        this.GAME.intervalTime = this.GAME.currLvConfig.intervalTime;
        this.GAME.heroFireDt = 0;

        this.enemys = [];
        this.herobullets = [];
        this.enemybullets = [];
        this.props = [];

        this.updateScore();

        this.wxBannerShow();
    },


    updateLevel: function(dt)
    {
        this.GAME.currLvConfig.delayTime -= dt;
        if(this.GAME.currLvConfig.delayTime < 0)
        {
            this.GAME.intervalTime += dt;
            if(this.GAME.intervalTime>this.GAME.currLvConfig.intervalTime)
            {
                this.GAME.intervalTime = 0;
                var ew = 50;
                if(this.GAME.currLvConfig.type == 1)
                {
                    var enemy = this.res.newEnemy(this.GAME.currLvConfig.lv);

                    if(Math.random()>0.5)
                    {
                        enemy.x = (Math.random() - 0.5) * 2 * (cc.winSize.width/2-ew);
                        if(Math.random()>0.5)
                            enemy.y = cc.winSize.height/2 - ew;
                        else
                            enemy.y = -cc.winSize.height/2 + ew;
                        var dis = this.hero.position.sub(enemy.position).mag();
                        if(dis < 300)
                        {
                            if(this.hero.x < 0)
                                enemy.x = cc.winSize.width/2 - ew;
                            else
                                enemy.x = -cc.winSize.width/2 + ew;
                        }
                    }
                    else
                    {
                        enemy.y = (Math.random() - 0.5) * 2 * (cc.winSize.height/2-ew);
                        if(Math.random()>0.5)
                            enemy.x = cc.winSize.width/2 - ew;
                        else
                            enemy.x = -cc.winSize.width/2 + ew;
                        var dis = this.hero.position.sub(enemy.position).mag();
                        if(dis < 300)
                        {
                            if(this.hero.y < 0)
                                enemy.y = cc.winSize.height/2 - ew;
                            else
                                enemy.y = -cc.winSize.height/2 + ew;
                        }
                    }

                    this.node_game_game.addChild(enemy);
                    this.enemys.push(enemy);
                }
                else
                {
                    var porp = this.res.newProp(this.GAME.currLvConfig.lv);
                    porp.x = (Math.random() - 0.5) * 2 * (cc.winSize.width/2-ew*4);
                    porp.y = (Math.random() - 0.5) * 2 * (cc.winSize.height/2-ew*6);

                    var dis = this.hero.position.sub(porp.position).mag();
                    if(dis < 160)
                    {
                        porp.y = cc.winSize.height/2-ew*6;
                        dis = this.hero.position.sub(porp.position).mag();
                        if(dis < 160)
                            porp.x = cc.winSize.width/2-ew*4;
                    }
                    this.node_game_game.addChild(porp,1000);
                    this.props.push(porp);
                }

                this.GAME.currLvConfig.num -= 1;
                if(this.GAME.currLvConfig.num <= 0)
                {
                    this.GAME.currLv ++;
                    this.GAME.currLv = this.GAME.currLv >= this.res.levels.length ? this.res.levels.length-15 : this.GAME.currLv;

                    var levelData = JSON.stringify(this.res.levels[this.GAME.currLv]);
                    this.GAME.currLvConfig = JSON.parse(levelData);
                    this.GAME.intervalTime = this.GAME.currLvConfig.intervalTime;
                }
            }
        }
    },

    updateHero: function(dt)
    {
        var self = this;
        //找到距离最近的敌人
        var target = null;
        for(var i=0;i<this.enemys.length;i++)
        {
            var enemy = this.enemys[i];
            if(enemy.state != "die" && enemy.state != "born")
            {
                if(target)
                {
                    var dis = this.hero.position.sub(enemy.position).mag();
                    var dis2 = this.hero.position.sub(target.position).mag();
                    if(dis < dis2)
                    {
                        target = enemy;
                    }
                }
                else
                {
                    var dis = this.hero.position.sub(enemy.position).mag();
                    if(dis < (this.hero.config.attackRange+50)*this.hero.config.attackRangeAdd)
                        target = enemy;
                }
            }
        }
        this.GAME.heroFireDt += dt;
        //开火
        if(target)
        {
            if(this.hero.config.fireType == 1 && this.GAME.heroFireDt > 1/(this.hero.config.fireSpeed*this.hero.config.fireSpeedAdd))
            {
                this.GAME.heroFireDt = 0;

                this.addBullet(true,this.hero,target);
            }
            this.hero.range.opacity = 200;
        }
        else
        {
            this.hero.range.opacity = 0;
        }

        //吃道具
        for(var i=0;i<this.props.length;i++)
        {
            var prop = this.props[i];
            prop.config.time -= dt;
            if(prop.config.time>0)
            {
                var dis = this.hero.position.sub(prop.position).mag();
                if(dis < 130)
                {
                    this.res.updateHeroByPropId(this.hero,prop.config.id);
                    this.props.splice(i,1);
                    this.res.destoryProp(prop);

                    if(this.hero.config.lv > this.GAME.maxlv)
                        this.GAME.maxlv = this.hero.config.lv;
                    break;
                }
            }
            else
            {
                this.props.splice(i,1);
                this.res.destoryProp(prop);
                break;
            }
        }

        //死亡旋风
        if(this.hero.config.fireType == 2)
        {
            if(this.GAME.heroFireDt > 0.1)
            {
                this.GAME.heroFireDt = 0;

                if(this.enemys.length>0)
                {
                    var enemy = this.enemys[0];
                    this.enemyHurt(enemy,100,cc.v2(0,0));
                }

                //this.addSkillBullet(this.hero,cc.v2(0,1).rotateSelf(cc.misc.degreesToRadians(this.hero.circle.rotation)));
                //this.addSkillBullet(this.hero,cc.v2(0,1).rotateSelf(cc.misc.degreesToRadians(this.hero.circle.rotation+90)));
                //this.addSkillBullet(this.hero,cc.v2(0,1).rotateSelf(cc.misc.degreesToRadians(this.hero.circle.rotation+180)));
                //this.addSkillBullet(this.hero,cc.v2(0,1).rotateSelf(cc.misc.degreesToRadians(this.hero.circle.rotation+270)));
            }
        }
        else if(this.hero.config.fireType == 3)
        {
            if(this.GAME.heroFireDt > 0.05)
            {
                this.GAME.heroFireDt = 0;
                if(this.enemys.length>0)
                {
                    var enemy = this.enemys[0];
                    this.enemyHurt(enemy,100,cc.v2(0,0));
                }

                //for(var i=0;i<8;i++)
                //{
                //    this.addSkillBullet(this.hero,cc.v2(0,1).rotateSelf(cc.misc.degreesToRadians(this.hero.circle.rotation+360/8*i)));
                //}
            }
        }
    },

    updateEnemy: function(dt)
    {
        for(var i=0;i<this.enemys.length;i++)
        {
            var enemy = this.enemys[i];
            if(enemy.state == "idle")
            {
                enemy.config.fireDt += dt;
                if(enemy.config.fireDt > 1/enemy.config.fireSpeed)
                {
                    enemy.config.fireDt = 0;
                    //var dis = this.hero.position.sub(enemy.position).mag();
                    //if(dis < enemy.config.attackRange+80)//开火
                    //{
                    //    this.addBullet(false,enemy,this.hero);
                    //}
                    //else//行走
                    //{
                        this.moveEnemy(enemy);
                    //}
                }
            }
        }
    },

    updateBulletColl: function(dt)
    {
        //主角子弹和敌人碰撞
        for(var i=0;i<this.herobullets.length;i++)
        {
            var bullet = this.herobullets[i];
            //if(bullet.state == "move")
            for(var j=0;j<this.enemys.length;j++)
            {
                var enemy = this.enemys[j];
                if(enemy.state != "die" && enemy.state != "born")
                {
                    var dis = bullet.position.sub(enemy.position).mag();
                    if(dis<=50)
                    {
                        this.enemyHurt(enemy,bullet.config.fire,bullet.lastdir);
                        this.removeBullet(bullet,true);
                        return;
                    }
                }
            }
        }
        //敌人和主角
        for(var j=0;j<this.enemys.length;j++)
        {
            var enemy = this.enemys[j];
            var dis = enemy.position.sub(this.hero.position).mag();
            if(dis<130)
            {
                this.enemyHurt(enemy,100,cc.v2(0,0));
                if(this.hero.config.lv > 1)
                {
                    this.hero.circle.runAction(cc.sequence(
                            cc.tintTo(0.1,cc.color(255,0,0)),
                            cc.tintTo(0.1,cc.color(255,255,255))
                        ));
                    this.res.showToast("等级下降！",0.6);
                    this.res.updateHeroByLv(this.hero,this.hero.config.lv-1);
                }
                else
                    this.willFinish();
            }
        }
        //敌人子弹和主角
        //for(var i=0;i<this.enemybullets.length;i++)
        //{
        //    var bullet = this.enemybullets[i];
        //    var dis = bullet.position.sub(this.hero.position).mag();
        //    if(dis<=80)
        //    {
        //        this.removeBullet(bullet,false);
        //        return;
        //    }
        //}
    },

    addBullet: function(isHero,sp,target)
    {
        var self = this;

        var bullet = this.res.newBullet(sp.config);
        bullet.position = sp.position;
        this.node_game_game.addChild(bullet);

        var dir = target.position.sub(bullet.position).normalizeSelf();
        var pos = dir.mulSelf(cc.winSize.height).add(bullet.position);
        var time = cc.winSize.height/bullet.config.bulletSpeed;

        bullet.lastdir = dir;
        bullet.runAction(cc.sequence(
            cc.moveTo(time,pos),
            cc.callFunc(function(){
                self.removeBullet(bullet,isHero);
            })
        ));

        if(isHero)
            this.herobullets.push(bullet);
        else
            this.enemybullets.push(bullet);
    },

    addSkillBullet: function(sp,dir)
    {
        var self = this;

        var bullet = this.res.newBullet(sp.config);
        bullet.position = sp.position;
        bullet.config.fire *= 2;
        this.node_game_game.addChild(bullet);

        var pos = dir.mulSelf(cc.winSize.height).add(bullet.position);
        var time = cc.winSize.height/bullet.config.bulletSpeed;

        bullet.lastdir = dir;
        bullet.runAction(cc.sequence(
            cc.moveTo(time,pos),
            cc.callFunc(function(){
                self.removeBullet(bullet,true);
            })
        ));

        this.herobullets.push(bullet);
    },

    removeBullet: function(bullet,isHeroBullet)
    {
        if(isHeroBullet)
        {
            for(var i=0;i<this.herobullets.length;i++)
            {
                if(bullet == this.herobullets[i])
                {
                    this.herobullets.splice(i,1);
                    break;
                }
            }
        }
        else
        {
            for(var i=0;i<this.enemybullets.length;i++)
            {
                if(bullet == this.enemybullets[i])
                {
                    this.enemybullets.splice(i,1);
                    break;
                }
            }
        }
        this.res.destoryBullet(bullet);
    },

    moveHero: function(pos)
    {
        if(this.GAME.state == "start")
        {
            var p = cc.v2(pos.x-cc.winSize.width/2,pos.y-cc.winSize.height/2);
            var dis = this.hero.position.sub(p).mag();

            var time = dis/(this.hero.config.moveSpeed*this.hero.config.moveSpeedAdd);
            this.hero.stopActionByTag(1);
            var ac = cc.moveTo(time,p);
            ac.setTag(1);
            this.hero.runAction(ac);
        }
    },

    moveEnemy: function(enemy)
    {
        var self = this;
        //enemy.state == "move";
        enemy.stopAllActions();
        var pos = this.hero.position.sub(enemy.position).normalize().mulSelf(720).add(enemy.position);
        var time = 720/enemy.config.moveSpeed;

        enemy.runAction(cc.sequence(
            cc.moveTo(time,pos),
            cc.callFunc(function(){
                self.state == "idle";
            })
        ));
    },

    enemyHurt: function(enemy,hurt,dir)
    {
        storage.playSound(this.res.audio_hurt);

        var self = this;
        var score = hurt;
        if(score > enemy.config.lv)
            score = enemy.config.lv;
        this.GAME.score += score;
        this.updateScore();

        enemy.config.lv -= hurt;
        if(enemy.config.lv <= 0)
        {
            enemy.config.lv = 0;
            enemy.state = "die";
            for(var i=0;i<this.enemys.length;i++)
            {
                if(enemy == this.enemys[i])
                {
                    this.enemys.splice(i,1);
                    break;
                }
            }
            var bomb = this.res.newBomb(enemy.qiu.color);
            bomb.position = enemy.position;
            this.node_game_game.addChild(bomb);
            bomb.runAction(cc.sequence(
                cc.delayTime(2),
                cc.callFunc(function(){
                    self.res.destoryBomb(bomb);
                })
            ));
            this.res.destoryEnemy(enemy);
            storage.playSound(this.res.audio_kill);
            storage.vibrate();
        }
        else
        {
            dir = dir.normalizeSelf();
            var pos = dir.mulSelf(10);
            enemy.runAction(cc.sequence(
                cc.moveBy(0.1,pos).easing(cc.easeSineIn()),
                cc.moveBy(0.1,pos.mulSelf(-0.5)).easing(cc.easeSineIn())
            ));
            this.res.updateEnemyLv(enemy);
        }
    },

    willFinish: function()
    {
        if(this.GAME.state == "stop")
            return;
        var self = this;
        this.GAME.state = "stop";
        this.hero.runAction(cc.sequence(
            cc.scaleTo(0.3,1.1).easing(cc.easeSineIn()),
            cc.scaleTo(0.2,0).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                var bomb = self.res.newBomb(cc.color(255,20,0));
                bomb.position = self.hero.position;
                bomb.scale = 1.8;
                self.node_game_game.addChild(bomb);
                self.node_game_game.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.callFunc(function(){
                        self.res.destoryBomb(bomb);
                        self.judgeFuhuo();
                    })
                ));
            })
        ));

        storage.playSound(this.res.audio_dead);
    },

    judgeFuhuo: function()
    {
        if(this.GAME.fuhuonum>0 && this.GAME.share)
        {
            this.openFuhuo();
        }
        else
        {
            this.gameOver();
        }
    },

    fuhuoEnd: function()
    {
        var self = this;
        for(var i=0;i<this.enemys.length;i++)
        {
            var enemy = this.enemys[i];
            var bomb = this.res.newBomb(enemy.qiu.color);
            bomb.position = enemy.position;
            this.node_game_game.addChild(bomb);
            bomb.runAction(cc.sequence(
                cc.delayTime(2),
                cc.callFunc(function(){
                    self.res.destoryBomb(bomb);
                })
            ));
            this.res.destoryEnemy(enemy);
        }
        this.enemys = [];

        var lv = Math.floor(this.GAME.maxlv-1);
        lv = lv <= 0 ? 1 : lv;
        this.res.updateHeroByLv(this.hero,lv);
        this.hero.runAction(cc.sequence(
            cc.scaleTo(0.3,1.3).easing(cc.easeSineIn()),
            cc.scaleTo(0.2,1).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                storage.playSound(self.res.audio_born);
            })
        ));

        this.GAME.state = "start";
    },

    gameOver: function()
    {
        var score = storage.getScore();
        if(this.GAME.score > score)
            storage.setScore(this.GAME.score);
        this.wxUploadScore(Math.floor(this.GAME.score));
        this.node_main.active = true;
        this.node_game_game.destroyAllChildren();
        this.openOver();

        this.uploadData();
    },

    addListener: function()
    {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.moveHero(event.getLocation());
        }, this);
    },

    update: function(dt)
    {
        if(this.GAME.state == "start")
        {
            this.updateLevel(dt);
            this.updateHero(dt);
            this.updateEnemy(dt);
            this.updateBulletColl(dt);

            this.uploadScoreDt += dt;
            if(this.uploadScoreDt > 20)
            {
                this.uploadScoreDt = 0;
                this.wxUploadScore(Math.floor(this.GAME.score));
                this.wxBannerShow();
            }
        }
        else
        {
            this.subdt += dt;
            if(this.subdt > 0.08)
            {
                this.subdt = 0;
                this._updaetSubDomainCanvas();
            }
        }
    },


    wxGetUserInfo: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.getSetting({
                success: function (res) {
                console.log(res.authSetting);
                  if(!res.authSetting["scope.userInfo"])
                  {
                      self.wxOpenSetting();
                  }
                  else
                  {
                      wx.getUserInfo({
                          success: function(res) {
                              self.userInfo = res.userInfo;
                              qianqista.login(true,res.userInfo);
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
                    title: "自从玩了这个游戏，朋友都多了",
                    imageUrl: cc.url.raw("resources/zhuanfa.jpg")
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
    },

    openQuanxian: function()
    {
        var quanxian = cc.instantiate(this.res.node_quanxian);
        this.node.addChild(quanxian);
        this.node_quanxian = quanxian.getComponent("quanxian");
        this.node_quanxian.show();
    },

    wxOpenSetting: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            self.openQuanxian();
            //var quan = self.node_quanxian.quan;
            //var openDataContext = wx.getOpenDataContext();
            //var sharedCanvas = openDataContext.canvas;
            //var sc = sharedCanvas.width/this.dsize.width;
            //var dpi = cc.view._devicePixelRatio;

            var s = cc.view.getFrameSize();

            var pos = cc.v2(s.width/2, s.height/2);

            var button = wx.createUserInfoButton({
                type: 'text',
                text: '获取用户信息',
                style: {
                    left: pos.x-60,
                    top: pos.y+15,
                    width: 120,
                    height: 30,
                    lineHeight: 30,
                    backgroundColor: '#1779a6',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 12,
                    borderRadius: 4
                }
            });
            button.onTap(function(res){
                console.log(res);
                if (res.errMsg.indexOf('auth deny') > -1 ||     res.errMsg.indexOf('auth denied') > -1 ) {
                    qianqista.login(false);
                }
                else
                {
                    self.userInfo = res.userInfo;
                    qianqista.login(true,res.userInfo);
                    wx.postMessage({ message: "loginSuccess",userInfo:res.userInfo });

                    button.destroy();
                    if(cc.isValid(self.node_quanxian))
                        self.node_quanxian.hide();
                }
            });
        }
    },

    _updaetSubDomainCanvas: function() {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            this.subContextView.update();
        }
    },

    wxOpenQuan: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var s = cc.view.getFrameSize();
            var quan = cc.find("quan",this.node_main);
            var sc = s.width/this.dsize.width;
            //var dpi = cc.view._devicePixelRatio;
            var pos = cc.v2((quan.x+cc.winSize.width/2)*sc,(cc.winSize.height/2-quan.y)*sc);
            //var pos = cc.v2(quan.x*sc/dpi,sharedCanvas.height/dpi - quan.y*sc/dpi);
            //pos.y = 20;
            this.quan_button = wx.createGameClubButton({
                icon: 'white',
                style: {
                    left: pos.x - 13,
                    top: pos.y - 13,
                    width: 26,
                    height: 26
                }
            })
        }
    },

    wxQuanState: function(active)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(active)
                this.quan_button.show();
            else
                this.quan_button.hide();
        }
    },

    wxCloseOver: function()
    {
        //if(cc.isValid(this.node_over))
        //    this.node_over.hide();
        var self = this;
        this.node_display.runAction(cc.sequence(
            cc.scaleTo(0.2,1,0).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                self.node_display.active = false;
            })
        ));

        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            wx.postMessage({ message: "closeOver" });
        }
    },

    wxCloseRank: function()
    {
        var self = this;
        this.node_display.runAction(cc.sequence(
            cc.scaleTo(0.2,1,0).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                self.node_display.active = false;
            })
        ));
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            wx.postMessage({ message: "closeRank" });
    },

    wxRank: function()
    {
        this.node_display.active = true;
        this.node_display.opacity = 0;
        this.node_display.runAction(cc.sequence(
            cc.scaleTo(0,1,0),
            cc.fadeIn(0),
            cc.scaleTo(0.3,1,1).easing(cc.easeSineOut())
        ));
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            wx.postMessage({ message: "friendRank" });
    },

    wxOverRank: function(score,playerId,gunId)
    {
        this.node_display.active = true;
        this.node_display.opacity = 0;
        this.node_display.runAction(cc.sequence(
            cc.scaleTo(0,1,0),
            cc.fadeIn(0),
            cc.scaleTo(0.3,1,1).easing(cc.easeSineOut())
        ));
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            wx.postMessage({ message: "overRank",score:score,playerId:playerId,gunId:gunId });
    },


    wxUploadScore: function(score)
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
            wx.postMessage({ message: "updateScore",score:score });
    },

    wxGropShare: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var query = "channel=groupsharemenu";
            var title = "爱玩枪神的小姐姐，身材不会差哟！";
            var imageUrl = cc.url.raw("resources/zhuanfa.jpg");
            if(this.GAME.sharepic)
                imageUrl = this.GAME.sharepic;
            if(this.GAME.sharetxt)
                title = this.GAME.sharetxt;

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

    },

    wxVideoLoad: function()
    {
        var self = this;
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId:'adunit-506949787fc773c5'});
            this.rewardedVideoAd.onLoad(function(){
                console.log('激励视频 广告加载成功')
            });
            this.rewardedVideoAd.onClose(function(res){
                // 用户点击了【关闭广告】按钮
                // 小于 2.1.0 的基础库版本，res 是一个 undefined
                if (res && res.isEnded || res === undefined) {
                    if(self.videocallback)
                        self.videocallback(true);
                }
                else {
                    if(self.videocallback)
                        self.videocallback(false);
                }
                storage.playMusic(self.res.audio_mainBGM);
            });
        }
    },

    wxVideoShow: function(callback)
    {
        var self = this;
        this.videocallback = callback;
        storage.pauseMusic();
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            this.rewardedVideoAd.show().catch(function(err){
                self.rewardedVideoAd.load().then(function(){
                    self.rewardedVideoAd.show();
                });
            });
        }
        else
        {
            if(callback)
                callback(true);
        }
    },

    wxBannerShow: function()
    {
        this.wxBannerHide();
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            var dpi = cc.view.getDevicePixelRatio();
            var s = cc.view.getFrameSize();

            this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-c5b2e0e80388172e',
                style: {
                    left: 0,
                    top: s.height/dpi-300/3.5,
                    width: 300
                }
            });
            var bannerAd = this.bannerAd;
            this.bannerAd.onResize(function(res){
                bannerAd.style.left = s.width/2-res.width/2;
                bannerAd.style.top = s.height-res.height;
            });
            this.bannerAd.show();
        }
    },

    wxBannerHide: function()
    {
        if(cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS)
        {
            if(this.bannerAd)
                this.bannerAd.hide();
        }
    }
});
