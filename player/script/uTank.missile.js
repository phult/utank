//Missile
function Missile(tank,context,posX,posY,angle){
    this.tank=tank;
    this.context=context;
    this.posX=posX;
    this.posY=posY;
    this.width=7;
    this.length=18;
    this.angle=angle;  
    this.speed=2.5;
}
Missile.prototype.explosed=function(){
    
    }
Missile.prototype.busted=function(){
    var retval=false;                    
    for( var idx2=0;idx2<_tanks.length;idx2++){
        if(_tanks[idx2].user!=this.tank.user){
            if((_tanks[idx2]).posX-30<=this.posX &&
                (_tanks[idx2]).posX+30>=this.posX &&
                (_tanks[idx2]).posY-30<=this.posY &&
                (_tanks[idx2]).posY+30>=this.posY){
                (_tanks[idx2]).heath-=1;
                if(_tank==_tanks[idx2] && _tank.heath==0){
                    //i'm die
                    var msg= new UTankMsg(_tank.user);
                    msg.posX=_tank.posX;
                    msg.posY=_tank.posY;
                    _uTankIO.sendMessage('uTank_msg_busted',msg);
                }
                this.context.drawImage(_busted_img,this.posX-50,this.posY-50,100,100);
                _busted_snd.currentTime=0;
                _busted_snd.play();
                retval=true;
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
    return retval;
}

Missile.prototype.draw=function(){
    this.posX+=this.speed*Math.cos(this.angle);
    this.posY+=this.speed*Math.sin(this.angle);   
    this.context.save();                          
    this.context.translate(this.posX,this.posY);
    this.context.rotate(this.angle);                
    //    this.context.beginPath();
    //    this.context.fillStyle = "#fcfdf9";                
    //    this.context.rect(38,-this.width/2,this.length,this.width);
    //    this.context.closePath();
    //    this.context.fill(); 
    this.context.drawImage(_missile,38,-this.width/2,this.length,this.width);
    this.context.restore();
}