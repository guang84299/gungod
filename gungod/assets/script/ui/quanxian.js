var storage = require("storage");

cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad: function()
    {
        this.dsize = cc.view.getDesignResolutionSize();
        this.main = cc.find("Canvas").getComponent("main");
        this.res = cc.find("Canvas").getComponent("res");
        
        this.initUI();
    },

    initUI: function()
    {
        this.node_quanxian = this.node;
        this.quan = cc.find("bg",this.node_quanxian);
        this.updateUI();
    },

    updateUI: function()
    {
    
    },

    show: function()
    {
        this.main.wxQuanState(false);
        this.node.active = true;
        this.updateUI();
    },

    hide: function()
    {
        this.main.wxQuanState(true);
        this.node.destroy();
    },

    click: function(event,data)
    {
        
        
        cc.log(data);
    }
    
});
