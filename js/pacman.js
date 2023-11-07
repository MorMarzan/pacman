'use strict'

const PACMAN = '😀'
var gPacman

function createPacman(board) {
    // DONE: initialize gPacman...
    gPacman = {
        location: {
            i: 5,
            j: 5
        },
        isSuper: false
    }
    board[gPacman.location.i][gPacman.location.j] = PACMAN
}

function onMovePacman(ev) {
    if (!gGame.isOn) return
    // DONE: use getNextLocation(), nextCell
    const nextLocation = getNextLocation(ev)
    if (!nextLocation) return //incorrect key was pressed
    const nextCell = gBoard[nextLocation.i][nextLocation.j]

    // DONE: return if cannot move
    if (nextCell === WALL) return

    if (nextCell === SUPER_FOOD) {
        if (gPacman.isSuper) return
        else superFoodMode()
    }

    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            //erase ghost from model only! it will render to the DOM on its next move via the interval
            const ghostIdx = getGhostIdx(nextLocation)
            gGhosts.splice(ghostIdx, 1)
        } else {                         
            gameOver()
            return
        }
    }

    if (nextCell === CHERRY) {
        updateScore(20)
    }

    // DONE: moving from current location:
    // DONE: update the model
    gBoard[gPacman.location.i][gPacman.location.j] = EMPTY
    // DONE: update the DOM
    renderCell(gPacman.location, EMPTY)

    // DONE: Move the pacman to new location:
    // DONE: update the model
    gBoard[nextLocation.i][nextLocation.j] = PACMAN
    gPacman.location = nextLocation
    // DONE: update the DOM
    renderCell(gPacman.location, PACMAN)

    if (nextCell === FOOD) { //this is here so that if its victory, the pacman will move to food before modal
        updateScore(1)
        gGame.foodCount--
        if (gGame.foodCount === 0) {
            gameOver(true)
            return
        }
    }
    console.log('gGame.foodCount',gGame.foodCount)
}

function getNextLocation(eventKeyboard) {
    // DONE: figure out nextLocation
    const nextLocation = {
        i: gPacman.location.i,
        j: gPacman.location.j
    }

    switch (eventKeyboard.key) {
        case 'ArrowUp':
            nextLocation.i--
            break;
        case 'ArrowDown':
            nextLocation.i++
            break;
        case 'ArrowLeft':
            nextLocation.j--
            break;
        case 'ArrowRight':
            nextLocation.j++
            break;
        default:
            return null
    }

    return nextLocation
}