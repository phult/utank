
//tank
function Tank(user,context,posX,posY,angle,heath){
    this.user=user;
    this.context=context;
    this.posX=posX;
    this.posY=posY;
    this.width=57;
    this.length=72;
    this.angle=angle;            
    this.canon=new Canon(this,context);
    this.canon.posX=this.posX;
    this.canon.posY=this.posY;
    this.canon.width=6;
    this.canon.length=34;
    this.canon.angle=angle;
    this.canon.desAngle=angle;
    this.desPosX=0;                
    this.desPosY=0;
    this.speed=1;
    this.heath=heath;
}
Tank.prototype.goTo=function(desPosX,desPosY){
    var dx = desPosX - this.posX;
    var dy = desPosY - this.posY;
    this.canon.angle+=(Math.atan2(dy,dx)-this.angle);
    this.angle = Math.atan2(dy,dx);
                
    this.desPosX=desPosX;                
    this.desPosY=desPosY;
}
Tank.prototype.move=function(){
    if((this.desPosX ==0 && this.desPosY ==0) ||(this.posX-10<=this.desPosX && this.posX+10>=this.desPosX &&
        this.posY-10<=this.desPosY && this.posY+10>=this.desPosY)){
        _tank_run_snd.currentTime=0;
        _tank_run_snd.pause();
    }else{
        if(this.posX!=this.desPosX && this.posY!=this.desPosY){
            this.posX+=this.speed*Math.cos(this.angle);
            this.posY+=this.speed*Math.sin(this.angle);   
            //                        if(_tank_run_snd.currentTime==0 || (_tank_run_snd.currentTime>=_tank_run_snd.duration-4)){
            _tank_run_snd.currentTime=1;
            _tank_run_snd.play();                            
        //                        }                        
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
    this.context.drawImage(_tank_body,-this.length/2,-this.width/2,this.length,this.width);		   
    this.context.font="12px Arial";
    this.context.fillStyle = "blue"; 
    this.context.strokeText(this.user,-10,40);
    
    this.context.restore();        
    this.canon.draw(this.posX,this.posY,this.angle);
    if(this.heath<=0){
        this.context.drawImage(_busted_img,this.posX-20,this.posY-20,40,40);
    }
}  
Tank.prototype.fire=function(posX,posY){     
    var angle=Math.atan2(posY,posX);
    _tank_fire_snd.currentTime=0;
    _tank_fire_snd.play();
    this.canon.angle=angle;    
    var missile=new Missile(this,this.canon.context,this.canon.posX,this.canon.posY,angle);
    this.canon.missiles.push(missile);
//                this.canon.draw(angle);
}