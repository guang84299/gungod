import { storage } from "../../script/storage";
import { res } from "../../script/res";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class sgshiwan extends cc.Component {

    @property(cc.Node)
    icon: cc.Node = null;

    gid = 0;
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
       
    //    this.initUI();
       
    }

    initUI(){
        if(gg.GAME.skipgame && gg.GAME.skipgame.shiwan && gg.GAME.skipgame.shiwan.length>0)
        {
            this.initItem();
            
        }
        else
        {
            this.scheduleOnce(this.initUI.bind(this),1); 
        }
    }

    initItem(){
        if(gg.GAME.skipgame && gg.GAME.skipgame.shiwan && gg.GAME.skipgame.shiwan.length>0)
        {
            res.loadPic(gg.GAME.skipgame.shiwan[this.gid].btn.imgs[0],this.icon);
            this.gid++;
            if(this.gid>=gg.GAME.skipgame.shiwan.length)this.gid = 0;
            this.scheduleOnce(this.initItem.bind(this),5); 
        }
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

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "item")
        {
            res.openUI("sgmore",null,null,true);
        }
        
       
        cc.log(data);
    }

    // update (dt) {}
}
