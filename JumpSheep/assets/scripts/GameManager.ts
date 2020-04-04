const { ccclass, property } = cc._decorator;
import Sheep from "./Sheep";

const State = cc.Enum({
  Menu: -1,
  Run: -1,
  Over: -1
});
@ccclass
export default class GameManager extends cc.Component {
  static State = State;

  @property(Sheep)
  sheep: Sheep = null;
  // LIFE-CYCLE CALLBACKS:
  state = State.Menu;
  onLoad() {
    // 将 GameManager 类型放入全局数据
    Global.GameManager = GameManager;
    Global.game = this;
    // 开启碰撞检测系统
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    // manager.enabledDebugDraw = true;
    this.state = State.Menu;
    this.sheep.init();
  }

  start() {
    this.state = State.Run;

    this.sheep.startRun();

    Global.pipeManager.startSpawn();
  }

  gameOver() {
    Global.pipeManager.reset();
    this.state = State.Over;
  }

  // update (dt) {}
}
