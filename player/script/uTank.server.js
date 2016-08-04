var io = require('socket.io');
var socket = io.listen(1337);
var clientNameTemp = 'client_temp';
function Client(name,posX,posY,socket,heath){
    this.name=name;
    this.posX=posX;
    this.posY=posY;
    this.heath=heath;
    this.socket=socket;
}
function Message(){    
}

var clients=new Array();
socket.sockets.on('connection',function(socket){
    //    sockets.push(socket);
    var replyMsg=new Array();
    
    for(i=0;i<clients.length;i++){
        if(clients[i].name!=clientNameTemp){
            var clientMsg=new Client(clients[i].name,clients[i].posX,clients[i].posY,null,clients[i].heath);
            replyMsg.push(clientMsg);
        }
    }    
    socket.emit('uTank_msg_load',JSON.stringify(replyMsg));
    var newClient=new Client(clientNameTemp,0,0,socket,1);
    clients.push(newClient);
    //    socket.on('uTank_msg', function(msg){
    //        console.log('Received expression from client ',msg);
    //        switch(msgObj.type)
    //        {
    //            case 'init':
    //                msg.type='has_init';
    //                for(i=0;i<clients.length;i++){
    //                    if(clients[i].name!=msgObj.user){
    //                        clients[i].socket.emit('uTank_msg',msg);
    //                    }
    //                }
    //                var replyMsg = JSON.stringify(clients);
    //                socket.socket.emit('uTank_msg',msg);
    //                for(i=0;i<clients.length;i++){
    //                    if(clients[i].socket==socket){
    //                        clients[i].name=msgObj.user
    //                    }
    //                }
    //                //                var client=new Client(msgObj.user,msgObj.posX,msgObj.posY,socket);
    //                //                clients.push(client);                
    //                
    //                break;
    //            case 'destroy':
    //                for(i=0;i<clients.length;i++){
    //                    if(clients[i].name==msgObj.user){
    //                        clients.splice(i,1);  
    //                        break;
    //                    }
    //                }
    //                break;
    //            case 'fire':
    //                for(i=0;i<clients.length;i++){
    //                    if(clients[i].name!=msgObj.user){
    //                        clients[i].socket.emit('uTank_msg',msg);                      
    //                    }
    //                }
    //                break;
    //            case 'goTo':
    //                for(i=0;i<clients.length;i++){
    //                    if(clients[i].name!=msgObj.user){
    //                        clients[i].socket.emit('uTank_msg',msg);                      
    //                    }
    //                }
    //                break;
    //            default:
    //        }
    //    //        try{
    //    //            for(i=0;i<sockets.length;i++){
    //    //                if(sockets[i]!=socket){
    //    //                    sockets[i].emit('uTank_msg',msg);
    //    //                }
    //    //            }
    //    //        //socket.send(expr);
    //    //        //socket.sockets.emit('message',expr);
    //    //
    //    //        }catch(err){
    //    //
    //    //            socket.emit("error",err.message);
    //    //
    //    //        }
    //
    //    });

    socket.on('uTank_msg_goto', function(msg){
        var msgObj=JSON.parse(msg);
        //        console.log('Received GOTO from client ',msg);
        for(i=0;i<clients.length;i++){            
            if(clients[i].name!=msgObj.user){
                //                console.log('Received GOTO to client ',msg);
                clients[i].socket.emit('uTank_msg_goto',msg);                      
            }else{
                clients[i].posX=msgObj.targetX;
                clients[i].posY=msgObj.targetY;
            }
        }
    });
    socket.on('uTank_msg_fire', function(msg){
        var msgObj=JSON.parse(msg);
        for(i=0;i<clients.length;i++){
            if(clients[i].name!=msgObj.user){
                clients[i].socket.emit('uTank_msg_fire',msg);                      
            }
        }
    });
    socket.on('uTank_msg_init', function(msg){
        var msgObj=JSON.parse(msg);
        for(i=0;i<clients.length;i++){
            if(clients[i].socket==socket){
                clients[i].name=msgObj.user;
                clients[i].posX=msgObj.posX;
                clients[i].posY=msgObj.posY;
                console.log('clients[i].name',msgObj.posX);
            }
        }
        for(i=0;i<clients.length;i++){
            if(clients[i].name!=msgObj.user){
                clients[i].socket.emit('uTank_msg_has_init',msg);
            }
        }
        //        var replyMsg = JSON.stringify(clients);
        socket.emit('uTank_msg_init',msg);//?????????msg
    //        client=new Client(msgObj.user,msgObj.posX,msgObj.posY,socket);
    //        clients.push(client);                   
    //        console.log('FINAL INIT');
    });
    socket.on('uTank_msg_destroy', function(msg){
        var msgObj=JSON.parse(msg);
        for(i=0;i<clients.length;i++){
            if(clients[i].name==msgObj.user){
                clients.splice(i,1);  
                break;
            }
        }
    });
    socket.on('uTank_msg_busted', function(msg){
        var msgObj=JSON.parse(msg);
        for(i=0;i<clients.length;i++){
            if(clients[i].name!=msgObj.user){
                clients[i].socket.emit('uTank_msg_has_busted',msg);
            }else{
                clients[i].heath=0;
            }
        }
    });    
    socket.on('disconnect', function(){        
        var client;
        for(i=0;i<clients.length;i++){
            if(clients[i].socket==socket){
                client=clients[i].name;
                clients.splice(i,1);  
                break;
            }
        }
        var destroyMsg=new Message();   
        destroyMsg.user=client;
        for(i=0;i<clients.length;i++){
            clients[i].socket.emit('uTank_msg_has_destroy',JSON.stringify(destroyMsg));
        }
        //        socket.emit('uTank_msg_has_destroy','{"user":"'+client+'"}');
        console.log('Client disconnected: ',client);
    });

});
