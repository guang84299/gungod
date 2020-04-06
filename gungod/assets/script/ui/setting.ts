import { storage } from "../storage";

const {ccclass, property} = cc._decorator;
var gg = window["gg"];
@ccclass
export default class setting extends cc.Component {

    @property(cc.Node)
    musicOpen: cc.Node = null;
    @property(cc.Node)
    musicClose: cc.Node = null;

    @property(cc.Node)
    soundOpen: cc.Node = null;
    @property(cc.Node)
    soundClose: cc.Node = null;

    bg = null;
    game = null;
    // onLoad () {}

    start () {
       this.updateUI();
        
    }

    updateUI()
    {
        var music = storage.getStorage(storage.music);
        var sound = storage.getStorage(storage.sound);

        if(music == 1)
        {
            this.musicOpen.active = true;
            this.musicClose.active = false;
        }
        else
        {
            this.musicOpen.active = false;
            this.musicClose.active = true;
        }

        if(sound == 1)
        {
            this.soundOpen.active = true;
            this.soundClose.active = false;
        }
        else
        {
            this.soundOpen.active = false;
            this.soundClose.active = true;
        }
    }

    show(data){
        this.game = cc.find("Canvas").getComponent("main");
        this.bg = cc.find("bg",this.node);
        this.bg.scaleY = 0;
        cc.tween(this.bg)
        .delay(0.01)
        .to(0.2,{scaleY:1},{easing:"sineInOut"})
        .start();

        gg.sdk.showBanner();
    }

    hide(){
        cc.tween(this.bg)
        .to(0.2,{scaleY:0},{easing:"sineOut"})
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
        else if(data == "music")
        {
            var music = storage.getStorage(storage.music);
            storage.setStorage(storage.music,music == 1?0:1);
            if(music == 1) gg.audio.stopMusic();
            else gg.audio.playMusic(gg.res.audio_music);
            this.updateUI();
        }
        else
        {
            var sound = storage.getStorage(storage.sound);
            storage.setStorage(storage.sound,sound == 1?0:1);
            this.updateUI();
        }
        gg.audio.playSound(gg.res.audio_button);
        cc.log(data);
    }

    // update (dt) {}
}
