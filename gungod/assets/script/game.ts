const {ccclass, property} = cc._decorator;

import { storage } from "./storage";
import { res } from "./res";
import { config } from "./config";
import { player } from "./game/player";

var gg = window["gg"];


@ccclass
export default class game extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;
    @property(cc.Node)
    gameNode: cc.Node = null;
    @property(cc.Node)
    gameMap: cc.Node = null;
    @property(cc.Label)
    coinLabel: cc.Label = null;
   
    maps = [];
    bgcolor = cc.color(36,106,206);
    platformZindex = 9999;
    opas = [1,0.68,0.68,0.88,1.4,3.6,5];
    gameState = "stop";
    currFloor = 0;
    
    playerSc = null;
    
    onLoad () {
        this.initPhysics();
        this.addListener();
        this.initData();
    }

    start () {
        this.initMap();
        this.initPlayer();
    }

    initPhysics()
    {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit ;
        // cc.PhysicsManager.DrawBits.e_jointBit |
        // cc.PhysicsManager.DrawBits.e_shapeBit;

        //cc.director.getPhysicsManager().debugDrawFlags = 0;
        //cc.PhysicsManager.FIXED_TIME_STEP = 1/30;
        cc.PhysicsManager.VELOCITY_ITERATIONS = 1;
        cc.PhysicsManager.POSITION_ITERATIONS = 1;
        //cc.PhysicsManager.MAX_ACCUMULATOR = cc.PhysicsManager.FIXED_TIME_STEP*2;
        cc.director.getPhysicsManager().enabledAccumulator = false;
        cc.director.getPhysicsManager().gravity = cc.v2(0,0);

        // cc.director.getPhysicsManager()._debugDrawer.node.group = "game";
        // cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
        // var manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        //manager.enabledDebugDraw = true;
        //manager.enabledDrawBoundingBox = true;

    }

    addListener ()
    {
        var s = cc.winSize;
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            var pos = event.getLocation();
            this.touchDown(pos);

        }, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            var pos = event.getLocation();
            this.touchMove(pos);
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var pos = event.getLocation();
            this.touchUp(pos);
        }, this);
    }

    initData(){
        gg.coin = storage.getStorage(storage.coin);
        this.bgcolor = config.bgcolor[Math.floor(Math.random()*config.bgcolor.length)];
    }

    initMap(){
        this.gameMap.y = -cc.winSize.height/2;
        for(var i=0;i<8;i++)
        {
            this.addMap(0);
        }
    }

    addMap(time){
        var platformnum = this.maps.length;
        var platform = res.getObjByPool("prefab_game_platform");
        platform.x = 0;
        platform.opacity = 0;
        platform.color = this.bgcolor;

        var floornum = Math.floor(Math.random()*4)+3;
        platform["floornum"] = floornum;
        platform["floor"] = [];
        platform["wujian"] = null;
        platform["move"] = false;
        if(platformnum>0)
        {
            var lastMap = this.maps[platformnum-1];
            var lastfloornum = lastMap["floornum"];
            platform.height = lastfloornum*50;
            var y = lastMap.y + lastMap.height/2 + platform.height/2;
            platform.y = y;
            platform.getComponent(cc.PhysicsBoxCollider).size.height = platform.height;

            //添加物件
            if(Math.random()>0.4)
            {
                var wupin = new cc.Node();
                wupin.addComponent(cc.Sprite);
                wupin.anchorY = 0;
                wupin.opacity = 0;
                wupin.x = -(50*floornum + (platform.width/2-50*floornum)/2);
                if(this.platformZindex%2==0) 
                {
                    wupin.x = -wupin.x;
                    wupin.scaleX = -1;
                }
                wupin.y = platform.height/2+50*floornum;
                wupin.parent = platform;
                res.setSpriteFrame("images/wujian/wujian_"+(Math.floor(Math.random()*19)+1),wupin);
                platform["wujian"] = wupin;
            }
        }
        else
        {
            platform.y = platform.height/2;
        }

        for(var i=0;i<floornum;i++)
        {
            var floor = res.getObjByPool("prefab_game_floor");
            floor.color = this.bgcolor;
            floor.opacity = 0;
            floor.x = 50*i+platform.width/2;
            floor.y = platform.height/2+50*(i+1)-25;
            if(this.platformZindex%2==1) floor.x = -floor.x;
            floor.parent = platform;
            platform["floor"].push(floor);
        }
        platform.zIndex = this.platformZindex;
        this.gameMap.addChild(platform);
        this.maps.push(platform);
        this.platformZindex --;

        this.setPhysics(platform,false);
        this.updateOpa(time);
    }

    removeMap(){
        var platform = this.maps[0];
        //判断是否超出屏幕
        var y = this.camera.node.convertToWorldSpaceAR(platform.position).y-cc.winSize.height-platform["floornum"]*50;
        if(y<0) return;

        if(platform["wujian"])platform["wujian"].destroy();
        platform["move"] = false;

        for(var i=0;i<platform["floor"].length;i++)
        {
            // platform["floor"][i].destroy();
            res.putObjByPool(platform["floor"][i],"prefab_game_floor");
        }
        res.putObjByPool(platform,"prefab_game_platform");
       
        this.maps.shift();
    }
    //更新透明度
    updateOpa(time){
        var n = 0;
        for(var i=0;this.maps.length;i++)
        {
            var pla = this.maps[i];
            if(!pla) break;
            var opa = 255-n*40;
            if(pla.opacity!=opa) cc.tween(pla).to(time,{ opacity: opa}).start();
           
            for(var j=0;j<pla["floor"].length;j++)
            {
                var opa2 = opa;
                if(this.opas.length>n) opa2 *= this.opas[n];
                if(pla["floor"][j].opacity!=opa2) cc.tween(pla["floor"][j]).to(time,{ opacity: opa2}).start();
            }
            var opa3 = opa;
            if(this.opas.length>n) opa3 *= this.opas[n];
            if(pla["wujian"])
            {
                var opa2 = opa;
                if(this.opas.length>n) opa2 *= this.opas[n]/2;
                if(pla["move"]) opa2 = 0;
                if(pla["wujian"].opacity!=opa2) cc.tween(pla["wujian"]).to(time,{ opacity: opa2}).start();
            }
            if(!pla["move"]) n++;

        }
    }

    setPhysics(platform,enabled){
        platform.getComponent(cc.PhysicsBoxCollider).enabled = enabled;
        for(var i=0;i<platform["floor"].length;i++)
        {
            platform["floor"][i].getComponent(cc.PhysicsBoxCollider).enabled = enabled;
        }
    }

    initPlayer(){
        var playerNode = cc.instantiate(res.loads["prefab_game_player"]);
        playerNode.y = 300;
        this.gameMap.addChild(playerNode,9999);
        this.playerSc = playerNode.getComponent(player);
    }

    startGame(){
        this.excNext();
    }

    excNext(){
        var platform = null;
        for(var i=0;i<this.maps.length;i++)
        {
            platform = this.maps[i];
            if(!platform["move"]) break;
        }
        var floornum = platform["floornum"];
        var x = (50*floornum + (platform.width/2-50*floornum)/2);
        if(this.currFloor%2==0) x = -x;
        
        var y = platform.height/2+50*floornum + platform.y;

        this.playerSc.jump(cc.v2(x,y));
    }

    nextFloor(){
        var platform =  this.maps[0];
        for(var i=0;i<this.maps.length;i++)
        {
            platform = this.maps[i];
            if(!platform["move"]) break;
        }
        platform["move"] = true;
        var floornum = platform["floornum"];
        var h = floornum*50;
        var time = h/400;
        cc.tween(this.camera.node)
        .by(time, { position: cc.v2(0,h)},{easing:"sineIn"})
        .call(() => { 
            this.removeMap(); 
        })
        .start();
        this.addMap(time);
        // this.updateOpa(time);
        this.currFloor ++;
    }

   
    touchDown(pos){

    }

    touchMove(pos){

    }

    touchUp(pos){
        if(this.gameState == "stop")
        {
            this.gameState = "start";
            this.startGame();
        }
        else if(this.gameState == "start")
        {
            this.excNext();
        }
    }

    update (dt) {
       
    }

}
