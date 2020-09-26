import { storage } from "../storage";
import { config } from "../config";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class fuhuo extends cc.Component {

    @property(cc.Node)
    btnLingqu: cc.Node = null;

    bg = null;
    game = null;
    useShare = false;
    // onLoad () {}

    start () {
       this.updateUI();
    }

    updateUI()
    {
        this.useShare = false;
        var sharenum = storage.getStorage(storage.sharenum);
        if(gg.GAME.user && !gg.GAME.user.isLegal && sharenum<gg.GAME.user.sharecfg.totalNum)
        {
            var rad = parseInt(gg.GAME.user.shareRad);
            if(!gg.GAME.hasVideo || sharenum<gg.GAME.user.sharecfg.initNum) rad = 100;
            if(Math.random()*100 < rad)
            {
                this.useShare = true;
                this.btnLingqu.getChildByName("share").active = true;
                this.btnLingqu.getChildByName("video").active = false;
            }
            else
            {
                this.btnLingqu.getChildByName("share").active = false;
                this.btnLingqu.getChildByName("video").active = true;
            }
        }
        else
        {
            this.btnLingqu.getChildByName("share").active = false;
            this.btnLingqu.getChildByName("video").active = true;
        }
    }

    lingqu(){
        this.game.toFuhuo();

        this.hide();
    }

    show(data){
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
            this.game.toFangqiFuhuo();
            this.hide();
        }
        else if(data == "lingqu")
        {
            var self = this;
            if(this.useShare)
            {
                gg.sdk.share(function(r){
                    if(r)
                    {
                        self.lingqu();
                    }
                },"fuhuo");
                gg.sdk.aldSendEvent("复活_分享");
            }
            else
            {
                gg.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu();
                    }
                });
                gg.sdk.aldSendEvent("复活_视频");
            }
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
