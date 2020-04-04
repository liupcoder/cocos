const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
  @property({ tooltip: "移动速度" })
  speed: number = 0;

  @property({ tooltip: "重置X位置" })
  resetX: number = 0;

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}

  start() {}

  update(dt) {
    if (Global.game.state !== Global.GameManager.State.Run) {
      return false;
    }
    // 获取当前节点的x位置
    let x = this.node.x;
    x += this.speed * dt;

    if (x <= this.resetX) {
      x -= this.resetX;
    }

    this.node.x = x;
  }
}
