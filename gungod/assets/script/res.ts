const {ccclass, property} = cc._decorator;
var gg = window["gg"];

export const res = {
    
    loads:{},
    audio_music: "audio/bgm",
    audio_button: "audio/button",
    audio_coin: "audio/coin",
    nodePools: {},

    getObjByPool: function(name){
        if(!this.nodePools[name]) this.nodePools[name] = new cc.NodePool();
        let obj = null;
        if (this.nodePools[name].size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            obj = this.nodePools[name].get();
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            obj = cc.instantiate(this.loads[name]);
        }
        return obj;
    },

    putObjByPool: function(obj,name){
        if(!this.nodePools[name]) this.nodePools[name] = new cc.NodePool();
        this.nodePools[name].put(obj); 
    },

    setSpriteFrame: function(url,sp,callback?:any)
    {
        cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
            if(!err && sp && cc.isValid(sp))
            {
                var sf = sp.getComponent(cc.Sprite);
                if(sf) sf.spriteFrame = spriteFrame;
                if(callback) callback(spriteFrame);
                //sp.getComponent("cc.Sprite").spriteFrame = spriteFrame;
            }
        });
    },

    setSpriteFrameAtlas: function(atlasUrl,url,sp)
    {
        cc.loader.loadRes(atlasUrl,cc.SpriteAtlas, function(err, atlas)
        {
            if(!err && sp && cc.isValid(sp))
            {
                sp.getComponent(cc.Sprite).spriteFrame = atlas.getSpriteFrame(url);
            }

        });
    },

    loadPic: function(url,sp)
    {
        cc.loader.load({url: url, type: 'png'}, function (err, tex) {
            if(err)
            {
                cc.log(err);
            }
            else
            {
                if(cc.isValid(sp))
                {
                    var spriteFrame = new cc.SpriteFrame(tex);
                    sp.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            }
        });
    },

    showToast: function(str)
    {
        var toast = cc.instantiate(this.loads["prefab_ui_toast"]);
        cc.find("label",toast).getComponent(cc.Label).string = str;
        cc.find("Canvas").addChild(toast,10000);
        toast.getComponent(cc.Sprite).scheduleOnce(function(){
            toast.destroy();
        },1.7)
    },

    showCoinAni: function(pos)
    {
        for(var i=0;i<8;i++)
        {
            var node = new cc.Node();
            node.addComponent(cc.Sprite);
            cc.find("Canvas").addChild(node,10000);
            this.setSpriteFrame("images/common/icon_huobi_jinbi",node);
            node.x = (Math.random()-0.5)*300;
            node.y = (Math.random()-0.5)*300;
            node.runAction(cc.sequence(
                cc.moveTo(0.5,pos).easing(cc.easeSineIn()),
                cc.removeSelf()
            ));
            gg.audio.playSound(gg.res.audio_coin);
        }
    },

    showGoldAni: function(pos)
    {
        for(var i=0;i<8;i++)
        {
            var node = new cc.Node();
            node.addComponent(cc.Sprite);
            cc.find("Canvas").addChild(node,10000);
            this.setSpriteFrame("images/common/icon_huobi_yuanbao",node);
            node.x = (Math.random()-0.5)*300;
            node.y = (Math.random()-0.5)*300;
            node.runAction(cc.sequence(
                cc.moveTo(0.5,pos).easing(cc.easeSineIn()),
                cc.removeSelf()
            ));
            gg.audio.playSound(gg.res.audio_coin);
        }
    },

    openUI: function(name,parent?:cc.Node,showType?:any)
    {
        if(!parent) parent = cc.find("Canvas");
        if(parent)
        {
            var node = parent.getChildByName("ui_"+name);
            if(node)
            {
                //node.active = true;
                node.getComponent(name).show(showType);
                return;
            }

            if(parent["opening_"+name])
            {
                return;
            }
        }
        parent["opening_"+name] = true;
        cc.loader.loadRes("prefab/ui/"+name, function(err, prefab)
        {
            parent["opening_"+name] = false;
            if(err)
            {
                console.log("init error "+name,err);
            }
            else
            {
                var node = cc.instantiate(prefab);
                node.name = "ui_"+name;
                parent.addChild(node);
                node.getComponent(name).show(showType);
            }
        });
    },

    closeUI: function(name,parent?:cc.Node)
    {
        if(!parent) parent = cc.find("Canvas");
        if(parent)
        {
            var node = parent.getChildByName("ui_"+name);
            if(node)
            {
                node.destroy();
            }
        }
    },

    getUI: function(name,parent?:cc.Node)
    {
        if(!parent) parent = cc.find("Canvas");
        if(parent)
        {
            var node = parent.getChildByName("ui_"+name);
            if(node)
            {
                return node.getComponent(name);
            }
        }
        return null;
    },

    openPrefab: function(path,parent?:cc.Node,callback?:any)
    {
        if(!parent) parent = cc.find("Canvas");
        cc.loader.loadRes("prefab/"+path, function(err, prefab)
        {
            if(err)
            {
                console.log("init error "+path,err);
            }
            else
            {
                var node = cc.instantiate(prefab);
                parent.addChild(node);
                if(callback)callback(node);
            }
        });
    },
};

