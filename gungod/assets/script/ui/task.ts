import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
import { config } from "../config";
@ccclass
export default class task extends cc.Component {

    @property(cc.Node)
    item: cc.Node = null;
    @property(cc.Node)
    itemContent: cc.Node = null;

    bg = null;
    main = null;

    tasknum = 0;
    // onLoad () {}

    start () {

       this.addItem();
    }

    addItem()
    {
        if(this.tasknum<config.tasks.length)
        {
            var taskitem = config.tasks[this.tasknum];

            var taskdata = storage.getStorage(storage.taskdata);
            var adNum = taskdata[""+taskitem.id] ? taskdata[""+taskitem.id] : 0;
            if(adNum == 0)
            {
                var item = cc.instantiate(this.item);
                item.active = true;
                this.itemContent.addChild(item);

                var desc = cc.find("desc",item).getComponent(cc.Label);
                var award = cc.find("award",item).getComponent(cc.Label);
                var state = cc.find("state",item).getComponent(cc.Label);
                var btn = cc.find("btn",item);

                desc.string = taskitem.desc;
                award.string = storage.castNum(taskitem.award);
                btn["gid"] = taskitem.id;

                var wnum = 0;
                if(taskitem.type==1) wnum = storage.getStorage(storage.hitenemy);
                else if(taskitem.type==2) wnum = storage.getStorage(storage.hithead);
                else if(taskitem.type==3) wnum = storage.getStorage(storage.hitboss);
                
                if(wnum>=taskitem.num)
                {
                    btn.active = true;
                    state.node.active = false;
                }
                else
                {
                    btn.active = false;
                    state.node.active = true;
                    state.string = wnum+"/"+taskitem.num;
                }
            }

            this.tasknum++;

            this.scheduleOnce(this.addItem.bind(this),0.05);
        }
    }

    lingqu(target){
        var gid = target["gid"];
        var taskitem = config.tasks[gid-1];

        var coin = storage.getStorage(storage.coin);
        storage.setStorage(storage.coin,coin+taskitem.award);
        storage.uploadStorage(storage.coin);

        var taskdata = storage.getStorage(storage.taskdata);
        taskdata[""+taskitem.id] = 1;
        storage.setStorage(storage.taskdata,taskdata);
        storage.uploadStorage(storage.taskdata);

        this.main.updateCoinAni();
        this.main.updateRed();

        target.parent.destroy();
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
    }

    hide(){
        cc.tween(this.bg)
        .to(0.2,{scaleX:0},{easing:"sineOut"})
        .call(()=>{
            this.node.destroy();
            // gg.sdk.hideBanner();
        })
        .start();
    }

    click(event,data){
        if(data == "close")
        {
            this.hide();
        }
        else if(data == "lingqu")
        {
           this.lingqu(event.target);
           gg.sdk.aldSendEvent("任务_领取");
        }
        
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
