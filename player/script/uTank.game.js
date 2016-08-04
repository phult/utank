var _tanks =new Array();
var _uTankIO;
var _uGame=new UGame();

var _tank;
var _context;
//var _canvas;
var _canvas;
function UResource(){
    this.getResource=function(resourceName,type){
        var resource=null;
        switch(type){
            case 'audio':{
                resource=new Audio("sound/"+resourceName+".mp3");
                break;
            }
            case 'image':{
                resource = new Image();
                resource.src="image/"+resourceName+".png";
                break;
            }
        }
        return resource;
    }
}


//map
function Map(){

}
//wall
function Wall(ugame,context,type,posX,posY,width,length){
    this.ugame=ugame;
    this.context=context;
    this.type=type;
    this.posX=posX;
    this.posY=posY;
    this.width=width;
    this.length=length;
    this.draw=function(){  
        //                context.fillStyle = "red";
        //                context.fillRect(posX, posY, width, length);
        //                context.fill();
        this.context.drawImage(this.ugame.wall_img,this.posX-this.width/2,this.posY-this.length/2,this.width,this.length);
    }
}
//tank
function Tank(ugame,user,context,posX,posY,angle,heath,type,speed,team){
    this.ugame=ugame;
    this.user=user;
    this.context=context;
    this.posX=posX;
    this.posY=posY;
    this.angle=angle;            
    this.canon=new Canon(this.ugame,this,context);
    this.canon.posX=this.posX;
    this.canon.posY=this.posY;
    this.canon.width=6;
    this.canon.length=34;
    this.canon.angle=angle;
    this.canon.desAngle=angle;
    this.desPosX=posX;                
    this.desPosY=posY;    
    //    this.speed=speed;
    //    this.heath=heath;
    this.type=type;
    this.team=team;
    var types=this.ugame.load_tank_type;
    for(var i=0;i<types.length;i++){
        if(types[i].type==this.type){
            this.width=types[i].width;
            this.length=types[i].length;
            this.heath=types[i].heath;
            this.speed=types[i].speed;
            break;
        }
    }    
    //    switch(type){
    //        
    //        case 'mini':{
    //            this.width=37;
    //            this.length=47;           
    //            break;
    //        }
    //        default:{
    //            this.width=57;
    //            this.length=72;           
    //            break;
    //        }
    //    }       
    this.goTo=function(desPosX,desPosY){
        var dx = desPosX - this.posX;
        var dy = desPosY - this.posY;
        this.canon.angle+=(Math.atan2(dy,dx)-this.angle);
        this.angle = Math.atan2(dy,dx);
        
        this.desPosX=desPosX;                
        this.desPosY=desPosY;
    }
    this.hasCollision=function(){
        var retval=false;
        var blockhouses=UGame.prototype.getInstance().blockhouses;
        for(var i=0;i<blockhouses.length;i++){
            if(
                this.posX-this.length/2<=UGame.prototype.getInstance().blockhouses[i].posX+UGame.prototype.getInstance().blockhouses[i].width/2
                &&this.posX+this.length/2>=UGame.prototype.getInstance().blockhouses[i].posX-UGame.prototype.getInstance().blockhouses[i].width/2
                &&this.posY-this.width/2<=UGame.prototype.getInstance().blockhouses[i].posY+UGame.prototype.getInstance().blockhouses[i].length/2
                &&this.posY+this.width/2>=UGame.prototype.getInstance().blockhouses[i].posY-UGame.prototype.getInstance().blockhouses[i].length/2
                ){
                retval=true;
                break;
            }   
        }
        var walls=UGame.prototype.getInstance().walls;
        for(var i=0;i<walls.length;i++){
            
            if(
                this.posX-this.length/2<=UGame.prototype.getInstance().walls[i].posX+UGame.prototype.getInstance().walls[i].width/2
                &&this.posX+this.length/2>=UGame.prototype.getInstance().walls[i].posX-UGame.prototype.getInstance().walls[i].width/2
                &&this.posY-this.width/2<=UGame.prototype.getInstance().walls[i].posY+UGame.prototype.getInstance().walls[i].length/2
                &&this.posY+this.width/2>=UGame.prototype.getInstance().walls[i].posY-UGame.prototype.getInstance().walls[i].length/2
                ){
                retval=true;
                break;
            }   
        }
        for(var i=0;i<UGame.prototype.getInstance().tanks.length;i++){  
            if(UGame.prototype.getInstance().tanks[i]==this){
                continue;
            }
            if((this.posX-UGame.prototype.getInstance().tanks[i].posX<=this.length && this.posX-UGame.prototype.getInstance().tanks[i].posX>=-this.length)
                &&(this.posY-UGame.prototype.getInstance().tanks[i].posY<=this.width && this.posY-UGame.prototype.getInstance().tanks[i].posY>=-this.width)){
                retval=true;
                break;
            }      
        }        
        if(retval){
            this.ugame.wall_hit_snd.currentTime=0;
            this.ugame.wall_hit_snd.play();
        }
        return retval;
    }
    this.move=function(){     
        //        this.alertEnemy();
        if((((this.desPosX ==0 && this.desPosY ==0) ||(this.posX-this.length/2<=this.desPosX && this.posX+this.length/2>=this.desPosX &&
            this.posY-this.width/2<=this.desPosY && this.posY+this.width/2>=this.desPosY)))){
        //            if(this.hasCollision()){
        //                this.posX-=this.speed*Math.cos(this.angle);
        //                this.posY-=this.speed*Math.sin(this.angle);   
        //            }
        //            if(this.hasCollision()){
        //                this.Colliding=true;
        //            }
        //            this.ugame.tank_run_snd.currentTime=0;
        //            this.ugame.tank_run_snd.pause();
        }else{
            if(this.hasCollision()){
                this.posX-=4*this.speed*Math.cos(this.angle);
                this.posY-=4*this.speed*Math.sin(this.angle);
                this.desPosX=this.posX;
                this.desPosY=this.posY;
            }else{
                if(this.posX!=this.desPosX && this.posY!=this.desPosY){
                    this.posX+=this.speed*Math.cos(this.angle);
                    this.posY+=this.speed*Math.sin(this.angle);   
                //                this.ugame.tank_run_snd.currentTime=1;
                //                this.ugame.tank_run_snd.play();                            
                }   
            }               
        }                          
        this.context.save();                          
        this.context.translate(this.posX,this.posY);
        this.context.rotate(this.angle);
        this.context.beginPath();
        if(this==_tank){
            this.context.fillStyle = "#d64e29";                
        }else{
            this.context.fillStyle = "#397b31";                
        }        
        switch(type){
            case '0':{
                this.context.drawImage(this.ugame.mini_tank_body,-this.length/2,-this.width/2,this.length,this.width);	
                break;
            }
            default:{
                this.context.drawImage(this.ugame.tank_body,-this.length/2,-this.width/2,this.length,this.width);	
                break;
            }
        }
        if(this.heath>0){
            var unitHeathWidth=5;      
            if(this.team=='0'){
                context.fillStyle = "blue";
            }else{
                context.fillStyle = "red";            
            }
            for(var i=0;i<this.heath;i++){
                context.fillRect(-(unitHeathWidth*this.heath+this.heath)/2+i*(unitHeathWidth+1), 30,unitHeathWidth, 10);
                context.fill();
            }              
        }
        this.context.font="11px Arial";
        this.context.fillStyle = "blue"; 
        this.context.strokeText(this.user,-10,38);          
        this.context.restore();            
        var missilesCanon=this.canon.missiles;
        for(var idx=0;idx<missilesCanon.length;idx++){
            if(missilesCanon[idx].busted()){
                missilesCanon.splice(idx,1);
                if(this==_tank && this.heath<=0){		
                    
                }
            }
            else{
                missilesCanon[idx].draw();
            }
        }
        this.canon.draw(this.posX,this.posY,this.angle);
        if(this.heath<=0){
            this.context.drawImage(this.ugame.busted_img,this.posX-20,this.posY-20,40,40);
        }
    }  
    this.fire=function(posX,posY){    
        if(this.canon.missiles.length>=3){
            return;
        }
        var angle=Math.atan2(posY,posX);
        this.ugame.tank_fire_snd.currentTime=0;
        this.ugame.tank_fire_snd.play();
        this.canon.angle=angle;    
        var missile=new Missile(this.ugame,this,this.canon.context,this.canon.posX,this.canon.posY,angle);
        this.canon.missiles.push(missile);
        this.posX-=5*this.speed*Math.cos(this.angle);
        this.posY-=5*this.speed*Math.sin(this.angle);
    //                this.canon.draw(angle);
    }
    this.alertEnemy=function(){
        for(var i=0;i<UGame.prototype.getInstance().tanks.length;i++){  
            if(_tank!=null &&_tank.user=='phult' &&_tank!=UGame.prototype.getInstance().tanks[i]){
                if(Math.sqrt((_tank.posX-UGame.prototype.getInstance().tanks[i].posX)*(_tank.posX-UGame.prototype.getInstance().tanks[i].posX)+(_tank.posY-UGame.prototype.getInstance().tanks[i].posY)*(_tank.posY-UGame.prototype.getInstance().tanks[i].posY))<=300){
                    _tank.fire(UGame.prototype.getInstance().tanks[i].posX-_tank.posX,UGame.prototype.getInstance().tanks[i].posY-_tank.posY);
                    var msg= new UTankMsg(_tank.user);        
                    msg.dx=UGame.prototype.getInstance().tanks[i].posX-_tank.posX;
                    msg.dy=UGame.prototype.getInstance().tanks[i].posY-_tank.posY;
                    _uTankIO.sendMessage('uTank_msg_fire',msg);
                }
            }
        }
    }
}
//cannon
function Canon(ugame,tank,context){
    this.ugame=ugame;
    this.tank=tank;
    this.context=context;
    this.posX=100;
    this.posY=100;
    this.width=33;
    this.length=60;
    this.angle=0;
    this.missiles= new Array();
    this.draw =function(posX,posY,angle){
        this.posX=posX;
        this.posY=posY;
        this.context.save();                          
        this.context.translate(this.posX,this.posY);
        this.context.rotate(this.angle);
        switch(this.tank.type){
            case '0':{
                this.context.drawImage(this.ugame.mini_tank_cannon,-12,-9,46,19);   
                break;
            }
            default:{
                this.context.drawImage(this.ugame.tank_cannon,-18,-16,60,33);   	
                break;
            }
        }        
        this.context.restore();
    }    
}

