
const {ccclass, property} = cc._decorator;
import { storage } from "./storage";
import { res } from "./res";
import { config } from "./config";
var gg = window["gg"];

@ccclass
export default class main extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    @property(cc.Node)
    startBtn: cc.Node = null;
   
    onlineTime = 0;

    yindaoStep = 0;

    coinPos = null;

    currLevel = 1;
    currCoin = 0;

    onLoad () {
        this.initData();
    }

    start () {
        this.scheduleOnce(this.updateNet.bind(this),0.5);

        cc.tween(this.startBtn)
        .by(0.5,{scale:0.3},{easing:"sineIn"})
        .by(0.5,{scale:-0.3},{easing:"sineIn"})
        .union().repeatForever().start();

        
       
        //适配刘海屏
        // if(gg.sdk.is_iphonex())
        // {
        //     var topNode = cc.find("topNode",this.node);
        //     topNode.height += 30;
        //     topNode.getComponent(cc.Widget).updateAlignment();
        //     for(var i=0;i<topNode.children.length;i++)
        //     {
        //         topNode.children[i].y -= 15;
        //     }           
        // }

        gg.audio.playMusic(gg.res.audio_music);

        if(!this.coinPos)
        {
            this.scheduleOnce(function(){
                var coinNode = cc.find("coinbg",this.node);
                var pos = coinNode.parent.convertToWorldSpaceAR(coinNode.position);
                this.coinPos = pos.sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
            },0.1);
        }

        this.currLevel = storage.getStorage(storage.level);
        
        this.lvLabel.string = "当前关卡："+this.currLevel;
        this.updateCoin();
        this.updateRed();
        gg.sdk.aldSendEvent("进入游戏界面");

        gg.sdk.showBanner();
    }

    initData(){
       
    }


    updateNet(){
        //签到
        if(gg.GAME.isFirstOpen)
        {
            gg.GAME.isFirstOpen = false;
            var qiandaotag = storage.getStorage(storage.qiandaotag);
            if(qiandaotag<7)
            {
                var loginday = storage.getStorage(storage.loginday);
                if(qiandaotag<loginday)res.openUI("qiandao");
            }

            storage.setStorage(storage.logintime,new Date().getTime());
            storage.uploadStorage(storage.logintime);
            storage.uploadStorage(storage.loginday);  

            this.currLevel = storage.getStorage(storage.level);
        
            this.lvLabel.string = "当前关卡："+this.currLevel;
            this.updateCoin();
            this.updateRed();
        }
    }
   
    updateCoin(){
        this.currCoin = storage.getStorage(storage.coin);
        this.coinLabel.string = storage.castNum(this.currCoin);
    }

   
    updateCoinAni(){
        gg.res.showCoinAni(this.coinPos);
        this.updateCoin();
    }

    //更新小红点
    updateRed(){
        //枪
        cc.find("gun/red",this.node).active = this.isRedGun();
        //skin
        cc.find("skin/red",this.node).active = this.isRedSkin();
        //签到
        cc.find("qiandao/red",this.node).active = this.isRedQiandao();
        //任务
        cc.find("task/red",this.node).active = this.isRedTask();
    }

    click(event,data){
        if(data == "setting")
        {
            res.openUI("setting");
        }
        else if(data == "gun")
        {
            res.openUI("gun");
        }
        else if(data == "skin")
        {
            res.openUI("skin");
        }
        else if(data == "qiandao")
        {
            res.openUI("qiandao");
        }
        else if(data == "task")
        {
            res.openUI("task");
        }
        else if(data == "start")
        {
            cc.director.loadScene("game");
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
        gg.sdk.aldSendEvent("游戏界面-点击按钮"+data);
        // this.eventManage.excEvent(gg.events.coinChange,1);
    }

    update (dt) {
       
    }

    isRedGun(){        
        var isRed = false;
        var hasgun = storage.getStorage(storage.hasgun);
        for(var i=0;i<config.gunConf.length;i++)
        {
            if(this.currCoin>=config.gunConf[i].unlockcost 
                && this.currLevel>=config.gunConf[i].unlocklv
                && storage.indexOf(hasgun,i+1) == -1)
               {
                    isRed = true;
                    break;
               } 
        }
        
        return isRed;
    }

    isRedSkin(){
        var isRed = false;
        var hasskin = storage.getStorage(storage.hasskin);
        for(var i=0;i<config.playerConf.length;i++)
        {
            if(this.currCoin>=config.playerConf[i].unlockcost 
                && this.currLevel>=config.playerConf[i].unlocklv
                && storage.indexOf(hasskin,i+1) == -1)
               {
                    isRed = true;
                    break;
               } 
        }
        
        return isRed;
    }

    isRedQiandao(){
        var isRed = false;
        var qiandaotag = storage.getStorage(storage.qiandaotag);
        if(qiandaotag<7)
        {
            var loginday = storage.getStorage(storage.loginday);
            if(qiandaotag<loginday) isRed = true;
        }
        return isRed;
    }

    isRedTask(){
        var hitenemy = storage.getStorage(storage.hitenemy);
        var hithead = storage.getStorage(storage.hithead);
        var hitboss = storage.getStorage(storage.hitboss);
        var isRed = false;
        for(var i=0;i<config.tasks.length;i++)
        {
            var taskitem = config.tasks[i];
            var taskdata = storage.getStorage(storage.taskdata);
            var adNum = taskdata[""+taskitem.id] ? taskdata[""+taskitem.id] : 0;
            if(adNum == 0)
            {
                var wnum = 0;
                if(taskitem.type==1) wnum = hitenemy;
                else if(taskitem.type==2) wnum = hithead;
                else if(taskitem.type==3) wnum = hitboss;
                
                if(wnum>=taskitem.num)
                {
                    isRed = true;
                    break;
                }
            }
        }
        return isRed;
    }
}
