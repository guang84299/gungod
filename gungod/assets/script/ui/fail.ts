import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class fail extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Node)
    btnLingqu: cc.Node = null;
    @property(cc.Node)
    btnLingqu2: cc.Node = null;
    @property(cc.Node)
    btnHome: cc.Node = null;
    @property(cc.Node)
    btnAgain: cc.Node = null;

    bg = null;
    game = null;
    useShare = false;
    award = 0;
    // onLoad () {}

    start () {
        this.btnLingqu.active = false;
        this.btnHome.active = false;
        this.btnAgain.active = false;

        this.updateUI();
        this.coinLabel.string = "x"+storage.castNum(this.award);

        this.scheduleOnce(function(){
            if(this.btnLingqu2.active)
            this.btnLingqu.active = true;
        },2);

        if(this.award<=0)
        {
            this.btnLingqu2.active = false;
            this.btnHome.active = true;
            this.btnAgain.active = true;
        }

        var hitenemy = storage.getStorage(storage.hitenemy);
        var hithead = storage.getStorage(storage.hithead);

        storage.setStorage(storage.hitenemy,hitenemy+this.game.hitEnemy);
        storage.uploadStorage(storage.hitenemy);

        storage.setStorage(storage.hithead,hithead+this.game.hitHead);
        storage.uploadStorage(storage.hithead);

        gg.sdk.aldSendEvent("关卡失败_"+storage.getStorage(storage.level));
    }

    updateUI()
    {
        this.useShare = false;
        if(gg.GAME.share)
        {
            var rad = parseInt(gg.GAME.failAd);
            if(!gg.GAME.hasVideo) rad = 100;
            if(Math.random()*100 < rad)
            {
                this.useShare = true;
                this.btnLingqu2.getChildByName("share").active = true;
                this.btnLingqu2.getChildByName("video").active = false;
            }
            else
            {
                this.btnLingqu2.getChildByName("share").active = false;
                this.btnLingqu2.getChildByName("video").active = true;
            }
        }
        else
        {
            this.btnLingqu2.getChildByName("share").active = false;
            this.btnLingqu2.getChildByName("video").active = true;
        }
    }

    lingqu(isVedio){
        if(isVedio) this.award *= 5;
        var coin = storage.getStorage(storage.coin);
        storage.setStorage(storage.coin,coin+this.award);
        storage.uploadStorage(storage.coin);

        gg.res.showToast("获得金币+"+this.award);
    
        this.btnLingqu.active = false;
        this.btnLingqu2.active = false;

        this.btnHome.active = true;
        this.btnAgain.active = true;

    }

    show(data){
        this.award = data;
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
            // gg.sdk.hideBanner();
        })
        .start();
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "home")
        {
            cc.director.loadScene("main");
        }
        else if(data == "again")
        {
            this.game.nextLevel();
            this.hide();
        }
        else if(data == "lingqu")
        {
            this.lingqu(false);
            gg.sdk.aldSendEvent("失败_直接领取");
        }
        else if(data == "lingqu2")
        {
            var self = this;
            if(this.useShare)
            {
                gg.sdk.share(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                },"win");
                gg.sdk.aldSendEvent("失败_分享");
            }
            else
            {
                gg.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu(true);
                    }
                });
                gg.sdk.aldSendEvent("失败_视频");
            }
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
