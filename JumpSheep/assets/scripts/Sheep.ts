const { ccclass, property } = cc._decorator;
import Dust from "./Dust";
const State = cc.Enum({
  None: -1,
  Run: -1,
  Jump: -1,
  Drop: -1,
  DropEnd: -1,
  Dead: -1
});

@ccclass
export default class NewClass extends cc.Component {
  @property({
    type: State
  })
  _state = State.None;
  @property
  get state() {
    return this._state;
  }
  set state(value) {
    if (value !== this._state) {
      this._state = value;
      if (this._state !== State.None) {
        this.updateAnimation();
      }
    }
  }
  @property({
    tooltip: "地面高度"
  })
  groundY: number = 0;
  @property({
    tooltip: "重力影响"
  })
  gravity: number = 0;
  @property({
    tooltip: "起跳速度"
  })
  initJumpSpeed: number = 0;

  @property(cc.Prefab)
  dustPrefab: cc.Prefab = null;

  @property(cc.Node)
  score: cc.Node = null;
  anim: cc.Animation = null;
  currentSpeed: number = 0;
  // 更新动画
  updateAnimation() {
    const animName = State[this._state];
    this.anim.stop();
    this.anim.play(animName);
  }
  // LIFE-CYCLE CALLBACKS:

  init() {
    Global.sheep = this;
    // 获取当前节点上的Animation组件
    this.anim = this.getComponent(cc.Animation);
    this.currentSpeed = 0;
  }

  startRun() {
    this.state = State.Run;
    this.enableInput(true);
  }

  enableInput(enable: boolean) {
    if (enable) {
      this.registerInput();
    } else {
      this.cancelListener();
    }
  }

  registerInput() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.jump, this);
    cc.find("Canvas").on(cc.Node.EventType.TOUCH_START, this.jump, this);
  }

  cancelListener() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN);
    cc.find("Canvas").off(cc.Node.EventType.TOUCH_START);
  }

  jump() {
    this.state = State.Jump;
    this.currentSpeed = this.initJumpSpeed;
    this.spawnDust("DustUp");
  }

  spawnDust(animName) {
    // 动态创建dust
    const dust = Global.sceneManager.spawnDust(
      this.dustPrefab,
      Dust,
      this.node
    );
    dust.position = cc.v2(0, 0);
    dust.getComponent("Dust").playAnim(animName);
  }

  onLoad() {}

  start() {}

  onDropFinished() {
    this.state = State.Run;
  }
  update(dt) {
    switch (this.state) {
      case State.Jump:
        if (this.currentSpeed < 0) {
          this.state = State.Drop;
        }
        break;
      case State.Drop:
        if (this.node.y < this.groundY) {
          this.node.y = this.groundY;
          this.state = State.DropEnd;
          this.spawnDust("DustDown");
        }
        break;
      default:
        break;
    }
    const flying = this.state === State.Jump || this.node.y > this.groundY;
    if (flying) {
      this.currentSpeed -= this.gravity * dt;
      this.node.y += this.currentSpeed * dt;
    }
    // this.score.getComponent("cc.Label").string("分数: ", Global.score);
  }
  /**
   * 当碰撞产生的时候调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionEnter(other, self) {
    console.log("other: ", other);
    console.log("self: ", self);
    if (this.state !== State.Dead) {
      const group = cc.game.groupList[other.node.groupIndex];
      console.log(group);
      console.log(cc.game.groupList);

      switch (group) {
        case "Obstacle":
          this.state = State.Dead;
          Global.game.gameOver();
          this.enableInput(false);
          break;
        case "NextPipe":
          console.log("NextPipe");
          Global.score += 1;
          this.score.getComponent("cc.Label").string = "分数:" + Global.score;
          break;
        default:
          break;
      }
    }
  }
}
