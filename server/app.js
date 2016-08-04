var io = require('socket.io');
var socket = io.listen(1337,{log:true});
var clientNameTemp = 'client_temp';
function Client(name, posX, posY, socket, heath) {
    this.name = name;
    this.posX = posX;
    this.posY = posY;
    this.heath = heath;
    this.socket = socket;
}
function Message() {
}
var tank_type = [
    {
        type: 0,
        cannon: 0,
        speed: 1.5,
        heath: 5,
        width: 37,
        length: 47
    },
    {
        type: 1,
        cannon: 1,
        speed: 1,
        heath: 10,
        width: 57,
        length: 72
    },
    {
        type: 2,
        cannon: 2,
        speed: 1,
        heath: 10,
        width: 57,
        length: 72
    }
]
var cannon_type = [
    {
        type: 0,
        missile: 0
    },
    {
        type: 1,
        missile: 1
    },
    {
        type: 2,
        missile: 2
    }
]
var missile_type = [
    {
        type: 0,
        range: 400,
        power: 1,
        speed: 2,
        missile_number: 1
    },
    {
        type: 1,
        range: 400,
        power: 2,
        speed: 2,
        missile_number: 2
    },
    {
        type: 2,
        range: 550,
        power: 2,
        speed: 2,
        missile_number: 2
    }
]
var wall_type = [
    {
        type: 0,
        heath: 400
    }
]
var blockhouse_type = [
    {
        type: 2,
        heath: 10,
        missile: 2,
        width: 100,
        length: 100
    }
]
var clients = new Array();
socket.sockets.on('connection', function(socket) {
console.log('Client connection');
//    sockets.push(socket);
    var currentTanks = new Array();
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].name != clientNameTemp) {
            var clientMsg = new Object(); //new Client(clients[i].name,clients[i].posX,clients[i].posY,null,clients[i].heath,clients[i].type,clients[i].speed,clients[i].team);
            clientMsg.name = clients[i].name;
            clientMsg.posX = clients[i].posX;
            clientMsg.posY = clients[i].posY;
            clientMsg.angle = clients[i].angle;
            clientMsg.heath = clients[i].heath;
            clientMsg.type = clients[i].type;
            clientMsg.speed = clients[i].speed;
            clientMsg.team = clients[i].team;
            currentTanks.push(clientMsg);
        }
    }
    var map = loadMap();
    var replyMsg = new Object();
    replyMsg.map = map;
    replyMsg.tank_type = tank_type;
    replyMsg.cannon_type = cannon_type;
    replyMsg.missile_type = missile_type;
    replyMsg.blockhouse_type = blockhouse_type;
    replyMsg.wall_type = wall_type;
    replyMsg.currentTanks = currentTanks;
    socket.emit('uTank_msg_load', JSON.stringify(replyMsg));
    var newClient = new Client(clientNameTemp, 0, 0, socket, 1);
    clients.push(newClient);
    socket.on('msg_test', function(msg) {
        socket.emit('msg_test', msg);
    });
    socket.on('uTank_msg_goto', function(msg) {
        var msgObj = JSON.parse(msg);
        //        console.log('Received GOTO from client ',msg);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].name != msgObj.user) {
//                console.log('Received GOTO to client ',msg);
                clients[i].socket.emit('uTank_msg_goto', msg);
            } else {
                clients[i].posX = msgObj.targetX;
                clients[i].posY = msgObj.targetY;
                clients[i].angle = msgObj.angle;
            }
        }
    });
    socket.on('uTank_msg_fire', function(msg) {
        var msgObj = JSON.parse(msg);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].name != msgObj.user) {
                clients[i].socket.emit('uTank_msg_fire', msg);
            }
        }
    });
    socket.on('uTank_msg_init', function(msg) {
        console.log('uTank_msg_init');
        var msgObj = JSON.parse(msg);
        var clientMsg = new Object();
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].socket == socket) {
                if (msgObj.user != null && msgObj.user.length > 0) {
                    clients[i].name = msgObj.user;
                } else {
                    if (msgObj.team == '0') {
                        clients[i].name = 'AT_00' + i;
                    } else {
                        clients[i].name = 'DF_00' + i;
                    }
                }
                if (msgObj.team === '0') {
                    clients[i].posX = 50;
                } else {
                    clients[i].posX = loadMap().width - 50;
                }
                clients[i].posY = i * 100 + 50;
                clients[i].angle = 0;
                clients[i].type = msgObj.type;
                clients[i].team = msgObj.team;
//                for (var i = 0; i < tank_type.length; i++) {
//
//                }
//                switch (msgObj.type) {
//                    case 'mini':
//                        {
//                            clients[i].speed = 2;
//                            clients[i].heath = 3;
//                            break;
//                        }
//                    default:
//                        {
//                            clients[i].speed = 1;
//                            clients[i].heath = 10;
//                            break;
//                        }
//                }
                clientMsg.user = clients[i].name;
                clientMsg.posX = clients[i].posX;
                clientMsg.posY = clients[i].posY;
                clientMsg.angle = clients[i].angle;
                clientMsg.heath = clients[i].heath;
                clientMsg.type = clients[i].type;
                clientMsg.speed = clients[i].speed;
                clientMsg.team = clients[i].team;
                socket.emit('uTank_msg_init', JSON.stringify(clientMsg));
//                console.log('clients[i].name', msgObj.posX);
                break;
            }
        }
