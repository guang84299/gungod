import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class freecoin extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Node)
    btnLingqu: cc.Node = null;

    bg = null;
    main = null;
    useShare = false;
    award = 0;
    callback = null;
    // onLoad () {}

    start () {
       this.updateUI();
       this.coinLabel.string = "x"+storage.castNum(this.award);
    }

    updateUI()
    {
        this.useShare = false;
        if(gg.GAME.share)
        {
            var rad = parseInt(gg.GAME.freecoinAd);
            if(!gg.GAME.hasVideo) rad = 100;
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
        var coin = storage.getStorage(storage.coin);
        storage.setStorage(storage.coin,coin+this.award);
        storage.uploadStorage(storage.coin);

        if(this.callback) this.callback();
        this.hide();
    }

    show(data){
        var lv = storage.getStorage(storage.level);
        this.award = lv*100;
        this.callback = data.callback;
        this.main = cc.find("Canvas").getComponent("main");
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
            // gg.sdk.hideBanner();
        })
        .start();
    }

    click(event,data){
        if(data == "close")
        {
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
                },"freecoin");
                gg.sdk.aldSendEvent("免费金币_分享");
            }
            else
            {
                gg.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu();
                    }
                });
                gg.sdk.aldSendEvent("免费金币_视频");
            }
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
