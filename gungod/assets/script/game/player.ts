
const {ccclass, property} = cc._decorator;
import { res } from "../res";
@ccclass
export  class player extends cc.Component {

    game = null;
    aimDraw = null;
    gun = null;
    tail = null;

    isFire = false;
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
        var time = toPos.sub(this.node.position).mag()/500/2;
        var ang = 720;
        if(dir%2 == 1) ang = -ang;

        cc.tween(this.node)
        .then(cc.spawn(cc.jumpTo(time,toPos,h*2,1),cc.rotateBy(time,ang)))
        .to(0.2, { scaleX: dir%2==1?-1:1 }, { easing: 'sineIn'})
        .call(() => { 
            
        })
        .start();

        this.scheduleOnce(function(){
            cc.director.getScheduler().setTimeScale(0.02);
            this.aimDraw.active = true;
        },time*0.5);
        this.scheduleOnce(function(){
            if(this.game.gameState == "start")
            {
                cc.director.getScheduler().setTimeScale(1);
                this.aimDraw.active = false;
                this.game.nextFloor();
            }
        },time*0.7);
    }

    die(){

    }

    fire(){
        if(this.isFire) return;
        this.isFire = true;
        var p1 = this.node.convertToWorldSpaceAR(this.aimDraw.position);
        var p2 = this.node.convertToWorldSpaceAR(this.aimDraw.position.add(cc.v2(cc.winSize.height,0)));
        var results = cc.director.getPhysicsManager().rayCast(p1,p2,cc.RayCastType.AllClosest);
        var isHit = false;
        var bulletPos = null;
        var time = 0.03;
        var enemys = [];
        if(results)
        {
            for(var i=0;i<results.length;i++)
            {
                var node = results[i].collider.node;
                if(node.name == "head" || node.name == "body")
                {
                    isHit = true;
                    enemys.push(node.parent.getComponent("enemy"));
                }
                else if(node.name == "platform" || node.name == "floor")
                {
                    if(!bulletPos)
                    bulletPos = results[i].point;
                }
            }           
        }
        if(!isHit)
        {
            this.game.toOver();
        }
        var dis = bulletPos.sub(p1).mag();

        var bullet = res.getObjByPool("prefab_game_bullet");
        bullet.position = this.game.gameMap.convertToNodeSpaceAR(p1);
        this.game.gameMap.addChild(bullet,9999);
        cc.tween(bullet)
        .to(time,{position:bullet.position.add(p2.sub(p1).normalize().mul(dis))})
        .call(()=>{
            this.isFire = false;
            for(var i=0;i<enemys.length;i++)
                enemys[i].die();
        })
        .delay(time/2)
        .removeSelf()
        .start();
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
