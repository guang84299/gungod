var storage = require("storage");
cc.Class({
    extends: cc.Component,

    properties: {
        hero: {
            default: null,
            type: cc.Prefab
        },
        enemy: {
            default: null,
            type: cc.Prefab
        },
        bullet: {
            default: null,
            type: cc.Prefab
        },
        prop: {
            default: null,
            type: cc.Prefab
        },
        bomb: {
            default: null,
            type: cc.Prefab
        },
        node_setting: {
            default: null,
            type: cc.Prefab
        },
        node_fuhuo: {
            default: null,
            type: cc.Prefab
        },
        node_over: {
            default: null,
            type: cc.Prefab
        },
        node_rank: {
            default: null,
            type: cc.Prefab
        },
        node_quanxian: {
            default: null,
            type: cc.Prefab
        },
        toast: {
            default: null,
            type: cc.Prefab
        },
        audio_born: {
            type: cc.AudioClip,
            default: null
        },
        audio_button: {
            type: cc.AudioClip,
            default: null
        },
        audio_dead: {
            type: cc.AudioClip,
            default: null
        },
        audio_hurt: {
            type: cc.AudioClip,
            default: null
        },
        audio_kill: {
            type: cc.AudioClip,
            default: null
        },
        audio_levelup: {
            type: cc.AudioClip,
            default: null
        },
        audio_mainBGM: {
            type: cc.AudioClip,
            default: null
        },
        audio_prop: {
            type: cc.AudioClip,
            default: null
        },
        audio_shoot: {
            type: cc.AudioClip,
            default: null
        },
        audio_skill: {
            type: cc.AudioClip,
            default: null
        }
    },

    onLoad: function()
    {
        this.initConfigs();
        this.enemyPool = new cc.NodePool();
        for (var i = 0; i < 40; ++i) {
            var enemy = cc.instantiate(this.enemy);
            this.enemyPool.put(enemy);
        }

        this.bulletPool = new cc.NodePool();
        for (var i = 0; i < 650; ++i) {
            var bullet = cc.instantiate(this.bullet);
            this.bulletPool.put(bullet);
        }

        this.bombPool = new cc.NodePool();
        for (var i = 0; i < 30; ++i) {
            var bomb = cc.instantiate(this.bomb);
            this.bombPool.put(bomb);
        }

        this.propPool = new cc.NodePool();
        for (var i = 0; i < 5; ++i) {
            var prop = cc.instantiate(this.prop);
            this.propPool.put(prop);
        }
    },

    newHero: function()
    {
        var self = this;

        var hero = cc.instantiate(this.hero);
        hero.circle = cc.find("circle",hero);
        hero.qiu = cc.find("qiu",hero);
        hero.range = cc.find("range",hero);
        hero.lv = cc.find("lv",hero).getComponent("cc.Label");
        hero.lv.string = "Lv.1";
        hero.scale = 0;
        hero.circle.runAction(cc.repeatForever(cc.rotateBy(1,180)));
        //hero.qiu.runAction(cc.repeatForever(cc.sequence(
        //    cc.tintTo(2,cc.color(52,224,240)),
        //    cc.tintTo(2,cc.color(240,218,16)),
        //    cc.tintTo(2,cc.color(250,2,124)),
        //    cc.tintTo(2,cc.color(136,18,244))
        //)));
        hero.qiu.color = this.colors[0];
        hero.runAction(cc.sequence(
            cc.scaleTo(0.3,1.3).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                storage.playSound(self.audio_born);
            }),
            cc.scaleTo(0.2,1).easing(cc.easeSineOut())
        ));

        hero.config = {};
        hero.config.lv = 1;
        hero.config.fireType = 1;
        hero.config.fire = 1;
        hero.config.attackRange = 240;
        hero.config.moveSpeed = 80;
        hero.config.fireSpeed = 8;//1-50
        hero.config.bulletSpeed = 500;
        hero.config.fireAdd = 1;
        hero.config.moveSpeedAdd = 1;
        hero.config.fireSpeedAdd = 1;
        hero.config.bulletSpeedAdd = 1;
        hero.config.attackRangeAdd = 1;

        //this.props = [
        //    {desc:"等级+1",type:1,val:1},//1
        //    {desc:"攻击范围+10",type:2,val:9},//2
        //    {desc:"移动速度+10",type:3,val:10},//3
        //    {desc:"开火速度+1",type:4,val:0.5},//4
        //    {desc:"死神旋风",type:5,val:5},//5
        //    {desc:"无敌枪神",type:6,val:5},//6
        //];


        hero.range.opacity = 0;
        hero.range.setContentSize(cc.size(hero.config.attackRange*2,hero.config.attackRange*2));
        //hero.range.runAction(cc.repeatForever(cc.sequence(
        //    cc.delayTime(2),
        //    cc.fadeTo(0.5,100).easing(cc.easeSineIn()),
        //    cc.delayTime(1),
        //    cc.fadeTo(0.5,0).easing(cc.easeSineOut())
        //)));
        return hero;
    },
    updateHeroByLv: function(hero,lv)
    {
        hero.config.fire = lv;
        hero.config.lv = lv;
        hero.qiu.color = this.colors[hero.config.lv%30];
        hero.lv.string = "Lv."+hero.config.lv;
    },
    updateHeroByPropId: function(hero,id)
    {
        storage.playSound(this.audio_prop);

        var self = this;
        var prop = this.props[id-1];
        if(prop.type == 1)
        {
            hero.config.fire += prop.val;
            hero.config.lv += prop.val;
            hero.qiu.color = this.colors[hero.config.lv%30];
            hero.lv.string = "Lv."+hero.config.lv;

            this.showToast("等级提升！",0.8);
            var bomb = this.newBomb(cc.color(255,255,0));
            bomb.position = hero.position;
            bomb.scale = 1.8;
            bomb.parent =  hero.parent;
            bomb.runAction(cc.sequence(
                cc.delayTime(2),
                cc.callFunc(function(){
                    self.destoryBomb(bomb);
                })
            ));

            storage.playSound(this.audio_levelup);
        }
        else if(prop.type == 2)
        {
            hero.config.attackRange += prop.val;
            hero.range.setContentSize(cc.size(hero.config.attackRange*2,hero.config.attackRange*2));
        }
        else if(prop.type == 3)
        {
            hero.config.moveSpeed += prop.val;
        }
        else if(prop.type == 4)
        {
            hero.config.fireSpeed += prop.val;
        }
        else if(prop.type == 5)
        {
            hero.config.fireType = 2;
            hero.circle.stopActionByTag(1);
            var ac = cc.sequence(
                cc.delayTime(prop.val),
                cc.callFunc(function(){
                    hero.config.fireType = 1;
                })
            );
            ac.setTag(1);
            hero.circle.runAction(ac);
            storage.playSound(this.audio_skill);
        }
        else if(prop.type == 6)
        {
            hero.config.fireType = 3;
            hero.circle.stopActionByTag(1);
            var ac = cc.sequence(
                cc.delayTime(prop.val),
                cc.callFunc(function(){
                    hero.config.fireType = 1;
                })
            );
            ac.setTag(1);
            hero.circle.runAction(ac);
            storage.playSound(this.audio_skill);
        }

    },

    newEnemy: function(lv)
    {
        var self = this;

        var enemy = null;
        if (this.enemyPool.size() > 0) {
            enemy = this.enemyPool.get();
        } else {
            enemy = cc.instantiate(this.enemy);
        }

        enemy.qiu = cc.find("qiu",enemy);
        enemy.lv = cc.find("lv",enemy).getComponent("cc.Label");
        enemy.lv.string = lv;
        enemy.scale = 0;
        enemy.qiu.color = this.colors[lv%30];
        enemy.stopAllActions();
        enemy.runAction(cc.sequence(
            cc.scaleTo(0.3,1.3).easing(cc.easeSineIn()),
            cc.callFunc(function(){
                storage.playSound(self.audio_born);
            }),
            cc.scaleTo(0.2,1).easing(cc.easeSineOut()),
            cc.callFunc(function(){
                enemy.state = "idle";
            })
        ));
        enemy.state = "born";
        enemy.config = {};
        enemy.config.lv = lv;
        enemy.config.fire = 1;
        enemy.config.attackRange = 160;
        enemy.config.moveSpeed = 80 + lv*0.7;
        enemy.config.fireSpeed = 2;
        enemy.config.bulletSpeed = 400;

        enemy.config.fireAdd = 1;
        enemy.config.moveSpeedAdd = 1;
        enemy.config.fireSpeedAdd = 1;
        enemy.config.bulletSpeedAdd = 1;
        enemy.config.attackRangeAdd = 1;

        enemy.config.fireDt = 1;

        return enemy;
    },

    updateEnemyLv: function(enemy)
    {
        var lv = enemy.config.lv;
        enemy.qiu.color = this.colors[lv%30];
        enemy.lv.string = lv;
    },

    destoryEnemy: function(enemy)
    {
        this.enemyPool.put(enemy);
    },

    newBullet: function(config)
    {
        var bullet = null;
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get();
        } else {
            bullet = cc.instantiate(this.bullet);
        }
        bullet.stopAllActions();

        bullet.color = this.colors[config.lv%30];
        bullet.state = "move";
        bullet.config = {};
        bullet.config.lv = config.lv;
        bullet.config.fire = config.fire*config.fireAdd;
        bullet.config.bulletSpeed = config.bulletSpeed*config.bulletSpeedAdd;

        storage.playSound(this.audio_shoot);

        return bullet;
    },

    destoryBullet: function(bullet)
    {
        this.bulletPool.put(bullet);
    },

    newBomb: function(color)
    {
        var bomb = null;
        if (this.bombPool.size() > 0) {
            bomb = this.bombPool.get();
        } else {
            bomb = cc.instantiate(this.bomb);
        }
        var par = bomb.getComponent("cc.ParticleSystem");
        par.resetSystem();
        par.startColor = color;
        par.startColorVar = cc.color(0,0,0);
        par.endColor = color;
        par.endColorVar = cc.color(0,0,0);
        return bomb;
    },

    destoryBomb: function(bomb)
    {
        this.bombPool.put(bomb);
    },

    newProp: function(id)
    {
        var prop = null;
        if (this.propPool.size() > 0) {
            prop = this.propPool.get();
        } else {
            prop = cc.instantiate(this.prop);
        }
        prop.qiu = cc.find("qiu",prop);
        prop.desc = cc.find("desc",prop).getComponent("cc.Label");
        prop.desc.string = this.props[id-1].desc;
        prop.scale = 0;
        prop.qiu.stopAllActions();
        prop.qiu.runAction(cc.repeatForever(cc.sequence(
            cc.tintTo(2,cc.color(52,224,240)),
            cc.tintTo(2,cc.color(240,218,16)),
            cc.tintTo(2,cc.color(250,2,124)),
            cc.tintTo(2,cc.color(136,18,244))
        )));
        prop.stopAllActions();
        prop.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0.3,1.3).easing(cc.easeSineIn()),
            cc.scaleTo(0.2,1).easing(cc.easeSineOut()),
            cc.delayTime(2)
        )));
        prop.config = {};
        prop.config.id = id;
        prop.config.time = 10;
        return prop;
    },

    destoryProp: function(prop)
    {
        this.propPool.put(prop);
    },


    showToast: function(str,time)
    {
        time = time ? time : 1;
        var toast = cc.instantiate(this.toast);
        cc.find("label",toast).getComponent("cc.Label").string = str;
        toast.opacity = 0;
        toast.y = cc.winSize.height*0.4;
        this.node.addChild(toast,1000);

        var seq = cc.sequence(
            cc.fadeIn(time/2),
            cc.delayTime(time),
            cc.fadeOut(time/2),
            cc.removeSelf()
        );
        toast.runAction(seq);
    },

    initConfigs: function()
    {
        //this.herolvs = [
        //    {fire:1,attackRange:200,moveSpeed:100,fireSpeed:100,bulletSpeed:100},//1
        //    {fire:1,attackRange:200,moveSpeed:100,fireSpeed:100,bulletSpeed:100},//2
        //    {fire:1,attackRange:200,moveSpeed:100,fireSpeed:100,bulletSpeed:100},//3
        //];
        //this.enemylvs = [
        //    {fire:1,attackRange:200,moveSpeed:100,fireSpeed:100,bulletSpeed:100},//1
        //    {fire:1,attackRange:200,moveSpeed:100,fireSpeed:100,bulletSpeed:100},//2
        //    {fire:1,attackRange:200,moveSpeed:100,fireSpeed:100,bulletSpeed:100},//3
        //];
        this.colors = [
            cc.color(100,149,237),cc.color(65,105,225),cc.color(30,144,255),cc.color(70,130,180),cc.color(0,191,255),
            cc.color(0,206,209),cc.color(0,255,255),cc.color(0,128,128),cc.color(127,255,212),cc.color(0,250,154),
            cc.color(60,179,113),cc.color(46,139,87),cc.color(143,188,143),cc.color(50,205,50),cc.color(34,139,34),
            cc.color(173,255,47),cc.color(154,205,50),cc.color(107,142,35),cc.color(240,230,140),cc.color(255,215,0),
            cc.color(255,222,173),cc.color(255,165,0),cc.color(255,140,0),cc.color(255,160,122),cc.color(255,127,80),
            cc.color(147,112,219),cc.color(186,85,211),cc.color(148,0,211),cc.color(128,0,128),cc.color(75,0,130)
        ];
        this.props = [
            {desc:"等级+1",type:1,val:1},//1
            {desc:"攻击范围+10",type:2,val:9},//2
            {desc:"移动速度+10",type:3,val:10},//3
            {desc:"开火速度+1",type:4,val:0.5},//4
            {desc:"死神旋风",type:5,val:5},//5
            {desc:"无敌枪神",type:6,val:6},//6
        ];
        this.levels = [
            //1
            {type:1,delayTime:1,intervalTime:2,lv:1,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:2,num:2},
            {type:1,delayTime:1,intervalTime:0.2,lv:3,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:4,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.2,lv:5,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:6,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:7,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:8,num:10},
            {type:1,delayTime:1,intervalTime:1,lv:9,num:10},
            {type:1,delayTime:1,intervalTime:1,lv:10,num:10},

            //2
            {type:1,delayTime:1,intervalTime:2,lv:11,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:12,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:13,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:14,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:15,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:16,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:17,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:18,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:19,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:20,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:20,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //3
            {type:1,delayTime:1,intervalTime:2,lv:21,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:22,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:23,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:24,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:25,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:26,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:27,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:28,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:29,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:30,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:30,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //4
            {type:1,delayTime:1,intervalTime:2,lv:31,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:32,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:33,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:34,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:35,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:36,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:37,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:38,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:39,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:40,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:40,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //5
            {type:1,delayTime:1,intervalTime:2,lv:41,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:42,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:43,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:44,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:45,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:46,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:47,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:48,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:49,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:50,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:50,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //6
            {type:1,delayTime:1,intervalTime:2,lv:51,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:52,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:53,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:54,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:55,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:56,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:57,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:58,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:59,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:60,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:60,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //7
            {type:1,delayTime:1,intervalTime:2,lv:61,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:62,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:63,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:64,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:65,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:66,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:67,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:68,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:69,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:70,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:70,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //8
            {type:1,delayTime:1,intervalTime:2,lv:71,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:72,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:73,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:74,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:75,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:76,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:77,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:78,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:79,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:80,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:80,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //9
            {type:1,delayTime:1,intervalTime:2,lv:81,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:82,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:83,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:84,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:85,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:86,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:87,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:88,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:89,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:90,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:90,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //10
            {type:1,delayTime:1,intervalTime:2,lv:91,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:92,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:93,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:94,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:95,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:96,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:97,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:98,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:99,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:100,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:100,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //11
            {type:1,delayTime:1,intervalTime:2,lv:101,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:102,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:103,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:104,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:105,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:106,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:107,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:108,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:109,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:110,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:110,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //12
            {type:1,delayTime:1,intervalTime:2,lv:111,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:112,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:113,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:114,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:115,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:116,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:117,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:118,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:119,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:120,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:120,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //13
            {type:1,delayTime:1,intervalTime:2,lv:121,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:122,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:123,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:124,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:125,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:126,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:127,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:128,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:129,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:130,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:130,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //14
            {type:1,delayTime:1,intervalTime:2,lv:131,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:132,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:133,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:134,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:135,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:136,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:137,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:138,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:139,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:140,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:140,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //15
            {type:1,delayTime:1,intervalTime:2,lv:141,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:142,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:143,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:144,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:145,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:146,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:147,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:148,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:149,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:150,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:150,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //16
            {type:1,delayTime:1,intervalTime:2,lv:151,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:152,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:153,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:154,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:155,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:156,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:157,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:158,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:159,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:160,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:160,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //17
            {type:1,delayTime:1,intervalTime:2,lv:161,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:162,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:163,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:164,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:165,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:166,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:167,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:168,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:169,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:170,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:170,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //18
            {type:1,delayTime:1,intervalTime:2,lv:171,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:172,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:173,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:174,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:175,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:176,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:177,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:178,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:179,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:180,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:180,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //19
            {type:1,delayTime:1,intervalTime:2,lv:181,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:182,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:183,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:184,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:185,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:186,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:187,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:188,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:189,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:190,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:190,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //20
            {type:1,delayTime:1,intervalTime:2,lv:191,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:192,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:193,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:194,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:195,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:196,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:197,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:198,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:199,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:200,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:200,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //21
            {type:1,delayTime:1,intervalTime:2,lv:201,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:202,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:203,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:204,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:205,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:206,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:207,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:208,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:209,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:210,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:210,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //22
            {type:1,delayTime:1,intervalTime:2,lv:211,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:212,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:213,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:214,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:215,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:216,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:217,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:218,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:219,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:220,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:220,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //23
            {type:1,delayTime:1,intervalTime:2,lv:221,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:222,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:223,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:224,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:225,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:226,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:227,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:228,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:229,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:230,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:230,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //24
            {type:1,delayTime:1,intervalTime:2,lv:231,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:232,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:233,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:234,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:235,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:236,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:237,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:238,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:239,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:240,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:240,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //25
            {type:1,delayTime:1,intervalTime:2,lv:241,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:242,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:243,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:244,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:245,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:246,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:247,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:248,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:249,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:250,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:250,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //26
            {type:1,delayTime:1,intervalTime:2,lv:251,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:252,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:253,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:254,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:255,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:256,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:257,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:258,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:259,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:260,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:260,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //27
            {type:1,delayTime:1,intervalTime:2,lv:261,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:262,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:263,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:264,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:265,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:266,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:267,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:268,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:269,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:270,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:270,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //28
            {type:1,delayTime:1,intervalTime:2,lv:271,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:272,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:273,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:274,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:275,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:276,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:277,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:278,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:279,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:280,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:280,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //29
            {type:1,delayTime:1,intervalTime:2,lv:281,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:282,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:283,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:284,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:285,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:286,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:287,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:288,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:289,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:290,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:290,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //30
            {type:1,delayTime:1,intervalTime:2,lv:291,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:292,num:2},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:0.5,lv:293,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:294,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:295,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:3,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:296,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:297,num:8},
            {type:1,delayTime:1,intervalTime:0.3,lv:298,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.3,lv:299,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:4,num:1},
            {type:1,delayTime:1,intervalTime:0,lv:300,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:1,num:1},
            {type:1,delayTime:1,intervalTime:1,lv:300,num:16},
            {type:2,delayTime:1,intervalTime:1,lv:2,num:1},

            //31
            {type:1,delayTime:1,intervalTime:2,lv:300,num:6},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:2,lv:300,num:2},
            {type:1,delayTime:1,intervalTime:0.5,lv:300,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:300,num:8},
            {type:1,delayTime:1,intervalTime:0.2,lv:300,num:8},
            {type:1,delayTime:1,intervalTime:1,lv:300,num:10},
            {type:2,delayTime:1,intervalTime:1,lv:6,num:1},
            {type:1,delayTime:1,intervalTime:0.2,lv:207,num:8},
            {type:1,delayTime:1,intervalTime:0.1,lv:208,num:8},
            {type:2,delayTime:1,intervalTime:1,lv:5,num:1},
            {type:1,delayTime:1,intervalTime:0.1,lv:209,num:8},
            {type:1,delayTime:1,intervalTime:0,lv:210,num:6},
            {type:1,delayTime:1,intervalTime:1,lv:300,num:16},
            {type:1,delayTime:1,intervalTime:0.1,lv:300,num:20}

        ];
    }
});
