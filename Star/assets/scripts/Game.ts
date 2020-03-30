import Player from "./Player";
// import Star from "./Star";
// const Player = require('./Player')

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    starPreFab: cc.Prefab = null;
    @property(cc.Node)
    ground: cc.Node = null;
    @property(Player)
    player: Player = null;
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
    @property(cc.Node)
    btnStart: cc.Node = null;
    @property(cc.Node)
    gameOverNode: cc.Node = null;
    @property(cc.Prefab)
    scoreFXPrefab: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:

    groundY = 0;
    score = 0;
    timer = 0;
    starDuration = 0;
    currentStar = null;
    scorePool: cc.NodePool = null;
    onLoad() {
        this.enabled = false;
        // 记录星星显示的有效时长
        this.timer = 0;
        // 记录当前星星的显示时长
        this.starDuration = 0;
        // 获取地平面的高度
        this.groundY = this.ground.y + this.ground.height / 2;

        this.currentStar = null

        // 创建节点池
        this.scorePool = new cc.NodePool('ScoreFX');
    }

    spawnNewStar() {
        // 通过预制资源创建星星实例
        const newStar = cc.instantiate(this.starPreFab);
        this.node.addChild(newStar);
        // 将 game(组件) 的引用注入到 Star 中
        // newStar.getComponent('Star').game = this;
        newStar.getComponent('Star').init(this);
        this.currentStar = newStar;
        // 设置星星位置
        newStar.setPosition(this.getNewStarPosition());
        // 当前星星的显示时长
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition() {
        // const randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + this.starPreFab.data.height / 2;
        const randY = this.groundY + Math.random() * this.player.jumpHeight + this.starPreFab.data.height / 2;
        const maxX = this.node.width / 2;
        const randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    }

    gainScore(pos: cc.Vec2) {
        this.score += 1;
        this.scoreDisplay.string = "Score: " + this.score.toString();
        cc.audioEngine.playEffect(this.scoreAudio, false);

        // 播放动画
        // 1. 获取预制资源节点上的脚本组件
        const fx = this.spawnScoreFX();
        this.node.addChild(fx.node);
        fx.node.setPosition(pos)
        fx.play();
    }

    despawnScoreFX(scoreFX) {
        this.scorePool.put(scoreFX);
        console.log('despawnScoreFX: ', this.scorePool.size())

    }

    spawnScoreFX() {
        let fx = null;
        if (this.scorePool.size() > 0) {
            console.log('取')
            fx = this.scorePool.get();
            return fx.getComponent('ScoreFX');
        }
        console.log('生成')

        fx = cc.instantiate(this.scoreFXPrefab).getComponent('ScoreFX');
        fx.init(this);
        return fx;
    }

    start() {

    }

    update(dt) {
        if (this.timer > this.starDuration) {
            this.gameOver();
            return
        }
        this.timer += dt;
    }

    gameOver() {
        // this.player.stopAllActions();
        // cc.director.loadScene("game");

        this.enabled = false;
        this.player.enabled = false;
        // this.player.node.stopAllActions();
        this.player.stopMove();

        this.btnStart.x = 0;
        this.currentStar.destroy();
        // 游戏结束时激活节点
        this.gameOverNode.active = true;

    }
    onStartGame() {
        this.resetScore();
        this.enabled = true;
        this.btnStart.x = 1000;
        this.player.init(cc.v2(0, this.groundY));
        // 随机产生一个星星
        this.spawnNewStar();
        // 游戏开始时, 关闭节点
        this.gameOverNode.active = false;

    }
    resetScore() {
        this.score = 0;
        this.scoreDisplay.string = "Score: " + this.score.toString();
    }
}
