const { ccclass, property } = cc._decorator;

@ccclass
export default class Dust extends cc.Component {
  @property(cc.Animation)
  anim: cc.Animation = null;
  playAnim(animName) {
    this.anim.play(animName);
  }

  finish() {
    this.node.removeFromParent();
    Global.sceneManager.putIntoDustPool(this.node);
  }
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  // update (dt) {}
}
