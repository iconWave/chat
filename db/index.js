var mongoose = require('mongoose');
var config = require('./config');
var ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.connect(config.dbUrl);
//定义用户的数据结构骨架
var UserSchema = new mongoose.Schema({
    email: String,
    avatar: String
});
//定义可以操作用户User集合的模型对象
var User = mongoose.model('User', UserSchema);
//把此用户模型进行导出 require('db').User
exports.User = User;

var RoomSchema = new mongoose.Schema({
    name:String,
    //在线人数的数组 类型是对象ID，引用模型是User 它里存放的ID就是用户的ID
    users:[{type:ObjectId,ref:'User'}],
    messages:[{//此房间内的消息数组
        user:{type:ObjectId,ref:'User'},//用户ID
        content:String,//聊天的内容
        createAt:{type:Date,default:Date.now()}//发言的时间
    }]
});
var Room = mongoose.model('Room',RoomSchema);
exports.Room = Room;


///Room.create([{name:'JAVA'},{name:'JAVASCRIPT'}]);

