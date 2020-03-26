
const {ccclass, property} = cc._decorator;

@ccclass
export  class player extends cc.Component {

    game = null;
    // onLoad () {}

    start () {
        this.game = cc.find("Canvas").getComponent("game");
    }

    jump(toPos){
        var x = toPos.x - this.node.x;
        var h = toPos.y - this.node.y;
        var time = toPos.sub(this.node.position).mag()/500/2;

        cc.tween(this.node)
        .to(time, { x: this.node.x+x*0.9, y: {value: this.node.y+h*2,easing: 'expoOut'}})
        .to(time*0.6, { x: toPos.x, y: {value: toPos.y,easing: 'expoIn'}})
        .call(() => { 
            this.game.nextFloor();
        })
        .start();
    }

    // update (dt) {}
}
