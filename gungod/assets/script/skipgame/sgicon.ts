import { res } from "../../script/res";
import { sdk } from "../../script/sdk";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class sgicon extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    @property(cc.Integer)
    rankNum = 0;

    gid = 0;
    currGid = 0;
    game = null;
    // onLoad () {}

    start () {

        cc.tween(this.node)
        .delay(2)
        .to(0.1,{angle:10},{easing:'sineIn'})
        .to(0.1,{angle:0},{easing:'sineIn'})
        .to(0.1,{angle:-10},{easing:'sineOut'})
        .to(0.1,{angle:0},{easing:'sineOut'})
        .union()
        .repeatForever()
        .start();
       
       for(var i=0;i<this.node.children.length;i++)
       {
            this.node.children[i].active = false;
       }

       this.initUI();
    }

    initUI(){

        if(gg.GAME.skipgame && gg.GAME.skipgame.icon && gg.GAME.skipgame.icon.length>0)
        {
            for(var i=0;i<this.node.children.length;i++)
            {
                    this.node.children[i].active = true;
            }
            if(this.rankNum != 1) 
            {
                this.gid+=this.rankNum; 
                if(this.gid>=gg.GAME.skipgame.icon.length)this.gid = 0;
            }
            this.initItem();
        }
        else
        {
            this.scheduleOnce(this.initUI.bind(this),1); 
        }
    }

    initItem(){

        if(gg.GAME.skipgame && gg.GAME.skipgame.icon && gg.GAME.skipgame.icon.length>0)
        {
            this.currGid = this.gid;
            res.loadPic(gg.GAME.skipgame.icon[this.gid].imgs[0],this.icon);
           
            this.gid+=1;
            if(this.gid>=gg.GAME.skipgame.icon.length)this.gid = 0;
            this.scheduleOnce(this.initItem.bind(this),5); 
        }
    }

    updateUI()
    {
       
    }

    itemClick(gtag){
        cc.log(gtag);
        var data = gg.GAME.skipgame.icon[gtag];
        sdk.skipGame(data,function(r){
            if(!r) res.openUI("sgmore",null,null,true);
        });
    }

    show(data){
        this.game = cc.find("Canvas").getComponent("game");
        
    }

    hide(){
        this.node.destroy();
        
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "item")
        {
            this.itemClick(this.currGid);
        }
        
       
        cc.log(data);
    }

    // update (dt) {}
}