//Missile
function Missile(ugame,tank,context,posX,posY,angle){
    this.ugame=ugame;
    this.tank=tank;
    this.context=context;
    this.sourcePosX=posX;
    this.sourcePosY=posY;
    this.posX=posX;
    this.posY=posY;
    this.width=7;
    this.length=22;
    this.angle=angle;     
    var tanktypes=this.ugame.load_tank_type;
    var cannonType=0;
    for(var i=0;i<tanktypes.length;i++){
        if(tanktypes[i].type==this.tank.type){
            cannonType=tanktypes[i].cannon;
            break;
        }
    }
    var cannonTypes=this.ugame.load_cannon_type;
    var missileType=0;
    for(var i=0;i<cannonTypes.length;i++){
        if(cannonTypes[i].type==cannonType){
            missileType=cannonTypes[i].missile;
            break;
        }
    }
    var types=this.ugame.load_missile_type;
    for(var i=0;i<types.length;i++){
        if(types[i].type==missileType){
            this.speed=types[i].speed;
            this.range=types[i].range;
            this.power=types[i].power;
            this.missile_number=types[i].missile_number;
            break;
        }
    }
    //    switch(this.tank.type){
    //        case 'mini':{
    //            this.power=1;
    //            break;
    //        }
    //        default:{
    //            this.power=2;
    //            break;
    //        }
    //    }          
    this.explosed=function(){    
    }
    this.busted=function(){
        var retval=false;         
        var blockhouses=UGame.prototype.getInstance().blockhouses; 
        for(var i=0;i<blockhouses.length;i++){
            if(blockhouses[i]!=this.tank
                &&this.posX>=blockhouses[i].posX-blockhouses[i].width/2
                &&this.posX<=blockhouses[i].posX+blockhouses[i].width/2    
                &&this.posY>=blockhouses[i].posY-blockhouses[i].length/2
                &&this.posY<=blockhouses[i].posY+blockhouses[i].length/2    
                ){
                this.ugame.busted_snd.currentTime=0;
                this.ugame.busted_snd.play();
//                if(_tank==this.tank){
                    (blockhouses[i]).heath-=this.power;                    
//                }                
                retval=true;
                break;
            }
        }        
        var walls=UGame.prototype.getInstance().walls;        
        for(var i=0;i<walls.length;i++){
            if(this.posX>=walls[i].posX-walls[i].width/2
                &&this.posX<=walls[i].posX+walls[i].width/2    
                &&this.posY>=walls[i].posY-walls[i].length/2
                &&this.posY<=walls[i].posY+walls[i].length/2    
                ){
                //                this.ugame.busted_snd.currentTime=0;
                //                this.ugame.busted_snd.play();
                this.ugame.wall_ric_snd.currentTime=0;
                this.ugame.wall_ric_snd.play();
                retval=true;
                break;
            }
        }
        for( var idx2=0;idx2<UGame.prototype.getInstance().tanks.length;idx2++){
            if(UGame.prototype.getInstance().tanks[idx2].user!=this.tank.user){
                if((UGame.prototype.getInstance().tanks[idx2]).posX-30<=this.posX &&
                    (UGame.prototype.getInstance().tanks[idx2]).posX+30>=this.posX &&
                    (UGame.prototype.getInstance().tanks[idx2]).posY-30<=this.posY &&
                    (UGame.prototype.getInstance().tanks[idx2]).posY+30>=this.posY){
                    if(_tank==this.tank || this.tank.typeName=="Blockhouse"){
                        (UGame.prototype.getInstance().tanks[idx2]).heath-=this.power;                    
                    }
                    this.context.drawImage(this.ugame.busted_img,this.posX-50,this.posY-50,100,100);
                    this.ugame.busted_snd.currentTime=0;
                    this.ugame.busted_snd.play();
                    retval=true;
                    //                    if(_tank==this.tank){
                    //i'm die
                    var msg= new UTankMsg(UGame.prototype.getInstance().tanks[idx2].user);
                    msg.posX=UGame.prototype.getInstance().tanks[idx2].posX;
                    msg.posY=UGame.prototype.getInstance().tanks[idx2].posY;
                    msg.heath=UGame.prototype.getInstance().tanks[idx2].heath;
                    _uTankIO.sendMessage('uTank_msg_busted',msg);
                    //                    }
                    break;
                //            alert('asdasdasd');
                }   
            //        }        
            }        
        }
        if(this.posX<=0||this.posX>=_canvas.width||
            this.posY<=0||this.posY>=_canvas.height){
            //            this.context.drawImage(_busted_img,this.posX-50,this.posY-50,100,100);
            //            _busted_snd.currentTime=0;
            //            _busted_snd.play(); 
            retval=true;                            
        }
        if(Math.sqrt((this.posX-this.sourcePosX)*(this.posX-this.sourcePosX)+(this.posY-this.sourcePosY)*(this.posY-this.sourcePosY))>=this.range){
            retval=true; 
        }
        return retval;
    }
    this.draw=function(){
        this.posX+=this.speed*Math.cos(this.angle);
        this.posY+=this.speed*Math.sin(this.angle);   
        this.context.save();                          
        this.context.translate(this.posX,this.posY);
        this.context.rotate(this.angle);       
        var leftPs=-this.missile_number*(this.width/2);
        for(var i=0;i<this.missile_number;i++){
            this.context.drawImage(UGame.prototype.getInstance().missile,30,leftPs,this.length,this.width);      
            leftPs+=this.width;
        }
        //        switch(this.tank.type){
        //            case '0':{
        //                this.context.drawImage(UGame.prototype.getInstance().missile,30,-this.width/2,this.length,this.width);        
        //                break;
        //            }
        //            default:{
        //                this.context.drawImage(UGame.prototype.getInstance().missile,38,-this.width,this.length,this.width);
        //                this.context.drawImage(UGame.prototype.getInstance().missile,38,0,this.length,this.width);
        //                break;
        //            }
        //        }             
        this.context.restore();
    }
}    
//Blockhouse
function Blockhouse(ugame,context,posX,posY,type,team){
    this.typeName="Blockhouse";
    this.ugame=ugame;
    this.context=context;
    this.posX=posX;
    this.posY=posY;
    this.type=type;
    this.team=team;
    this.angle=0;
    this.missiles=new Array();
    var types=this.ugame.load_blockhouse_type;
    var self = this;
    for(var i=0;i<types.length;i++){
        if(types[i].type==this.type){
            this.width=types[i].width;
            this.length=types[i].length;
            this.heath=types[i].heath;
            this.missile=types[i].missile;
            break;
        }
    }

    var types=this.ugame.load_missile_type;
    for(var i=0;i<types.length;i++){
        if(types[i].type==this.missile){
            this.range=types[i].range;
            break;
        }
    }
    this.draw=function(){     
        if(this.heath>0){
            this.alertEnemy();     
        }
        for(var idx=0;idx<this.missiles.length;idx++){
            if(this.missiles[idx].busted()){
                this.missiles.splice(idx,1);
            }
            else{
                this.missiles[idx].draw();
            }
        }
        self.context.drawImage(this.ugame.wall_img,this.posX-this.width/2,this.posY-this.length/2,this.width,this.length);
        self.context.save();                          
        self.context.translate(this.posX,this.posY);
        self.context.rotate(this.angle);
        //draw heath
        if(this.heath>0){
            var unitHeathWidth=1;     
            context.fillStyle = "red";
            for(var i=0;i<this.heath;i++){
                context.fillRect(-(unitHeathWidth*this.heath+this.heath)/2+i*(unitHeathWidth+1), 30,unitHeathWidth, 10);
                context.fill();
            }              
        }
        self.context.drawImage(this.ugame.tank_cannon,-18,-16,60,33);   
        self.context.restore();    
        if(this.heath<=0){
            self.context.drawImage(this.ugame.busted_img,this.posX-20,this.posY-20,40,40);
        }
    }
    this.fire=function(posX,posY){  
        if(this.missiles.length>=1){
            return;
        }
        this.ugame.bh_fire_snd.currentTime=0;
        this.ugame.bh_fire_snd.play();
        this.angle=Math.atan2(posY,posX);
        var missile=new Missile(this.ugame,this,this.context,this.posX,this.posY,this.angle);
        this.missiles.push(missile);
    }
    this.alertEnemy=function(){
        for(var i=0;i<UGame.prototype.getInstance().tanks.length;i++){              
            if(this.team!= UGame.prototype.getInstance().tanks[i].team 
                && UGame.prototype.getInstance().tanks[i].heath>0 
                && Math.sqrt((this.posX-UGame.prototype.getInstance().tanks[i].posX)*(this.posX-UGame.prototype.getInstance().tanks[i].posX)+(this.posY-UGame.prototype.getInstance().tanks[i].posY)*(this.posY-UGame.prototype.getInstance().tanks[i].posY))<=this.range){
                this.fire(UGame.prototype.getInstance().tanks[i].posX-this.posX,UGame.prototype.getInstance().tanks[i].posY-this.posY);
            //                var msg= new UTankMsg(_tank.user);        
            //                msg.dx=UGame.prototype.getInstance().tanks[i].posX-_tank.posX;
            //                msg.dy=UGame.prototype.getInstance().tanks[i].posY-_tank.posY;
            //                _uTankIO.sendMessage('uTank_msg_fire',msg);
            }
        }
    }
}

