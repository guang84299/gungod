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
        cc.color(208,163,162),cc.color(107,133,148),cc.color(140,31,57),cc.color(86,127,22)],

    gunConf:[
        {id:1,anchor:cc.v2(0.3,0.5), aim:cc.v2(43,-3)},
        {id:2,anchor:cc.v2(0.34,0.5), aim:cc.v2(43,-2)},
        {id:3,anchor:cc.v2(0.4,0.5), aim:cc.v2(38,0)},
        {id:4,anchor:cc.v2(0.35,0.5), aim:cc.v2(77,-3)},
        {id:5,anchor:cc.v2(0.38,0.5), aim:cc.v2(65,-4)},
        {id:6,anchor:cc.v2(0.35,0.4), aim:cc.v2(66,-6)},
        {id:7,anchor:cc.v2(0.32,0.5), aim:cc.v2(56,-1)},
        {id:8,anchor:cc.v2(0.4,0.4), aim:cc.v2(71,-5)},
        {id:9,anchor:cc.v2(0.35,0.4), aim:cc.v2(75,-5)},
        {id:10,anchor:cc.v2(0.35,0.4), aim:cc.v2(88,-8)},
        {id:11,anchor:cc.v2(0.4,0.5), aim:cc.v2(67,-8)},
        {id:12,anchor:cc.v2(0.4,0.4), aim:cc.v2(55,-8)},
        {id:13,anchor:cc.v2(0.35,0.4), aim:cc.v2(74,-4)},
        {id:14,anchor:cc.v2(0.4,0.4), aim:cc.v2(83,0)},
        {id:15,anchor:cc.v2(0.4,0.54), aim:cc.v2(66,-5)},
        {id:16,anchor:cc.v2(0.45,0.54), aim:cc.v2(46,-5)},
        {id:17,anchor:cc.v2(0.4,0.5), aim:cc.v2(40,-5)},
        {id:18,anchor:cc.v2(0.38,0.5), aim:cc.v2(77,-7)},
        {id:19,anchor:cc.v2(0.45,0.45), aim:cc.v2(64,-15)},
        {id:20,anchor:cc.v2(0.4,0.5), aim:cc.v2(38,-2)}
    ], 
    
    enemyConf:[
        {id:1,hv:cc.v2(0,20),hc:cc.size(48,28),bv:cc.v2(0,-15),bc:cc.size(58,40),color:cc.color(221,88,254)},
        {id:2,hv:cc.v2(0,20),hc:cc.size(48,28),bv:cc.v2(0,-15),bc:cc.size(58,40),color:cc.color(120,56,251)},
        {id:3,hv:cc.v2(0,20),hc:cc.size(48,28),bv:cc.v2(0,-15),bc:cc.size(58,40),color:cc.color(240,42,60)},
        {id:4,hv:cc.v2(0,20),hc:cc.size(48,28),bv:cc.v2(0,-15),bc:cc.size(58,40),color:cc.color(157,251,56)},
        {id:5,hv:cc.v2(0,20),hc:cc.size(48,28),bv:cc.v2(0,-15),bc:cc.size(58,40),color:cc.color(42,254,182)},
        {id:6,hv:cc.v2(0,20),hc:cc.size(48,34),bv:cc.v2(0,-17),bc:cc.size(40,40),color:cc.color(42,254,182)},
        {id:7,hv:cc.v2(0,20),hc:cc.size(48,34),bv:cc.v2(0,-17),bc:cc.size(40,40),color:cc.color(157,251,56)},
        {id:8,hv:cc.v2(0,20),hc:cc.size(48,34),bv:cc.v2(0,-17),bc:cc.size(40,40),color:cc.color(240,42,60)},
        {id:9,hv:cc.v2(0,20),hc:cc.size(48,34),bv:cc.v2(0,-17),bc:cc.size(40,40),color:cc.color(120,56,251)},
        {id:10,hv:cc.v2(0,20),hc:cc.size(48,34),bv:cc.v2(0,-17),bc:cc.size(40,40),color:cc.color(221,88,254)},
        {id:11,hv:cc.v2(0,33),hc:cc.size(28,22),bv:cc.v2(0,-12),bc:cc.size(28,64),color:cc.color(221,88,254)},
        {id:12,hv:cc.v2(0,33),hc:cc.size(28,22),bv:cc.v2(0,-12),bc:cc.size(28,64),color:cc.color(120,56,251)},
        {id:13,hv:cc.v2(0,33),hc:cc.size(28,22),bv:cc.v2(0,-12),bc:cc.size(28,64),color:cc.color(240,42,60)},
        {id:14,hv:cc.v2(0,33),hc:cc.size(28,22),bv:cc.v2(0,-12),bc:cc.size(28,64),color:cc.color(157,251,56)},
        {id:15,hv:cc.v2(0,33),hc:cc.size(28,22),bv:cc.v2(0,-12),bc:cc.size(28,64),color:cc.color(42,254,182)}
    ],

    bossConf:[
        {id:1,hv:cc.v2(0,31),hc:cc.size(32,36),bv:cc.v2(0,-18),bc:cc.size(42,62),color:cc.color(221,88,254)},
        {id:2,hv:cc.v2(0,33),hc:cc.size(34,36),bv:cc.v2(0,-20),bc:cc.size(60,68),color:cc.color(221,88,254)},
        {id:3,hv:cc.v2(0,31),hc:cc.size(38,56),bv:cc.v2(0,-28),bc:cc.size(42,66),color:cc.color(221,88,254)},
        {id:4,hv:cc.v2(5,23),hc:cc.size(40,50),bv:cc.v2(2,-25),bc:cc.size(38,50),color:cc.color(221,88,254)},
        {id:5,hv:cc.v2(0,31),hc:cc.size(38,44),bv:cc.v2(0,-21),bc:cc.size(44,60),color:cc.color(221,88,254)},
        {id:6,hv:cc.v2(0,31),hc:cc.size(46,50),bv:cc.v2(0,-26),bc:cc.size(46,60),color:cc.color(221,88,254)},
        {id:7,hv:cc.v2(0,25),hc:cc.size(40,30),bv:cc.v2(0,-19),bc:cc.size(58,58),color:cc.color(221,88,254)},
        {id:8,hv:cc.v2(0,23),hc:cc.size(44,30),bv:cc.v2(0,-15),bc:cc.size(88,46),color:cc.color(221,88,254)},
        {id:9,hv:cc.v2(0,27),hc:cc.size(40,40),bv:cc.v2(0,-21),bc:cc.size(46,54),color:cc.color(221,88,254)},
        {id:10,hv:cc.v2(0,27),hc:cc.size(40,40),bv:cc.v2(0,-24),bc:cc.size(50,60),color:cc.color(221,88,254)},
        {id:11,hv:cc.v2(5,37),hc:cc.size(42,42),bv:cc.v2(5,-21),bc:cc.size(40,70),color:cc.color(221,88,254)},
        {id:12,hv:cc.v2(0,39),hc:cc.size(30,40),bv:cc.v2(0,-17),bc:cc.size(40,74),color:cc.color(221,88,254)},
        {id:13,hv:cc.v2(0,32),hc:cc.size(30,32),bv:cc.v2(0,-14),bc:cc.size(74,64),color:cc.color(221,88,254)},
        {id:14,hv:cc.v2(0,16),hc:cc.size(44,40),bv:cc.v2(0,-21),bc:cc.size(62,34),color:cc.color(221,88,254)},
        {id:15,hv:cc.v2(0,42),hc:cc.size(36,36),bv:cc.v2(0,-17),bc:cc.size(26,82),color:cc.color(221,88,254)},
        {id:16,hv:cc.v2(0,30),hc:cc.size(42,34),bv:cc.v2(-2,-16),bc:cc.size(24,60),color:cc.color(221,88,254)}
    ],

    levels:[
        {id:1,floor:2},
        {id:2,floor:5},
        {id:3,floor:6},
        {id:4,floor:6},
        {id:5,floor:7},
        {id:6,floor:7},
        {id:7,floor:7},
        {id:8,floor:8},
        {id:9,floor:8},
        {id:10,floor:8}
    ]    
    
};

