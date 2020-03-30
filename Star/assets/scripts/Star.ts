// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({
        tooltip: "碰撞半径",
    })
    pickRadius: number = 0;
    // 暂存 Game 对象的引用
    game = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.enabled = false;
    }

    start() {

    }

    getPlayerDistance() {
        // const playerPos = this.game.player.getPosition();
        const playerPos = this.game.player.getCenterPos();
        return this.node.position.sub(playerPos).mag();
    }

    onPicked() {
        // 随机创建一个新的星星的实例
        this.game.spawnNewStar();
        // 更新分数
        const pos = this.node.getPosition();
        this.game.gainScore(pos);
        // 将原有的星星销毁
        this.node.destroy();
    }

    update(dt) {
        // 判断星星与小怪兽的距离
        if (this.getPlayerDistance() < this.pickRadius) {
            this.onPicked();
            return
        }
    }
    init(game) {
        this.enabled = true;
        this.game = game;
        this.node.opacity = 255;
    }
}
