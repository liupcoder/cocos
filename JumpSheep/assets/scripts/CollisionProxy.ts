const { ccclass, property } = cc._decorator;
@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Component)
  realListener: cc.Component = null;
  // LIFE-CYCLE CALLBACKS:

  // onLoad() {}
 

  start() {}

  // update (dt) {}
  /**
   * 当碰撞产生的时候调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionEnter(other, self) {
    Global.sheep.onCollisionEnter(other, self);
  }
  /**
   * 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionStay(other, self) {}
  /**
   * 当碰撞结束后调用
   * @param  {Collider} other 产生碰撞的另一个碰撞组件
   * @param  {Collider} self  产生碰撞的自身的碰撞组件
   */
  onCollisionExit(other, self) {}
}
