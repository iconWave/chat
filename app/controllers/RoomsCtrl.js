angular.module('chatMod').controller('RoomsCtrl',function($scope,$http,$rootScope,$location){
   $scope.rooms = $scope._rooms = [];
    /**
     * 1. 在控制器里立刻调用后台接口 get /rooms，获取房间列表
     * 2. 服务器端要实现 get /rooms这个路由，
     * 3. 在路由里要调Room 模型的find方法查询所有的房间列表文档数组
     * 4. 为了Room,需要先在db/index.js里定义对应的模型和schema,字段只有一个name,类型是string
     */
    $http({
        url:'/rooms',
        method:'GET',
    }).success(function(result){
       if(result.err==0){//如果没有出错，就把返回来的房间数组赋给$scope.rooms属性 _rooms放过滤前的数组 rooms放过滤后的数组
           $scope.rooms = $scope._rooms= result.data;
       }else{
          $rootScope.errorMsg = result.msg;
       }
    });
    $scope.filter = function(){
        var keyword = $scope.keyword;
        $scope.rooms = $scope._rooms.filter(function(item){
            return item.name.indexOf(keyword)!=-1;
        });
    }
    /**
     * 增加房间
     * 1. 给增加房间按钮绑定点击事件ng-click,当点击的时候执行$scope上的createRoom方法
     * 2. 在createRoom方法中获取到房间名($scope.keyword)，调用增加房间的后台接口，请求方法post 请求的URL /rooms  数据 data {name:$scope.keyword}
     * 3. 在服务器端编写/rooms/add路由，得到请求体对象，然后调用Room.create方法把此对象保存到数据库中，并返回保存后的房间对象
     */
    $scope.createRoom = function(){
        $http({
            url:'/rooms',
            method:'POST',
            data:{name:$scope.keyword}
        }).success(function(result){
            if(result.err == 0){
                //把保存成功之后的房间对象添加到房间列表数组中
                $scope._rooms.push(result.data);
                $scope.filter();
            }else{
                $rootScope.errorMsg = result.msg;
            }
        });
    }
    /**
     * 点击房间名的时候要进入某个房间的聊天界面
     * 1. 给名字所在的DOM元素增加ng-click事件
     * 2. 在事件函数里要跳转到聊天页面 /rooms/:roomId
     */
    $scope.gogogo = function(_id){
        $location.path('/rooms/'+_id);
    }
});