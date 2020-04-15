import { storage } from "../storage";
import { config } from "../config";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class sharevedio extends cc.Component {

    @property(cc.Label)
    descLabel: cc.Label = null;
   
    @property(cc.Node)
    btnNode: cc.Node = null;

    bg = null;
    game = null;
    award = 0;
    callback = null;
    // onLoad () {}

    start () {
        this.btnNode.active = false;

        this.scheduleOnce(function(){
            this.btnNode.active = true;
        },2);
        this.descLabel.string = "x"+storage.castNum(this.award);
    }

    lingqu(){
        // var coin = storage.getStorage(storage.coin);
        // storage.setStorage(storage.coin,coin+this.award);
        // storage.uploadStorage(storage.coin);
        var sharenum = storage.getStorage(storage.sharenum);
        storage.setStorage(storage.sharenum,sharenum+1);

        if(this.callback) this.callback(this.award);
        this.hide();
    }
   
    show(data){
        var lv = storage.getStorage(storage.level);
        this.award = (lv-1)*100;
        this.callback = data;
        this.game = cc.find("Canvas").getComponent("game");
        this.bg = cc.find("bg",this.node);

        this.bg.scaleX = 0;
        cc.tween(this.bg)
        .delay(0.01)
        .to(0.2,{scaleX:1},{easing:"sineIn"})
        .start();

        gg.sdk.showBanner();
    }

    hide(){
        cc.tween(this.bg)
        .to(0.2,{scaleX:0},{easing:"sineOut"})
        .call(()=>{
            this.node.destroy();
            if(config.isTT()) gg.sdk.hideBanner();
        })
        .start();
    }

    click(event,data){
        if(data == "close")
        {
            if(this.callback) this.callback(0);
            this.hide();
        }
        else if(data == "share")
        {
            var self = this;
            gg.sdk.share(function(r){
                if(r)
                {
                    self.lingqu();
                }
            });
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
