/**
 * Created by guang on 18/7/18.
 */
var config = require("config");
var storage = require("storage");


cc.Class({
    extends: cc.Component,

    properties: {
        enemy: {
            default: null,
            type: cc.Prefab
        },
        platform: {
            default: null,
            type: cc.Prefab
        },
        bullet: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad: function() {
        this.initPhysics();
        this.initData();
        this.initUI();
        this.addListener();
    },

    initPhysics: function()
    {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_pairBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit;
        cc.director.getPhysicsManager().debugDrawFlags = 0;
        cc.PhysicsManager.FIXED_TIME_STEP = 1/30;
        cc.PhysicsManager.VELOCITY_ITERATIONS = 6;
        cc.PhysicsManager.POSITION_ITERATIONS = 6;
        cc.PhysicsManager.MAX_ACCUMULATOR = cc.PhysicsManager.FIXED_TIME_STEP*2;
        //cc.director.getPhysicsManager().enabledAccumulator = true;
        cc.director.getPhysicsManager().gravity = cc.v2(0,-98);



        //cc.director.getPhysicsManager().attachDebugDrawToCamera(this.gameCamera);
        //var manager = cc.director.getCollisionManager();
        //manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;

    },

    initData: function()
    {

    },


    initUI: function()
    {
        this.main = cc.find("Canvas").getComponent("main");
        this.res = cc.find("Canvas").getComponent("res");
        this.node_game = cc.find("Canvas/node_game");
        this.layer_game = cc.find("layer_game",this.node_game);
        this.gameLayer = cc.find("layer_game/gameLayer",this.node_game);
        this.wall_bottom = cc.find("layer_game/wall/bottom",this.node_game);

        this.player = cc.find("player",this.gameLayer);
        this.player.hand = cc.find("player/hand",this.gameLayer);
        this.player.aim = cc.find("player/hand/aim",this.gameLayer);

        this.bgColors = [
            cc.color(91,105,123),
            cc.color(112,91,123),
            cc.color(123,91,91),
            cc.color(123,115,91),
            cc.color(104,123,91),
            cc.color(91,123,120)
        ];

        this.startGame();
    },

    resetData: function()
    {

    },

    updateUI: function()
    {

    },

    startGame: function()
    {
        this.isCanFire = true;
        this.initMap();
        this.state = "start";
    },

    initMap: function()
    {
        //var s = cc.winSize;
        var h = this.wall_bottom.y;

        var map = config.levels[7];
        for(var i=0;i<map.platform.length;i++)
        {
            var platform = cc.instantiate(this.platform);
            platform.position = map.platform[i];
            platform.y+=h;
            this.gameLayer.addChild(platform);
        }

        for(var i=0;i<map.enemy.length;i++)
        {
            var enemy = cc.instantiate(this.enemy);
            enemy.position = map.enemy[i];
            enemy.y += h;
            this.gameLayer.addChild(enemy);
        }
    },


    gameOver: function()
    {

    },

    updatePlayer:function(pos,isUp)
    {
        if(!this.isCanFire) return;

        var s = cc.winSize;
        var p = pos.sub(cc.v2(s.width/2, s.height/2));
        var dir = p.sub(this.player.position).normalizeSelf();
        var ang = dir.signAngle(cc.v2(1,0));
        var deg = cc.misc.radiansToDegrees(ang);
        if(deg>0) return;
        this.player.hand.rotation = deg;
        var pos1 = this.player.position.addSelf(cc.v2(s.width/2, s.height/2));
        var pos2 = dir.mul(s.height).addSelf(pos1);
        var results = cc.director.getPhysicsManager().rayCast(pos1, pos2, cc.RayCastType.Closest);
        if(results.length)
        {
            var point = results[0].point;
            var dis = point.sub(pos1).mag();
            this.player.aim.width = dis-this.player.hand.width;
        }

        if(isUp)
        {
            this.player.aim.width = 0;

            var bpos = dir.mul(this.player.hand.width).addSelf(this.player.position);
            var bullet = cc.instantiate(this.bullet);
            bullet.position = bpos;
            bullet.getComponent("bullet").init(dir);
            this.gameLayer.addChild(bullet);

            this.isCanFire = false;
        }
    },



    click: function(event,data)
    {
        if(data == "baoxiang")
        {

        }
        else if(data == "adclose")
        {

        }
        cc.log(data);
    },


    addListener: function()
    {
        var s = cc.winSize;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var pos = event.getLocation();
            this.updatePlayer(pos,false);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var pos = event.getLocation();
            this.updatePlayer(pos,false);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pos = event.getLocation();
            this.updatePlayer(pos,true);
        }, this);

    },

    update: function(dt) {
        if(this.state == "start")
        {
            cc.director.getPhysicsManager().update(dt);
        }
    }
});