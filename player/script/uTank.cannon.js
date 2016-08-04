//cannon
function Canon(tank,context){
    this.tank=tank;
    this.context=context;
    this.posX=100;
    this.posY=100;
    this.width=33;
    this.length=60;
    this.angle=0;
    this.missiles= new Array();
}
Canon.prototype.draw =function(posX,posY,angle){
    this.posX=posX;
    this.posY=posY;
    //                this.angle=angle+1;
    this.context.save();                          
    this.context.translate(this.posX,this.posY);
    this.context.rotate(this.angle);
	
    this.context.drawImage(_tank_cannon,-18,-16,60,33);
    //                this.desAngle=0;
    /*
    this.context.beginPath();
    this.context.fillStyle = "black";                
    this.context.rect(0,-this.width/2,this.length,this.width);
    this.context.closePath();
    this.context.fill(); 
				
    this.context.beginPath();
    this.context.fillStyle = "black";                
    this.context.rect(this.length-1,-this.width/2-2,7,this.width+4);
    this.context.closePath();
    this.context.fill(); 
                
    //this.context.beginPath();
    //                this.context.fillStyle = "black";
    //              this.context.arc(0,0,14,0,Math.PI*2,true);
    //            this.context.closePath();
    //          this.context.fill();
	  
    this.context.beginPath();
    this.context.fillStyle = "black";                
    this.context.rect(-22/2,-22/2,22,22);
    this.context.closePath();
    this.context.fill(); 
	*/
    this.context.restore();
    
    var missilesCanon=this.missiles;
    for(idx=0;idx<missilesCanon.length;idx++){
        if(missilesCanon[idx].busted()){
            missilesCanon.splice(idx,1);
        }
        else{
            missilesCanon[idx].draw();
        }
    }
}