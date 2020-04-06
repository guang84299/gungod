import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class yindao extends cc.Component {

    @property(cc.Label)
    descLabel: cc.Label = null;
   
    @property(cc.Node)
    btnNode: cc.Node = null;

    bg = null;
    game = null;
    timeScale = 0;
    // onLoad () {}

    start () {
        this.btnNode.active = false;
        this.descLabel.string = "当瞄准线经过敌人时\r\n点击屏幕开枪";
        this.timeScale = cc.director.getScheduler().getTimeScale();
    }

    next()
    {
        this.btnNode.active = true;
        this.descLabel.string = "就是现在!!!\r\n快速点击屏幕开枪";
        
       cc.director.getScheduler().setTimeScale(0);
    }

   
    show(data){
        this.game = cc.find("Canvas").getComponent("game");
        this.bg = cc.find("bg",this.node);
    }

    hide(){
        cc.director.getScheduler().setTimeScale(this.timeScale);
        this.game.touchDown(cc.v2(0,0));
        this.node.destroy();
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
