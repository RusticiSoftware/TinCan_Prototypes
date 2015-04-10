/*
 * PROJECT:  JsTetris
 * VERSION:  1.19
 * LICENSE:  BSD (revised)
 * AUTHOR:  (c) 2004-2009 Cezary Tomczak
 * LINK:  http://www.gosu.pl/tetris/
 *
 * This script can be used freely as long as all
 * copyright messages are intact.
 */

/**
 * Tetris Game
 * Initializes the buttons automatically, no additional actions required
 *
 * Score:
 * 1) puzzle speed = 80+700/level
 * 2) if puzzles created in current level >= 10+level*2 then increase level
 * 3) after puzzle falling score is increased by 1000*level*linesRemoved
 * 4) each down action increases score by 5+level
 *
 * API:
 *
 * public - method can be called outside of the object
 * event - method is used as event, "this" refers to html object, "self" refers to javascript object
 *
 * class Tetris
 * ------------
 * public event void start()
 * public event void reset()
 * public event void pause()
 * public event void gameOver()
 * public event void up()
 * public event void down()
 * public event void left()
 * public event void right()
 * public event void space()
 *
 * class Window
 * ------------
 * event void activate()
 * event void close()
 * public bool isActive()
 *
 * class Keyboard
 * --------------
 * public void set(int key, function func)
 * event void event(object e)
 *
 * class Stats
 * -----------
 * public void start()
 * public void stop()
 * public void reset()
 * public event void incTime()
 * public void setScore(int i)
 * public void setLevel(int i)
 * public void setLines(int i)
 * public void setPuzzles(int i)
 * public void setActions(int i)
 * public int getScore()
 * public int getLevel()
 * public int getLines()
 * public int getPuzzles()
 * public int getActions()
 *
 * class Area
 * ----------
 * public Constructor(int unit, int x, int y, string id)
 * public void destroy()
 * public int removeFullLines()
 * public bool isLineFull(int y)
 * public void removeLine(int y)
 * public mixed getBlock(int y, int x)
 * public void addElement(htmlObject el)
 *
 * class Puzzle
 * ------------
 * public Constructor(object area)
 * public void reset()
 * public bool isRunning()
 * public bool isStopped()
 * public int getX()
 * public int getY()
 * public bool mayPlace()
 * public void place()
 * public void destroy()
 * private array createEmptyPuzzle(int y, int x)
 * event void fallDown()
 * public event void forceMoveDown()
 * public void stop()
 * public bool mayRotate()
 * public void rotate()
 * public bool mayMoveDown()
 * public void moveDown()
 * public bool mayMoveLeft()
 * public void moveLeft()
 * public bool mayMoveRight()
 * public void moveRight()
 *
 * class Highscores
 * ----------------
 * public Constructor(maxscores)
 * public void load()
 * public void save()
 * public bool mayAdd(int score)
 * public void add(string name, int score)
 * public array getScores()
 * public string toHtml()
 * private void sort()
 *
 * class Cookie
 * ------------
 * public string get(string name)
 * public void set(string name, string value, int seconds, string path, string domain, bool secure)
 * public void del(string name)
 *
 * TODO:
 * document.getElementById("tetris-nextpuzzle") cache ?
 *
 */
