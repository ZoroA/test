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
        //gunNode放枪的节点
        gunNode:cc.Node,
        //枪预制资源
        gunPanel:cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //定义透明度
        this.oldOpacity=127;//半透明
        this.allOpacity=255;//不透明
        //显示枪
        this.getAndShowGun();
        //给节点设置点击事件
        this.setClickGun();
        //设置枪面板滑动事件
        this.setScrollGunNode();
    },
    getAndShowGun(){
        this.gunList=util.gunList;
        this.gunPanelList=[];
        //3张图片才使用以下代码
        for(let i=0;i<this.gunList.length;i++){
            let newGun = cc.instantiate(this.gunPanel);

            //枪名字
            let gunName= newGun.getComponent('gunPanel').gunName;
            gunName.string=this.gunList[i].name;

            //枪图片
            let gunImg=newGun.getComponent('gunPanel').gunImg;
            util.loadLocalImg(gunImg,this.gunList[i].img);

            //枪描述
            let gunDes= newGun.getComponent('gunPanel').gunDes;
            gunDes.string=this.gunList[i].des;

            //枪id
            let gunId= newGun.getComponent('gunPanel').gunId;
            gunId.value=this.gunList[i].id;

            //设置节点位置
            if(i<2){
                let imgwidth=newGun.width/2-40;
                newGun.setPosition(cc.p(i*imgwidth,0));
            }else{
                newGun.setPosition(cc.p(i*newGun.width,0));
            }
            //比例。透明度。层级
            if(i==0){
                //一般大
                newGun.setScale(1);
                //修改透明度
                newGun.opacity=this.allOpacity;
                //最大层级
                newGun.zIndex=99;
            }else{
                newGun.setScale(0.9);
                //修改透明度
                newGun.opacity=this.oldOpacity;
                //最大层级
                newGun.zIndex=10;
            }

            //添加子节点
            this.gunNode.addChild(newGun);
            this.gunPanelList.push(newGun);
        }
        //当前处于中间的节点
        this.currentNodeIndex=0;
    },
    //点击某个枪后执行的动作。nodeIndex节点下标 currentImgIndex所有枪数据的下标
    setBigAndOthersSmall(nodeIndex,currentIndex){
        var ACTION_TAG = 1;
    
        //被点击的ImgId
        // var clickImgId=this.gunPanelList[nodeIndex].children[3].value;
        var list=this.gunPanelList[nodeIndex].children.find((element) => (element._name== 'gunId'));
        let clickImgId=list.value;

        //被点击的节点等于当前处于中间的节点。则开枪
        if(nodeIndex==currentIndex){
             //do  开枪动作和声音
             this.openGun(nodeIndex);
        }else{
            for(let i=0;i<this.gunPanelList.length;i++){
               this.gunPanelList[i].stopActionByTag(ACTION_TAG);
            }
            var width=this.gunPanelList[currentIndex].width/2-40;
             if(currentIndex<nodeIndex){
                   //点击的节点是当前节点之后的节点 。下一个节点
                   
                    //1.当前节点往前移动
                    //this.gunPanelList[currentIndex].setScale(0.9);//变小
                    this.gunPanelList[currentIndex].opacity=this.oldOpacity;//透明
                    this.gunPanelList[currentIndex].zIndex=10;//层级小
                    //this.gunPanelList[currentIndex].setPosition(cc.p(-width,0));//移动到左边
                    let currentSpawn = cc.spawn(cc.scaleTo(0.5,0.9,0.9),cc.moveTo(0.5,cc.p(-width,0)));
                    this.gunPanelList[currentIndex].runAction(currentSpawn);
                    currentSpawn.setTag(ACTION_TAG);
                   

                    if(clickImgId==this.gunList[this.gunList.length-1].id){
                       //点击到最后一个枪时。就没有下下个节点
                    }else{
                        if(nodeIndex+1<this.gunPanelList.length){
                            //1.下下个节点往前移动
                            this.gunPanelList[nodeIndex+1].opacity=this.oldOpacity;//透明
                            this.gunPanelList[nodeIndex+1].zIndex=10;//层级小
                            let nextSpawn = cc.spawn(cc.scaleTo(0.5,0.9,0.9),cc.moveTo(0.5,cc.p(width,0)));
                            this.gunPanelList[nodeIndex+1].runAction(nextSpawn);
                            nextSpawn.setTag(ACTION_TAG);
                        }
                    }
                    if(nodeIndex-2>=0){
                        //2.其他节点都在界面外。此处。第三个节点在外面
                        this.gunPanelList[nodeIndex-2].setPosition(cc.p(-4*width,0));//移动到左边
                        //3.大于等于4张时，将第四个节点也放在外面
                    }
             }else{
                    //let width=this.gunPanelList[currentIndex].width/2-40;
                    //点击的节点是当前节点之前的节点 。上一个节点
                    //1.当前节点往后移动
                    this.gunPanelList[currentIndex].opacity=this.oldOpacity;//透明
                    this.gunPanelList[currentIndex].zIndex=10;//层级小
                    let beforeCurrentSpawn = cc.spawn(cc.scaleTo(0.5,0.9,0.9),cc.moveTo(0.5,cc.p(width,0)));
                    this.gunPanelList[currentIndex].runAction(beforeCurrentSpawn);
                    beforeCurrentSpawn.setTag(ACTION_TAG);
                  if(clickImgId==0){
                    //点击的是第一个节点。就没有上上个节点
                  }else{
                      if(nodeIndex-1>=0){
                        //1.上上个节点往后移动
                        this.gunPanelList[nodeIndex-1].opacity=this.oldOpacity;//透明
                        this.gunPanelList[nodeIndex-1].zIndex=10;//层级小
                        // this.gunPanelList[nodeIndex-1].setPosition(cc.p(-width,0));//移动到左边

                        let lastSpawn = cc.spawn(cc.scaleTo(0.5,0.9,0.9),cc.moveTo(0.5,cc.p(-width,0)));
                        this.gunPanelList[nodeIndex-1].runAction(lastSpawn);
                        lastSpawn.setTag(ACTION_TAG);
                      }
                  }
                  if(nodeIndex+2<this.gunPanelList.length){
                        //2.其他节点都在界面外。此处。第三个节点在外面
                        this.gunPanelList[nodeIndex+2].setPosition(cc.p(4*width,0));//移动到右边
                        //3.大于等于4张时，将第四个节点也放在外面
                  }
                 
             }
            //1.被点击的枪变大，不透明，移动到中间。与他相邻的两把枪变小。透明。移动到指定位置
            this.gunPanelList[nodeIndex].opacity=this.allOpacity;//不透明
            this.gunPanelList[nodeIndex].zIndex=99;//层级最高
            //动作
            let nowSpawn = cc.spawn(cc.scaleTo(0.5,1,1),cc.moveTo(0.5,cc.p(0,0)));
            this.gunPanelList[nodeIndex].runAction(nowSpawn);
            nowSpawn.setTag(ACTION_TAG);
        }
        this.currentNodeIndex=nodeIndex;
    },
    //点击枪事件
    setClickGun(){
        let self=this;
        for(let i=0;i<this.gunPanelList.length;i++){
            self.gunPanelList[i].on(cc.Node.EventType.TOUCH_START, function (event) {
                self.setBigAndOthersSmall(i,self.currentNodeIndex);
                
                //设置枪面板滑动事件
                //self.setScrollGunNode();
            }, self.gunPanelList[i]);
        }
        
    },
    //滚动事件
    setScrollGunNode(){
         let self=this;//gunPanelList[self.currentNodeIndex]
         var xLocation;
         
         self.gunNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            xLocation=event.currentTouch._point.x-event.currentTouch._startPoint.x;
        },self.gunNode);

        self.gunNode.on(cc.Node.EventType.TOUCH_END, function (event) {
            //console.log("结束");
            //var panelWidth= self.gunPanelList[self.currentNodeIndex].width;
            if(xLocation<0&&Math.abs(xLocation)>=50){
                //所有都往左移动
                if(self.currentNodeIndex+1<self.gunPanelList.length){
                    self.setBigAndOthersSmall(self.currentNodeIndex+1,self.currentNodeIndex);
                }
            }else if(xLocation>0&&Math.abs(xLocation)>=50){
                if(self.currentNodeIndex-1>=0){
                    self.setBigAndOthersSmall(self.currentNodeIndex-1,self.currentNodeIndex);
                }
                
            }
           
        }, self.gunNode);
    },
    //开枪效果
    openGun(clickNodeIndex){
        //let gunImgId=this.gunPanelList[clickNodeIndex].children[3].value;//枪图片id
        var list=this.gunPanelList[clickNodeIndex].children.find((element) => (element._name== 'gunId'));
        let gunImgId=list.value;
        this.gunAction(gunImgId,clickNodeIndex);
    },
    gunAction(gunImgId,clickNodeIndex){
        this.gunPanelList[clickNodeIndex].getComponent('gunPanel').openFire(gunImgId);
    },
    start () {

    },

    // update (dt) {},
});
