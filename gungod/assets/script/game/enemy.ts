
const {ccclass, property} = cc._decorator;
import { res } from "../res";
import { config } from "../config";
var gg = window["gg"];
@ccclass
export  class enemy extends cc.Component {

    game = null;
    aimDraw = null;
    gun = null;
    tail = null;

    isBoss = false;
    hp = 15;

    conf = {color:cc.color(221,88,254)};

    // onLoad () {}

    start () {
        this.game = cc.find("Canvas").getComponent("game");
        this.aimDraw = cc.find("gun/aim",this.node);
        this.aimDraw.active = false;
        this.gun = cc.find("gun",this.node);
        this.tail = cc.find("tail",this.node);

        this.setPhysics(false);
    }

    initConf(isBoss,skinid,callback){
        this.isBoss = isBoss;
        if(isBoss) this.conf = config.bossConf[skinid-1];
        else this.conf = config.enemyConf[skinid-1];
        var player = cc.find("player",this.node);
        var tail = cc.find("tail",this.node);

        var self = this;
        var skinpath = "images/enemy/enemy_"+skinid;
        if(isBoss) skinpath = "images/boss/boss_"+skinid;
        res.setSpriteFrame(skinpath,player,function(){
            self.node.setContentSize(player.getContentSize());
            if(callback) callback();
        });

        tail.active = false;
        res.setTexture(skinpath,function(texture){
            tail.getComponent(cc.MotionStreak).texture = texture;
            var rec = new cc.SpriteFrame(texture).getRect();
            tail.getComponent(cc.MotionStreak).stroke = rec.width*0.8;
            tail.active = true;
            tail.y = -rec.height/2*0.9;
        });
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
            ac.call(()=>{
                if(this.isBoss)
                {
                    this.game.cameraAni();
                    gg.audio.playSound('audio/foot_boss_land');
                }
                else{
                    gg.audio.playSound('audio/foot_1');
                }
            })
        }
        ac.call(() => { 
            this.game.playerJump();
            this.setPhysics(true);
        })
        ac.start();

        if(this.isBoss)
        {
            gg.audio.playSound('audio/boss_chu');
        }
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
            this.game.cameraAni();
            gg.audio.playSound('audio/foot_boss_land');
            this.node.scaleX = dir%2==1?-1:1;
            this.game.playerJump();
            this.setPhysics(true);
        })
        .start();
    }

    die(pos,isHead){
        var isDie = false;
        if(this.isBoss)
        {
            this.hp -= 5;
            if(this.hp<=0) 
            {
                isDie = true;                
                this.game.toWin();
            }
            cc.tween(this.node)
                .by(0.05, { position: cc.v2(-20,0)},{easing:"sineIn"})
                .by(0.05, { position: cc.v2(10,0)},{easing:"sineIn"})
                .start();
            gg.audio.playSound('audio/boss_hurt_'+(Math.floor(Math.random()*3+1)));
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

        if(isHead)
        {
            //特效
            var bigblood = res.getObjByPool("prefab_anim_bigblood");
            bigblood.position = this.node.position;
            bigblood.scaleX = -this.node.scaleX;
            this.game.gameMap.addChild(bigblood,9999);
            bigblood.getComponent(cc.ParticleSystem).startColor = this.conf.color;
            bigblood.getComponent(cc.ParticleSystem).endColor = this.conf.color;
            
            gg.audio.playSound('audio/hit_head');
        }
        else
        {
            var blood = res.getObjByPool("prefab_anim_blood");
            blood.position = this.node.position;
            blood.scaleX = -this.node.scaleX;
            this.game.gameMap.addChild(blood,9999);
            blood.getComponent(cc.ParticleSystem).startColor = this.conf.color;
            blood.getComponent(cc.ParticleSystem).endColor = this.conf.color;

            gg.audio.playSound('audio/hit_torso');
        }

        //添加击中特效
        var hit = res.getObjByPool("prefab_game_hit");
        hit.position = this.node.position;
        hit.color = this.conf.color;
        hit.opacity = 0;
        this.game.gameMap.addChild(hit,9999);
        cc.tween(hit)
        .to(0.1,{scale:3,opacity:150},{easing:"sineIn"})
        .to(0.1,{opacity:0},{easing:"sineIn"})
        .call(()=>{
            if(isHead) gg.audio.playSound('audio/hit_head_yuyin');
        })
        .removeSelf()
        .start();
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

         gg.audio.playSound('audio/gun_1');
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
