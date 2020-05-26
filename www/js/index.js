/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// ----------------------------------------------
//      SnakeGame class
// ----------------------------------------------
var mGame = (function(){

    // --------------------------------------------------------------
    function SnakeGame(){
        this.mCanvas = null;
        this.mContext = null;
    }



    // --------------------------------------------------------------
    // get random whole numbers in a specific range
    // @see https://stackoverflow.com/a/1527820/2124254    
    SnakeGame.prototype.getRandomInt = function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    SnakeGame.prototype.getRandomCell_X = function(){
        return this.getRandomInt(0, this.MAX_GRID_WIDTH) * this.mCellSize;
    }

    SnakeGame.prototype.getRandomCell_Y = function(){
        return this.getRandomInt(0, this.MAX_GRID_HEIGHT) * this.mCellSize;
    }



    // --------------------------------------------------------------
    SnakeGame.prototype.initSelf = function(){
        this.mCellSize = 16;
        this.mCount = 0;

        this.mCanvas = document.getElementById("game_canvas");
        this.mContext = this.mCanvas.getContext('2d');
        this.MAX_WIDTH = this.mCanvas.clientWidth;      // In pixels
        this.MAX_HEIGHT = this.mCanvas.clientHeight;    // in pixels
        console.log("SnakeGame:initSelf. Canvas-width is " + this.MAX_WIDTH + " and canvas-height = " +  this.MAX_HEIGHT );
        this.MAX_GRID_WIDTH = Math.floor(this.MAX_WIDTH / this.mCellSize);
        this.MAX_GRID_HEIGHT = Math.floor(this.MAX_HEIGHT / this.mCellSize);

        document.addEventListener('keydown', (e) =>{ this.handleKey(e) }); // For browser only.
        // hook to the buttons...
        document.getElementById('btnLeft').onclick = (e) => { this.onLeftBtnClick(e)};
        document.getElementById('btnUp').onclick = (e) => { this.onUpBtnClick(e)};
        document.getElementById('btnDown').onclick = (e) => { this.onDownBtnClick(e)};
        document.getElementById('btnRight').onclick = (e) => { this.onRightBtnClick(e)};

        // add touch handlers
        this.mCanvas.addEventListener( "touchstart", (evt) =>{ this.handleTouchStart( evt)} );
        this.mCanvas.addEventListener( "touchmove", (evt) =>{ this.handleTouchMove( evt)} );
        this.mCanvas.addEventListener( "touchend", (evt) =>{ this.handleTouchEnd( evt)} );
        this.mCanvas.addEventListener( "touchcancel", (evt) =>{ this.handleTouchCancel( evt)} );

    
        this.mSnake = {    
            x: this.getRandomCell_X(),
            y: this.getRandomCell_Y(),

            // snake velocity. moves by one cell increments every frame in either the x or y direction
            dx: this.mCellSize,
            dy: 0,

            // keep track of all grids the snake body occupies
            cells: [],

            // length of the snake at start. grows when eating an apple
            maxCells: 4
        };
    
        this.mApple = {
            x: this.getRandomCell_X(),
            y: this.getRandomCell_Y()
        }
    }


    //-------------------------------------------------------------
    SnakeGame.prototype.handleTouchStart = function( evt ){
        evt.preventDefault();
        console.log("touch-start called!");
        var touches = evt.changedTouches;
        this.mCurrentTouch = touches[0];        // We dont handle multi touch
    }

    //-------------------------------------------------------------
    SnakeGame.prototype.handleTouchMove = function( evt ){
        evt.preventDefault();
        console.log("touch-move called!");
        if( !this.mCurrentTouch ){
            console.log("Wooah! move called without touchstart!");
            return;
        }
        var touch = evt.changedTouches[0];
        if( touch.identifier === this.mCurrentTouch.identifier ){
            let dx = Math.floor( touch.clientX - this.mCurrentTouch.clientX );
            let dy = Math.floor( touch.clientY - this.mCurrentTouch.clientY );
            if( Math.abs(dx) > Math.abs(dy)){
                // x-direction
                if( dx > 0){
                    this.onRightBtnClick();
                }
                else{
                    this.onLeftBtnClick();
                }
            }
            else{
                if( dy > 0 ){
                    this.onDownBtnClick();
                }
                else{
                    this.onUpBtnClick();
                }
            }
        }   
    }


    //-------------------------------------------------------------
    SnakeGame.prototype.handleTouchEnd = function( evt ){
        evt.preventDefault();
        console.log("touch-end called!");
        var touches = evt.changedTouches;
        for(i = 0; i< touches.length; i++){
            var aTouch = touches[i];
            if( aTouch.identifier == this.mCurrentTouch.identifier ){
                this.mCurrentTouch = undefined;
                return;
            }
        }
    }   

    //-------------------------------------------------------------
    SnakeGame.prototype.handleTouchCancel = function( evt ){
        evt.preventDefault();
        console.log("touch-cancel called!");
        this.handleTouchEnd( evt );
    }

    // --------------------------------------------------------------
    SnakeGame.prototype.onLeftBtnClick = function(){
        this.mSnake.dx = -this.mCellSize;
        this.mSnake.dy = 0;
    }

    // --------------------------------------------------------------
    SnakeGame.prototype.onUpBtnClick = function(){
        console.log("Left button was clicked");
        this.mSnake.dy = -this.mCellSize;
        this.mSnake.dx = 0;
    }

    // --------------------------------------------------------------
    SnakeGame.prototype.onDownBtnClick = function(){
        console.log("Left button was clicked");
        this.mSnake.dy = this.mCellSize;
        this.mSnake.dx = 0;
    }

    // --------------------------------------------------------------
    SnakeGame.prototype.onRightBtnClick = function(){
        console.log("Left button was clicked");
        this.mSnake.dx = this.mCellSize;
        this.mSnake.dy = 0;
    }

    // --------------------------------------------------------------
    SnakeGame.prototype.handleKey = function( ) {
        // prevent snake from backtracking on itself by checking that it's 
        // not already moving on the same axis (pressing left while moving    
        // left won't do anything, and pressing right while moving left
        // shouldn't let you collide with your own body)

        // left arrow key
        if (e.which === 37 && this.mSnake.dx === 0) {
            this.onLeftBtnClick();
        }

        // up arrow key
        else if (e.which === 38 && this.mSnake.dy === 0) {
            this.onUpBtnClick();
        }

        // right arrow key
        else if (e.which === 39 && this.mSnake.dx === 0) {
            this.onRightBtnClick();
        }

        // down arrow key
        else if (e.which === 40 && this.mSnake.dy === 0) {
            this.onDownBtnClick();
        }
    }



    // --------------------------------------------------------------
    SnakeGame.prototype.startGame = function(){
        this.initSelf();
        requestAnimationFrame( () =>{ this.gameLoop();} );
        this.logHello();
    }


    // -------------------------------------------------------------
    SnakeGame.prototype.moveSnake = function(){
        // move snake by it's velocity
        this.mSnake.x += this.mSnake.dx;
        this.mSnake.y += this.mSnake.dy;

        // wrap snake position horizontally on edge of screen
        if (this.mSnake.x < 0) {
            this.mSnake.x = this.MAX_WIDTH - this.mCellSize;
        }
        else if ( this.mSnake.x >= this.MAX_WIDTH ) {
            this.mSnake.x = 0;
        }

        // wrap snake position vertically on edge of screen
        if ( this.mSnake.y < 0) {
            this.mSnake.y = this.MAX_HEIGHT - this.mCellSize;
        }
        else if ( this.mSnake.y >= this.MAX_HEIGHT ) {
            this.mSnake.y = 0;
        }

        // keep track of where snake has been. front of the array is always the head
        this.mSnake.cells.unshift( {x: this.mSnake.x, y: this.mSnake.y});


        // remove cells as we move away from them
        if ( this.mSnake.cells.length > this.mSnake.maxCells) {
            this.mSnake.cells.pop();
        }
    }

    // --------------------------------------------------------------
    SnakeGame.prototype.drawApple = function(){
        // draw apple
        this.mContext.fillStyle = 'red';
        this.mContext.fillRect( this.mApple.x, this.mApple.y, this.mCellSize-1, this.mCellSize-1);
    }


    // -------------------------------------------------------------
    SnakeGame.prototype.resetGame = function(){
        this.mSnake.x = 160;
        this.mSnake.y = 160;
        this.mSnake.cells = [];
        this.mSnake.maxCells = 4;
        this.mSnake.dx = this.mCellSize;
        this.mSnake.dy = 0;
        this.mApple.x = this.getRandomCell_X();
        this.mApple.y = this.getRandomCell_Y();
    }


    // -------------------------------------------------------------
    SnakeGame.prototype.checkIfSnakeAteTheApple = function(){
        // snake ate apple
        if ( this.mSnake.cells[0].x === mGame.mApple.x && this.mSnake.cells[0].y === mGame.mApple.y) {
            mGame.mSnake.maxCells++;
            // canvas is 400x400 which is 25x25 grids 
            mGame.mApple.x = mGame.getRandomCell_X();
            mGame.mApple.y = mGame.getRandomCell_Y();
        } // if
    }

    // --------------------------------------------------------------
    SnakeGame.prototype.drawSnake = function(){
        // draw snake one cell at a time
        this.mContext.fillStyle = 'green';

        this.mSnake.cells.forEach( (cell, index) => {
            // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
            this.mContext.fillRect( cell.x, cell.y, this.mCellSize-1, this.mCellSize-1);  

            // check collision with all cells after this one (modified bubble sort)
            // for (var i = index + 1; i < this.mSnake.cells.length; i++) {
            //     // snake occupies same space as a body part. reset game
            //     if (cell.x === mGame.mSnake.cells[i].x && cell.y === mGame.mSnake.cells[i].y ) {
            //         this.resetGame();
            //     }
            // } // for loop.
        }); // foreach
    }
    

    // --------------------------------------------------------------
    SnakeGame.prototype.gameLoop = function(){
        requestAnimationFrame( () =>{ this.gameLoop();} );
        // slow game loop to 15 fps instead of 60 (60/15 = 4)
        if (++ this.mCount < 10 ) {
            return;
        }
        this.mCount = 0;
        this.mContext.fillStyle = "black";
        this.mContext.clearRect(0,0,this.MAX_WIDTH,this.MAX_HEIGHT);
        this.moveSnake();
        this.checkIfSnakeAteTheApple();
        this.drawApple();
        this.drawSnake();
    }



    // --------------------------------------------------------------
    SnakeGame.prototype.logHello = function(){
        this.mContext.fillStyle = 'green';
        this.mContext.font = "30px Arial";
        this.mContext.fillText("Hello World", 10, this.MAX_HEIGHT/2);
    }

    return new SnakeGame();
})();



// Cordova provided App class (unnecessary flab removed)
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        mGame.startGame();
    }
};

app.initialize();