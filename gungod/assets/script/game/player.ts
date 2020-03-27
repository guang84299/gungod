
const {ccclass, property} = cc._decorator;
import { res } from "../res";
@ccclass
export  class player extends cc.Component {

    game = null;
    aimDraw = null;
    gun = null;
    tail = null;

    isCanFire = false;
    // onLoad () {}

    start () {
        this.game = cc.find("Canvas").getComponent("game");
        this.aimDraw = cc.find("aim",this.node);
        this.aimDraw.active = false;
        this.gun = cc.find("gun",this.node);
        this.tail = cc.find("tail",this.node);
    }

    jump(toPos,dir){
        var h = toPos.y - this.node.y;
        if(h>200) h = 200;
        var time = 1;
        var ang = 720;
        if(dir%2 == 1) ang = -ang;

        cc.tween(this.node)
        .then(cc.spawn(cc.jumpTo(time,toPos,h*2,1),cc.rotateBy(time,ang)))
        .to(0.2, { scaleX: dir%2==1?-1:1 }, { easing: 'sineIn'})
        .call(() => { 
            
        })
        .start();

        this.scheduleOnce(function(){
            cc.director.getScheduler().setTimeScale(0.05);
            this.aimDraw.active = true;
            this.isCanFire = true;
        },time*0.52);
        this.scheduleOnce(function(){
            if(this.isCanFire)
            {
                this.nofire();
            }
            if(this.game.gameState == "start")
            {
                cc.director.getScheduler().setTimeScale(1);
                this.aimDraw.active = false;
                this.game.nextFloor();
            }
        },time*0.65);
    }

    die(){
        this.node.stopAllActions();
        var toPos = cc.v2(this.node.x,this.node.y-cc.winSize.height/2);
        if(toPos.x>0) 
        {
            toPos.x += 300;
            if(toPos.x>cc.winSize.width/2)toPos.x = cc.winSize.width/2;
        }
        else{
            toPos.x -= 300;
            if(toPos.x<-cc.winSize.width/2)toPos.x = -cc.winSize.width/2;
        }
        var ang = 360;
        if(toPos.x>0) ang = -ang;
        cc.tween(this.node)
        .then(cc.spawn(cc.jumpTo(0.5,toPos,300,1),cc.rotateBy(0.5,ang)))
        .removeSelf()
        .start();
    }

    fire(){
        if(!this.isCanFire) return;
        this.isCanFire = false;
        var p1 = this.node.convertToWorldSpaceAR(this.aimDraw.position);
        var p2 = this.node.convertToWorldSpaceAR(this.aimDraw.position.add(cc.v2(cc.winSize.height,0)));
        var results = cc.director.getPhysicsManager().rayCast(p1,p2,cc.RayCastType.Closest);
        var bulletPos = p2;
        var time = 0.02;
        var enemy = null;
        if(results)
        {
            for(var i=0;i<results.length;i++)
            {
                var node = results[i].collider.node;
                if(node.name == "head" || node.name == "body")
                {
                    enemy = node.parent.getComponent("enemy");
                    bulletPos = results[i].point;
                }
                else if(node.name == "platform" || node.name == "floor")
                {
                    bulletPos = results[i].point;
                }
            }           
        }
        //添加子弹
        var dis = bulletPos.sub(p1).mag();
        var bullet = res.getObjByPool("prefab_game_bullet");
        bullet.position = this.game.gameMap.convertToNodeSpaceAR(p1);
        this.game.gameMap.addChild(bullet,9999);
        cc.tween(bullet)
        .to(time,{position:bullet.position.add(p2.sub(p1).normalize().mul(dis))})
        .call(()=>{
            if(cc.director.getScheduler().getTimeScale()<0.5)
            cc.director.getScheduler().setTimeScale(0.5);
            if(enemy) enemy.die(bullet.position);
            else this.die();
        })
        .delay(time/2)
        .removeSelf()
        .start();

        if(!enemy)
        {
            this.game.enemySc.fire(time);
            this.game.toOver();
        }
    }

    nofire(){
        this.game.enemySc.fire(0.02);
        this.game.toOver();
        this.scheduleOnce(function(){
            cc.director.getScheduler().setTimeScale(1);
            this.die();
        },0.02);
    }

    update (dt) {
        if(this.aimDraw.active)
        {
            this.aimDraw.width = cc.winSize.height;
            var p1 = this.node.convertToWorldSpaceAR(this.aimDraw.position);
            var p2 = this.node.convertToWorldSpaceAR(this.aimDraw.position.add(cc.v2(this.aimDraw.width,0)));

            var results = cc.director.getPhysicsManager().rayCast(p1,p2,cc.RayCastType.Closest);
            if(results && results.length>0)
            {
                var point = results[0].point;
                var dis = point.sub(p1).mag();
                this.aimDraw.width = dis;
            }
        }
    }
}
