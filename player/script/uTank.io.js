//var socket = io.connect('http://localhost:1337');
//var strJSON = '{"result":true,"count":1}';
//var obj = JSON.parse(strJSON).result;
//socket.on('uTank_msg', function (msg) {
//    receiveMessage(msg);        
//});  
function UTankIO(){  
var ioUT=this;
    this.socket=io.connect('http://localhost:1337');
    //    this.socket.on('connection', function () {
    //        _uGame.log('Connected to server');
    //    });
    this.socket.on('uTank_msg_load', function (msg) {
        _uGame.log('Connected to server');
        _uGame.handingMessage('uTank_msg_load',msg);
    });
    this.socket.on('uTank_msg_goto', function (msg) {
        _uGame.handingMessage('uTank_msg_goto',msg);
    });
    this.socket.on('uTank_msg_fire', function (msg) {
        _uGame.handingMessage('uTank_msg_fire',msg);
    });
    this.socket.on('uTank_msg_init', function (msg) {
        _uGame.handingMessage('uTank_msg_init',msg);
    });
    this.socket.on('uTank_msg_destroy', function (msg) {
        _uGame.handingMessage('uTank_msg_destroy',msg);
    });
    this.socket.on('uTank_msg_has_destroy', function (msg) {
        _uGame.handingMessage('uTank_msg_has_destroy',msg);
    });
    this.socket.on('uTank_msg_has_busted', function (msg) {
        _uGame.handingMessage('uTank_msg_has_busted',msg);
    });
    this.socket.on('uTank_msg_has_init', function (msg) {
        _uGame.handingMessage('uTank_msg_has_init',msg);
    });
	this.socket.on('message', function (msg) {
        console.log(msg);
    });
}
function UTankMsg(user){
    this.user=user;
//    this.params=new Array();
}
//UTankIO.prototype.sendMessage=function(msg){
//    this.socket.emit('uTank_msg',msg);
//}
UTankIO.prototype.sendMessage=function(type,uTankMsg){
    var msgJSON = JSON.stringify(uTankMsg);
    this.socket.emit(type,msgJSON);
    _uGame.log('Sent message: '+type+' - '+msgJSON);
}
UTankIO.prototype.receiveMessage=function(msg){
    //    _uGame.log('Resceived message: '+msg);
    var msgObj=JSON.parse(msg);
    switch(msgObj[1].type)
    {
        case 'fire':
            getTank(msgObj[0].name).fire(msgObj[2].posX,msgObj[3].posY);
            break;
        case 'goTo':
            getTank(msgObj[0].name).goTo(msgObj[2].targetX,msgObj[3].targetY);
            break;
        default:
    }
}