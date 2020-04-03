const { ccclass, property } = cc._decorator;

@ccclass
export default class PipeGroup extends cc.Component {
  @property
  botYrange = cc.v2(0, 0); // -270 到 -50
  @property
  sapcingRange = cc.v2(0, 0); // 200 到 375
  @property(cc.Node)
  topPipe: cc.Node = null;
  @property(cc.Node)
  botPipe: cc.Node = null;
  // LIFE-CYCLE CALLBACKS:

  // onLoad () {}
  start() {}

  // update (dt) {}

  onEnable() {
    // 随机获取底部管道 Y 轴的位置
    const botYPos =
      this.botYrange.x + Math.random() * (this.botYrange.y - this.botYrange.x);
    const space =
      this.sapcingRange.x +
      Math.random() * (this.sapcingRange.y - this.sapcingRange.x);
    // 计算上部管道 y 轴位置
    const topYPos = botYPos + space;
    this.topPipe.y = topYPos;
    this.botPipe.y = botYPos;
  }
}
