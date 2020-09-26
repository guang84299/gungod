import { sdk } from "../../script/sdk";
import { res } from "../../script/res";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class sgnext extends cc.Component {

    @property(cc.Node)
    item: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
   
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    next: cc.Node = null;
    @property(cc.Node)
    close: cc.Node = null;

    game = null;
    // onLoad () {}

    start () {
       
    }

    onEnable(){
        this.close.active = false;
        this.next.active = false;
        
       this.initUI();
    }

    initUI(){
        if(gg.GAME.skipgame && gg.GAME.skipgame.jiesuan && gg.GAME.skipgame.jiesuan.length>0)
        {
            this.addItem();
        }
        else
        {
            this.scheduleOnce(this.initUI.bind(this),1); 
        }
    }

    addItem(){
        var i = this.content.children.length;
        if(gg.GAME.skipgame && gg.GAME.skipgame.jiesuan && i<gg.GAME.skipgame.jiesuan.length)
        {
            var data = gg.GAME.skipgame.jiesuan[i];

            var item = cc.instantiate(this.item);
            item.active = true;
            item.y = 0;
            item["gtag"] = i;
            var icon = cc.find("icon",item);
            var name = cc.find("name",item).getComponent(cc.Label);
            name.string = data.name;
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
        this.node.zIndex = 99;
        sdk.hideBanner();
    }

    hide(){
        // this.node.destroy();
        this.node.active = false;
        
    }

    itemClick(gtag){
        cc.log(gtag);
        var data = gg.GAME.skipgame.jiesuan[gtag];
        var self = this;
        sdk.skipGame(data,function(r){
            if(!self.next.active)
            {
                self.scheduleOnce(function(){self.next.active = true;self.close.active = true;},2); 
            }
        });       
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
            this.game.click(null,"home");
        }
        else if(data == "item")
        {
            this.itemClick(event.target["gtag"]);
        }
        else if(data == "next")
        {
            this.hide();
            sdk.showBanner();
            this.game.nextLevel();
        }
       
        cc.log(data);
    }

    // update (dt) {}
}
