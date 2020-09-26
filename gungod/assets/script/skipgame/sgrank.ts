import { sdk } from "../../script/sdk";
import { res } from "../../script/res";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class sgrank extends cc.Component {

    @property(cc.Node)
    item: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
   
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    heads: cc.Node = null;

    @property(cc.Node)
    close: cc.Node = null;

    @property(cc.Node)
    jixu: cc.Node = null;

    game = null;
    isShiwan = false;
    // onLoad () {}

    start () {
        
    }

    onEnable(){
        this.close.active = false;
        this.jixu.active = false;
        this.scheduleOnce(function(){this.jixu.active = true;}.bind(this),2); 

        if(!sdk.judgeLegal())
        {
            this.scheduleOnce(function(){sdk.showBanner();},2.4); 
            this.scheduleOnce(function(){sdk.hideBanner();},4); 
        }
       this.initUI();
    }

    initUI(){
        if(gg.GAME.skipgame && gg.GAME.skipgame.rank && gg.GAME.skipgame.rank.length>0)
        {
            for(var i=0;i<gg.GAME.skipgame.rank.length;i++)
            {
                if(i>=3) break;
                var data = gg.GAME.skipgame.rank[i];
                var item = this.heads.children[i];
                item.active = true;
                item["gtag"] = i;

                var name = cc.find("namebg/name",item).getComponent(cc.Label);
                name.string = data.name;
                res.loadPic(data.imgs[0],item);
            }
            this.addItem();
        }
        else
        {
            this.scheduleOnce(this.initUI.bind(this),1); 
        }
    }

    addItem(){
        var i = this.content.children.length+3;
        if(gg.GAME.skipgame && gg.GAME.skipgame.rank && i<gg.GAME.skipgame.rank.length)
        {
            var data = gg.GAME.skipgame.rank[i];

            var item = cc.instantiate(this.item);
            item.active = true;
            item.y = 0;
            item["gtag"] = i;
            var icon = cc.find("icon",item);
            var name = cc.find("name",item).getComponent(cc.Label);
            name.string = data.name;
            var rank = cc.find("rank",item).getComponent(cc.Label);
            rank.string = (i+1)+"";
            var desc = cc.find("desc",item).getComponent(cc.Label);
            desc.string = data.desc;//Math.floor(Math.random()*100+5)+"位好友在玩";
            // var hot = cc.find("hot",item);
            // hot.active = data.shiwan_tag != "0" ?  true : false;
            // if(hot.active) item.color = cc.color(255,255,255);

            res.loadPic(data.imgs[0],icon);

            this.content.addChild(item);
            this.scheduleOnce(this.addItem.bind(this),0.02); 
        }
        else
        {
            this.scheduleOnce(this.initScroll.bind(this),1); 
        }
    }

    initScroll(){
        var con = this.content;
        var x = con.x;
        var y = con.y;
        var speed = 60;
        var currX = con.x;
        var currY = con.y;
        var dir = 1;
        var sh = this.scrollView.node.height;

        var toScoll = function(){
            con.stopAllActions();
            if(dir == 1)
            {
                var t = Math.abs(((con.height-y) - con.y)/speed);
                cc.tween(con)
                .to(t,{x:x,y:con.height-y})
                .call(function(){
                    dir = 2;
                    toScoll();
                }).union().start();
            }
            else
            {
                var t =  Math.abs((y - con.y)/speed);
                cc.tween(con)
                .to(t,{x:x,y:y})
                .call(function(){
                    dir = 1;
                    toScoll();
                }).union().start();
            }
        }
        toScoll();
        this.scrollView.node.on("scroll-began",function(e){
            currY = con.y;
            con.stopAllActions();
            // rightbox.isClick = true;
        });
        this.scrollView.node.on("scroll-ended",function(e){
            if(con.y>currY) dir = 1;
            else dir = 2;
            toScoll();
        });
    }

    
    updateUI()
    {
       
    }

    show(data){
        this.game = cc.find("Canvas").getComponent("game");
        this.node.active = true;
        sdk.hideBanner();

        if(data) this.isShiwan = true;
    }

    hide(){
        // this.node.destroy();
        this.node.active = false;
        // sdk.showBanner();

    }

    itemClick(gtag){
        cc.log(gtag);
        var data = gg.GAME.skipgame.rank[gtag];
        var self = this;
        sdk.skipGame(data,function(r){
            self.close.active = true;
        });
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "item")
        {
            this.itemClick(event.target["gtag"]);
        }
        else if(data == "jixu")
        {
            this.itemClick(Math.floor(Math.random()*gg.GAME.skipgame.rank.length));
        }
       
        cc.log(data);
    }

    // update (dt) {}
}
