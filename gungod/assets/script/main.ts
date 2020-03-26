
const {ccclass, property} = cc._decorator;
import { storage } from "./storage";
import { res } from "./res";
var gg = window["gg"];

@ccclass
export default class main extends cc.Component {

    @property(cc.Label)
    coinLabel: cc.Label = null;
   
    onlineTime = 0;

    yindaoStep = 0;

    coinPos = null;

    onLoad () {
        this.initData();
    }

    start () {
        this.updateCoin();
        this.scheduleOnce(this.updateBtn.bind(this),0.2);

        //更新离线
        var lixiantime = storage.getStorage(storage.logintime);
        var now = new Date().getTime();
        if(now - lixiantime>60*1000)
        res.openUI("lixian");
        this.onlineTime = now;

        //适配刘海屏
        if(gg.sdk.is_iphonex())
        {
            var topNode = cc.find("topNode",this.node);
            topNode.height += 30;
            topNode.getComponent(cc.Widget).updateAlignment();
            for(var i=0;i<topNode.children.length;i++)
            {
                topNode.children[i].y -= 15;
            }           
        }

        var yindao = storage.getStorage(storage.yindao);
        if(yindao==1){
            yindao = 2;
            storage.setStorage(storage.yindao,yindao);
        }
        if(yindao==2) gg.res.openUI("yindao",null,3);
        this.yindaoStep = yindao;

        gg.audio.playMusic(gg.res.audio_music);

        if(!this.coinPos)
        {
            var coinNode = cc.find("topNode/coinbg",this.node);
            var pos = coinNode.parent.convertToWorldSpaceAR(coinNode.position);
            this.coinPos = pos.sub(cc.v2(cc.winSize.width/2,cc.winSize.height/2));
        }


        gg.sdk.aldSendEvent("进入游戏界面");
    }

    initData(){
        gg.coin = storage.getStorage(storage.coin);
    }

   
    updateCoin(){
        this.coinLabel.string = storage.castNum(gg.coin);
    }

   
    addCoin(num,isOther:any){
        gg.coin += num;

        if(isOther)
        {
            var totalcoin = storage.getStorage(storage.totalcoin);
            storage.setStorage(storage.totalcoin,totalcoin+num);
           
            if(num>0)
            gg.res.showCoinAni(this.coinPos);
        }
        
        this.updateCoin();
    }

    updateBtn(){
        //解锁功能
        // var num = this.getUnlockRoleNum();
        // //炒作
        // cc.find("bottomNode/chaozuo",this.node).active = num > 1;
       
        // cc.find("rtxt",this.node).active = num == 0;
    }

    //更新小红点
    updateRed(){
        //炒作
        cc.find("bottomNode/chaozuo/red",this.node).active = this.isRedchaozuo();
    }

    click(event,data){
        if(data == "chaozuo")
        {
            res.openUI("chaozuo");
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
        gg.sdk.aldSendEvent("游戏界面-点击按钮"+data);
        // this.eventManage.excEvent(gg.events.coinChange,1);
    }

    update (dt) {
       
    }

    isRedchaozuo(){
        var chaozuoid = storage.getStorage(storage.chaozuoid);
       
        var isRed = false;
        
        return isRed;
    }
}
