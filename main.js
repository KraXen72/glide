let toggle, settbtn, containerElem
let time = new Date()

const containerObj = {
    p: { //props
        connect: false, //.connect: connects links together
        compact: false, //.compact: make links compact
        width: 40, //max container width. 32 - 65rem
        cols: 3, //.cols-2 || .cols-3: show either 1,2,3 or just 1,2 columns
        verdana: false, //.verdana: use verdana font
        nosearch: false, //.nosearch: hide search bar
        nopic: false, //.nopic: hide pic
        notitle: false, //.notitle: hide category titles
        nogreeting: true, //.nogreeting:	hide greeting
        leftpic: false, //.leftpic: put the pic to the left instead of top
        tallpic: false, //.tallpic: pic will be yahallo (358*279.72px) tall and wide (only works with leftpic)
        noclock: false //.clock show or hide side clock
    }, 
    m: { //misc
        incognito: false, //make buttons incognito
        greeting: 'heya', //greeting and other texts
        col1Title: 'links',
        col2Title: 'social',
        col3Title: 'other',
        imgPath: 'background.png' //image path
    }
}

let ls_containerObj = localStorage.getItem('Container')

//this will only update settings
if (typeof ls_containerObj !== 'undefined' && ls_containerObj !==  null) {
    let parsed = JSON.parse(ls_containerObj)
    console.log("found data in localStorage, loading Container: ", parsed)
    console.log(parsed)
    Object.assign(containerObj, parsed) //update the current container object with the one from localstorage
}

/**
* Container is the main object for layout; if you change its props, the layout instantly updates.
*/

const Container = Observable.from(containerObj)
Container.observe(changes => {
    changes.forEach(change => {
        //console.log(`detected ${change.type} in '${change.path[1]}': `, change)

        if (change.path[0] === "p") { //props changed
            let key = change.path[1]
            if (key === "cols") {
                //if its not 2 or 3 just dont change anything
                change.value = [2,3].includes(change.value) ? change.value : Container.p.cols

                let cl = [...containerElem.classList] //backup classlist
                cl[1] = `cols-${change.value}`
                containerElem.classList = cl.join(" ") //reconstruct classlists
            } else if (key === "width") {
                document.getElementById('styles').innerHTML = `:root{--maxwidth:${change.value || 40}rem;}`
            } else {
                //if new value is true, add the class otherwise remove the class 
                if (change.value === true) {
                    containerElem.classList.add(key)
                } else {
                    containerElem.classList.remove(key)
                }

                //make tallpic not work when leftpic is off & update the checkboxes in settings
                if (key === "leftpic" && !change.value) { 
                    Container.p.tallpic = false; 
                    document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false;
                }
                if (key === "tallpic" && change.value && !Container.p.leftpic) {
                    Container.p.tallpic = false;
                    setTimeout(() => {document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false;}, 150)
                }
            }
        } else if (change.path[0] === 'm') { //misc changed
            let key = change.path[1]
            miscUpdate(key, change.value)
        } else if (change.path.length === 1 && change.type === "insert") { //someone tried to do Container.something instead of Container.p.something
            console.log("unsupported change, reverting.")
            delete Container[change.path[0]]
        } else {
            //if delete than just go with it, otherwise alert the user that they are doing bullshitery
            if (!change.type === "delete") {
                console.warn(`you assigned some random bs deep in the object and its not a prop, that's on you man`)
            }
        }
    }) //cols-2 leftpic tallpic slim verdana nosearch notitle compact connect
})

/**
 * creates a new Link element (initialization creates the dom element)
 */
 class LinkElem {
    /**
     * creates the link dom element.
     * @param {String} name label of the link
     * @param {String} url url/href of the link
     * @param {'normal'|'config'} mode what type of links you need
     */
    constructor(name, url, mode) {
        let normal = mode === 'normal'
        /**
         * some properties that will later get assigned to the element
         * @type {Object}
         */
        this.elemProps = {} 

        /**
         * string to be passed into createElement, for normal mode it's a, for config it's span
         */
        this.elemStr = normal ? 'a' : 'span'

        this.elemProps = {
            href: url, //href don't work on span anyway
            title: name,
            target: '_self',//normal ? '_blank' : '_self',
            classList: "links",
            draggable: false,
            innerHTML: `<span class="accent">${normal ? "~" : '&times;'}</span>
            <span class="link-text">${name}</span>`
        }
    }
    /**
     * get the link element
     */
    get elem() {
        let w = document.createElement(this.elemStr)
        Object.assign(w, this.elemProps)
        w.querySelector('span.accent').onclick = () => {
            if (window.confirm(`Really delete '${this.elemProps.title}'?`)) {
                w.remove()
            }
        } //yeet the thing on span.accent onclick

        return w
    }
}

//TODO instangly update classlist from json, not through this for loop - save classList and Container separately

