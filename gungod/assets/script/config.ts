const {ccclass, property} = cc._decorator;
var gg = window["gg"];

export const config = {
    
   isWx(){
        return window["wx"] ? true : false;
   },

   isQQ(){
        return window["qq"] ? true : false;
   },

   isTT(){
    return window["tt"] ? true : false;
   },

   getGameId(){
        if(this.isQQ())
            return "1110371568";
        else if(this.isTT())
            return "tt317447c9ae5e785d";     
        else if(this.isWx())
            return "wx35c2e9513b8cc097"; 
        else  return "guntest";       
   },

   getSecret(){
        if(this.isQQ())
            return "9tEFZVnndS9FjcZp";
        else if(this.isTT())
            return "02a48e692de7049b16d426a214166ea788453a19";         
        else if(this.isWx())
            return "8a1126dfbcf8ca52750956ba8adde717"; 
        else  return "guntest";       
    },

    getGameName(){
        if(this.isQQ())
            return "测试-QQ";
        else if(this.isTT())
            return "测试-TT";            
        else if(this.isWx())
            return "测试-微信"; 
        else  return "测试";       
   },

   getBannerId(){
        if(this.isQQ())
            return "e5aabb20cee5c8ac9cbf5270758ab69d";
        else if(this.isTT())
            return "233mm0bofh7cffbn5n";     
        else if(this.isWx())
            return "adunit-c5b2e0e80388172e"; 
        else  return "guntest";       
   },

   getVideoId(){
        if(this.isQQ())
            return "dc796ef1a81af695303a5c7ce347b2f4";
        else if(this.isTT())
            return "19gin3eq0foe2c7jg7";        
        else if(this.isWx())
            return "adunit-506949787fc773c5"; 
        else  return "guntest";       
    },

    getSpotId(){
        if(this.isQQ())
            return "adunit-71169d03764c01e5";
        else if(this.isTT())
            return "fnban5j273rbpep1r6";        
        else if(this.isWx())
            return "adunit-71169d03764c01e5"; 
        else  return "guntest";       
    },

    bgcolor:[cc.color(36,106,206),cc.color(110,24,128),cc.color(25,112,133),cc.color(136,110,94),
        cc.color(89,89,89),cc.color(132,131,172),cc.color(134,152,118),cc.color(149,149,149),
        cc.color(24,128,93),cc.color(122,28,24),cc.color(24,95,128),cc.color(149,140,46),
        cc.color(208,163,162),cc.color(107,133,148),cc.color(140,31,57),cc.color(86,127,22)],

    playerConf: [//type 1综合 2金币 3血量
        {id:1,type:1,coin:1,hp:1,unlocklv:0,unlocktype:1,unlockcost:0,name:"枪徒"},
        {id:2,type:3,coin:1,hp:2,unlocklv:10,unlocktype:1,unlockcost:200,name:"大枪徒"},
        {id:3,type:2,coin:2,hp:1,unlocklv:30,unlocktype:2,unlockcost:2,name:"枪者"},
        {id:4,type:2,coin:2,hp:1,unlocklv:50,unlocktype:1,unlockcost:8000,name:"大枪者"},
        {id:5,type:1,coin:2,hp:2,unlocklv:70,unlocktype:2,unlockcost:4,name:"枪士"},
        {id:6,type:3,coin:1,hp:3,unlocklv:90,unlocktype:2,unlockcost:4,name:"大枪士"},
        {id:7,type:2,coin:3,hp:1,unlocklv:100,unlocktype:1,unlockcost:24000,name:"枪师"},
        {id:8,type:1,coin:3,hp:2,unlocklv:130,unlocktype:2,unlockcost:6,name:"大枪师"},
        {id:9,type:1,coin:2,hp:2,unlocklv:160,unlocktype:1,unlockcost:75000,name:"枪灵"},
        {id:10,type:3,coin:1,hp:4,unlocklv:180,unlocktype:1,unlockcost:160000,name:"大枪灵"},
        {id:11,type:2,coin:4,hp:1,unlocklv:220,unlocktype:2,unlockcost:4,name:"枪宗"},
        {id:12,type:2,coin:5,hp:2,unlocklv:250,unlocktype:1,unlockcost:225000,name:"大枪宗"},
        {id:13,type:2,coin:6,hp:2,unlocklv:330,unlocktype:2,unlockcost:12,name:"枪王"},
        {id:14,type:1,coin:4,hp:5,unlocklv:380,unlocktype:2,unlockcost:20,name:"大枪王"},
        {id:15,type:1,coin:3,hp:2,unlocklv:420,unlocktype:1,unlockcost:300000,name:"枪皇"},
        {id:16,type:2,coin:5,hp:2,unlocklv:460,unlocktype:2,unlockcost:10,name:"枪尊"},
        {id:17,type:1,coin:3,hp:4,unlocklv:560,unlocktype:2,unlockcost:12,name:"枪圣"},
        {id:18,type:1,coin:4,hp:4,unlocklv:630,unlocktype:2,unlockcost:16,name:"枪帝"},
        {id:19,type:1,coin:5,hp:4,unlocklv:800,unlocktype:1,unlockcost:1000000,name:"枪神"},
    ],
    
    gunConf:[
        {id:1,type:1,fire:2,num:1,speed:0,unlocklv:0,unlocktype:1,unlockcost:0,anchor:cc.v2(0.3,0.5), aim:cc.v2(43,-3),name:".357麦格农"},
        {id:2,type:1,fire:3,num:1,speed:0,unlocklv:2,unlocktype:1,unlockcost:100,anchor:cc.v2(0.34,0.5), aim:cc.v2(43,-2),name:"沙漠之鹰"},
        {id:3,type:2,fire:1,num:3,speed:0.08,unlocklv:20,unlocktype:2,unlockcost:3,anchor:cc.v2(0.4,0.5), aim:cc.v2(38,0),name:"乌兹"},
        {id:4,type:2,fire:2,num:3,speed:0.12,unlocklv:40,unlocktype:1,unlockcost:8000,anchor:cc.v2(0.35,0.5), aim:cc.v2(77,-3),name:"M-4"},
        {id:5,type:2,fire:2,num:3,speed:0.12,unlocklv:60,unlocktype:2,unlockcost:6,anchor:cc.v2(0.38,0.5), aim:cc.v2(65,-4),name:"AK-47"},
        {id:6,type:1,fire:3,num:1,speed:0.2,unlocklv:80,unlocktype:1,unlockcost:24000,anchor:cc.v2(0.35,0.4), aim:cc.v2(66,-6),name:"侦察者"},
        {id:7,type:3,fire:2,num:3,speed:0.2,unlocklv:100,unlocktype:2,unlockcost:6,anchor:cc.v2(0.32,0.5), aim:cc.v2(56,-1),name:"温切斯特1887"},
        {id:8,type:2,fire:3,num:3,speed:0.18,unlocklv:120,unlocktype:2,unlockcost:9,anchor:cc.v2(0.4,0.4), aim:cc.v2(71,-5),name:"M240"},
        {id:9,type:1,fire:4,num:1,speed:0.2,unlocklv:150,unlocktype:1,unlockcost:75000,anchor:cc.v2(0.35,0.4), aim:cc.v2(75,-5),name:"AWP"},
        {id:10,type:1,fire:5,num:1,speed:0.2,unlocklv:180,unlocktype:2,unlockcost:5,anchor:cc.v2(0.35,0.4), aim:cc.v2(88,-8),name:"巴雷特M82A1"},
        {id:11,type:3,fire:2,num:4,speed:0,unlocklv:220,unlocktype:2,unlockcost:8,anchor:cc.v2(0.4,0.5), aim:cc.v2(67,-8),name:"超级散弹枪"},
        {id:12,type:2,fire:2,num:4,speed:0.06,unlocklv:260,unlocktype:1,unlockcost:130000,anchor:cc.v2(0.4,0.4), aim:cc.v2(55,-8),name:"P90"},
        {id:13,type:3,fire:3,num:2,speed:0,unlocklv:320,unlocktype:1,unlockcost:160000,anchor:cc.v2(0.35,0.4), aim:cc.v2(74,-4),name:"麻烦制造者"},
        {id:14,type:2,fire:2,num:4,speed:0.15,unlocklv:360,unlocktype:2,unlockcost:8,anchor:cc.v2(0.4,0.4), aim:cc.v2(83,0),name:"毁灭者"},
        {id:15,type:3,fire:2,num:5,speed:0,unlocklv:400,unlocktype:2,unlockcost:10,anchor:cc.v2(0.4,0.54), aim:cc.v2(66,-5),name:"死神"},
        {id:16,type:2,fire:1,num:5,speed:0.06,unlocklv:450,unlocktype:1,unlockcost:225000,anchor:cc.v2(0.45,0.54), aim:cc.v2(46,-5),name:"幻灭"},
        {id:17,type:1,fire:5,num:1,speed:0,unlocklv:520,unlocktype:2,unlockcost:5,anchor:cc.v2(0.4,0.5), aim:cc.v2(40,-5),name:"神力"},
        {id:18,type:2,fire:3,num:3,speed:0.08,unlocklv:600,unlocktype:1,unlockcost:300000,anchor:cc.v2(0.38,0.5), aim:cc.v2(77,-7),name:"STAG"},
        {id:19,type:1,fire:7,num:1,speed:0,unlocklv:700,unlocktype:2,unlockcost:7,anchor:cc.v2(0.45,0.45), aim:cc.v2(64,-15),name:"巨人"},
        {id:20,type:2,fire:3,num:4,speed:0.08,unlocklv:1000,unlocktype:1,unlockcost:1000000,anchor:cc.v2(0.4,0.5), aim:cc.v2(38,-2),name:"火星枪"}
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

    tasks:[
        {id:1,type:1,desc:"击败10个敌人",num:10,award:10},
        {id:2,type:2,desc:"爆头20次",num:20,award:10},
        {id:3,type:3,desc:"击败3个Boss",num:3,award:15},

        {id:4,type:1,desc:"击败20个敌人",num:20,award:20},
        {id:5,type:2,desc:"爆头40次",num:40,award:20},
        {id:6,type:3,desc:"击败6个Boss",num:6,award:30},

        {id:7,type:1,desc:"击败50个敌人",num:50,award:50},
        {id:8,type:2,desc:"爆头100次",num:100,award:50},
        {id:9,type:3,desc:"击败10个Boss",num:10,award:50},

        {id:10,type:1,desc:"击败100个敌人",num:100,award:100},
        {id:11,type:2,desc:"爆头200次",num:200,award:100},
        {id:12,type:3,desc:"击败20个Boss",num:20,award:100},

        {id:13,type:1,desc:"击败200个敌人",num:200,award:200},
        {id:14,type:2,desc:"爆头400次",num:400,award:200},
        {id:15,type:3,desc:"击败40个Boss",num:40,award:200},

        {id:16,type:1,desc:"击败400个敌人",num:400,award:400},
        {id:17,type:2,desc:"爆头800次",num:800,award:400},
        {id:18,type:3,desc:"击败50个Boss",num:50,award:250},

        {id:19,type:1,desc:"击败800个敌人",num:800,award:800},
        {id:20,type:2,desc:"爆头1600次",num:1600,award:800},
        {id:21,type:3,desc:"击败100个Boss",num:100,award:500}
    ]

    // levels:[
    //     {id:1,floor:2,bosshp:4},
    //     {id:2,floor:3,bosshp:4},
    //     {id:3,floor:3,bosshp:6},
    //     {id:4,floor:4,bosshp:6},
    //     {id:5,floor:4,bosshp:6},
    //     {id:6,floor:4,bosshp:8},
    //     {id:7,floor:5,bosshp:8},
    //     {id:8,floor:5,bosshp:8},
    //     {id:9,floor:5,bosshp:8},
    //     {id:10,floor:6,bosshp:10},

    //     {id:11,floor:6,bosshp:10},
    //     {id:12,floor:7,bosshp:10},
    //     {id:13,floor:7,bosshp:12},
    //     {id:14,floor:8,bosshp:12},
    //     {id:15,floor:8,bosshp:12},
    //     {id:16,floor:8,bosshp:14},
    //     {id:17,floor:9,bosshp:14},
    //     {id:18,floor:9,bosshp:14},
    //     {id:19,floor:9,bosshp:14},
    //     {id:20,floor:10,bosshp:16},

    //     {id:21,floor:10,bosshp:16},
    //     {id:22,floor:11,bosshp:16},
    //     {id:23,floor:11,bosshp:18},
    //     {id:24,floor:12,bosshp:18},
    //     {id:25,floor:12,bosshp:18},
    //     {id:26,floor:12,bosshp:20},
    //     {id:27,floor:13,bosshp:20},
    //     {id:28,floor:13,bosshp:20},
    //     {id:29,floor:13,bosshp:20},
    //     {id:30,floor:14,bosshp:22},

    //     {id:31,floor:14,bosshp:22},
    //     {id:32,floor:15,bosshp:22},
    //     {id:33,floor:15,bosshp:24},
    //     {id:34,floor:16,bosshp:24},
    //     {id:35,floor:16,bosshp:24},
    //     {id:36,floor:16,bosshp:26},
    //     {id:37,floor:17,bosshp:26},
    //     {id:38,floor:17,bosshp:26},
    //     {id:39,floor:17,bosshp:26},
    //     {id:40,floor:18,bosshp:28},

    //     {id:41,floor:14,bosshp:22},
    //     {id:42,floor:15,bosshp:22},
    //     {id:43,floor:15,bosshp:24},
    //     {id:44,floor:16,bosshp:24},
    //     {id:45,floor:16,bosshp:24},
    //     {id:46,floor:16,bosshp:26},
    //     {id:47,floor:17,bosshp:26},
    //     {id:48,floor:17,bosshp:26},
    //     {id:49,floor:17,bosshp:26},
    //     {id:50,floor:18,bosshp:28},

    // ]    
    
};

