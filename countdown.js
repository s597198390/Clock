var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 768;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

var curShowTimeSeconds = 0;

var balls = [];
const colors = ["#33B5E5","#0099CC","#AA66CC",
				"#9933CC","#99CC00","#669900",
				"#FFBB33","#FF8800","#FF4444","#CC0000"];

window.onload = function() {

	WINDOW_WIDTH = document.documentElement.clientWidth - 50;
	WINDOW_HEIGHT = document.documentElement.clientHeight - 50;
	MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
	MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);
	RADIUS = Math.round(WINDOW_WIDTH*4 / 5 / 108)-1;

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext("2d");

	canvas.width = WINDOW_WIDTH;
	canvas.height =WINDOW_HEIGHT;

	curShowTimeSeconds = getCurrentShowTimeSeconds();

	
	//动画效果
	setInterval(
		//每一帧需要做的事情
		function(){
			render( context );
			update( );

		},
		//每隔多少时间执行一次函数
		50
	);
	
}

function getCurrentShowTimeSeconds(){

	var curTime = new Date();
	var ret = curTime.getHours()*3600+curTime.getMinutes()*60+curTime.getSeconds();

	return ret;
}

function render( ctx ){
	//清除画布
	ctx.clearRect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT);
	//根据点阵来画出时间,一位数字占15个单位,冒号占9个单位
	
	var hours = parseInt(curShowTimeSeconds/3600);
	var minutes = parseInt((curShowTimeSeconds - hours * 3600)/60);
	var seconds = curShowTimeSeconds % 60;
	//小时
	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) ,ctx);
	renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) ,ctx);
	renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 ,ctx);
	//分钟
	renderDigit( MARGIN_LEFT + 39*(RADIUS+1), MARGIN_TOP , parseInt(minutes/10) ,ctx);
	renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) ,ctx);
	renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , ctx);
	//秒钟
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , ctx);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , ctx);

    //将小球画出来
    for (var i = 0; i < balls.length; i++) {
    	ctx.fillStyle = balls[i].color;

    	ctx.beginPath();
    	ctx.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI );
    	ctx.closePath();

    	ctx.fill();
    }
}

function renderDigit( x, y , num , ctx){

	ctx.fillStyle = "rgb(25,255,153)";
	ctx.shadowBlur = 10;
	ctx.shadowColor = "#e0ca0b"

	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if ( digit[num][i][j] == 1 ) {
				ctx.beginPath();
				ctx.arc( 
					x+j*2*(RADIUS+1)+(RADIUS+1) , 
					y+i*2*(RADIUS+1)+(RADIUS+1) , 
					RADIUS , 0 , 2*Math.PI );
				ctx.closePath();

				ctx.fill();
			}
		}
	}
}

function update(){

	var nextShowTimeSeconds = getCurrentShowTimeSeconds();

	var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 );
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds/3600);
	var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600)/60);
	var curSeconds = curShowTimeSeconds % 60;

    if ( nextSeconds != curSeconds ) {
    	//如果数字发生变化，就添加小球效果
    	if ( parseInt(curHours/10) != parseInt(nextHours/10) ) {
    		addBalls(MARGIN_LEFT , MARGIN_TOP , parseInt(curHours/10));
    	}
    	if ( parseInt(curHours%10) != parseInt(nextHours%10) ) {
    		addBalls(MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP ,parseInt(curHours%10));
    	}
    	if ( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ) {
    		addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
    	}
    	if ( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ) {
    		addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
    	}
    	if ( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ) {
    		addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
    	}
    	if ( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ) {
    		addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
    	}

    	curShowTimeSeconds = nextShowTimeSeconds;
    }

    updateBalls();
}

function addBalls( x , y , num ){
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j< digit[num][i].length ; j++) {
			if( digit[num][i][j] ==1 ){
				var aBall = {
					x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    g:Math.random()*(2-1)+1,
                    vx:Math.pow( -1 , Math.ceil( Math.random()*100 ))*4,
                    vy:-5,
                    color:colors[ Math.floor( Math.random()*colors.length)]
				}

				balls.push( aBall );
			}
		}
	}
}

function updateBalls(){

	for (var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        //碰撞检测
        if ( balls[i].y >= WINDOW_HEIGHT - RADIUS) {
        	 balls[i].y = WINDOW_HEIGHT - RADIUS;
        	 balls[i].vy = -balls[i].vy*0.75;
        }

	}

	//动画效果优化
	var cnt = 0;
	for (var i = 0; i < balls.length; i++) {
		if (balls[i].x+RADIUS>0 && balls[i].x-RADIUS<WINDOW_WIDTH) {
			balls[cnt++] = balls[i];
		}
	}

	while( balls.length > Math.min(300,cnt)){
		balls.pop();
	}
}