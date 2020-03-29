import Player from "./Player";
import Star from "./Star";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    starPreFab: cc.Prefab = null;
    @property(cc.Node)
    ground: cc.Node = null;
    @property(cc.Node)
    player: cc.Node = null;
    @property(cc.Label)
    scoreDisplay: cc.Label = null;
    @property({
        tooltip: "最大持续时长",
    })
    maxStarDuration: number = 0;
    @property({
        tooltip: "最小持续时长",
    })
    minStarDuration: number = 0;
    @property(cc.AudioClip)
    scoreAudio: cc.AudioClip = null;
    // LIFE-CYCLE CALLBACKS:

    groundY = 0;
    score = 0;
    timer = 0;
    starDuration = 0;

    onLoad() {
        // 记录星星显示的有效时长
        this.timer = 0;
        // 记录当前星星的显示时长
        this.starDuration = 0;
        // 获取地平面的高度
        this.groundY = this.ground.y + this.ground.height / 2;
        // 随机产生一个星星
        this.spawnNewStar();
    }

    spawnNewStar() {
        // 通过预制资源创建星星实例
        const newStar = cc.instantiate(this.starPreFab);
        this.node.addChild(newStar);
        // 将 game(组件) 的引用注入到 Star 中
        newStar.getComponent('Star').game = this;
        // 设置星星位置
        newStar.setPosition(this.getNewStarPosition());
        // 当前星星的显示时长
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition() {
        const randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + this.starPreFab.data.height / 2;
        const maxX = this.node.width / 2;
        const randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    }

    gainScore() {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    start() {

    }

    update (dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            return
        }
        this.timer += dt;
    }

    gameOver() {
        this.player.stopAllActions();
        cc.director.loadScene("game");
    }
}
