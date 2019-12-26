
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function() {
        this.init();
    },

    init: function()
    {
        this.game = cc.find("Canvas").getComponent("game");
        this.body = this.node.getComponent("cc.RigidBody");
        this.node.sc = this;

        this.enemy = null;
        this.hand_left = null;
        this.hand_right = null;
        if(this.node.name == "enemy")
        {
            this.enemy = this.node;
            this.hand_left = cc.find("hand_left",this.node);
            this.hand_right = cc.find("hand_right",this.node);
        }
        else
        {
            this.enemy = this.node.parent;
            this.hand_left = cc.find("hand_left",this.node.parent);
            this.hand_right = cc.find("hand_right",this.node.parent);
        }
        this.enemy.isRemoveHandJoin = false;

        this.enemy.isDie = false;
    },

    updateJoin: function()
    {
        if(!this.enemy.isRemoveHandJoin)
        {
            this.enemy.isRemoveHandJoin = true;

            this.hand_left.getComponents("cc.DistanceJoint")[2].enabled = false;
            this.hand_right.getComponents("cc.DistanceJoint")[2].enabled = false;

        }

        this.node.color = cc.color(255,0,0);
        //var coms = this.node.getComponents("cc.DistanceJoint");
        //for(var i=0;i<coms.length;i++)
        //{
        //    coms[i].enabled = false;
        //}
        this.enemy.isDie = true;
    },

    update: function(dt) {

    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        if(otherCollider.node.group == "bullet")
        this.updateJoin();
    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {

    }
});
