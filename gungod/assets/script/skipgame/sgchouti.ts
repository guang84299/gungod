import { sdk } from "../../script/sdk";
import { res } from "../../script/res";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class sgchouti extends cc.Component {

    @property(cc.Node)
    item: cc.Node = null;
    @property(cc.Node)
    content: cc.Node = null;
   
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    jiantou: cc.Node = null;
    @property(cc.Node)
    box: cc.Node = null;

    game = null;
    // onLoad () {}

    start () {
      
        this.initUI(); 
    }

    initUI(){
        if(gg.GAME.skipgame && gg.GAME.skipgame.chouti && gg.GAME.skipgame.chouti.length>0)
        {
            this.addItem();
        }
        else
        {
            this.scheduleOnce(this.initUI.bind(this),0.5); 
        }
    }

    addItem(){
        var i = this.content.children.length;
        if(gg.GAME.skipgame && gg.GAME.skipgame.chouti && i<gg.GAME.skipgame.chouti.length)
        {
            var data = gg.GAME.skipgame.chouti[i];

            var item = cc.instantiate(this.item);
            item.y = 0;
            item["gtag"] = i;
            var icon = cc.find("icon",item);
            var name = cc.find("name",item).getComponent(cc.Label);
            name.string = data.name;
            item.active = true;

            // if(data.chouti_tag != "0") 
            // {
            //     cc.find("hot",item).active = true;
            // }

            res.loadPic(data.imgs[0],icon);
            // console.log(data.btn.imgs[0]);
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
                var t = Math.abs(((con.height-y-sh) - con.y)/speed);
                cc.tween(con)
                .to(t,{x:x,y:con.height-y-sh})
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

    openbox()
    {
        this.jiantou.active = false;
        this.box['initX'] = this.box.x;

        cc.tween(this.box)
        .to(0.3,{x:this.box['initX']+this.scrollView.node.parent.width},{easing:'sineIn'})
        .call(()=>{

        })
        .start();
        sdk.hideBanner();
    }

    closebox(){
        cc.tween(this.box)
        .to(0.3,{x:this.box['initX']},{easing:'sineIn'})
        .call(()=>{
            this.jiantou.active = true;
        })
        .start();
        sdk.showBanner();
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
        var data = gg.GAME.skipgame.chouti[gtag];
        sdk.skipGame(data,function(r){
            if(!r) res.openUI("sgmore",null,null,true);
        });
        
    }

    click(event,data){
        if(data == "openbox")
        {
            this.openbox();
        }
        else if(data == "closebox")
        {
            this.closebox();
        }
        else if(data == "item")
        {
            this.itemClick(event.target["gtag"]);
        }
        console.log(data);

        // cc.log(data);
    }

    // update (dt) {}
}
