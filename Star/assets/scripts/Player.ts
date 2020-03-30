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
        displayName: "jumpHeight",
        tooltip: "跳跃高度",
    })
    jumpHeight: number = 0;
    @property({
        displayName: "jumpDuration",
        tooltip: "跳跃持续时间",
    })
    jumpDuration: number = 0;
    @property({
        displayName: "maxMoveSpeed",
        tooltip: "最大移动速度",
    })
    maxMoveSpeed: number = 0;
    @property({
        displayName: "accel",
        tooltip: "加速度",
    })
    accel: number = 0;
    @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null;

    accLeft = false;
    accRight = false;
    xSpeed = 0;
    // LIFE-CYCLE CALLBACKS:

    setJumpAction() {
        const jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        const jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        const callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    }

    playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    onLoad() {
        this.enabled = false;
        // 事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        const touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touchstart', this.onTouchStart, this);
        touchReceiver.on('touchend', this.onTouchEnd, this);

    }
    onTouchStart(event) {
        const touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width / 2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
    }
    onTouchEnd(event) {
        this.accLeft = false;
        this.accRight = false;
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    }
    start() {

    }

    update(dt) {

        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        this.node.x += this.xSpeed * dt;

        if (this.node.x > this.node.parent.width / 2 - this.node.width / 2) {
            this.node.x = this.node.parent.width / 2 - this.node.width / 2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width / 2 + this.node.width / 2) {
            this.node.x = -this.node.parent.width / 2 + this.node.width / 2;
            this.xSpeed = 0;
        }
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    // 初始化
    init(pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.setJumpAction());
    }

    stopMove() {
        this.node.stopAllActions();
    }

    getCenterPos() {
        const center = cc.v2(this.node.x, this.node.y + this.node.height / 2);
        return center;
    }
}
