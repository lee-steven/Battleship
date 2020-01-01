const GRID_SIZE = 7 //Change value to change grid size
const AMOUNT_SHIPS = 5 //Change value to change number of ships on grid

//Object constructor for a "player"
function Player(){
    this.name
    this.grid = createPlayerGrid() // 1 == Ship // 0 == No Ship
    this.placedShips = AMOUNT_SHIPS
    this.score = 0
}

//Checks if there's a ship at grid's row and column
function hasShip(grid, row, column){
     return (grid[row][column] === 1 ? true : false)
}

//Create and initialize 2D array grid 
function createPlayerGrid(){
    let grid = new Array(GRID_SIZE); 
    for (let i = 0; i < grid.length; i++) { 
        grid[i] = []; 
    } 
    for (let i = 0; i < GRID_SIZE; i++) { 
        for (let j = 0; j < GRID_SIZE; j++) { 
            grid[i][j] = 0; 
        } 
    } 
    return grid
}

//Creat grid that let's player 1 choose where their ships are located
function createSetupGrid(section, player){
    let table = document.createElement('table')
    for(let i = 0; i < GRID_SIZE; i++){
        let row = document.createElement('tr')
        for(let j = 0; j < GRID_SIZE; j++){
            let cell = document.createElement('th')
            cell.setAttribute('data-coord', `{x: ${i}, y: ${j}}`)
            cell.className = "clickableCell"
            cell.addEventListener('click', function(){
                chooseSetupCell(cell, player, i, j)
            })
            row.appendChild(cell)
        }
        table.appendChild(row)
    }
    section.appendChild(table)
}

//Allows player 1 to place their ships on grid
function chooseSetupCell (cell, player, row, column){
    if(player.placedShips != 0 && !hasShip(player.grid, row, column) ){
        let heading = document.getElementById('setup-heading')
        cell.style.backgroundColor = 'rgba(166, 201, 255, 0.7)'
        player.placedShips-- 
        heading.innerText = `You have ${player.placedShips} more ships to place!`
        player.grid[row][column] = 1
    }
}

//Creates main playable battle grid
function createBattleGrid(section, player, computer){
    let table = document.createElement('table')
    let battlegrid = document.getElementsByClassName('battlegrid')

    for(let i = 0; i < GRID_SIZE; i++){
        let row = document.createElement('tr')
        for(let j = 0; j < GRID_SIZE; j++){
            let cell = document.createElement('th')
            cell.setAttribute('data-coord', `{x: ${i}, y: ${j}}`)
            if(section == battlegrid[1]){
                cell.className = "clickableCell"
                cell.addEventListener('click', function (){
                    clickCell(cell, player, computer, i, j)
                })
            }
            row.appendChild(cell)
        }
        table.appendChild(row)
    }
    section.appendChild(table)
}

//Checks if clicked cell contains a battleship and is either a 'hit' or a 'miss'
//Computer Turn is immediately after
function clickCell(cell, player, computer, row, column){
    //If cell isn't already filled
    if(cell.className !== 'hit' && cell.className !== 'miss'){
        //Player 1's Turn
        //If ship hit
        if(hasShip(computer.grid, row, column)){
            cell.className = 'hit'
            cell.innerText = 'X'
            player.score++
            if(checkWinningPlayer(player)){
                return
            }
        } else{ //If ship NOT hit
            cell.className = 'miss'
            cell.innerText = '•'
        }
      
        //Computer's Turn
        output.innerText = "Computer's Turn!"
        //Added 1 second delay between player 1 and computer's turn
        let delayInMilliseconds = 1000; 
        //"Cover" so that player can't click on computer grid when it's computer's turn
        let cover = document.getElementById('right-cover')
        cover.style.zIndex = -1
        cover.style.backgroundColor = 'rgba(156, 156, 156, 0.3)'
        setTimeout(function() {
          computerAttack(player, computer)
          output.innerText = "Player 1's Turn!"
          cover.style.zIndex = 1
          cover.style.backgroundColor = 'transparent'
        }, delayInMilliseconds);
    }
}

//Randomized computer attack --> Change this function if we want a more complex AI
function computerAttack(player,computer){
    let row, column, cell, data

    //Gets random row and column value and checks if coordinate had already been checked
    do{
        row = getRandomGridValue()
        column = getRandomGridValue()
        data = `{x: ${row}, y: ${column}}`
        let battlegrid = document.getElementsByClassName('battlegrid')
        cell = battlegrid[0].querySelector(`[data-coord="${data}"]`)
    } while(cell.className == 'hit' || cell.className == 'miss')

    if(hasShip(player.grid, row, column)){
        //if ship hit
        cell.className = 'hit'
        cell.innerText = 'X'
        computer.score++
        if(checkWinningPlayer(computer)){
            return
        }
    } else{
        //if ship NOT hit
        cell.className = 'miss'
        cell.innerText = '•'
    }
}

//Checks score after every turn
function checkWinningPlayer(player){
    if(player.score === 3){
        document.getElementById('main-content').style.display = 'none'
        let gameOverModal = document.getElementById('gameOverModal')
        gameOverModal.style.display = 'block'
        document.getElementById('winner-container').innerText = `${player.name} won the game!`
        document.getElementById('restart-button').addEventListener('click', restartGame)
        return true
    }
    return false
}

//Set up for Battleship One player option
function setUpOnePlayer(){
    let optionsContainer = document.getElementById('options-container')
    let titleHeading = document.getElementById('title-heading')

    let player = new Player()
    let computer = new Player() 

    player.name = "Player 1"
    computer.name = "Computer"
    optionsContainer.style.display = 'none'
    titleHeading.style.display = 'none'
    let setupContainer = document.getElementById('setup-container')

    let heading = document.createElement('h5')
    heading.setAttribute('id', 'setup-heading')
    heading.textContent = "You have 3 more ships to place!"
    setupContainer.appendChild(heading)
    
    createSetupGrid(setupContainer, player)
    createSetupButtons(setupContainer, player, computer)
    setUpComputerBoard(computer)
}

function getRandomGridValue(){
    return Math.floor(Math.random()*GRID_SIZE)
}

//Computer's ships placed randomly
function setUpComputerBoard(computer){
    let row, column
    for(let i = 0; i < AMOUNT_SHIPS; i++){
        //Checks to prevent same coordinate from being chosen
        do{
            row = getRandomGridValue()
            column = getRandomGridValue()
        } while(hasShip(computer.grid, row, column))
        computer.grid[row][column] = 1
    }
}

function createSetupButtons(container, player,computer){
    let startButton = document.createElement('button')
    startButton.textContent = "Start Game"
    startButton.className = 'options-menu'
    startButton.addEventListener('click', function(){
        startGame(player, computer)
    })
    container.appendChild(startButton)
}

//Set up actual game after player 1 placed ships
function startGame(player, computer){
    if(player.placedShips === 0){
        let modal = document.getElementById('myModal')
        modal.style.display = 'none'
        let battlegrid = document.getElementsByClassName('battlegrid')
        createBattleGrid(battlegrid[0], player, computer)
        createBattleGrid(battlegrid[1], player, computer)
    }
}

//Refreshes Site
function restartGame(){
    window.location.reload(false); 
}

document.getElementById('oneplayer-option').addEventListener('click', setUpOnePlayer)