window.onload=function init() {   
    _canvas = document.getElementById("canvas");
    _context = _canvas.getContext("2d");   
    _uTankIO=new UTankIO();
};
function canvas_mousedown(e){
    UGame.prototype.getInstance().mouseDown(e);
}


function UGame(){
    this.bh_fire_snd = new Audio("sound/bh_fire.wav");
    this.tank_fire_snd = new Audio("sound/tank_fire.mp3");
    this.tank_run_snd = new Audio("sound/tank_run.mp3");
    this.busted_snd = new Audio("sound/explosion.wav"); 
    this.background_snd = new Audio("sound/background.mp3"); 
    this.wall_ric_snd = new Audio("sound/wall_ric.mp3"); 
    this.wall_hit_snd = new Audio("sound/wall_hit.mp3"); 
    this.busted_snd = new Audio("sound/explosion.wav"); 
    
    this.busted_img = new Image();
    this.busted_img.src = "image/explosion.png";
    
    this.wall_img = new Image();
    this.wall_img.src = "image/wall.jpg";
    
    this.tank_body = new Image();
    this.tank_body.src = "image/tank_body.png";
    this.tank_cannon = new Image();
    this.tank_cannon.src = "image/tank_cannon.png";
    
    this.mini_tank_body = new Image();
    this.mini_tank_body.src = "image/mini_tank_body.png";
    this.mini_tank_cannon = new Image();
    this.mini_tank_cannon.src = "image/mini_tank_cannon.png";
    
    
    this.missile = new Image();
    this.missile.src = "image/missile.png";
    this.tanks =new Array();
    this.walls =new Array();
    this.blockhouses =new Array();
    this.handingMessage= function(type,msg){
        this.log('Received message: '+type+' - '+msg);
        var msgObj=JSON.parse(msg);
        switch(type)
        {
            case 'uTank_msg_load':
                this.load_map = msgObj.map;
                this.load_tank_type = msgObj.tank_type;
                this.load_cannon_type = msgObj.cannon_type;
                this.load_missile_type = msgObj.missile_type;
                this.load_blockhouse_type = msgObj.blockhouse_type;
                this.load_wall_type = msgObj.wall_type;
                this.load_currentTanks = msgObj.currentTanks;
                //load canvas
                $('#canvas').attr('width',this.load_map.width);
                $('#canvas').attr('height',this.load_map.height);
                $('#canvas').css('background-image','url("'+this.load_map.background+'")');
                //load tank
                for(var i=0;i<this.load_currentTanks.length;i++){
                    var newtank=new Tank(this,this.load_currentTanks[i].name,_context,this.load_currentTanks[i].posX,this.load_currentTanks[i].posY,this.load_currentTanks[i].angle,this.load_currentTanks[i].heath,this.load_currentTanks[i].type,this.load_currentTanks[i].speed,this.load_currentTanks[i].team);
                    UGame.prototype.getInstance().tanks.push(newtank);
                }
                //load wall
                var load_walls =this.load_map.walls;       
                for(var i=0;i<load_walls.length;i++){
                    var newWall=new Wall(this,_context,load_walls[i].type,load_walls[i].posX,load_walls[i].posY,load_walls[i].width,load_walls[i].length);
                    UGame.prototype.getInstance().walls.push(newWall);
                }         
                //load blockhouse                
                var load_blockhouses =this.load_map.blockhouses;       
                for(var i=0;i<load_blockhouses.length;i++){
                    var newBH=new Blockhouse(this,_context,load_blockhouses[i].posX,load_blockhouses[i].posY,load_blockhouses[i].type,load_blockhouses[i].team);
                    UGame.prototype.getInstance().blockhouses.push(newBH);
                }
                //_canvas.onmousemove = canvas_mousemove;            
                window.setInterval(UGame.prototype.getInstance().update,5); 
                break;
            case 'uTank_msg_init':
                _tank=new Tank(this,msgObj.user,_context,msgObj.posX,msgObj.posY,msgObj.angle,msgObj.heath,msgObj.type,msgObj.speed,msgObj.team);
                UGame.prototype.getInstance().tanks.push(_tank);
                _canvas.onmousedown = canvas_mousedown;            
                break;
            case 'uTank_msg_has_init':
                var newtank=new Tank(this,msgObj.user,_context,msgObj.posX,msgObj.posY,msgObj.angle,msgObj.heath,msgObj.type,msgObj.speed,msgObj.team);
                UGame.prototype.getInstance().tanks.push(newtank);
                break;
            case 'uTank_msg_fire':
                var tank=UGame.prototype.getInstance().getTank(msgObj.user);
                if(tank!=null){
                    tank.fire(msgObj.dx,msgObj.dy);   
                }            
                break;
            case 'uTank_msg_goto':
                var tank=UGame.prototype.getInstance().getTank(msgObj.user);
                if(tank!=null){
                    tank.goTo(msgObj.targetX,msgObj.targetY);
                }            
                break;
            case 'uTank_msg_has_destroy':
                var user = msgObj.user;
                for(var i=0;i<UGame.prototype.getInstance().tanks.length;i++){        
                    if(UGame.prototype.getInstance().tanks[i].user==user){
                        UGame.prototype.getInstance().tanks.splice(i,1); 
                        break;
                    }
                }
                break;
            case 'uTank_msg_has_busted':
                var user = msgObj.user;
                for(var i=0;i<UGame.prototype.getInstance().tanks.length;i++){        
                    if(UGame.prototype.getInstance().tanks[i].user==user){
                        UGame.prototype.getInstance().tanks[i].heath=msgObj.heath;
                        break;
                    }
                }
                break;			
            default:
        }
    }
    this.update=function(){
        if(UGame.prototype.getInstance().background_snd.currentTime==0){
            UGame.prototype.getInstance().background_snd.play();   
        }                           
        _context.clearRect(0, 0, _canvas.width, _canvas.height);        
        for(var i=0;i<UGame.prototype.getInstance().tanks.length;i++){
            UGame.prototype.getInstance().tanks[i].move();
        }
        for(var i=0;i<UGame.prototype.getInstance().blockhouses.length;i++){
            UGame.prototype.getInstance().blockhouses[i].draw();         
        }
        for(var i=0;i<UGame.prototype.getInstance().walls.length;i++){
            UGame.prototype.getInstance().walls[i].draw();         
        }        
    }
    this.log=function(log){
        $('#log').val('-> '+log+'\n'+$('#log').val());
    }    
    this.joinGame=function (){
        var user = $('#user').val();
        var type = $('#type').val();
        var team = $('#team').val();
        $('#game-menu').hide();
        $('#game-play').show();
        var msg= new UTankMsg(user);
        msg.posX=50;
        msg.posY=UGame.prototype.getInstance().tanks.length*100+50;
        msg.angle=0;
        msg.type=type;
        msg.team=team;
        _uTankIO.sendMessage('uTank_msg_init',msg);
        //        _tank=new Tank(this,user,_context,50,UGame.prototype.getInstance().tanks.length*100+50,0*Math.PI,1,type,team);
        $('#join-game').hide();
    }
    this.getTank=function(user){
        var retval=null;
        for(var i=0;i<UGame.prototype.getInstance().tanks.length;i++){        
            if(UGame.prototype.getInstance().tanks[i].user==user){
                retval=UGame.prototype.getInstance().tanks[i];
                break;
            }
        }
        return retval;
    }
    this.mouseDown=function(e){
        if(_tank.heath<=0){
            return;
        }
        _context.clearRect(0, 0, _canvas.width, _canvas.height);
        var targetX = e.pageX - _canvas.offsetLeft;
        var targetY = e.pageY - _canvas.offsetTop;
        var dx = targetX - _tank.posX;
        var dy = targetY - _tank.posY;
        
        if(e.button=='0'){
            var msg= new UTankMsg(_tank.user);        
            msg.dx=dx;
            msg.dy=dy;
            _uTankIO.sendMessage('uTank_msg_fire',msg);
            _tank.fire(dx,dy);  
        }
        if(e.button=='2'){                            
            var msg= new UTankMsg(_tank.user);        
            msg.targetX=targetX;
            msg.targetY=targetY;
            var dx = targetX - _tank.posX;
            var dy = targetY - _tank.posY;
            msg.angle = Math.atan2(dy,dx);
            
            _uTankIO.sendMessage('uTank_msg_goto',msg);
            _tank.goTo(targetX,targetY);
        }
    }
}
UGame.prototype.getInstance=function(){
    if(this.instance==null){
        this.instance=new UGame();
    }
    return this.instance;
}