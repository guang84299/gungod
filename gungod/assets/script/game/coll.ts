
const {ccclass, property} = cc._decorator;

@ccclass
export default class coll extends cc.Component {

   
    rigidbody = null;

    onLoad () {
        this.rigidbody = this.node.getComponent(cc.RigidBody);
    }

    start () {

    }

    update (dt) {
        this.rigidbody.applyForceToCenter(cc.v2(0,0),true);
        this.rigidbody.syncPosition(false);
    }
}
