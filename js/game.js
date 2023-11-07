'use strict'

const WALL = '#'
const FOOD = '.'
const EMPTY = ' '
const SUPER_FOOD = '🍭'
const CHERRY = '🍒'

var gGame
var gBoard
var gCherryInterval

function onInit() {
    gGame = {
        score: 0,
        isOn: true,
        foodCount: 0,
    }

    gBoard = buildBoard()
    console.log('gBoard', gBoard)

    createPacman(gBoard)
    createGhosts(gBoard)

    renderBoard(gBoard)
    // gGame.isOn = true

    clearInterval(gCherryInterval)
    gCherryInterval = setInterval(placeCherry, 15000)


    toggleModal(true)
}

function buildBoard() {
    const size = 10
    const board = []
    // DONE: Create Board
    for (var i = 0; i < size; i++) {
        board.push([])
        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            gGame.foodCount++

            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }

            if (i === 1 && j === 1 ||
                i === 1 && j === size - 2 ||
                i === size - 2 && j === 1 ||
                i === size - 2 && j === size - 2) {
                board[i][j] = SUPER_FOOD
            }

        }
    }
    // all slots minus other elements created
    gGame.foodCount -= (size * 4 + 4)
    return board
}

function renderBoard(board) {
    // DONE: Render the board
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
            const cell = board[i][j]
            const className = `cell cell-${i}-${j}`
            strHTML += `<td class="${className}">${cell}</td>\n`
        }
        strHTML += '</tr>\n'
    }

    // console.log('strHTML', strHTML)
    const elTable = document.querySelector('.board')
    elTable.innerHTML = strHTML
}

// location is an object like this - { i: 2, j: 7 }
function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function updateScore(diff) {
    // update model 
    gGame.score += diff
    // and dom
    document.querySelector('h2 span').innerText = gGame.score
}

function gameOver(isVictory = false) {
    console.log('Game Over')

    if (!isVictory) {
        renderCell(gPacman.location, '🪦')
    }

    gGame.isOn = false
    clearInterval(gIntervalGhosts)
    clearInterval(gCherryInterval)

    const modalTxt = isVictory ? "VICTORY!" : "GAME OVER"
    document.querySelector(".modal h2").innerText = modalTxt
    toggleModal(false)

}

function superFoodMode() {
    gPacman.isSuper = true

    //instant change of style. keep the style via moveGhost()->getGhostHTML()
    ghostsChangeStyle(1)                                 

    setTimeout(() => {
        gPacman.isSuper = false
        ghostsChangeStyle(0)
        //recreate ghosts
        const ghostToAdd = 3 - gGhosts.length
        for (var i = 0; i < ghostToAdd; i++) {
            createGhost(gBoard)
        }
    }, 5000)
}

function toggleModal(toHide = true) {
    const elModal = document.querySelector(".modal")
    const isHidden = elModal.classList.contains("hidden")

    if (isHidden && toHide || !isHidden && !toHide) return

    if (toHide) {
        elModal.classList.add("hidden")
    } else {
        elModal.classList.remove("hidden")
    }
}

function placeCherry() {
    // console.log("cherry!!")

    const emptyCells = getEmptyCells()
    if (!emptyCells) return
    const randLocation = getRandomVal(emptyCells)

    gBoard[randLocation.i][randLocation.j] = CHERRY
    renderCell(randLocation, CHERRY)
}
