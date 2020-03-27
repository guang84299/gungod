const {ccclass, property} = cc._decorator;

import { config } from "./config";
import { storage } from "./storage";
import { sdk } from "./sdk";
import { qianqista } from "./qianqista";
import { audio } from "./audio";
import { res } from "./res";


var gg = window["gg"];
gg.res = res;
gg.storage = storage;
gg.sdk = sdk;
gg.qianqista = qianqista;
gg.audio = audio;
gg.config = config;
gg.GAME = {};
gg.GAME.judgeLixian = true;


@ccclass
export default class loading extends cc.Component {
    @property(cc.ProgressBar)
    progressBar = null;

    @property(cc.Label)
    progressTips = null;

    @property(cc.Node)
    loadNode = null;

    private suburls = [];
    subCount = 0;
    subTotalCount = 0;

    private purls = [];
    completedCount = 0;
    totalCount = 0;
    loadCount = 0;
    nowtime = 0;
    progress = 0;
    resource = null;

    canLoadVideo = true;

    isStart = false;

    isFirstOpen = false;

    onLoad() {
        //cc.sys.os = "web";
        // cc.game.setFrameRate(30);
        var self = this;

        qianqista.init(config.getGameId(),config.getSecret(),"测试",function(){
            // var score = storage.getStorage(storage.lv);
            // sdk.uploadScore(score,self.initNet.bind(self));
            self.initNet();
        },null);
        sdk.getUserInfo();
        //sdk.videoLoad();
        sdk.closeRank();
        this.canLoadVideo = true;

        if(storage.getStorage(storage.first) == 0)
        {
            storage.setStorage(storage.first,1);
            storage.setStorage(storage.music,1);
            storage.setStorage(storage.sound,1);
            storage.setStorage(storage.vibrate,1);
            
            this.isFirstOpen = true;
        }   
        
        if(config.isWx())
            this.loadSubpackage();
        else 
            this.loadAllRes();
     
        gg.sdk.aldSendEvent("进入加载界面");
    }

    loadSubpackage(){
        this.suburls = [
           
        ];

        this.subTotalCount = this.suburls.length;
        if(this.subTotalCount>0)
            this.loadSubpackageItem();
        else   this.loadAllRes();
    }

    loadSubpackageItem(){
        var self = this;
        cc.loader.downloader.loadSubpackage(this.suburls[this.subCount],function(r){
            console.log("加载子包："+self.suburls[self.subCount],r);
            self.subCount ++;
            if(self.subCount>=self.subTotalCount)
            {
                gg.sdk.aldSendEvent("加载子包完成");
                self.loadAllRes();
            }
            else{
                self.progressBar.progress = self.subCount/self.subTotalCount;
                self.progressTips.string = "加载中 " + Math.floor(self.subCount/self.subTotalCount*100)+"%";
                self.loadSubpackageItem();
            }
        });
    }

    loadAllRes(){
        this.purls = [
            //"audio/button",

            // "conf/role",
                        
            "prefab/game/platform",
            "prefab/game/floor",
            "prefab/game/player",
            "prefab/game/enemy",
            "prefab/game/bullet",
                    
            // "prefab/anim/qinwang",
           
            // "prefab/ui/toast"
        ];

        // for(var i=1;i<=9;i++)
        // {
        //    this.purls.push("prefab/game/Res"+i);
        // }
        this.totalCount = this.purls.length;
        this.loadCount = 0;
        this.nowtime = new Date().getTime();
        for(var i=0;i<2;i++)
        this.loadres();  
    }


    start () {
        // Your initialization goes here.
       
    }

    loadres() {
        var self = this;
        if(this.loadCount<this.totalCount)
        {
            var index = this.loadCount;
            var path = this.purls[index];
            if(path.indexOf("anims/") != -1)
            {
                cc.loader.loadRes(this.purls[index],cc.SpriteAtlas, function(err, prefab)
                {
                    self.progressCallback(self.completedCount,self.totalCount,prefab,index);
                });
            }
            else
            {
                cc.loader.loadRes(this.purls[index], function(err, prefab)
                {
                    self.progressCallback(self.completedCount,self.totalCount,prefab,index);
                });
            }

            this.loadCount++;
        }
    }

    progressCallback(completedCount:number, totalCount:number,resource:any,index:number){
        this.progress = completedCount / totalCount;
        this.resource = resource;
        this.completedCount++;
        //this.totalCount = totalCount;

        this.progressBar.progress = this.progress;
        this.progressTips.string = "加载中 " + Math.floor(this.completedCount/this.totalCount*100)+"%";

        
        this.setRes(resource,index);

        if(this.completedCount>=this.totalCount)
        {
            this.completeCallback();
        }
        else{
            this.loadres();
            //this.scheduleOnce(this.loadres.bind(this),0.1);
        }

        if(this.canLoadVideo && this.progress>0.6)
        {
            this.canLoadVideo = false;
            sdk.videoLoad();
        }
    }

