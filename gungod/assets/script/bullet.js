
cc.Class({
    extends: cc.Component,

    properties: {
        speed:1000,
        maxColNum: 6
    },

    onLoad: function() {

    },

    init: function(dir)
    {
        this.game = cc.find("Canvas").getComponent("game");
        this.body = this.node.getComponent("cc.RigidBody");
        this.node.sc = this;
        this.isUpdateDir = false;
        this.colNum = 0;

        this.node.rotation = cc.misc.radiansToDegrees(dir.signAngle(cc.v2(0,1)));
        this.body.linearVelocity = dir.mul(this.speed);
    },

    updateDir: function()
    {
        var dir = this.body.linearVelocity.normalize();
        this.body.linearVelocity = cc.v2(0,0);
        this.node.rotation = cc.misc.radiansToDegrees(dir.signAngle(cc.v2(0,1)));
        this.body.linearVelocity = dir.mul(this.speed);

        this.colNum ++;
        if(this.colNum > this.maxColNum)
        {
            this.node.destroy();
            this.game.toFire();
        }
    },

    update: function(dt) {
        if(this.isUpdateDir)
        {
            this.isUpdateDir = false;
            this.updateDir();
        }
    },

    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact: function (contact, selfCollider, otherCollider) {
        var t = new Date().getTime();
        if(t-this.collTime>1000)
        {
            this.collTime = t;
            //storage.playSound(this.game.audio_coll);
        }

    },

    // 只在两个碰撞体结束接触时被调用一次
    onEndContact: function (contact, selfCollider, otherCollider) {
        this.isUpdateDir = true;
    },

    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve: function (contact, selfCollider, otherCollider) {
    },

    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve: function (contact, selfCollider, otherCollider) {

    }
});
