const {ccclass, property} = cc._decorator;
var gg = window["gg"];

export const config = {
    
   isWx(){
        return window["wx"] ? true : false;
   },

   isQQ(){
        return window["qq"] ? true : false;
   },

   getGameId(){
        if(this.isQQ())
            return "wx35c2e9513b8cc097";
        else if(this.isWx())
            return "wx35c2e9513b8cc097"; 
        else  return "guntest";       
   },

   getSecret(){
        if(this.isQQ())
            return "8a1126dfbcf8ca52750956ba8adde717";
        else if(this.isWx())
            return "8a1126dfbcf8ca52750956ba8adde717"; 
        else  return "guntest";       
    },

    bgcolor:[cc.color(36,106,206),cc.color(110,24,128),cc.color(25,112,133),cc.color(136,110,94),
        cc.color(89,89,89),cc.color(132,131,172),cc.color(134,152,118),cc.color(149,149,149),
        cc.color(24,128,93),cc.color(122,28,24),cc.color(24,95,128),cc.color(149,140,46),
        cc.color(208,163,162),cc.color(107,133,148),cc.color(140,31,57),cc.color(86,127,22)]
    
};

