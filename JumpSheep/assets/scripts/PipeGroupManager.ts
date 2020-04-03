const { ccclass, property } = cc._decorator;
import PipeGroup from "./PipeGroup";
@ccclass
export default class NewClass extends cc.Component {
  @property(cc.Prefab)
  pipePrefab: cc.Prefab = null;
  @property
  spawnInterval: number = 0;
  @property
  spawnX: number = 0;
  @property
  speed: number = 0;
  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    Global.pipeManager = this;
  }

  start() {}

  startSpawn() {
    this.spawnPipe();
    this.schedule(this.spawnPipe, this.spawnInterval);
  }

  spawnPipe() {
    console.log("spawnPipe");
    // 动态创建Pipe
    const pipeGroup = Global.sceneManager.spawnPipe(
      this.pipePrefab,
      PipeGroup,
      this.node
    );
    pipeGroup.position = cc.v2(this.spawnX, 0);
  }
  despawn(node) {
    node.removeFromParent();
    node.active = false;
    Global.sceneManager.putIntoPipePool(node);
  }

  update(dt) {
    const distance = this.speed * dt;
    // 获取当前节点的所有pipegourp子节点
    const children = this.node.children;
    children.forEach((node, index) => {
      node.x += distance;

      // 消失的管道回收
      const bounds = node.getBoundingBoxToWorld();
      const disappear = bounds.xMax < 0;
      if (disappear) {
        this.despawn(node);
      }
    });
  }
}
