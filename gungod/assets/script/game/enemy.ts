
const {ccclass, property} = cc._decorator;
import { res } from "../res";
@ccclass
export  class enemy extends cc.Component {

    game = null;
    aimDraw = null;
    gun = null;
    tail = null;

    isBoss = false;
    hp = 15;


    // onLoad () {}

    start () {
        this.game = cc.find("Canvas").getComponent("game");
        this.aimDraw = cc.find("gun/aim",this.node);
        this.aimDraw.active = false;
        this.gun = cc.find("gun",this.node);
        this.tail = cc.find("tail",this.node);

        this.setPhysics(false);
    }

    setBoss(isBoss){
        this.isBoss = isBoss;
    }

    setPhysics(enable){
        cc.find("head",this.node).active = enable;
        cc.find("body",this.node).active = enable;
    }

    jump(toPoss,dir){
        var h =  100;
        var time = 0.4;
        var ang = 360;
        if(dir%2 == 0) ang = -ang;
        var ac = cc.tween(this.node);
        for(var i=0;i<toPoss.length;i++)
        {
            ac.then(cc.spawn(cc.jumpTo(time,toPoss[i],h*2,1),cc.rotateBy(time,ang)))
        }
        ac.call(() => { 
            this.game.playerJump();
            this.setPhysics(true);
        })
        ac.start();

    }

    bossjump(toPos,dir){
        this.setPhysics(false);
        var h = toPos.y - this.node.y;
        if(h>200) h = 200;
        var time = 0.8;
        var ang = 360;
        if(dir%2 == 1) ang = -ang;

        cc.tween(this.node)
        .then(cc.spawn(cc.jumpTo(time,toPos,h*2,1),cc.rotateBy(time,ang)))
        // .to(0.2, { scaleX: dir%2==1?-1:1 }, { easing: 'sineIn'})
        .call(() => { 
            this.node.scaleX = dir%2==1?-1:1;
            this.game.playerJump();
            this.setPhysics(true);
        })
        .start();
    }

    die(pos){
        var isDie = false;
        if(this.isBoss)
        {
            this.hp -= 5;
            if(this.hp<=0) 
            {
                isDie = true;                
                this.game.toWin();
            }
        }
        else
        {
            isDie = true;   
        }
        if(isDie)
        {
            var dir = this.node.position.sub(pos).normalize();
            var toPos = this.node.position.add(dir.mul(cc.winSize.width/2));
            var ang = 360;
            if(cc.v2(dir).signAngle(cc.v2(0,1))>0) ang = -ang;
            cc.tween(this.node)
            .then(cc.spawn(cc.jumpTo(0.5,toPos,200,1),cc.rotateBy(0.5,ang)))
            .removeSelf()
            .start();
        }
    }

    fire(time){
        var p1 = this.aimDraw.parent.convertToWorldSpaceAR(this.aimDraw.position);
        var p2 = this.game.playerSc.node.position;
         //添加子弹
         var bullet = res.getObjByPool("prefab_game_bullet");
         bullet.position = this.game.gameMap.convertToNodeSpaceAR(p1);
         this.game.gameMap.addChild(bullet,9999);
         cc.tween(bullet)
         .to(time,{position:p2})
         .delay(time/2)
         .removeSelf()
         .start();
    }

    update(dt){
        if(this.game.playerSc.aimDraw.active)
        {
            var rad = cc.v2(this.game.playerSc.node.position).sub(cc.v2(this.node.position)).normalize().signAngle(cc.v2(1,0));
            var ang = cc.misc.radiansToDegrees(rad);
            if(this.node.scaleX == -1) ang = 180-ang; 
            this.gun.angle = -ang; 
        }
    }

    
}