    completeCallback () {
        console.log("-----completeCallback---time:",new Date().getTime()-this.nowtime);
        this.progressTips.string = "加载完成";
        this.progressBar.progress = 1;
        //this.progressTips.string = "加载中";
        //this.progressBar.node.active = true;
        //cc.loader.loadResDir("audio", this.progressCallback.bind(this), this.completeCallback2.bind(this));
        gg.sdk.aldSendEvent("加载资源完成");
        this.loadNode.active = false;
        this.startGame();
    }

    setRes(resource:any,index:number){
        var url = this.purls[index];
        var pifx = "";
        if(url.indexOf("audio/") != -1)
            pifx = "audio_";
        else if(url.indexOf("prefab/ui/") != -1)
            pifx = "prefab_ui_";
        else if(url.indexOf("prefab/anim/") != -1)
            pifx = "prefab_anim_";
        else if(url.indexOf("prefab/game/") != -1)
            pifx = "prefab_game_";
        else if(url.indexOf("roleani/") != -1)
            pifx = "prefab_skin_";    
        else if(url.indexOf("prefab/") != -1)
            pifx = "prefab_";
        else if(url.indexOf("conf/") != -1)
        {
            pifx = "conf_"+resource.name;
            //console.error(url,cc.url.raw("resources/"+url));
            resource = JSON.parse(resource.text);
        }

        if(url.indexOf("conf/") != -1)
            res.loads[pifx] = resource;
        else
        {
            res.loads[pifx+resource.data.name] = resource;
        }
            

        // cc.log(res.loads);
    }

    startGame() {
        if(this.progressBar.progress >= 1 && !this.isStart)
        {
            this.isStart = true;
            // this.progressBar.node.active = false;
            cc.log(res.loads);
            // res.openUI("juqing");
            // if(this.isFirstOpen) res.openUI("juqing");
            cc.director.loadScene("game");
            
        }
    }

    initNet(){
        var self = this;
        var httpDatas = false;
        var httpControl = false;
        qianqista.datas(function(res){
            console.log('my datas:', res);
            if(res.state == 200)
            {
                self.updateLocalData(res.data);
            }
            httpDatas = true;

            if(httpDatas && httpControl)
            {
                // self.loadNode.active = false;
                self.startGame();
            }

        });

        //qianqista.pdatas(function(res){
        //    self.updateLocalData2(res);
        //    httpPdatas = true;
        //
        //    if(httpDatas && httpPdatas && httpControl)
        //    {
        //        self.loadNode.active = false;
        //        self.startGame();
        //    }
        //});
        //qianqista.rankScore(function(res){
        //    self.worldrank = res.data;
        //});

        qianqista.control(function(res){
            console.log('my control:', res);
            if(res.state == 200)
            {
                gg.GAME.control = res.data;
                self.updateUIControl();
            }
            httpControl = true;

            if(httpDatas && httpControl)
            {
                // self.loadNode.active = false;
                self.startGame();
            }
        });
    }

