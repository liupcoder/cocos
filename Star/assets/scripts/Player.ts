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
        this.node.runAction(this.setJumpAction());
        // 事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                console.log('a keydown')
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                console.log('a keydown')
                this.accRight = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                console.log('a keydown')
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                console.log('a keydown')
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
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
}