document.addEventListener('DOMContentLoaded', () => {
    toggle = document.getElementById('toggle');
    settbtn = document.getElementById('settings');

    containerElem = document.getElementById('container')

    toggle.onclick = toggleImage
    settbtn.onclick = () => {toggleElem('settings-screen-left'); toggleElem('settings-screen-right')}

    let ls_classList = localStorage.getItem('classList')

    //this will only update settings
    if (typeof ls_classList !== 'undefined' && ls_classList !==  null) {
        console.log("found data in localStorage, loading classList: ", ls_classList)
        containerElem.classList = ls_classList
    }

    document.getElementById('styles').innerHTML = `:root{--maxwidth:${Container.p.width}rem;}`
    updateClock()
    initlinks()
    initsettings()
    Object.keys(Container.m).forEach(key => { miscUpdate(key, Container.m[key]) }) //this should reflect the values from settings
})

function initlinks() {
    for (let i = 0; i < Object.keys(settings.l).length; i++) {
        loadlinks(`col-${i+1}`, settings.l[`col${i+1}`], 'normal')
    }
}

/**
 * load links into an element. 
 * @param {String} id getelementbyid id for the column to insert to
 * @param {Object} db settigns.l.col1 for example
 * @param {'normal'|'config'} mode what type of link you need
 */
 function loadlinks(id, db, mode) {
    for (let i = 0; i < Object.keys(db).length; i++) {
        const key = Object.keys(db)[i];
        const val = db[key]

        let link = ''
        link = new LinkElem(val.name, val.url, mode)
        document.getElementById(id).appendChild(link.elem)
    }
}

/**
 * gets the values of global Container object (which is actually a Proxy)
 * @returns {Object} current Container configuration
 */
function serializeContainer() {
    let serialized = {}

    let keys = ["p", "m"] //first level keys of Container
    keys.forEach(topKey => {
        //for each loop through all it's ckeys and push them to thiskey
        let thisKey = {} //the object that we are pushing values to

        //copy this entire key to the 'thisKey' object
        Object.keys(Container[topKey]).forEach(lKey => {
            thisKey[lKey] = Container[topKey][lKey]
        })
        //add this key to the serialized object
        serialized[topKey] = thisKey
    })
    return serialized
}

/**
 * toggle the image visible or hidden
 */
function toggleImage() {
    document.getElementById('settingElem-nopic').querySelector('.s-update').click()
    saveSettings()
}

/**
 * toggle the visibility of an element
 * @param {String} id id of the element to toggle
 */
function toggleElem(id) {
    document.getElementById(id).classList.toggle('hidden')
}

/**
 * show and element and then fade it away
 * @param {String} query document.querySelector for element to blink
 */
function blinkElem(query, dec) {
    let elem = document.querySelector(query)

    elem.classList.remove('fade')
    elem.classList.remove('invis')
    setTimeout(() => {
        elem.classList.add('fade')
        elem.classList.add('invis')
    },0)
}

/**
 * add functionality to the misc settings
 * @param {String} what 'incognito'
 * @param {String | Boolean} value the new value
 */
function miscUpdate(what, value) {
    switch (what) {
        case "incognito":
            [...document.querySelectorAll(".settings.smolbtn, .toggle.smolbtn")].forEach(smolbtn => {
                if (value === true) {
                    smolbtn.classList.add('incognito')
                } else {
                    smolbtn.classList.remove('incognito')
                }
            })
            break;
        case "greeting":
            document.querySelector(`h1.title.greeting`).innerHTML = `${value} <span class="accent">~</span>`
            break;
        case "col1Title":
        case "col2Title":
        case "col3Title":
            document.querySelector(`div.title.${what}`).innerHTML = value || "..."
            break;
        case "imgPath":
            let img = document.getElementById('main-img')
            checkAndApplyImg(`img/${value}`,img)
        default:
            break;
    }
}

/**
 * checks if an image exists and if yes applies it to a given element
 * @param {String} path image path
 * @param {Element} imgelem image element
 */

function checkAndApplyImg(path, imgelem) {
    if (path === "img/icon64.png") {
        imgelem.src = 'img/placeholder.png'
    } else {
        let testimg = document.getElementById('testimg')

        testimg.onload = () => { imgelem.src = path }
        testimg.onerror = () => { imgelem.src = 'img/placeholder.png' }
        testimg.src = path
    }   
}

/**
 * update the #clock. call this function once, it will itself every minute (adjusts automatically)
 */
function updateClock() {
    time.setTime(Date.now())

    let clock = document.getElementById('clock')
    let timestr = time.toTimeString()
    let t = timestr.split(":")

    //calculate when to next update time
    let next = new Date()
    next.setHours(time.getHours())
    next.setMinutes(time.getMinutes() + 1)
    next.setSeconds(0)

    let diffTime = Math.abs(next - time) - 1;
    /*console.log("next in ms: ", diffTime)
    console.log(`now: ${time.toTimeString()} next: ${next.toTimeString()}`)*/


    clock.innerHTML = `
    <span class="clockdigit">${t[0].substr(0, 1)}</span>
    <span class="clockdigit">${t[0].substr(1, 2)}</span>
    <span class="clockdigit">-</span>
    <span class="clockdigit">${t[1].substr(0, 1)}</span>
    <span class="clockdigit">${t[1].substr(1, 2)}</span>
    `

    setTimeout(updateClock,diffTime)
}