requestAnimationFrame(step);
function step(){
	loop();
	requestAnimationFrame(step);
}


var pos = {}; //记录画笔位置
var next_pos = {}; //记录下一点画笔位置
var isDown = false; //是否按下
var isMove = false; //是否move
var DEFAULT_BRUSH_SIZE = 4; //设置默认的画笔大小
var DEFAULT_BRUSH_COLOR = "#000"; //画笔颜色

var ctx_draw = $("#draw")[0].getContext('2d');

var minX=0,minY=0,maxX=0,maxY=0;
$("#draw").on("touchstart", function(e) {	
	e.preventDefault();
	isDown = true;
	e = e.changedTouches[0];
	console.log(e);
	pos.x = e.pageX - $("#draw").offset().left;
	pos.y = e.pageY - $("#draw").offset().top;
	if(minX==0){
		minX = pos.x;
	}else{
		minX = minX>pos.x?pos.x:minX;
	}

	if(maxX==0){
		maxX =pos.x;
	}else{
		maxX = maxX<pos.x?pos.x:maxX;
	}
	
	if(minY==0){
		minY = pos.y;
	}else{
		minY = minY>pos.y?pos.y:minY;
	}

	if(maxY = 0){
		maxY = pos.y;
	}else{
		maxY = maxY<pos.y?pos.y:maxY;
	}
	
}).on("touchmove", function(e){
	e.preventDefault();
	isMove = true;
	e = e.changedTouches[0];
	pos.x = e.pageX - $("#draw").offset().left;
	pos.y = e.pageY - $("#draw").offset().top;
	minX = minX>pos.x?pos.x:minX;
	maxX = maxX<pos.x?pos.x:maxX;

	minY = minY>pos.y?pos.y:minY;
	maxY = maxY<pos.y?pos.y:maxY;

	if (isDown) draw(ctx_draw);
}).on("touchend", function(e) {
	e.preventDefault();
	isDown = false;
	e = e.changedTouches[0];
	if (!isMove) {
		pos.x = e.pageX - $("#draw").offset().left;
		pos.y = e.pageY - $("#draw").offset().top;
		next_pos = pos;
		draw(ctx_draw);
	}
	pos = {};
	next_pos = {};
	isMove = false;
});

function loop() {
	update(pos);
}

function update(up_point) {
	next_pos.x = up_point.x;
	next_pos.y = up_point.y;
}
var hasDraw = false;

function draw(ctx) {
	ctx.save();
	ctx.fillStyle = DEFAULT_BRUSH_COLOR;
	ctx.lineWidth = DEFAULT_BRUSH_SIZE;
	ctx.lineCap = "round"; 
	ctx.beginPath();
	if (pos.x == next_pos.x && pos.y == next_pos.y) {
		ctx.arc(pos.x, pos.y, DEFAULT_BRUSH_SIZE / 1.7, 0, Math.PI * 2, true);
		ctx.fill();
	} else {
		ctx.moveTo(pos.x, pos.y);
		ctx.lineTo(next_pos.x, next_pos.y);
		ctx.stroke();
	}
	hasDraw = true;
	ctx.restore(); 

}

function drawImg(ctx, src, x, y, width, height, callback){
	var img = new Image();
	img.onload = function() {
		ctx.drawImage(img, x, y, width, height);
		if (typeof callback !== "undefined") {
			callback();
		}
	}
	img.src = src;
}

$('#btn').click(function(){
	var canvas = document.createElement('canvas');
    var w = canvas.width = maxX-minX+DEFAULT_BRUSH_SIZE;
    var h = canvas.height = maxY-minY+DEFAULT_BRUSH_SIZE;
    var ctx = canvas.getContext('2d');
    ctx.drawImage($('#draw')[0],minX-DEFAULT_BRUSH_SIZE/2,minY-DEFAULT_BRUSH_SIZE/2,w,h,0,0,w,h);
    $('img').attr("src",canvas.toDataURL('image/png',0.7));
});
