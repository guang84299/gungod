import { storage } from "../storage";
import { config } from "../config";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class songgun extends cc.Component {

    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Node)
    gunNode: cc.Node = null;
    @property(cc.Node)
    btnLingqu: cc.Node = null;

    bg = null;
    main = null;
    useShare = false;
    callback = null;
    gunid = 1;
    // onLoad () {}

    start () {
       this.updateUI();
       var hasgun = storage.getStorage(storage.hasgun);
       var randguns = [];
       if(storage.indexOf(hasgun,5) == -1)
       {
           randguns.push(config.gunConf[5-1]);
       }
       if(storage.indexOf(hasgun,7) == -1)
       {
           randguns.push(config.gunConf[7-1]);
       }
       if(storage.indexOf(hasgun,16) == -1)
       {
           randguns.push(config.gunConf[16-1]);
       }
       
       var gunConf = randguns[Math.floor(Math.random()*randguns.length)];

       this.nameLabel.string = gunConf.name;
       gg.res.setSpriteFrame("images/gun/gun_"+gunConf.id,this.gunNode);
       this.gunid = gunConf.id;
    }

    updateUI()
    {
        this.useShare = false;
        if(gg.GAME.share)
        {
            var rad = parseInt(gg.GAME.shiyongAd);
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

        if(config.isTT())
        {
            this.useShare = true;
            this.btnLingqu.getChildByName("share").active = true;
            this.btnLingqu.getChildByName("video").active = false;
        }
    }

    lingqu(){
        var hasgun = storage.getStorage(storage.hasgun);
        hasgun.push(this.gunid);
        storage.setStorage(storage.hasgun,hasgun);
        storage.uploadStorage(storage.hasgun);
        gg.audio.playSound('audio/audio_jiesuo');

        storage.setStorage(storage.gunid,this.gunid);
        storage.uploadStorage(storage.gunid);

        this.scheduleOnce(function(){
            gg.audio.playSound('audio/audio_role_huan');
            gg.res.showToast("恭喜获得一把好枪，并自动装备!");
        },0.12);

        this.hide();
    }

    show(data){
        this.callback = data;
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
            if(config.isTT()) gg.sdk.hideBanner();
        })
        .start();

        if(this.callback) this.callback();
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
                },"shiyong");
                gg.sdk.aldSendEvent("送枪_分享");
            }
            else
            {
                gg.sdk.showVedio(function(r){
                    if(r)
                    {
                        self.lingqu();
                    }
                });
                gg.sdk.aldSendEvent("送枪_视频");
            }
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
