const { ccclass, property } = cc._decorator;
import PipeGroup from "./PipeGroup";
import Dust from "./Dust";

@ccclass
export default class NewClass extends cc.Component {
  _dustPool: cc.NodePool = null;
  _pipePool: cc.NodePool = null;

  @property
  spawnX: number = 0;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    Global.sceneManager = this;
    // 实例化对象池
    this._dustPool = new cc.NodePool(obj => {
      console.log("clear obj success");
    });
    this._pipePool = new cc.NodePool(obj => {
      console.log("clear obj success");
    });
  }

  spawnDust(prefab, compType, parent) {
    let comp = this._dustPool.get(compType);
    if (!comp) {
      comp = cc.instantiate(prefab);
      this._dustPool.put(comp);
    }
    if (parent) {
      comp.parent = parent;
    } else {
      this.node.addChild(comp);
      comp.x = this.spawnX;
    }
    comp.active = true;
    return comp;
  }
  spawnPipe(prefab, compType, parent) {
    let comp = this._pipePool.get(compType);
    if (!comp) {
      comp = cc.instantiate(prefab);
      this._pipePool.put(comp);
    }
    if (parent) {
      comp.parent = parent;
    } else {
      this.node.addChild(comp);
      comp.x = this.spawnX;
    }
    comp.active = true;
    return comp;
  }
  despawn(comp) {
    comp.node.removeFromParent();
    comp.node.active = false;
  }

  putIntoDustPool(val) {
    const oldCount = this._dustPool.size;
    this._dustPool.put(val);
    if (oldCount < this._dustPool.size) {
      return true;
    }
    return false;
  }

  putIntoPipePool(val) {
    const oldCount = this._pipePool.size;
    this._pipePool.put(val);
    if (oldCount < this._pipePool.size) {
      return true;
    }
    return false;
  }

  start() {}

  // update (dt) {}
}
