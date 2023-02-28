let score = document.querySelector('.score')
let page = document.querySelector('body')
let mouse = document.querySelector('.mouse')
let mouseCircle = document.querySelector('.mouse_circle')
let highscore = document.querySelector('.highscore')
let center =  document.querySelector('.center')

let coordX = 0 
let coordY = 0

let lastX = 0
let lastY = 0

let diffGlobal = 0

let highscoreDisplay = 0

let colorCursor = 0
let colorItem = 0
let slowItem = 0
let slowItemLight = 40

let list = []
let scoreSum = 0
let scoreLoop = 0

let windowSize = {
    'width': window.innerWidth,
    'height': window.innerHeight
}

let item = document.querySelector('.item');

// Event desktop
page.addEventListener('mousemove', e => {
    mouse.style = `left: ${e.pageX}px; top: ${e.pageY}px;`
})
// Event mobile
page.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    mouse.style = `left: ${touch.clientX}px; top: ${touch.clientY}px;`
})



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY
    };
}

function getCoord() {
    coordY = getOffset(mouse).top
    coordX = getOffset(mouse).left
}

function listCoord(coord) {
    if (list.length > 399) {
        list.shift()
    }
    list.push(coord)
}

function interpolate(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

function modifyColorString(colorString) {
    let alphaPart = colorString.replace(/^.*,(.+)\)/, '$1').replace(/[,\s)]/g, '');
    let alpha = parseFloat(alphaPart);
    
    alpha -= 0.01;
    
    if (alpha < 0) {
        alpha = 0;
    } else if (alpha > 1) {
        alpha = 1;
    }
    
    let modifiedString = colorString.slice(0, colorString.lastIndexOf(',')) + `, ${alpha})`;
    
    return modifiedString;
}

async function all() {
    while (true) {

        mouseCircle.style.borderColor = `hsl(${colorCursor}, 100%, 40%)`

        colorCursor += 1

        if (colorCursor > 360) {
            colorCursor = 0
        }

        let trail = document.createElement('div')
        trail.classList = 'trail'
        trail.style = `left: ${coordX - 5}px; top: ${coordY - 5}px; background-color: hsla(${colorCursor}, 100%, 40%, 0.99)`

        page.appendChild(trail)


        let allTrail = document.querySelectorAll('.trail')

        if (allTrail.length > 100) {
            allTrail[0].remove()
        }

        for (let i = 1; i < 100; i++) {
            if(allTrail[i]) {
                let bgc = allTrail[i].style.backgroundColor
                allTrail[i].style.backgroundColor = modifyColorString(bgc)
            }
        }

        getCoord()
        diffGlobal = Math.abs(coordX - lastX) + Math.abs(coordY - lastY)
        listCoord(diffGlobal)

        scoreSum = list.reduce((partialSum, a) => partialSum + a, 0);
        score.innerHTML = Math.round(scoreSum)

        if (scoreSum > highscoreDisplay) {
            highscoreDisplay = scoreSum
            highscore.innerHTML = highscoreDisplay
            score.style.color = `hsl(${colorCursor}, 100%, 40%)`
            highscore.style.color = `#000`
        } else {
            score.style.color = `#000`
            highscore.style.color = `hsl(${colorCursor}, 100%, 40%)`
        }

        scoreLoop += 0.7 + scoreSum / 3000

        if (scoreLoop > 3600) {
            scoreLoop = 0
        }

        item.style.transform = `rotateZ(${scoreLoop * 0.8}deg)`
        item.style.borderRadius = `${scoreSum / 1200}px`

        center.style.transform = `rotateZ(${-scoreLoop * 0.2}deg)`
        //item.style.animationDuration = `${50 - scoreSum / 750}s`

        switch(true) {
            case (scoreSum >= 0 && scoreSum < 10000 && colorItem == 0 && slowItem == 0):
                item.style.backgroundColor = `hsl(60, 100%, 100%)`
                break;
            case (scoreSum >= 10000 && scoreSum < 15000 && colorItem == 0 && slowItem == 0):
                item.style.backgroundColor = `hsl(60, 100%, ${interpolate(scoreSum, 10000, 15000, 100, 50)}%)`
                break;
            case (scoreSum >= 15000 && scoreSum < 25000 && colorItem == 0 && slowItem == 0):
                item.style.backgroundColor = `hsl(${interpolate(scoreSum, 15000, 25000, 60, 0)}, 100%, ${interpolate(scoreSum, 15000, 25000, 50, 40)}%)`
                item.style.boxShadow = ''
                break;
            case (scoreSum >= 25000 && scoreSum < 35000  && colorItem == 0 && slowItem == 0):
                item.style.boxShadow = `0 0 ${interpolate(scoreSum, 25000, 35000, 0 ,100)}px 0 hsl(${interpolate(scoreSum, 25000, 35000, 30, 0)}, 100%, 50%)`
                break
            case (scoreSum >= 35000 || colorItem != 0):
                if (colorItem <= 0 && scoreSum >= 35000) {
                    colorItem = 360
                }
                console.log(colorItem)
                item.style.backgroundColor = `hsl(${colorItem}, 100%, 40%)`
                item.style.boxShadow = `0 0 ${interpolate(scoreSum, 35000, 50000, 100 ,200)}px 0 hsl(${colorItem}, 100%, 40%)`
                colorItem -= 1
                slowItem = 1
                break;
            case (scoreSum < 35000 && colorItem == 0 && slowItem == 1):
                item.style.backgroundColor = `hsl(0, 100%, ${slowItemLight}%)`
                item.style.boxShadow = ``
                if (slowItemLight < 100) {
                    slowItemLight += 1
                }
                if (slowItemLight == 100) {
                    slowItem = 0
                    slowItemLight = 40
                }
        }

        lastX = coordX
        lastY = coordY

        await sleep(5)
    }
}

all()