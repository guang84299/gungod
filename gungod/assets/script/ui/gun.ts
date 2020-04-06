import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
import { config } from "../config";

@ccclass
export default class gun extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    typeLabel: cc.Label = null;
    @property(cc.Node)
    fireNode: cc.Node = null;
    @property(cc.Node)
    bnumNode: cc.Node = null;

    @property(cc.Node)
    gunNode: cc.Node = null;
    @property(cc.Node)
    skinNode: cc.Node = null;

    @property(cc.Node)
    item: cc.Node = null;
    @property(cc.Node)
    itemContent: cc.Node = null;
    @property(cc.ScrollView)
    scroll: cc.ScrollView = null;

    bg = null;
    main = null;
    // onLoad () {}

    start () {

       this.updateUI();
       this.updateCoin();
       this.addItem();

       gg.audio.playSound('audio/audio_role');
    }

    addItem(){
        var n = this.itemContent.childrenCount;
        if(n<config.gunConf.length)
        {
            var gunid = storage.getStorage(storage.gunid);
            var hasgun = storage.getStorage(storage.hasgun);
            var level = storage.getStorage(storage.level);

            var currGunid = n+1;
            var item = cc.instantiate(this.item);
            item.active = true;
            this.itemContent.addChild(item);

            var gun = cc.find("gun",item);
            var name = cc.find("name",item).getComponent(cc.Label);
            var type = cc.find("type",item).getComponent(cc.Label);
            var fire = cc.find("fire",item).getComponent(cc.Label);
            var bnum = cc.find("bnum",item).getComponent(cc.Label);
            var state = cc.find("state",item).getComponent(cc.Label);
            var zb = cc.find("zb",item);
            var js = cc.find("js",item);

            zb["gid"] = currGunid;
            js["gid"] = currGunid;
            zb.active = false;
            js.active = false;
            state.string = "";

            var gunConf = config.gunConf[currGunid-1];
            name.string = gunConf.name;
            var types = "单发枪";
            if(gunConf.type == 2)types = "连发枪";
            else if(gunConf.type == 3)types = "多发枪";
            type.string = types;
            fire.string = gunConf.fire+"";
            bnum.string = gunConf.num+"";

            if(gunid == currGunid) 
            {
                item.color = cc.color(255,184,0);
                state.string = "已装备";
            }
            else
            {
                if(storage.indexOf(hasgun,currGunid) != -1)
                {
                    zb.active = true;
                }
                else
                {
                    if(level>=gunConf.unlocklv)
                    {
                        js.active = true;
                        if(gunConf.unlocktype == 1)
                        {
                            cc.find("video",js).active = false;
                            cc.find("coin",js).active = true;
                            cc.find("str",js).getComponent(cc.Label).string = storage.castNum(gunConf.unlockcost)+"";
                        }
                        else
                        {
                            var gunlock = storage.getStorage(storage.gunlock);
                            var adNum = gunlock[""+currGunid] ? gunlock[""+currGunid] : 0;
                            cc.find("video",js).active = true;
                            cc.find("coin",js).active = false;
                            cc.find("str",js).getComponent(cc.Label).string = adNum+"/"+gunConf.unlockcost;
                        }
                    }
                    else
                    {
                        state.string = "通过第"+gunConf.unlocklv+"关可解锁";
                    }
                }
            }

            gg.res.setSpriteFrame("images/gun/gun_"+currGunid,gun);

            this.scheduleOnce(this.addItem.bind(this),0.05);
        }
        else
        {
            var gunid = storage.getStorage(storage.gunid);
            this.scroll.scrollToPercentVertical(1-(gunid-1)/n,0.1);
        }
    }

    updateUI()
    {
        var gunid = storage.getStorage(storage.gunid);
        var skinid = storage.getStorage(storage.skinid);
        
        gg.res.setSpriteFrame("images/gun/gun_"+gunid,this.gunNode);
        gg.res.setSpriteFrame("images/player/player_"+skinid,this.skinNode);

        var gunConf = config.gunConf[gunid-1];
        this.nameLabel.string = gunConf.name;

        var type = "单发枪";
        if(gunConf.type == 2)type = "连发枪";
        else if(gunConf.type == 3)type = "多发枪";
        this.typeLabel.string = type;

        for(var i=0;i<this.fireNode.childrenCount;i++)
        {
            this.fireNode.children[i].active = gunConf.fire>i?true : false;
        }
        for(var i=0;i<this.bnumNode.childrenCount;i++)
        {
            this.bnumNode.children[i].active = gunConf.num>i?true : false;
        }
    }

    updateCoin(){
        var coin = storage.getStorage(storage.coin);
        this.coinLabel.string = storage.castNum(coin)+"";
    }

    unlockGun(gunid){
        var item = this.itemContent.children[gunid-1];
        var state = cc.find("state",item).getComponent(cc.Label);
        var zb = cc.find("zb",item);
        var js = cc.find("js",item);

        js.active = false;
        zb.active = true;
        state.string = "";

        var hasgun = storage.getStorage(storage.hasgun);
        hasgun.push(gunid);
        storage.setStorage(storage.hasgun,hasgun);
        storage.uploadStorage(storage.hasgun);
        gg.audio.playSound('audio/audio_jiesuo');

        this.main.updateRed();
    }

    updateAdGun(gunid){
        var gunlock = storage.getStorage(storage.gunlock);
        var adNum = gunlock[""+gunid] ? gunlock[""+gunid] : 0;
        adNum ++;
        gunlock[""+gunid] = adNum;
        storage.setStorage(storage.gunlock,gunlock);
        storage.uploadStorage(storage.gunlock);

        var gunConf = config.gunConf[gunid-1];
        if(adNum>=gunConf.unlockcost)
        {
            this.unlockGun(gunid);
        }
        else
        {
            var item = this.itemContent.children[gunid-1];
            var js = cc.find("js",item);
            cc.find("str",js).getComponent(cc.Label).string = adNum+"/"+gunConf.unlockcost;
        }
    }

    zbGun(gid){
        var gunid = storage.getStorage(storage.gunid);
        if(gid != gunid)
        {
            var lastitem = this.itemContent.children[gunid-1];
            var lstate = cc.find("state",lastitem).getComponent(cc.Label);
            var lzb = cc.find("zb",lastitem);
            lzb.active = true;
            lstate.string = "";
            lastitem.color = cc.color(255,255,255);

            var item = this.itemContent.children[gid-1];
            var state = cc.find("state",item).getComponent(cc.Label);
            var zb = cc.find("zb",item);
            zb.active = false;
            state.string = "已装备";
            item.color = cc.color(255,184,0);

            storage.setStorage(storage.gunid,gid);
            storage.uploadStorage(storage.gunid);

            this.updateUI();

            gg.audio.playSound('audio/audio_role_huan');
        }
    }

    itemJieSuo(gid){
        var currGunid = gid;
        var gunConf = config.gunConf[currGunid-1];
        if(gunConf.unlocktype == 1)
        {
            var coin = storage.getStorage(storage.coin);
            if(coin>=gunConf.unlockcost)
            {
                storage.setStorage(storage.coin,coin-gunConf.unlockcost);
                storage.uploadStorage(storage.coin);

                this.unlockGun(currGunid);
                this.updateCoin();
                this.main.updateCoin();
            }
            else
            {
                var self = this;
                var award = Math.floor(gunConf.unlockcost/(gunConf.fire*gunConf.num));
                gg.res.openUI("freecoin",null,{award:award,callback:function(){
                    self.updateCoin();
                    self.main.updateCoinAni();
                }});
            }
        }
        else
        {
            var self = this;
            gg.sdk.showVedio(function(r){
                if(r)
                {
                    self.updateAdGun(currGunid);
                }
            });
        }
        cc.log(gid);
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
        gg.audio.playSound('audio/audio_role');
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "itemjs")
        {
            this.itemJieSuo(event.target["gid"]);
            gg.sdk.aldSendEvent("武器库_解锁");
        }
        else if(data == "itemzb")
        {
            this.zbGun(event.target["gid"]);
            gg.sdk.aldSendEvent("武器库_装备");
        }
       
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