//        console.log('------------123--', clients.length);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].socket == socket) {

            } else {
                clients[i].socket.emit('uTank_msg_has_init', JSON.stringify(clientMsg));
//                var clientMsg= new Object();//new Client(clients[i].name,clients[i].posX,clients[i].posY,null,clients[i].heath,clients[i].type,clients[i].speed,clients[i].team);
//                clientMsg.user=clients[i].name;
//                clientMsg.posX=clients[i].posX;
//                clientMsg.posY=clients[i].posY;
//                clientMsg.angle=clients[i].angle;
//                clientMsg.heath=clients[i].heath;
//                clientMsg.type=clients[i].type;
//                clientMsg.speed=clients[i].speed;
//                clientMsg.team=clients[i].team;
//                socket.emit('uTank_msg_init',JSON.stringify(clientMsg));
                console.log('------------its--');
            }
        }
//        var replyMsg = JSON.stringify(clients);

//        client=new Client(msgObj.user,msgObj.posX,msgObj.posY,socket);
//        clients.push(client);                   
//        console.log('FINAL INIT');
    });
    socket.on('uTank_msg_destroy', function(msg) {
        var msgObj = JSON.parse(msg);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].name == msgObj.user) {
                clients.splice(i, 1);
                break;
            }
        }
    });
    socket.on('uTank_msg_busted', function(msg) {
//        console.log('uTank_msg_busted->>>>');
        var msgObj = JSON.parse(msg);
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].name === msgObj.user) {
                clients[i].heath = msgObj.heath;
//                clients[i].socket.emit('uTank_msg_has_busted', msg);
            }
//            else if(clients[i].name !== msgObj.user && ) {
//                clients[i].socket.emit('uTank_msg_has_busted', msg);
//            }
            if (clients[i].socket !== socket) {
                clients[i].socket.emit('uTank_msg_has_busted', msg);
            }
        }
    });
    socket.on('disconnect', function() {
        var client;
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].socket == socket) {
                client = clients[i].name;
                clients.splice(i, 1);
                break;
            }
        }
        var destroyMsg = new Message();
        destroyMsg.user = client;
        for (var i = 0; i < clients.length; i++) {
            clients[i].socket.emit('uTank_msg_has_destroy', JSON.stringify(destroyMsg));
        }
//        socket.emit('uTank_msg_has_destroy','{"user":"'+client+'"}');
        console.log('Client disconnected: ', client);
    });
});
function loadMap(map) {
    var map = {
//        background: "image/bg3.png",
        background: "",
        width: 1350,
        height: 750,
        walls: [
            {
                type: 10,
                posX: 400,
                posY: 100,
                width: 100,
                length: 100
            },
            {
                type: 10,
                posX: 400,
                posY: 180,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 400,
                posY: 260,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 400,
                posY: 380,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 400,
                posY: 460,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 400,
                posY: 540,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 800,
                posY: 100,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 800,
                posY: 180,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 800,
                posY: 260,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 800,
                posY: 380,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 800,
                posY: 460,
                width: 50,
                length: 50
            },
            {
                type: 10,
                posX: 800,
                posY: 540,
                width: 50,
                length: 50
            }
        ],
        blockhouses: [
            {
                type: 2,
                posX: 1000,
                posY: 260,
                team: 1
            },
            {
                type: 2,
                posX: 1000,
                posY: 500,
                team: 1
            }

        ]

    };
    return map;
}