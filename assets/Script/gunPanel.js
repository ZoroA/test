// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var util = require('util');
cc.Class({
    extends: cc.Component,

    properties: {
        gunName:cc.Label,
        gunImg:cc.Sprite,
        gunDes:cc.Label,
        gunId:cc.Node,
        bulletPre:cc.Prefab,

        // home: {
        //     default: null,
        //     serializable: false
        // }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bulletList=[];
        this.gunList=util.gunList;
        //this.gunImg.node.zIndex=100;
    },
    //开枪
    openFire(id){
        //根据imgId去判断哪吧枪开火
        var list=this.gunList.find((element) => (element.id==id));
        // console.log(list);
        //开枪
        var animation=this.gunImg.node.getComponent(cc.Animation);
        animation.play(list.animation);
        //掉子弹
        this.dropBullet();
    },
    //掉子弹
    dropBullet(){
        let newBullet = cc.instantiate(this.bulletPre);
        //添加子节点
        newBullet.setPosition(cc.p(0,0));
        this.node.addChild(newBullet);
    
        newBullet.zIndex=-1;
        //下滑
        var bezier = [cc.v2(0,0), cc.v2(-150,150), cc.v2(-(this.node.width/3),-(this.node.height/3))];
        var bezierTo = cc.bezierTo(0.5, bezier);
        //回调
        var finished = cc.callFunc(function(target) {
            newBullet.destroy();//销毁子弹
        }, this);
        var myAction = cc.sequence(bezierTo,finished);
        newBullet.runAction(myAction);

    },
    start () {
        
    },
    update (dt) {
        
    },
});
