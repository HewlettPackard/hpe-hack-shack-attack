/* Credit goes to yoeleven https://github.com/yoeleven/phaser3-gameobject-video/blob/master/main.js */

/* video typedef. */                            
const video_t = function(scene, id, x, y, texture, file, width, height, loop) {
	/* set texture pointer to new canvas. */
	scene.textures.createCanvas(texture, width, height);
	Phaser.GameObjects.Image.call(this, scene, x, y, texture);

	/* gameobject data. */
	this.id = id;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	/* video data. */
	this.loaded = false;
	this.loop = false;
	if (loop)
		this.loop = true;

	/* create video as html5 video element. */
	this.video = document.createElement('video');
	this.video.muted = true;
	this.video.src = file;

	/* laziness - should use .call(this, ...) */
	var _this = this;

	/* hook video event listener into animation. */
	this.video.addEventListener('loadeddata', function() {
		this.play();
		_this.texture.context.drawImage(this, 0, 0);
		_this.texture.refresh();
		_this.loaded=true;
	});
	/* loop by playing on 'end' event listener. */
	if (this.loop) {
		this.video.addEventListener('ended', function() {
			this.play();
		});
	}

  scene.add.existing(this);
	
	return this;
}
video_t.prototype.constructor = video_t;
video_t.prototype = Object.create(Phaser.GameObjects.Image.prototype);

video_t.prototype.update = function() {
	/* phaser's update call. */
	if (this.loaded) {
		this.texture.context.drawImage(this.video, 0, 0);
		/* beware of refresh and issues with overloading the GPU  - need more research here. */
		this.texture.refresh();
		//this.texture.update();
	}
}

export default video_t;