function Tetris()
{
	var self = this;

	this.stats = new Stats();
	this.puzzle = null;
	this.area = null;

	this.unit  = 20; // unit = x pixels
	this.areaX = 20; // area width = x units
	this.areaY = 20; // area height = y units

	this.highscores = new Highscores(10);
	this.paused = false;

	/**
	 * @return void
	 * @access public event
	 */
	this.start = function()
	{
		if (self.puzzle && !confirm('Are you sure you want to start a new game ?')) return;
		
		tc_sendStatement_StartNewGame();
		
		self.reset();
		self.stats.start();
		document.getElementById("tetris-nextpuzzle").style.display = "block";
		document.getElementById("tetris-keys").style.display = "none";
		self.area = new Area(self.unit, self.areaX, self.areaY, "tetris-area");
		self.puzzle = new Puzzle(self, self.area);
		if (self.puzzle.mayPlace()) {
			self.puzzle.place();
		} else {
			self.gameOver();
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.reset = function()
	{
		if (self.puzzle) {
			self.puzzle.destroy();
			self.puzzle = null;
		}
		if (self.area) {
			self.area.destroy();
			self.area = null;
		}
		document.getElementById("tetris-gameover").style.display = "none";
		document.getElementById("tetris-nextpuzzle").style.display = "none";
		document.getElementById("tetris-keys").style.display = "block";
		self.stats.reset();
		self.paused = false;
		document.getElementById('tetris-pause').style.display = 'block';
		document.getElementById('tetris-resume').style.display = 'none';
	};

	/**
	 * Pause / Resume.
	 * @return void
	 * @access public event
	 */
	this.pause = function()
	{
		if (self.puzzle == null) return;
		if (self.paused) {
			self.puzzle.running = true;
			self.puzzle.fallDownID = setTimeout(self.puzzle.fallDown, self.puzzle.speed);
			document.getElementById('tetris-pause').style.display = 'block';
			document.getElementById('tetris-resume').style.display = 'none';
			self.stats.timerId = setInterval(self.stats.incTime, 1000);
			self.paused = false;
		} else {
			if (!self.puzzle.isRunning()) return;
			if (self.puzzle.fallDownID) clearTimeout(self.puzzle.fallDownID);
			document.getElementById('tetris-pause').style.display = 'none';
			document.getElementById('tetris-resume').style.display = 'block';
			clearTimeout(self.stats.timerId);
			self.paused = true;
			self.puzzle.running = false;
		}
	};

	/**
	 * End game.
	 * Stop stats, ...
	 * @return void
	 * @access public event
	 */
	this.gameOver = function()
	{
		self.stats.stop();
		self.puzzle.stop();
		
		tc_sendStatement_EndGame(this.stats.getLevel(),this.stats.time,this.stats.apm,this.stats.getLines(),this.stats.getScore());
		
		document.getElementById("tetris-nextpuzzle").style.display = "none";
		document.getElementById("tetris-gameover").style.display = "block";
		/*if (this.highscores.mayAdd(this.stats.getScore())) {
			var name;
			if (actorName != ""){
				name = actorName;
			} else {
				name = prompt("Game Over !\nEnter your name:", "");
			}
			
			if (name && name.trim().length) {
				this.highscores.add(name, this.stats.getScore());
			}
		}*/
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.up = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped()) {
			if (self.puzzle.mayRotate()) {
				self.puzzle.rotate();
				self.stats.setActions(self.stats.getActions() + 1);
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.down = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped()) {
			if (self.puzzle.mayMoveDown()) {
				self.stats.setScore(self.stats.getScore() + 5 + self.stats.getLevel());
				self.puzzle.moveDown();
				self.stats.setActions(self.stats.getActions() + 1);
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.left = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped()) {
			if (self.puzzle.mayMoveLeft()) {
				self.puzzle.moveLeft();
				self.stats.setActions(self.stats.getActions() + 1);
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.right = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped()) {
			if (self.puzzle.mayMoveRight()) {
				self.puzzle.moveRight();
				self.stats.setActions(self.stats.getActions() + 1);
			}
		}
	};

	/**
	 * @return void
	 * @access public event
	 */
	this.space = function()
	{
		if (self.puzzle && self.puzzle.isRunning() && !self.puzzle.isStopped()) {
			self.puzzle.stop();
			self.puzzle.forceMoveDown();
		}
	};

	// windows
	var helpwindow = new Window("tetris-help");
	var highscores = new Window("tetris-highscores");

	// game menu
	document.getElementById("tetris-menu-start").onclick = function() { helpwindow.close(); highscores.close(); self.start(); this.blur(); };

	// document.getElementById("tetris-menu-reset").onclick = function() { helpwindow.close(); highscores.close(); self.reset(); this.blur(); };

	document.getElementById("tetris-menu-pause").onclick = function() { self.pause(); this.blur(); };
	document.getElementById("tetris-menu-resume").onclick = function() { self.pause(); this.blur(); };

	// help
	document.getElementById("tetris-menu-help").onclick = function() { highscores.close(); helpwindow.activate(); this.blur(); };
	document.getElementById("tetris-help-close").onclick = helpwindow.close;

	// highscores
	document.getElementById("tetris-menu-highscores").onclick = function()
	{
		helpwindow.close();
		document.getElementById("tetris-highscores-content").innerHTML = self.highscores.toHtml();
		highscores.activate();
		this.blur();
	};
	document.getElementById("tetris-highscores-close").onclick = highscores.close;

	// keyboard - buttons
	//document.getElementById("tetris-keyboard-up").onclick = function() { self.up(); this.blur(); };
	//document.getElementById("tetris-keyboard-down").onclick = function() { self.down(); this.blur(); };
	//document.getElementById("tetris-keyboard-left").onclick = function () { self.left(); this.blur(); };
	//document.getElementById("tetris-keyboard-right").onclick = function() { self.right(); this.blur(); };

	// keyboard
	var keyboard = new Keyboard();
	//keyboard.set(keyboard.n, this.start);
	//keyboard.set(keyboard.r, this.reset);
	//keyboard.set(keyboard.p, this.pause);
	keyboard.set(keyboard.up, this.up);
	keyboard.set(keyboard.down, this.down);
	keyboard.set(keyboard.left, this.left);
	keyboard.set(keyboard.right, this.right);
	keyboard.set(keyboard.space, this.space);
	document.onkeydown = keyboard.event;

	/**
	 * Window replaces game area, for example help window
	 * @param string id
	 */
	function Window(id)
	{
		this.id = id;
		this.el = document.getElementById(this.id);
		var self = this;

		/**
		 * Activate or deactivate a window - update html
		 * @return void
		 * @access event
		 */
		this.activate = function()
		{
			self.el.style.display = (self.el.style.display == "block" ? "none" : "block");
		};

		/**
		 * Close window - update html
		 * @return void
		 * @access event
		 */
		this.close = function()
		{
			self.el.style.display = "none";
		};

		/**
		 * @return bool
		 * @access public
		 */
		this.isActive = function()
		{
			return (self.el.style.display == "block");
		};
	}

	/**
	 * Assigning functions to keyboard events
	 * When key is pressed, searching in a table if any function has been assigned to this key, execute the function.
	 */
	function Keyboard()
	{
		this.up = 38;
		this.down = 40;
		this.left = 37;
		this.right = 39;
		this.n = 78;
		this.p = 80;
		this.r = 82;
		this.space = 32;
		this.f12 = 123;
		this.escape = 27;

		this.keys = [];
		this.funcs = [];

		var self = this;

		/**
		 * @param int key
		 * @param function func
		 * @return void
		 * @access public
		 */
		this.set = function(key, func)
		{
			this.keys.push(key);
			this.funcs.push(func);
		};

		/**
		 * @param object e
		 * @return void
		 * @access event
		 */
		this.event = function(e)
		{
			if (!e) { e = window.event; }
			for (var i = 0; i < self.keys.length; i++) {
				if (e.keyCode == self.keys[i]) {
					self.funcs[i]();
				}
			}
		};
	}

	/**
	 * Live game statistics
	 * Updating html
	 */
	function Stats()
	{
		this.level;
		this.time;
		this.apm;
		this.lines;
		this.score;
		this.puzzles; // number of puzzles created on current level

		this.actions;

		this.el = {
			"level": document.getElementById("tetris-stats-level"),
			"time":  document.getElementById("tetris-stats-time"),
			"apm":  document.getElementById("tetris-stats-apm"),
			"lines": document.getElementById("tetris-stats-lines"),
			"score": document.getElementById("tetris-stats-score")
		}

		this.timerId = null;
		var self = this;

		/**
		 * Start counting statistics, reset stats, turn on the timer
		 * @return void
		 * @access public
		 */
		this.start = function()
		{
			this.reset();
			this.timerId = setInterval(this.incTime, 1000);
		};

		/**
		 * Stop counting statistics, turn off the timer
		 * @return void
		 * @access public
		 */
		this.stop = function()
		{
			if (this.timerId) {
				clearInterval(this.timerId);
			}
		};

		/**
		 * Reset statistics - update html
		 * @return void
		 * @access public
		 */
		this.reset = function()
		{
			this.stop();
			this.level = 1;
			this.time  = 0;
			this.apm   = 0;
			this.lines = 0;
			this.score = 0;
			this.puzzles = 0;
			this.actions = 0;
			this.el.level.innerHTML = this.level;
			this.el.time.innerHTML = this.time;
			this.el.apm.innerHTML = this.apm;
			this.el.lines.innerHTML = this.lines;
			this.el.score.innerHTML = this.score;
		};

		/**
		 * Increase time, update apm - update html
		 * This func is called by setInterval()
		 * @return void
		 * @access public event
		 */
		this.incTime = function()
		{
			self.time++;
			self.el.time.innerHTML = self.time;
			self.apm = parseInt((self.actions / self.time) * 60);
			self.el.apm.innerHTML = self.apm;
		};

		/**
		 * Set score - update html
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setScore = function(i)
		{
			this.score = i;
			this.el.score.innerHTML = this.score;
		};

		/**
		 * Set level - update html
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setLevel = function(i)
		{
			this.level = i;
			this.el.level.innerHTML = this.level;
			
		};

		/**
		 * Set lines - update html
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setLines = function(i)
		{
			this.lines = i;
			this.el.lines.innerHTML = this.lines;
		};

		/**
		 * Number of puzzles created on current level
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setPuzzles = function(i)
		{
			this.puzzles = i;
		};

		/**
		 * @param int i
		 * @return void
		 * @access public
		 */
		this.setActions = function(i)
		{
			this.actions = i;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getScore = function()
		{
			return this.score;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getLevel = function()
		{
			return this.level;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getLines = function()
		{
			return this.lines;
		};

		/**
		 * Number of puzzles created on current level
		 * @return int
		 * @access public
		 */
		this.getPuzzles = function()
		{
			return this.puzzles;
		};

		/**
		 * @return int
		 * @access public
		 */
		this.getActions = function()
		{
			return this.actions;
		};
	}

	/**
	 * Area consists of blocks (2 dimensional board).
	 * Block contains "0" (if empty) or Html Object.
	 * @param int x
	 * @param int y
	 * @param string id
	 */
	function Area(unit, x, y, id)
	{
		this.unit = unit;
		this.x = x;
		this.y = y;
		this.el = document.getElementById(id);

		this.board = [];

		// create 2-dimensional board
		for (var y = 0; y < this.y; y++) {
			this.board.push(new Array());
			for (var x = 0; x < this.x; x++) {
				this.board[y].push(0);
			}
		}

		/**
		 * Removing html elements from area.
		 * @return void
		 * @access public
		 */
		this.destroy = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						this.el.removeChild(this.board[y][x]);
						this.board[y][x] = 0;
					}
				}
			}
		};

		/**
		 * Searching for full lines.
		 * Must go from the bottom of area to the top.
		 * Returns the number of lines removed - needed for Stats.score.
		 * @see isLineFull() removeLine()
		 * @return void
		 * @access public
		 */
		this.removeFullLines = function()
		{
			var lines = 0;
			for (var y = this.y - 1; y > 0; y--) {
				if (this.isLineFull(y)) {
					this.removeLine(y);
					lines++;
					y++;
				}
			}
			return lines;
		};

		/**
		 * @param int y
		 * @return bool
		 * @access public
		 */
		this.isLineFull = function(y)
		{
			for (var x = 0; x < this.x; x++) {
				if (!this.board[y][x]) { return false; }
			}
			return true;
		};

		/**
		 * Remove given line
		 * Remove html objects
		 * All lines that are above given line move down by 1 unit
		 * @param int y
		 * @return void
		 * @access public
		 */
		this.removeLine = function(y)
		{
			for (var x = 0; x < this.x; x++) {
				this.el.removeChild(this.board[y][x]);
				this.board[y][x] = 0;
			}
			y--;
			for (; y > 0; y--) {
				for (var x = 0; x < this.x; x++) {
					if (this.board[y][x]) {
						var el = this.board[y][x];
						el.style.top = el.offsetTop + this.unit + "px";
						this.board[y+1][x] = el;
						this.board[y][x] = 0;
					}
				}
			}
		};

		/**
		 * @param int y
		 * @param int x
		 * @return mixed 0 or Html Object
		 * @access public
		 */
		this.getBlock = function(y, x)
		{
			if (y < 0) { return 0; }
			if (y < this.y && x < this.x) {
				return this.board[y][x];
			} else {
				throw "Area.getBlock("+y+", "+x+") failed";
			}
		};

		/**
		 * Add Html Element to the area.
		 * Find (x,y) position using offsetTop and offsetLeft
		 * @param object el
		 * @return void
		 * @access public
		 */
		this.addElement = function(el)
		{
			var x = parseInt(el.offsetLeft / this.unit);
			var y = parseInt(el.offsetTop / this.unit);
			if (y >= 0 && y < this.y && x >= 0 && x < this.x) {
				this.board[y][x] = el;
			} else {
				// not always an error ..
			}
		};
	}

	/**
	 * Puzzle consists of blocks.
	 * Each puzzle after rotating 4 times, returns to its primitive position.
	 */
	function Puzzle(tetris, area)
	{
		var self = this;
		this.tetris = tetris;
		this.area = area;

		// timeout ids
		this.fallDownID = null;
		this.forceMoveDownID = null;

		this.type = null; // 0..6
		this.nextType = null; // next puzzle
		this.position = null; // 0..3
		this.speed = null;
		this.running = null;
		this.stopped = null;

		this.board = []; // filled with html elements after placing on area
		this.elements = [];
		this.nextElements = []; // next board elements

		// (x,y) position of the puzzle (top-left)
		this.x = null;
		this.y = null;

		// width & height must be the same
		this.puzzles = [
			[
				[0,0,1],
				[1,1,1],
				[0,0,0]
			],
			[
				[1,0,0],
				[1,1,1],
				[0,0,0]
			],
			[
				[0,1,1],
				[1,1,0],
				[0,0,0]
			],
			[
				[1,1,0],
				[0,1,1],
				[0,0,0]
			],
			[
				[0,1,0],
				[1,1,1],
				[0,0,0]
			],
			[
				[1,1],
				[1,1]
			],
			[
				[0,0,0,0],
				[1,1,1,1],
				[0,0,0,0],
				[0,0,0,0]
			]
		];

		/**
		 * Reset puzzle. It does not destroy html elements in this.board.
		 * @return void
		 * @access public
		 */
		this.reset = function()
		{
			if (this.fallDownID) {
				clearTimeout(this.fallDownID);
			}
			if (this.forceMoveDownID) {
				clearTimeout(this.forceMoveDownID);
			}
			this.type = this.nextType;
			this.nextType = random(this.puzzles.length);
			this.position = 0;
			this.speed = 80 + (700 / this.tetris.stats.getLevel());
			this.running = false;
			this.stopped = false;
			this.board = [];
			this.elements = [];
			for (var i = 0; i < this.nextElements.length; i++) {
				document.getElementById("tetris-nextpuzzle").removeChild(this.nextElements[i]);
			}
			this.nextElements = [];
			this.x = null;
			this.y = null;
		};

		this.nextType = random(this.puzzles.length);
		this.reset();

		/**
		 * Check whether puzzle is running.
		 * @return bool
		 * @access public
		 */
		this.isRunning = function()
		{
			return this.running;
		};

		/**
		 * Check whether puzzle has been stopped by user. It happens when user clicks
		 * "down" when puzzle is already at the bottom of area. The puzzle may still
		 * be running with event fallDown(). When puzzle is stopped, no actions will be
		 * performed when user press a key.
		 * @return bool
		 * @access public
		 */
		this.isStopped = function()
		{
			return this.stopped;
		};

		/**
		 * Get X position of puzzle (top-left)
		 * @return int
		 * @access public
		 */
		this.getX = function()
		{
			return this.x;
		};

		/**
		 * Get Y position of puzzle (top-left)
		 * @return int
		 * @access public
		 */
		this.getY = function()
		{
			return this.y;
		};

		/**
		 * Check whether new puzzle may be placed on the area.
		 * Find (x,y) in area where beginning of the puzzle will be placed.
		 * Check if first puzzle line (checking from the bottom) can be placed on the area.
		 * @return bool
		 * @access public
		 */
		this.mayPlace = function()
		{
			var puzzle = this.puzzles[this.type];
			var areaStartX = parseInt((this.area.x - puzzle[0].length) / 2);
			var areaStartY = 1;
			var lineFound = false;
			var lines = 0;
			for (var y = puzzle.length - 1; y >= 0; y--) {
				for (var x = 0; x < puzzle[y].length; x++) {
					if (puzzle[y][x]) {
						lineFound = true;
						if (this.area.getBlock(areaStartY, areaStartX + x)) { return false; }
					}
				}
				if (lineFound) {
					lines++;
				}
				if (areaStartY - lines < 0) {
					break;
				}
			}
			return true;
		};

		/**
		 * Create empty board, create blocks in area - html objects, update puzzle board.
		 * Check puzzles on current level, increase level if needed.
		 * @return void
		 * @access public
		 */
		this.place = function()
		{
			// stats
			this.tetris.stats.setPuzzles(this.tetris.stats.getPuzzles() + 1);
			if (this.tetris.stats.getPuzzles() >= (10 + this.tetris.stats.getLevel() * 2)) {
				
				tc_sendStatement_FinishLevel(this.tetris.stats.getLevel(),this.tetris.stats.time,this.tetris.stats.apm,this.tetris.stats.getLines(),this.tetris.stats.getScore());
				
				this.tetris.stats.setLevel(this.tetris.stats.getLevel() + 1);
				this.tetris.stats.setPuzzles(0);
			}
			// init
			var puzzle = this.puzzles[this.type];
			var areaStartX = parseInt((this.area.x - puzzle[0].length) / 2);
			var areaStartY = 1;
			var lineFound = false;
			var lines = 0;
			this.x = areaStartX;
			this.y = 1;
			this.board = this.createEmptyPuzzle(puzzle.length, puzzle[0].length);
			// create puzzle
			for (var y = puzzle.length - 1; y >= 0; y--) {
				for (var x = 0; x < puzzle[y].length; x++) {
					if (puzzle[y][x]) {
						lineFound = true;
						var el = document.createElement("div");
						el.className = "block" + this.type;
						el.style.left = (areaStartX + x) * this.area.unit + "px";
						el.style.top = (areaStartY - lines) * this.area.unit + "px";
						this.area.el.appendChild(el);
						this.board[y][x] = el;
						this.elements.push(el);
					}
				}
				if (lines) {
					this.y--;
				}
				if (lineFound) {
					lines++;
				}
			}
			this.running = true;
			this.fallDownID = setTimeout(this.fallDown, this.speed);
			// next puzzle
			var nextPuzzle = this.puzzles[this.nextType];
			for (var y = 0; y < nextPuzzle.length; y++) {
				for (var x = 0; x < nextPuzzle[y].length; x++) {
					if (nextPuzzle[y][x]) {
						var el = document.createElement("div");
						el.className = "block" + this.nextType;
						el.style.left = (x * this.area.unit) + "px";
						el.style.top = (y * this.area.unit) + "px";
						document.getElementById("tetris-nextpuzzle").appendChild(el);
						this.nextElements.push(el);
					}
				}
			}
		};

		/**
		 * Remove puzzle from the area.
		 * Clean some other stuff, see reset()
		 * @return void
		 * @access public
		 */
		this.destroy = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.area.el.removeChild(this.elements[i]);
			}
			this.elements = [];
			this.board = [];
			this.reset();
		};

		/**
		 * @param int y
		 * @param int x
		 * @return array
		 * @access private
		 */
		this.createEmptyPuzzle = function(y, x)
		{
			var puzzle = [];
			for (var y2 = 0; y2 < y; y2++) {
				puzzle.push(new Array());
				for (var x2 = 0; x2 < x; x2++) {
					puzzle[y2].push(0);
				}
			}
			return puzzle;
		};

		/**
		 * Puzzle fall from the top to the bottom.
		 * After placing a puzzle, this event will be called as long as the puzzle is running.
		 * @see place() stop()
		 * @return void
		 * @access event
		 */
		this.fallDown = function()
		{
			if (self.isRunning()) {
				if (self.mayMoveDown()) {
					self.moveDown();
					self.fallDownID = setTimeout(self.fallDown, self.speed);
				} else {
					// move blocks into area board
					for (var i = 0; i < self.elements.length; i++) {
						self.area.addElement(self.elements[i]);
					}
					// stats
					var lines = self.area.removeFullLines();
					if (lines) {
						self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
						self.tetris.stats.setScore(self.tetris.stats.getScore() + (1000 * self.tetris.stats.getLevel() * lines));
					}
					// reset puzzle
					self.reset();
					if (self.mayPlace()) {
						self.place();
					} else {
						self.tetris.gameOver();
					}
				}
			}
		};

		/**
		 * After clicking "space" the puzzle is forced to move down, no user action is performed after
		 * this event is called. this.running must be set to false. This func is similiar to fallDown()
		 * Also update score & actions - like Tetris.down()
		 * @see fallDown()
		 * @return void
		 * @access public event
		 */
		this.forceMoveDown = function()
		{
			if (!self.isRunning() && !self.isStopped()) {
				if (self.mayMoveDown()) {
					// stats: score, actions
					self.tetris.stats.setScore(self.tetris.stats.getScore() + 5 + self.tetris.stats.getLevel());
					self.tetris.stats.setActions(self.tetris.stats.getActions() + 1);
					self.moveDown();
					self.forceMoveDownID = setTimeout(self.forceMoveDown, 30);
				} else {
					// move blocks into area board
					for (var i = 0; i < self.elements.length; i++) {
						self.area.addElement(self.elements[i]);
					}
					// stats: lines
					var lines = self.area.removeFullLines();
					if (lines) {
						self.tetris.stats.setLines(self.tetris.stats.getLines() + lines);
						self.tetris.stats.setScore(self.tetris.stats.getScore() + (1000 * self.tetris.stats.getLevel() * lines));
					}
					// reset puzzle
					self.reset();
					if (self.mayPlace()) {
						self.place();
					} else {
						self.tetris.gameOver();
					}
				}
			}
		};

		/**
		 * Stop the puzzle falling
		 * @return void
		 * @access public
		 */
		this.stop = function()
		{
			this.running = false;
		};

		/**
		 * Check whether puzzle may be rotated.
		 * Check down, left, right, rotate
		 * @return bool
		 * @access public
		 */
		this.mayRotate = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						var newY = this.getY() + this.board.length - 1 - x;
						var newX = this.getX() + y;
						if (newY >= this.area.y) { return false; }
						if (newX < 0) { return false; }
						if (newX >= this.area.x) { return false; }
						if (this.area.getBlock(newY, newX)) { return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Rotate the puzzle to the left.
		 * @return void
		 * @access public
		 */
		this.rotate = function()
		{
			var puzzle = this.createEmptyPuzzle(this.board.length, this.board[0].length);
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						var newY = puzzle.length - 1 - x;
						var newX = y;
						var el = this.board[y][x];
						var moveY = newY - y;
						var moveX = newX - x;
						el.style.left = el.offsetLeft + (moveX * this.area.unit) + "px";
						el.style.top = el.offsetTop + (moveY * this.area.unit) + "px";
						puzzle[newY][newX] = el;
					}
				}
			}
			this.board = puzzle;
		};

		/**
		 * Check whether puzzle may be moved down.
		 * - is any other puzzle on the way ?
		 * - is it end of the area ?
		 * If false, then true is assigned to variable this.stopped - no user actions will be performed to this puzzle,
		 * so this func should be used carefully, only in Tetris.down() and Tetris.puzzle.fallDown()
		 * @return bool
		 * @access public
		 */
		this.mayMoveDown = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						if (this.getY() + y + 1 >= this.area.y) { this.stopped = true; return false; }
						if (this.area.getBlock(this.getY() + y + 1, this.getX() + x)) { this.stopped = true; return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Move the puzzle down by 1 unit.
		 * @return void
		 * @access public
		 */
		this.moveDown = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].style.top = this.elements[i].offsetTop + this.area.unit + "px";
			}
			this.y++;
		};

		/**
		 * Check whether puzzle may be moved left.
		 * - is any other puzzle on the way ?
		 * - is the end of the area
		 * @return bool
		 * @access public
		 */
		this.mayMoveLeft = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						if (this.getX() + x - 1 < 0) { return false; }
						if (this.area.getBlock(this.getY() + y, this.getX() + x - 1)) { return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Move the puzzle left by 1 unit
		 * @return void
		 * @access public
		 */
		this.moveLeft = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].style.left = this.elements[i].offsetLeft - this.area.unit + "px";
			}
			this.x--;
		};

		/**
		 * Check whether puzle may be moved right.
		 * - is any other puzzle on the way ?
		 * - is the end of the area
		 * @return bool
		 * @access public
		 */
		this.mayMoveRight = function()
		{
			for (var y = 0; y < this.board.length; y++) {
				for (var x = 0; x < this.board[y].length; x++) {
					if (this.board[y][x]) {
						if (this.getX() + x + 1 >= this.area.x) { return false; }
						if (this.area.getBlock(this.getY() + y, this.getX() + x + 1)) { return false; }
					}
				}
			}
			return true;
		};

		/**
		 * Move the puzzle right by 1 unit.
		 * @return void
		 * @access public
		 */
		this.moveRight = function()
		{
			for (var i = 0; i < this.elements.length; i++) {
				this.elements[i].style.left = this.elements[i].offsetLeft + this.area.unit + "px";
			}
			this.x++;
		};
	}

	/**
	 * Generates random number that is >= 0 and < i
	 * @return int
	 * @access private
	 */
	function random(i)
	{
		return Math.floor(Math.random() * i);
	}

	/**
	 * Store highscores in cookie.
	 */
	function Highscores(maxscores)
	{
		/**
		 * All highscores returned in html friendly format.
		 * @return string
		 * @access public
		 */
		this.toHtml = function()
		{
			tc_InitHighScoresObject();
			
			
			var s = '<table cellspacing="0" cellpadding="2"><tr><th></th><th>Name</th><th>Score</th></tr>';
			for (var i = 0; i < HighScoresArray.length; ++i) {
				s += '<tr><td>?.</td><td>?</td><td>?</td></tr>'.format(i+1, (typeof HighScoresArray[i].actor !== "undefined" ? HighScoresArray[i].actor.name : ""), HighScoresArray[i].score);
			}
			s += '</table>';
			return s;
		};

		
	}

	/**
	 * Managing cookies.
	 */
	function Cookie()
	{
		/**
		 * @param string name
		 * @return string
		 * @access public
		 */
		this.get = function(name)
		{
			var cookies = document.cookie.split(";");
			for (var i = 0; i < cookies.length; ++i) {
				var a = cookies[i].split("=");
				if (a.length == 2) {
					a[0] = a[0].trim();
					a[1] = a[1].trim();
					if (a[0] == name) {
						return unescape(a[1]);
					}
				}
			}
			return "";
		};

		/**
		 * @param string name
		 * @param string value (do not use special chars like ";" "=")
		 * @param int seconds
		 * @param string path
		 * @param string domain
		 * @param bool secure
		 * @return void
		 * @access public
		 */
		this.set = function(name, value, seconds, path, domain, secure)
		{
			this.del(name);
			if (!path) path = '/';

			var cookie = (name + "=" + escape(value));
			if (seconds) {
				var date = new Date(new Date().getTime()+seconds*1000);
				cookie += ("; expires="+date.toGMTString());
			}
			cookie += (path    ? "; path="+path : "");
			cookie += (domain  ? "; domain="+domain : "");
			cookie += (secure  ? "; secure" : "");
			document.cookie = cookie;
		};

		/**
		 * @param name
		 * @return void
		 * @access public
		 */
		this.del = function(name)
		{
			document.cookie = name + "=; expires=Thu, 01-Jan-70 00:00:01 GMT";
		};
	}
}

if (!String.prototype.trim) {
	String.prototype.trim = function() {
		return this.replace(/^\s*|\s*$/g, "");
	};
}

if (!Array.prototype.removeByIndex) {
	Array.prototype.removeByIndex = function(index) {
		this.splice(index, 1);
	};
}

if (!String.prototype.format) {
	String.prototype.format = function() {
		if (!arguments.length) { throw "String.format() failed, no arguments passed, this = "+this; }
		var tokens = this.split("?");
		if (arguments.length != (tokens.length - 1)) { throw "String.format() failed, tokens != arguments, this = "+this; }
		var s = tokens[0];
		for (var i = 0; i < arguments.length; ++i) {
			s += (arguments[i] + tokens[i + 1]);
		}
		return s;
	};
}
