import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
import { config } from "../config";

@ccclass
export default class skin extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    typeLabel: cc.Label = null;
    @property(cc.Node)
    hpNode: cc.Node = null;
    @property(cc.Node)
    coinNode: cc.Node = null;

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
        if(n<config.playerConf.length)
        {
            var skinid = storage.getStorage(storage.skinid);
            var hasskin = storage.getStorage(storage.hasskin);
            var level = storage.getStorage(storage.level);

            var currSkinid = n+1;
            var item = cc.instantiate(this.item);
            item.active = true;
            this.itemContent.addChild(item);

            var player = cc.find("player",item);
            var name = cc.find("name",item).getComponent(cc.Label);
            var type = cc.find("type",item).getComponent(cc.Label);
            var hp = cc.find("hp",item).getComponent(cc.Label);
            var coin = cc.find("coin",item).getComponent(cc.Label);
            var state = cc.find("state",item).getComponent(cc.Label);
            var zb = cc.find("zb",item);
            var js = cc.find("js",item);

            zb["gid"] = currSkinid;
            js["gid"] = currSkinid;
            zb.active = false;
            js.active = false;
            state.string = "";

            var playerConf = config.playerConf[currSkinid-1];
            name.string = playerConf.name;
            var types = "综合型";
            if(playerConf.type == 2)types = "吸金型";
            else if(playerConf.type == 3)types = "肉盾型";
            type.string = types;
            hp.string = playerConf.hp+"";
            coin.string = playerConf.coin+"";

            if(skinid == currSkinid) 
            {
                item.color = cc.color(255,184,0);
                state.string = "已装备";
            }
            else
            {
                if(storage.indexOf(hasskin,currSkinid) != -1)
                {
                    zb.active = true;
                }
                else
                {
                    if(level>=playerConf.unlocklv)
                    {
                        js.active = true;
                        if(playerConf.unlocktype == 1)
                        {
                            cc.find("video",js).active = false;
                            cc.find("coin",js).active = true;
                            cc.find("str",js).getComponent(cc.Label).string = storage.castNum(playerConf.unlockcost)+"";
                        }
                        else
                        {
                            var skinlock = storage.getStorage(storage.skinlock);
                            var adNum = skinlock[""+currSkinid] ? skinlock[""+currSkinid] : 0;
                            cc.find("video",js).active = true;
                            cc.find("coin",js).active = false;
                            cc.find("str",js).getComponent(cc.Label).string = adNum+"/"+playerConf.unlockcost;
                        }
                    }
                    else
                    {
                        state.string = "通过第"+playerConf.unlocklv+"关可解锁";
                    }
                }
            }

            gg.res.setSpriteFrame("images/player/player_"+currSkinid,player);

            this.scheduleOnce(this.addItem.bind(this),0.05);
        }
        else
        {
            var skinid = storage.getStorage(storage.skinid);
            this.scroll.scrollToPercentVertical(1-(skinid-1)/n,0.1);
        }
    }

    updateUI()
    {
        var gunid = storage.getStorage(storage.gunid);
        var skinid = storage.getStorage(storage.skinid);
        
        gg.res.setSpriteFrame("images/gun/gun_"+gunid,this.gunNode);
        gg.res.setSpriteFrame("images/player/player_"+skinid,this.skinNode);

        var playerConf = config.playerConf[skinid-1];
        this.nameLabel.string = playerConf.name;

        var type = "综合型";
        if(playerConf.type == 2)type = "吸金型";
        else if(playerConf.type == 3)type = "肉盾型";
        this.typeLabel.string = type;

        for(var i=0;i<this.hpNode.childrenCount;i++)
        {
            this.hpNode.children[i].active = playerConf.hp>i?true : false;
        }
        for(var i=0;i<this.coinNode.childrenCount;i++)
        {
            this.coinNode.children[i].active = playerConf.coin>i?true : false;
        }
    }

    updateCoin(){
        var coin = storage.getStorage(storage.coin);
        this.coinLabel.string = storage.castNum(coin)+"";
    }

    unlockSkin(skinid){
        var item = this.itemContent.children[skinid-1];
        var state = cc.find("state",item).getComponent(cc.Label);
        var zb = cc.find("zb",item);
        var js = cc.find("js",item);

        js.active = false;
        zb.active = true;
        state.string = "";

        var hasskin = storage.getStorage(storage.hasskin);
        hasskin.push(skinid);
        storage.setStorage(storage.hasskin,hasskin);
        storage.uploadStorage(storage.hasskin);
        gg.audio.playSound('audio/audio_jiesuo');

        this.main.updateRed();
    }

    updateAdSkin(skinid){
        var skinlock = storage.getStorage(storage.skinlock);
        var adNum = skinlock[""+skinid] ? skinlock[""+skinid] : 0;
        adNum ++;
        skinlock[""+skinid] = adNum;
        storage.setStorage(storage.skinlock,skinlock);
        storage.uploadStorage(storage.skinlock);

        var playerConf = config.playerConf[skinid-1];
        if(adNum>=playerConf.unlockcost)
        {
            this.unlockSkin(skinid);
        }
        else
        {
            var item = this.itemContent.children[skinid-1];
            var js = cc.find("js",item);
            cc.find("str",js).getComponent(cc.Label).string = adNum+"/"+playerConf.unlockcost;
        }
    }

    zbSkin(gid){
        var skinid = storage.getStorage(storage.skinid);
        if(gid != skinid)
        {
            var lastitem = this.itemContent.children[skinid-1];
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

            storage.setStorage(storage.skinid,gid);
            storage.uploadStorage(storage.skinid);

            this.updateUI();
            gg.audio.playSound('audio/audio_role_huan');
        }
    }

    itemJieSuo(gid){
        var currSkinid = gid;
        var playerConf = config.playerConf[currSkinid-1];
        if(playerConf.unlocktype == 1)
        {
            var coin = storage.getStorage(storage.coin);
            if(coin>=playerConf.unlockcost)
            {
                storage.setStorage(storage.coin,coin-playerConf.unlockcost);
                storage.uploadStorage(storage.coin);

                this.unlockSkin(currSkinid);
                this.updateCoin();
                this.main.updateCoin();
            }
            else
            {
                var self = this;
                var award = Math.floor(playerConf.unlockcost/(playerConf.hp*playerConf.coin));
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
                    self.updateAdSkin(currSkinid);
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
        gg.sdk.hideClub();
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
        gg.sdk.showClub();
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "itemjs")
        {
            this.itemJieSuo(event.target["gid"]);
            gg.sdk.aldSendEvent("角色库_解锁");
        }
        else if(data == "itemzb")
        {
            this.zbSkin(event.target["gid"]);
            gg.sdk.aldSendEvent("角色库_装备");
        }
       
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
