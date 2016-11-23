/**
 * 利用画布可以获取每个像素点的特性
 * 简单封装，将input也传进来其实很牵强。。。
 * 已知bug，不知道是不是我电脑原因，用接近黑色颜色会不显示
 * 思路：获取input中的value，将其绘制在画布上后获取每个像素点的rgba值，然后迅速清空画布，
 *       遍历所有点（点数太多，所以是每隔几个点取其中一个点），
 *       通过判断其中的透明度a值是否大于0判断该像素是否有颜色，
 *       记录所有有颜色点的位置，用自定义的点绘制原来图像，实现粒子化
 *       粒子运动轨迹是在创建时便确定，即x、y每帧的变化量和最终位置
 * 
 *       @param {dom} [cts] [cvs.getcontext2d]
 *       @param {dom} [input] [出发粒子化的button]
 *
 * 可以模拟3D，添加自定义的z轴变量，将z轴的变化量映射到x、y上，可参考大神讲解
 * http://www.cnblogs.com/hongru/archive/2012/03/28/2420415.html
 */


;(function(w){
    function Context(cts,input){
        this.cts=cts;
        this.input=input;
    	this.arr=[];
    	this.width=cts.canvas.width;
    	this.height=cts.canvas.height;
    	this.Cricle=function(x,y,X,Y,tx,ty){
    	    this.x=x;
    	    this.y=y;
    	    this.X=X;
    	    this.Y=Y;
    	    this.flag=true;
    	    this.tx=tx||0;
    	    this.ty=ty||0;
    	};
        this._init();
    }
    Context.prototype={
    	_init:function(){
    		this._goGack();
		    this._draw();
   		},
   		_goGack:function(){
			this.arr=[];
				for(var i=0;i<this.width/2;i++){
			    	var X=Math.floor(Math.random()*this.width);
			        var Y=Math.floor(Math.random()*this.height);
			        var circle=new this.Cricle(0,0,X,Y);
			        this.arr.push(circle);
			    }
   		},
        _draw:function(){
            for(var i=0;i<this.arr.length;i++){
                this.cts.beginPath();
                this.cts.arc(this.arr[i].X,this.arr[i].Y,2,0,2*Math.PI);
                this.cts.fill();
            } 
        },
   		_getText:function(){
            this.cts.clearRect(0, 0, this.width, this.height);
   			var text=this.input.value;
   			this.arr=[];
   			this.cts.textAlign='center';
        	this.cts.textBaseLine='middle';
	        this.cts.fillText(text,this.width/2,this.height/2 );
	        var arr=this.cts.getImageData(0, 0, this.width, this.height);
	        for(var i=0;i<arr.width;i+=6){
	            for(var k=0;k<arr.height;k+=6){
	                if(arr.data[(k*this.width+i)*4]>108){
	                    var X=Math.floor(Math.random()*this.width);
	                    var Y=Math.floor(Math.random()*this.height);
	                    var circle=new this.Cricle(i,k,X,Y);
	                    this.arr.push(circle);
	                }
	            }
        	}

        	this.cts.clearRect(0, 0, this.width, this.height);	
   		},
        _animate:function(){
            for(var i=0;i<this.arr.length;i++){
                    this.cts.beginPath();
                    this.tx=(this.arr[i].X-this.arr[i].x)/10;
                    this.ty=(this.arr[i].Y-this.arr[i].y)/10;
                    this.arr[i].X=this.arr[i].X-this.tx;
                    this.arr[i].Y=this.arr[i].Y-this.ty;
                    this.cts.arc(this.arr[i].X,this.arr[i].Y,2,0,2*Math.PI);
                    this.cts.fill();
                    this.cts.restore();
                    if(Math.abs(this.arr[i].X-this.arr[i].x)<2&&Math.abs(this.arr[i].Y-this.arr[i].y)<1)
                    {
                        this.arr[i].X=this.arr[i].x;
                        this.arr[i].Y=this.arr[i].y;   
                    }else{this.flag=false}
                } 
        },
        _begin:function(){
            this._getText();
            this.cts.clearRect(0, 0, this.width, this.height);
            var self=this;
            var timer=setInterval(function(){
                self.cts.clearRect(0, 0, self.width, self.height);
                self.flag=true;
                self._animate();
                if(self.flag){
                        clearInterval(timer);  
                        self._over.call(self);
                }          
            }, 20)
        },
        _over:function(){
            for(var i=0;i<this.arr.length;i++){
                    var X=Math.floor(Math.random()*this.width);
                    var Y=Math.floor(Math.random()*this.height);
                    this.arr[i].x=X;
                    this.arr[i].y=Y;
                }
            var self=this;
            var timer=null;
            setTimeout(function(){
                timer=setInterval(function(){
                    self.cts.clearRect(0, 0, self.width, self.height);
                    self.flag=true;
                    self._animate();
                    if(self.flag){
                            clearInterval(timer);  
                    }          
                }, 20)
            },2000)  
        }
    } 
    w.Context=Context;
}(window))