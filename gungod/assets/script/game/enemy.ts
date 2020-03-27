
const {ccclass, property} = cc._decorator;

@ccclass
export  class enemy extends cc.Component {

    game = null;
    aimDraw = null;
    gun = null;
    tail = null;

    isBoss = false;
    hp = 50;


    // onLoad () {}

    start () {
        this.game = cc.find("Canvas").getComponent("game");
        this.aimDraw = cc.find("aim",this.node);
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

    jump(toPoss,dir,isEnd){
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
            if(isEnd)
            this.game.playerJump();
            this.setPhysics(true);
        })
        ac.start();

    }

    bossjump(toPos,dir){
        this.setPhysics(false);
        var h = toPos.y - this.node.y;
        var time = toPos.sub(this.node.position).mag()/500/2;
        var ang = 720;
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

    die(){
        if(this.isBoss)
        {
            this.hp -= 5;
            if(this.hp<=0) 
            {
                this.node.destroy();
                this.game.toWin();
            }
        }
        else
        this.node.destroy();
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
