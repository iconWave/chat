angular.module('chatMod').controller('RoomCtrl', function ($routeParams, $http, $scope, $rootScope) {
    /**
     * 1. 在控制器中注入 $routeParams,这是一个对象，key是路径占位符，值就是路径里占位符对应的字符串
     * 2. 拼出url /rooms/真实id 调用后台接口得到room对象
     * 3. 后台编写一个路由响应这个请求 app.get('/rooms/:_id')
     * 4. 通过Room模型的findById方法传入id,得到room对象并返回给客户端
     * 5. 客户端拿到room赋给$scope.room
     */
    var roomId = $routeParams.id;//id是房间的_id
    $http({
        url: `/rooms/${roomId}`,//获取某个房间的文档对象
        method: 'GET'//请求的方法为GET
    }).success(function (result) {
        if (result.err == 0) {
            //把取回来的房间对象赋给room {name,messages,users}
            $scope.room = result.data;
        } else {
            $rootScope.errorMsg = result.msg;
        }
    });

    /**
     * 1. 在后台引入socket.io. 监听客户端的连接请求
     * 2. 在前台连接后台的socket.io服务器
     * 3.在前台发送消息给后台，后台保存到当前房间里messages数组中，并且通过所有的客户端添加此消息
     */
    var socket = io.connect('ws://localhost:9090');
    socket.on('message', function (msgObj) {
        console.log(msgObj);
        $scope.room.messages.push(msgObj);
    });
    $scope.send = function () {
        socket.send({user: $rootScope.user, content: $scope.content});
    }

});
//如果输入回车键的话就自动发送
angular.module('chatMod').directive('keyDown',function(){
 return {
     link:function(scope,element,attrs){
         element.keydown(function(event){
             if(event.keyCode == 13){
                 scope.$eval(attrs.keyDown);
             }
         });
     }
 }
});