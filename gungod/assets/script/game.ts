const {ccclass, property} = cc._decorator;

import { storage } from "./storage";
import { res } from "./res";
import { config } from "./config";
import { player } from "./game/player";
import { enemy } from "./game/enemy";

var gg = window["gg"];


@ccclass
export default class game extends cc.Component {

    @property(cc.Camera)
    camera: cc.Camera = null;
    @property(cc.Node)
    gameNode: cc.Node = null;
    @property(cc.Node)
    gameMap: cc.Node = null;
    @property(cc.Node)
    uiNode: cc.Node = null;
    @property(cc.Node)
    bossNode: cc.Node = null;
    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Label)
    hitenemyLabel: cc.Label = null;
    @property(cc.Label)
    hitheadLabel: cc.Label = null;
    @property(cc.Node)
    startLabel: cc.Node = null;
   
    maps = [];
    bgcolor = cc.color(36,106,206);
    platformZindex = 9999;
    opas = [1,0.68,0.68,0.88,1.4,3.6,5];
    gameState = "stop";
    currFloor = 0;
    canNextFloor = true;
    isBoss = false;
    
    playerSc = null;
    enemySc = null;
    public level = 1;
    levelConf = {id:1,floor:2,bosshp:4};
    currCoin = 0;
    hitEnemy = 0;
    hitHead = 0;
    isFuhuo = false;

    fuhuoData = {pos:cc.v2(),scaleX:1};

    coinPos = null;
    
    onLoad () {
        this.initPhysics();
        this.addListener();
        this.initData();
    }

    start () {
        if(!this.coinPos)
        {
            this.scheduleOnce(function(){
                var coinNode = this.coinLabel.node.parent;
                var pos = coinNode.parent.convertToWorldSpaceAR(coinNode.position);
                this.coinPos = pos.sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            },0.1);
        }
       this.initGame();
       gg.audio.playMusic(res.audio_music,0.5);

       if(config.isTT())  gg.sdk.hideBanner();
    }

    initPhysics()
    {
        cc.director.getPhysicsManager().enabled = true;
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit ;
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
       
    }

    initUI(){

    }

    addCoin(num,pos,isHead){
        pos = pos.sub(this.camera.node.position);
        if(isHead) num*=2;
        for(var i=0;i<num;i++)
        {
            var node = new cc.Node();
            node.addComponent(cc.Sprite);
            this.uiNode.addChild(node);
            res.setSpriteFrame("images/common/coin",node);
            node.scale = 0.8;
            node.x = pos.x;
            node.y = pos.y-cc.winSize.height/2;
            cc.tween(node)
            .to(0.3,{position:cc.v2(node.x+(Math.random()-0.5)*300,node.y+(Math.random()-0.5)*300)},{easing:"sineOut"})
            .to(0.5+0.05*num,{position:this.coinPos},{easing:"sineIn"})
            .call(()=>{
                this.currCoin++;
                this.coinLabel.string = ""+this.currCoin;
            })
            .removeSelf()
            .start();
        }
        gg.audio.playSound(gg.res.audio_coin);
    }

    addCoinAni(num){
        var pos = this.playerSc.node.position.sub(this.camera.node.position);
        for(var i=0;i<num;i++)
        {
            var node = new cc.Node();
            node.addComponent(cc.Sprite);
            this.uiNode.addChild(node);
            res.setSpriteFrame("images/common/coin",node);
            node.scale = 0.8;
            node.x = pos.x;
            node.y = pos.y-cc.winSize.height/2;
            cc.tween(node)
            .to(0.3,{position:cc.v2(node.x+(Math.random()-0.5)*300,node.y+(Math.random()-0.5)*300)},{easing:"sineOut"})
            .to(0.5+0.05*i,{position:this.coinPos},{easing:"sineIn"})
            .call(()=>{
                this.currCoin ++;
                this.coinLabel.string = ""+this.currCoin;
            })
            .removeSelf()
            .start();
        }
        gg.audio.playSound(gg.res.audio_coin);
    }

    addHitEnemy(num){
        this.hitEnemy += num;
        this.hitenemyLabel.string = this.hitEnemy+"";
    }

    addHitHead(num){
        this.hitHead += num;
        if(num==0) this.hitHead = 0;
        this.hitheadLabel.string = this.hitHead+"";
    }

    initGame(){
        this.maps = [];
        this.platformZindex = 9999;
        this.gameState = "stop";
        this.currFloor = 0;
        this.canNextFloor = true;
        this.isBoss = false;
        this.isFuhuo = false;
        this.level = storage.getStorage(storage.level);
        // var level = this.level<=config.levels.length ? this.level : config.levels.length;
        // this.levelConf = config.levels[level-1];
        this.levelConf.id = this.level;
        this.levelConf.floor = this.level+1 > 10 ? 10 : this.level+1;
        this.levelConf.bosshp = this.level+5 > 100 ? 100 : this.level+5;
        this.bgcolor = config.bgcolor[(this.level-1)%config.bgcolor.length];

        this.currCoin = 0;
        this.hitEnemy = 0;
        this.hitHead = 0;
        this.coinLabel.string = "0";
        this.lvLabel.string = "第 "+this.level+" 关";
        this.addHitEnemy(0);
        this.addHitHead(0);

        // this.startLabel.active = true;
        this.bossNode.active = false;
        this.camera.node.stopAllActions();
        this.camera.node.y = 0;
        this.gameMap.destroyAllChildren();
        this.initData();
        this.initMap();
        this.initPlayer();
        this.enemySc = null;
        cc.director.getScheduler().setTimeScale(1);

        gg.sdk.gameRecorderStart();
        this.scheduleOnce(function(){
            this.gameState = "start";
            this.camera.node.y = 0;
            var hasgun = storage.getStorage(storage.hasgun);
            if(this.level>1 && (storage.indexOf(hasgun,5) == -1 || storage.indexOf(hasgun,7) == -1))
            {
                var self = this;
                res.openUI("shiyong",null,function(){
                    self.playerSc.resetZb();
                    self.startGame();
                });
            }
            else
            this.startGame();
        },1)
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
        if(this.level == 1)
        {
            floornum = 4;
        }
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
            platform.height = 400;
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
        var platform = this.maps[0];

        var playerNode = cc.instantiate(res.loads["prefab_game_player"]);
        this.gameMap.addChild(playerNode,9999);
        this.playerSc = playerNode.getComponent(player);
        this.playerSc.initConf(function(){
            playerNode.y =  platform.height/2 + platform.y + playerNode.height/2;
            playerNode.x = platform.width/4;
            playerNode.scaleX = -1;
        });
        
    }

    startGame(){
        this.startLabel.active = false;
        this.excNext();

        gg.sdk.aldLevelStart(this.level);
    }

    excNext(){
        if(!this.canNextFloor) return;
        this.canNextFloor = false;
        var platform = null;
        for(var i=0;i<this.maps.length;i++)
        {
            platform = this.maps[i];
            if(!platform["move"]) break;
        }
        
        this.createEnemys(platform);
        this.setPhysics(platform,true);
    }

    createEnemys(platform){
        if(this.enemySc && !this.enemySc.isDie)
        {
            this.enemyJump(platform);
            return;
        }
        var floornum = platform["floornum"];
        if(this.currFloor>=this.levelConf.floor)
        {
            this.isBoss = true;
        }
        var fn = Math.floor(Math.random()*floornum);
        if(this.level == 1 )//&& this.currFloor == 0
        {
            fn = 0;
        }
        this.createEnemy(platform,fn);
    }

    createEnemy(platform,fn){
        var floornum = platform["floornum"];
        var enemyNode = cc.instantiate(res.loads["prefab_game_enemy"]);
        enemyNode.scaleX = this.currFloor%2==0 ? 1 : -1;
        this.gameMap.addChild(enemyNode,9999);
        this.enemySc = enemyNode.getComponent(enemy);

        var enemyId = Math.floor(Math.random()*config.enemyConf.length+1);
        if(this.isBoss) 
        {
            // enemyId = Math.floor(Math.random()*config.bossConf.length+1);
            enemyId = this.level%config.bossConf.length;
            if(enemyId == 0)enemyId = config.bossConf.length;

            this.bossNode.active = true;
            cc.tween(this.bossNode)
            .then(cc.blink(1,5))
            .call(()=>{
                this.bossNode.active = false;
            })
            .start();
        }
        var self = this;
        this.enemySc.initConf(this.isBoss,enemyId,this.levelConf.bosshp,function(){

            var tarx = 50*floornum + (platform.width/2-50*floornum)/2-25;
            if(self.currFloor%2==0) tarx = -tarx;
            var tary = platform.height/2+50*floornum + platform.y + enemyNode.height/2;

            enemyNode.y = tary;
            enemyNode.x = self.currFloor%2==0? -cc.winSize.width/2-100 : cc.winSize.width/2+100;

            var jumpPos = [cc.v2(tarx,tary)];
            // var fn = enemyNum-n;// Math.floor(Math.random()*n);
            for(var i=1;i<=fn;i++)
            {
                var x =  50*floornum-25 - 50*i;
                if(self.currFloor%2==0) x = -x;
                jumpPos.push(cc.v2(x,tary-50*i));
            }
            self.enemySc.jump(jumpPos,self.currFloor);

        }); 
    }

    playerJump(){
        var platform = null;
        for(var i=0;i<this.maps.length;i++)
        {
            platform = this.maps[i];
            if(!platform["move"]) break;
        }
        var floornum = platform["floornum"];
        var x = (50*floornum + (platform.width/2-50*floornum)/2)-25;
        if(this.currFloor%2==0) x = -x;
        
        var y = platform.height/2+50*floornum + platform.y + this.playerSc.node.height/2;
        this.playerSc.jump(cc.v2(x,y),this.currFloor);

        this.fuhuoData.pos = this.playerSc.node.position;
        this.fuhuoData.scaleX = this.playerSc.node.scaleX;
    }

    enemyJump(platform){
        var floornum = platform["floornum"];
        var fn = Math.floor(Math.random()*floornum);
        if(this.level == 1) fn = 0;
        var x =  50*floornum-25 - 50*fn;// (50*floornum + (platform.width/2-50*floornum)/2)-25 + 50*fn;
        if(this.currFloor%2==0) x = -x;
        
        var y = platform.height/2+50*floornum + platform.y + this.enemySc.node.height/2 - 50*fn;
        this.enemySc.jump2(cc.v2(x,y),this.currFloor);
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
        this.currFloor ++;
        this.setPhysics(platform,false);

        this.canNextFloor = true;
        this.scheduleOnce(this.excNext.bind(this),0.11);
        // this.excNext();
    }

    toOver(){
        this.gameState = "over";
        this.scheduleOnce(function(){
            this.enemySc.winAni();
        },1);

        this.scheduleOnce(function(){
            if(this.isFuhuo) this.gameOver();
            else  res.openUI("fuhuo"); 
        },3);
        if(this.isFuhuo)
        storage.setStorage(storage.sygunid,0);
    }

    toWin(){
        this.gameState = "over";
        
        storage.setStorage(storage.level,this.level+1);
        storage.uploadStorage(storage.level);

        this.scheduleOnce(function(){
            this.playerSc.winAni();
        },1);

        gg.sdk.gameRecorderStop();

        var self = this;
        this.scheduleOnce(function(){
            var sharenum = storage.getStorage(storage.sharenum);
            if(sharenum<2 && config.isTT())
            {
                res.openUI("sharevedio",null,function(awrad){
                    if(awrad>0) 
                    {
                        self.addCoinAni(12);
                        awrad -= 12;
                    }
                    self.scheduleOnce(function(){
                        self.coinLabel.string = ""+(self.currCoin+awrad);
                        res.openUI("win",null,self.currCoin+awrad);
                    },1.5);
                });
            }
            else
            {
                res.openUI("win",null,self.currCoin);
            }
        },3);
        storage.setStorage(storage.sygunid,0);

        gg.sdk.aldLevelEnd(this.level,true);
    }

    nextLevel(){
        this.scheduleOnce(this.initGame.bind(this),0.05);
    }

    toFuhuo(){
        var self = this;
        var playerNode = cc.instantiate(res.loads["prefab_game_player"]);
        this.gameMap.addChild(playerNode,9999);
        this.playerSc = playerNode.getComponent(player);
        this.playerSc.initConf(function(){
            playerNode.position = self.fuhuoData.pos;
            playerNode.scaleX = self.fuhuoData.scaleX;
        });

        this.scheduleOnce(this.playerJump.bind(this),1);
        this.gameState = "start";
        this.isFuhuo = true;

        gg.sdk.aldLevelRunning(this.level);
    }

    toFangqiFuhuo(){
        this.scheduleOnce(function(){
            this.gameOver();
        },0.2);
        storage.setStorage(storage.sygunid,0);
    }

    gameOver(){
        gg.sdk.gameRecorderStop();
        res.openUI("fail",null,this.currCoin);
        gg.sdk.aldLevelEnd(this.level,false);
    }
   
    touchDown(pos){
        if(this.gameState == "start")
        {
            this.playerSc.fire();
        }
    }

    touchMove(pos){

    }

    touchUp(pos){
        // if(this.gameState == "stop")
        // {
        //     this.gameState = "start";
        //     this.startGame();
        // }
    }

    cameraAni(){
        cc.tween(this.camera.node)
        .by(0.05, { position: cc.v2(0,20)},{easing:"sineIn"})
        .by(0.05, { position: cc.v2(0,-20)},{easing:"sineIn"})
        .start();
    }

    update (dt) {
       
    }

}