    updateUIControl(){
        gg.GAME.skipgame = null;
        gg.GAME.share = false;
        gg.GAME.lixianswitch = false;
        gg.GAME.adCheck = true;
        gg.GAME.shares = [];
        if(gg.GAME.control.length>0)
        {
            for(var i=0;i<gg.GAME.control.length;i++)
            {
                var con = gg.GAME.control[i];
                if(con.id == "skipgame")
                {
                    if(con.value)
                    {
                        //[{'name':'全民剪羊毛','appId':'wx37d536c56e3e73f7','icon1':'https://www.7q7q.top/gameicon/sheep1.png','icon2':'https://www.7q7q.top/gameicon/sheep1.png','ani':'https://www.7q7q.top/gameicon/sheepAni','aniNum':'2'},{'name':'全民剪羊毛2','appId':'wx37d536c56e3e73f7','icon1':'https://www.7q7q.top/gameicon/sheep1.png','icon2':'https://www.7q7q.top/gameicon/sheep1.png'}]
                        var s = con.value.replace(/\'/g,"\"");
                        gg.GAME.skipgame = JSON.parse(s);
                    }
                }
                else if(con.id.indexOf("share") != -1)
                {
                    if(con.id == "share")
                    {
                        gg.GAME.share = con.value == 1 ? true : false;
                    }
                    else
                    {
                        if(con.value && con.value.length>0)
                        {
                            var s = con.value.replace(/\'/g,"\"");
                            gg.GAME.shares.push(JSON.parse(s));
                        }
                    }

                }
                else if(con.id == "lixian")
                {
                    gg.GAME.lixianswitch = con.value == 1 ? true : false;
                }
                else if(con.id == "adCheck")
                {
                    gg.GAME.adCheck = con.value == 1 ? true : false;
                }
                else
                {
                    gg.GAME[con.id] = con.value;
                }
            }

        }
    }

    updateLocalData(data:any){
        if(data)
        {
            var datas = JSON.parse(data);
            // if(datas.hasOwnProperty("first"))
            //     storage.setStorage(storage.first);
            if(datas.hasOwnProperty("coin"))
            {
                var coin = Number(datas.coin);
                var coin2 = storage.getStorage(storage.coin);
                if(coin2>coin) coin = coin2;
                storage.setStorage(storage.coin,coin);
            }

            // if(datas.hasOwnProperty("gold"))
            //     storage.setStorage(storage.gold, Number(datas.gold)); 

            // if(datas.hasOwnProperty("hasrole"))
            //     storage.setStorage(storage.hasrole, datas.hasrole);  

            // if(datas.hasOwnProperty("chaozuoid"))
            //     storage.setStorage(storage.chaozuoid, datas.chaozuoid);

            // if(datas.hasOwnProperty("tiaozhanid"))
            //     storage.setStorage(storage.tiaozhanid, Number(datas.tiaozhanid));

            // if(datas.hasOwnProperty("fuli"))
            //     storage.setStorage(storage.fuli, datas.fuli);

            // if(datas.hasOwnProperty("laodianrate"))
            //     storage.setStorage(storage.laodianrate, Number(datas.laodianrate));    

            // if(datas.hasOwnProperty("guiziid"))
            //     storage.setStorage(storage.guiziid, datas.guiziid);    

            // if(datas.hasOwnProperty("onlinetime"))
            //     storage.setStorage(storage.onlinetime, Number(datas.onlinetime)); 
            
            // if(datas.hasOwnProperty("bankanum"))
            //     storage.setStorage(storage.bankanum, Number(datas.bankanum)); 
                
            // if(datas.hasOwnProperty("bankatime"))
            //     storage.setStorage(storage.bankatime, Number(datas.bankatime)); 
               
            // if(datas.hasOwnProperty("bankarate"))
            //     storage.setStorage(storage.bankarate, Number(datas.bankarate));   
            
            // if(datas.hasOwnProperty("bankalastsa"))
            //     storage.setStorage(storage.bankalastsa, Number(datas.bankalastsa));   

            // if(datas.hasOwnProperty("videonum"))
            //     storage.setStorage(storage.videonum, Number(datas.videonum));  

            // if(datas.hasOwnProperty("totalcoin"))
            //     storage.setStorage(storage.totalcoin, Number(datas.totalcoin));  

            // if(datas.hasOwnProperty("cainum"))
            //     storage.setStorage(storage.cainum, Number(datas.cainum));  

            // if(datas.hasOwnProperty("jingying"))
            //     storage.setStorage(storage.jingying, datas.jingying);  
                
            // if(datas.hasOwnProperty("renwuid"))
            //     storage.setStorage(storage.renwuid, datas.renwuid);    
                
            // if(datas.hasOwnProperty("shipin"))
            //     storage.setStorage(storage.shipin, datas.shipin);   
                
            // if(datas.hasOwnProperty("baoliao"))
            //     storage.setStorage(storage.baoliao, datas.baoliao); 
                
            // if(datas.hasOwnProperty("tucao"))
            //     storage.setStorage(storage.tucao, datas.tucao);

            // if(datas.hasOwnProperty("shengzhi"))
            //     storage.setStorage(storage.shengzhi, datas.shengzhi);

            // if(datas.hasOwnProperty("shouyix2"))
            //     storage.setStorage(storage.shouyix2, datas.shouyix2);

            if(datas.hasOwnProperty("loginday"))
                storage.setStorage(storage.loginday, Number(datas.loginday));    
                
            if(datas.hasOwnProperty("logintime"))
                storage.setStorage(storage.logintime, Number(datas.logintime));
            
            if(datas.hasOwnProperty("yindao"))
                storage.setStorage(storage.yindao, Number(datas.yindao));
           
        
            var t1 = new Date().getTime();
            var t2 = storage.getStorage(storage.logintime);
            if(storage.isResetDay(t1,t2))
            {
                var loginday = storage.getStorage(storage.loginday);
                storage.setStorage(storage.loginday, loginday+1);   
                // storage.setStorage(storage.fuli, []);   
                // storage.setStorage(storage.cainum,2);
                // storage.setStorage(storage.renwuid, []); 
                // storage.setStorage(storage.baoliao, {});
                // storage.setStorage(storage.shipinnum,0);
            }
            console.log("datas:",datas);
        }
        else
        {
             
        }
    }
    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}
