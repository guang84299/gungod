import { res } from "../../script/res";
import { sdk } from "../../script/sdk";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class sgbanner extends cc.Component {

    @property(cc.Node)
    item: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
   
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    game = null;
    // onLoad () {}

    start () {
        this.initUI();
    //    this.updateUI();
    }

    initUI(){
        if(gg.GAME.skipgame && gg.GAME.skipgame.banner && gg.GAME.skipgame.banner.length>0)
        {
           this.addItem();
        }
        else
        {
            this.scheduleOnce(this.initUI.bind(this),0.2); 
        }
    }

    addItem(){
        var i = this.content.children.length;
        if(gg.GAME.skipgame && gg.GAME.skipgame.banner && i<gg.GAME.skipgame.banner.length)
        {
            var data = gg.GAME.skipgame.banner[i];

            var item = cc.instantiate(this.item);
            item.y = 0;
            item["gtag"] = i;
            var icon = cc.find("icon",item);
            var name = cc.find("name",item).getComponent(cc.Label);
            name.string = data.name;
            item.active = true;

            res.loadPic(data.imgs[0],icon);
            // console.log("xx",data.btn.imgs[0]);
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
        var dir = 1;
        var sw = this.scrollView.node.width;

        var toScoll = function(){
            con.stopAllActions();
            if(dir == 1)
            {
                var t = Math.abs(((-x-con.width+sw) - con.x)/speed);
                cc.tween(con)
                .to(t,{x:-x-con.width+sw,y:y})
                .call(function(){
                    dir = 2;
                    toScoll();
                }).union().start();
            }
            else
            {
                var t =  Math.abs((x - con.x)/speed);
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
            currX = con.x;
            con.stopAllActions();
        });
        this.scrollView.node.on("scroll-ended",function(e){
            if(con.x>currX) dir = 2;
            else dir = 1;
            toScoll();
        });
    }

    updateUI()
    {
       
    }

    show(data){
        this.game = cc.find("Canvas").getComponent("game");
        
    }

    hide(){
        this.node.destroy();
        
    }

    itemClick(gtag){
        cc.log(gtag);
        var data = gg.GAME.skipgame.banner[gtag];
        sdk.skipGame(data,function(r){
            if(!r) res.openUI("sgmore",null,null,true);
            
        });
    }

    click(event,data){
        if(data == "item")
        {
            this.itemClick(event.target["gtag"]);
        }
        

        cc.log(data);
    }

    // update (dt) {}
}
