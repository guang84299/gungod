const {ccclass, property} = cc._decorator;
var gg = window["gg"];

export const storage = {
    pice:['aa','bb','cc','dd','ee','ff','gg','hh','ii','jj','kk','ll','mm','nn','oo','pp','qq','rr','ss','tt','uu','vv','ww','xx','yy','zz','AA','BB','CC','DD','EE','FF','GG','HH','II','JJ','KK','LL','MM','NN','OO','PP','QQ','RR','SS','TT','UU','VV','WW','XX','YY','ZZ','aaa','bbb','ccc','ddd','eee','fff','ggg','hhh','iii','jjj','kkk','lll','mmm','nnn','ooo','ppp','qqq','rrr','sss','ttt','uuu','vvv','www','xxx','yyy','zzz','AAA','BBB','CCC','DDD','EEE','FFF','GGG','HHH','III','JJJ','KKK','LLL','MMM','NNN','OOO','PPP','QQQ','RRR','SSS','TTT','UUU','VVV','WWW','XXX','YYY','ZZZ'],
    pfix: "gungod_",

    music: "music",
    sound: "sound",
    vibrate: "vibrate",
    first: "first",
    coin: "coin",
    skinid: "skinid",
    hasskin:"hasskin",
    gunid: "gunid",
    hasgun: "hasgun",
    level: "level",
    gunlock: "gunlock",
    skinlock: "skinlock",
    onlinetime: "onlinetime",
    loginday:"loginday",
    logintime:"logintime",
    qiandaotag: "qiandaotag",
    hitenemy: "hitenemy",
    hithead: "hithead",
    hitboss: "hitboss",
    taskdata: "taskdata",
    sygunid: "sygunid",
    yindao:"yindao",

    defaultVal: {
        music:1,
        sound:1,
        vibrate:1,
        first:0,
        coin:0,
        skinid:1,
        hasskin: [1],
        gunid: 1,
        hasgun: [1],
        level: 1,
        gunlock: {},
        skinlock: {},
        onlinetime: 0,
        loginday: 0,
        logintime: 0,
        qiandaotag: 0,
        hitenemy: 0,
        hithead: 0,
        hitboss: 0,
        taskdata: {},
        sygunid: 0,
        yindao: 0,
    },

    setStorage: function(key,val)
    {
        if(typeof this.defaultVal[key] == "object")
            val = JSON.stringify(val);       
        cc.sys.localStorage.setItem(this.pfix+key,val);
    },
    getStorage: function(key)
    {
        var val = cc.sys.localStorage.getItem(this.pfix+key);
        if(val === null || val === "" || val === undefined)
        {
            return this.defaultVal[key];
        }
        else
        {
            if(typeof this.defaultVal[key] == "object")
                return JSON.parse(val);
            else
                return Number(val);
        
        }
    },

    uploadStorage: function(key)
    {
        var datas = {key:null};
        datas[key] = this.getStorage(key);
        var data = JSON.stringify(datas);
        gg.qianqista.uploaddatas(data);
    },


    scientificToNumber: function(num) {
        var str = num.toString();
        /*6e7或6e+7 都会自动转换数值*/
        var index = str.indexOf("e+");
        if (index == -1) {
            return str;
        } else {
            /*6e-7 需要手动转换*/
            var head = str.substr(0,index);
            var zero = '';
            var len = parseInt(str.substr(index+2,str.length));
            if(head.indexOf(".")>=0)
            {
                var h = head.split(".");
                head = h[0]+h[1];
                len = len - h[1].length;
            }
            for(var i=0;i<len;i++)
            {
                zero += '0';
            }
            return head + zero;
        }
    },


    castNum: function(coin)
    {
        coin = Math.floor(coin);
        if(coin<10000) return coin+'';
        else if(coin<100000000 && coin>=10000) 
        {
            var str = (coin/10000).toFixed(2)+'';
            var h = str.split(".")[0];
            var e = str.split(".")[1];
            if(e[1] == '0')
            {
                e = e[0];
                if(e == '0') e = '';
            }
            if(e != '') str = h + '.' + e;
            else str = h;
            return str+'万';
        }
        else if(coin<1000000000000 && coin>=100000000) 
        {
            var str = (coin/100000000).toFixed(2)+'';
            var h = str.split(".")[0];
            var e = str.split(".")[1];
            if(e[1] == '0')
            {
                e = e[0];
                if(e == '0') e = '';
            }
            if(e != '') str = h + '.' + e;
            else str = h;
            return str+'亿';
        }
        else if(coin<1000000000000000 && coin>=1000000000000) 
        {
            var str = (coin/1000000000000).toFixed(2)+'';
            var h = str.split(".")[0];
            var e = str.split(".")[1];
            if(e[1] == '0')
            {
                e = e[0];
                if(e == '0') e = '';
            }
            if(e != '') str = h + '.' + e;
            else str = h;
            return str+'兆';
        }

        coin /= 1000000000000;
        coin = Math.floor(coin);

        str = this.scientificToNumber(coin);
        var s = '';
        var n = 0;
        if(str.length>3)
            n = Math.floor((str.length-1)/3);
        if(n>0)
        {
            coin = (coin/Math.pow(1000,n)).toFixed(2);
        }
        str = coin+"";
        var l = str.split(".")[0].split("").reverse();
        for (var i = 0; i < l.length; i++) {
            s += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
        }
        s = s.split("").reverse().join("");
        if(n>0)
        {
            var r = str.split(".")[1];
            if(r[1] == '0')
            {
                r = r[0];
                if(r == '0') r = '';
            }
            if(r != '')
                s = s + "." + r;
            s += this.pice[n-1];
        }
        return s;
    },

    getLabelStr: function(str,num)
    {
        var s = "";
        var len = 0;
        for (var i=0; i<str.length; i++) {
            var c = str.charCodeAt(i);
            //单字节加1
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
                len++;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
            else {
                len+=2;
                if(len>=num-2)
                {
                    if(i != str.length-1)
                        s += "...";
                    break;
                }
                else
                {
                    s += str.charAt(i);
                }
            }
        }
        return s;
    },

    getCountDown: function(t1,t2,fnum)
    {
        var time = t2 - t1;
        return this.fomatTime(time,fnum);
    },

    fomatTime: function(time,fnum){
        var str = "";
        if(!fnum) fnum = 3;

        if(time<=0)
        {
            if(fnum == 1)
                str = "00";
            else if(fnum == 2)
                str = "00:00";
            else if(fnum == 3)
                str = "00:00:00";

            return str;
        }

        var d = Math.floor(time/(24*60*60*1000));
        var h = Math.floor((time - d*24*60*60*1000)/(60*60*1000));
        var m = Math.floor((time - d*24*60*60*1000 - h*60*60*1000)/(60*1000));
        var s = Math.floor(((time - d*24*60*60*1000 - h*60*60*1000 - m*60*1000))/1000);
        var sd = d < 10 ? "0"+d : d;
        var sh = h < 10 ? "0"+h : h;
        var sm = m < 10 ? "0"+m : m;
        var ss = s < 10 ? "0"+s : s;


        if(fnum == 1)
            str = ss+"";
        else if(fnum == 2)
            str = sm+":"+ss;
        else if(fnum == 3)
            str = sh+":"+sm+":"+ss;
        else
        {
            if(d>0) str = sd+":"+sh+":"+sm+":"+ss;
            else str = sh+":"+sm+":"+ss;
        }

        return str;
    },

    fomatTime2(time,fnum){
        var str = "";
        if(!fnum) fnum = 2;

        if(time<=0)
        {
            if(fnum == 1)
                str = "0秒";
            else if(fnum == 2)
                str = "0分0秒";
            else if(fnum == 3)
                str = "0时0分0秒";

            return str;
        }

        var d = Math.floor(time/(24*60*60*1000));
        var h = Math.floor((time - d*24*60*60*1000)/(60*60*1000));
        var m = Math.floor((time - d*24*60*60*1000 - h*60*60*1000)/(60*1000));
        var s = Math.floor(((time - d*24*60*60*1000 - h*60*60*1000 - m*60*1000))/1000);
        var sd = d;
        var sh = h;
        var sm = m;
        var ss = s;


        if(fnum == 1)
            str = ss+"秒";
        else if(fnum == 2)
            str = sm+"分"+ss+"秒";
        else if(fnum == 3)
            str = sh+"时"+sm+"分"+ss+"秒";
        else
        {
            if(d>0) str = sd+"天"+sh+"时"+sm+"分"+ss+"秒";
            else str = sh+"时"+sm+"分"+ss+"秒";
        }

        return str;
    },

    isResetDay: function(time1,time2){
        var t1 = new Date(time1);
        var t2 = new Date(time2);

        if(t2.getFullYear() != t1.getFullYear())
        {
            return true;
        }
        else if(t2.getMonth() != t1.getMonth())
        {
            return true;
        }
        else if(t2.getDate() != t1.getDate())
        {
            return true;
        }
        else
        {
            return false;
        }
    },

    indexOf: function(arr,item){
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i] == item) return i;
            // if(arr[i].id && arr[i].id == item) return i;
        }
        return -1;
    }
}
