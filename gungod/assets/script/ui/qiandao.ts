import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class qiandao extends cc.Component {

    @property(cc.Toggle)
    doubleToggle: cc.Toggle = null;
    @property(cc.Node)
    btnLingqu: cc.Node = null;

    bg = null;
    main = null;
    useShare = false;

    conf = [
        {id:1,type:1,award:100},
        {id:2,type:2,award:5,award2:1000},
        {id:3,type:1,award:2000},
        {id:4,type:1,award:3000},
        {id:5,type:1,award:4000},
        {id:6,type:1,award:5000},
        {id:7,type:3,award:13,award2:6000}
    ];

    items = [];
    // onLoad () {}

    start () {
       this.updateUI();
       
    }

    updateUI(){
        var loginday = storage.getStorage(storage.loginday);
        var qiandaotag = storage.getStorage(storage.qiandaotag);
        for(var i=0;i<this.conf.length;i++)
        {
            var itemConf = this.conf[i];
            var item = cc.find("item"+(i+1),this.bg);
            var coin = cc.find("coin",item);
            var num = cc.find("num",item).getComponent(cc.Label);

            if(itemConf.type == 1)
            {
                num.string = storage.castNum(itemConf.award);
            }
            else if(itemConf.type == 2)
            {
                var gunConf = gg.config.gunConf[itemConf.award-1];
                gg.res.setSpriteFrame("images/gun/gun_"+itemConf.award,coin);
                num.string = gunConf.name;
            }
            else if(itemConf.type == 3)
            {
                var playerConf = gg.config.playerConf[itemConf.award-1];
                gg.res.setSpriteFrame("images/player/player_"+itemConf.award,coin);
                num.string = playerConf.name;
            }
            item.color = cc.color(255,255,255);
            if(loginday>i && qiandaotag>i) 
            {
                num.string = "已领取";
                item.color = cc.color(255,184,0);
            }
        }
        
        if(qiandaotag>=loginday || qiandaotag>=7)
        {
            this.btnLingqu.getChildByName("share").active = false;
            this.btnLingqu.getChildByName("video").active = false;
            this.btnLingqu.getChildByName("desc").getComponent(cc.Label).string = "已领取";
            this.btnLingqu.getComponent(cc.Button).interactable = false;
        }
        else
        {
            this.btnLingqu.getComponent(cc.Button).interactable = true;
            this.btnLingqu.getChildByName("desc").getComponent(cc.Label).string = "免费领取";

            if(this.conf[qiandaotag].type != 1)  
            {
                this.doubleToggle.node.active = false;
                this.doubleToggle.uncheck();
            }
            else 
            {
                this.doubleToggle.node.active = true;
                this.doubleToggle.check();
            }
            this.updateAd();
        }
        
    }

    updateAd()
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
        var qiandaotag = storage.getStorage(storage.qiandaotag);
        var itemConf = this.conf[qiandaotag];

        if(itemConf.type == 1)
        {
            var award = itemConf.award;
            if(this.doubleToggle.isChecked) award*=2;

            var coin = storage.getStorage(storage.coin);
            storage.setStorage(storage.coin,coin+award);
            storage.uploadStorage(storage.coin);

            this.main.updateCoinAni();
        }
        else if(itemConf.type == 2)
        {
            var hasgun = storage.getStorage(storage.hasgun);
            if(storage.indexOf(hasgun,itemConf.award) != -1)
            {
                var coin = storage.getStorage(storage.coin);
                storage.setStorage(storage.coin,coin+itemConf.award2);
                storage.uploadStorage(storage.coin);
    
                this.main.updateCoinAni();

                gg.res.showToast("已经拥有该枪，转化为金币"+storage.castNum(itemConf.award2));
            }
            else
            {
                hasgun.push(itemConf.award);
                storage.setStorage(storage.hasgun,hasgun);
                storage.uploadStorage(storage.hasgun);
                gg.res.showToast("恭喜获得一把好枪！");
            }
        }
        else if(itemConf.type == 3)
        {
            var hasskin = storage.getStorage(storage.hasskin);
            if(storage.indexOf(hasskin,itemConf.award) != -1)
            {
                var coin = storage.getStorage(storage.coin);
                storage.setStorage(storage.coin,coin+itemConf.award2);
                storage.uploadStorage(storage.coin);
    
                this.main.updateCoinAni();

                gg.res.showToast("已经拥有该角色，转化为金币"+storage.castNum(itemConf.award2));
            }
            else
            {
                hasskin.push(itemConf.award);
                storage.setStorage(storage.hasskin,hasskin);
                storage.uploadStorage(storage.hasskin);
                gg.res.showToast("恭喜获得霸气角色！");
            }
        }

        storage.setStorage(storage.qiandaotag,qiandaotag+1);
        storage.uploadStorage(storage.qiandaotag);

        this.updateUI();
        this.main.updateRed();
    }

    toggle(){
        if(this.useShare)
        {
            this.btnLingqu.getChildByName("share").active = this.doubleToggle.isChecked;
        }
        else
        {
            this.btnLingqu.getChildByName("video").active = this.doubleToggle.isChecked;
        }
    }

    show(data){
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
        else if(data == "toggle")
        {
            this.scheduleOnce(this.toggle.bind(this),0.1);
        }
        else if(data == "lingqu")
        {
            var self = this;
            if(this.doubleToggle.isChecked)
            {
                if(this.useShare)
                {
                    gg.sdk.share(function(r){
                        if(r)
                        {
                            self.lingqu();
                        }
                    },"qiandao");
                    gg.sdk.aldSendEvent("签到_分享");
                }
                else
                {
                    gg.sdk.showVedio(function(r){
                        if(r)
                        {
                            self.lingqu();
                        }
                    });
                    gg.sdk.aldSendEvent("签到_视频");
                }
            }
            else
            {
                self.lingqu();
            }
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
