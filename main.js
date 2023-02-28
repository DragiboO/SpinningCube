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

let list = []
let scoreSum = 0

let line = 0

let truc = 0

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

        if (Math.round(scoreSum) > highscoreDisplay) {
            highscoreDisplay = Math.round(scoreSum)
            highscore.innerHTML = highscoreDisplay
        }

        truc += 0.7 + scoreSum / 3000

        if (truc > 3600) {
            truc = 0
        }

        item.style.transform = `rotateZ(${truc * 0.8}deg)`
        item.style.borderRadius = `${scoreSum / 1200}px`

        center.style.transform = `rotateZ(${-truc * 0.2}deg)`
        //item.style.animationDuration = `${50 - scoreSum / 750}s`

        lastX = coordX
        lastY = coordY

        await sleep(5)
    }
}

all()