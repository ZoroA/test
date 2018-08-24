
// var func1 = function() {
//     console.log("func1");
//  };
// module.exports = {
//     gunList:[{id:'0',name:'AK47',img:"gun0"},{id:'1',name:'燃尽',img:"gun1"},{id:'2',name:'手枪',img:"gun2"},{id:'3',name:'稀有枪',img:"gun3"}]
// };

var gunList=[{id:0,name:'维和者',img:"gun0",des:"曾经有位牛仔，他叫麦克雷",animation:'peaceClip',price:'0',needFriend:'0'},
             {id:1,name:'AK47',img:"ak47",des:"杀人无算，拉风枪王",animation:'akClip',price:'5000',needFriend:'5'},
             {id:2,name:'沙漠之鹰',img:"eagle",des:"它的上一任主人，名叫韦德·威尔逊",animation:'eagleClip',price:'5000',needFriend:'5'}];
//加载本地资源要手动创建一个resuorce文件夹
var loadLocalImg=function(container,url){
    cc.loader.loadRes(url, cc.SpriteFrame, function (err, spriteFrame) {
        // console.log("loadLocalImg"+spriteFrame);
        container.spriteFrame= spriteFrame;
    });
}
//加载远程图片
var loadRemoteImg=function(container,url){
    cc.loader.load({url: url, type: 'png'}, function (err, texture) {
        // console.log("图片"+texture);
        var sprite  = new cc.SpriteFrame(texture);
        container.spriteFrame = sprite;
    });
}
//  要引用这个文件的函数或者变量，除了在要引用的的js文件中模块化之外（var utils=require('js地址')），
// 在被引用的的js中要通过 module.exports={a:a}作为面向对象的变量输出函数如下：
 module.exports={
     gunList:gunList,//要引用的函数 xx:xx
     loadLocalImg:loadLocalImg,
     loadRemoteImg:loadRemoteImg
 }