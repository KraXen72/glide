let toggle, settbtn, containerElem
let time = new Date()

let containerObj = {
	p: { //props
		connect: false, //.connect: connects links together
		compact: false, //.compact: make links compact
		width: 40, //max container width. 32 - 65rem
		cols: 3, //.cols-2 || .cols-3: show either 1,2,3 or just 1,2 columns
		greetingtype: 'greeting', // greeting, nogreeting, greeting+date
		dateformat: '{wn}, {mm}. {Mn}', // default date format
		clocktype: "noclock",
		verdana: false, //.verdana: use verdana font
		nosearch: false, //.nosearch: hide search bar
		nopic: false, //.nopic: hide pic
		notitle: false, //.notitle: hide category titles
		leftpic: false, //.leftpic: put the pic to the left instead of top
		tallpic: false, //.tallpic: pic will be yahallo (358*279.72px) tall and wide (only works with leftpic)
		nolinks: false, //.nolinks: hide colwrap
	},
	m: { //misc
		incognito: false, //make buttons incognito
		customfont: '',
		greeting: 'heya', //greeting and other texts
		col1Title: 'links',
		col2Title: 'social',
		col3Title: 'other',
		imgPath: 'background.png', //image path
		imgGallery: ""
	}
}

let ls_containerObj = localStorage.getItem('Container')
let ls_lastImg = null
let clockTimeout = null

function randomNumberBetween(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min)
}

//this will only update settings
if (typeof ls_containerObj !== 'undefined' && ls_containerObj !== null) {
	let parsed = JSON.parse(ls_containerObj)
	console.log("before", Object.assign({}, containerObj), "after", parsed)
	console.log("found data in localStorage, loading Container: ", parsed)

	//Object.assign(containerObj, parsed) //update the current container object with the one from localstorage
	containerObj = circleAssign(containerObj, parsed)
}
/**
* Container is the main object for layout; if you change its props, the layout instantly updates.
*/

const Container = Observable.from(containerObj)
Container.observe(changes => {
	changes.forEach(change => {
		let cl = containerElem.classList
		//console.log(`detected ${change.type} in '${change.path[1]}': `, change)

		if (change.path[0] === "p") { //props changed
			let key = change.path[1]
			if (key === "clocktype") {

				// sideclock vs noclock: 
				// automatically try to add 8 rem to width when clock is enabled and substract 8 when it's disabled
				if (change.value === "side") {
					Container.p.width += 6
					if (Container.p.width > 65) Container.p.width = 65
				} else {
					Container.p.width -= 6
					if (Container.p.width < 33) Container.p.width = 32
				}
				document.querySelector("#settingElem-width .s-update").value = Container.p.width
				
				switch (change.value) {
					case "side":
						cl.remove("noclock")
						cl.remove("greetclock")
						break;
					case "greeting":
						cl.add("noclock")
						cl.add("greetclock")
						break;
					case "noclock":
					default:
						cl.add("noclock")
						cl.remove("greetclock")
						break;
				}
				updateGreetingElem()
				updateClock()
			} else if (key === "greetingtype") {
				cl.remove("soft-hide-greeting")
				cl.remove("nogreeting")
				switch (change.value) {
					case "nogreeting":
						cl.add("nogreeting")
						cl.remove("date")
						break;
					case "greeting+date":
						cl.add("date")
						break;
					case "date":
						cl.add("soft-hide-greeting")
						cl.add("date")
						break;
					default:
					case "greeting":
						cl.remove("date")
						break;
				}
				updateGreetingElem()
				updateClock()
				updateDate()
			} else if (key === "cols") {
				//if its not 2 or 3 just dont change anything
				change.value = [2, 3].includes(change.value) ? change.value : Container.p.cols

				let _cl = [...containerElem.classList] //backup classlist
				_cl[1] = `cols-${change.value}`
				containerElem.classList = _cl.join(" ") //reconstruct classlists

			} else if (key === "width") {
				document.getElementById('styles').innerHTML = `:root{--maxwidth:${change.value || 40}rem;}`
			} else if (key === "dateformat") {
				updateDate(change.value)
			} else {
				//if new value is true, add the class otherwise remove the class 
				if (change.value === true) {
					cl.add(key)
				} else {
					cl.remove(key)
				}

				//make tallpic not work when leftpic is off & update the checkboxes in settings
				if (key === "leftpic" && !change.value) {
					Container.p.tallpic = false;
					document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false;
				}
				if (key === "tallpic" && change.value && !Container.p.leftpic) {
					Container.p.tallpic = false;
					setTimeout(() => { document.getElementById("settingElem-tallpic").querySelector(".s-update").checked = false; }, 150)
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
			normal: normal,
			innerHTML: `<span class="accent">${normal ? "~" : '&times;'}</span>
						<span class="link-text">${name}</span>`
		}

		this.w = document.createElement(this.elemStr)
		Object.assign(this.w, this.elemProps)

		if (!this.elemProps.normal) {
			this.w.querySelector('span.accent').onclick = () => {
				if (window.confirm(`Really delete '${this.elemProps.title}'?`)) {
					this.w.remove()
				}

			}
			this.w.oncontextmenu = (event) => {
				event.preventDefault()
				this.edit(this)
			}
		}

	}

	/**
	 * get the link element
	 */
	get elem() {
		return this.w
	}

	edit(linkInstance) {
		document.querySelector("#add-link-name").value = linkInstance.elemProps.title
		document.querySelector("#add-link-url").value = linkInstance.elemProps.href
		linkInstance.w.remove()
	}
}

// stuff that prevents the container from being initially rendered
// container has a loadHide class that makes it invisible
const loadConstraints = {
	imageHasLoaded: Container.p.nopic ? true : false,
	layoutHasApplied: false,

	check: () => {
		let passing = true
		const constraints = Object
			.entries(loadConstraints)
			.filter(item => typeof item[1] === 'boolean')

		// loop through all the constriants and check if they are all completed
		for (let i = 0; i < constraints.length; i++) {
			const constraint = constraints[i];

			if (constraint[1] === false) {
				passing = false;
				break;
			}
		}
		//console.log("Checked load constraints", constraints, passing)
		if (passing) containerElem.removeAttribute("style")
		updateGreetingElem()
		updateClock()
		updateDate()
	}
}

//DONE instantly update classlist from json, not through this for loop - save classList and Container separately

document.addEventListener('DOMContentLoaded', () => {
	function showHideSettings() {
		toggleElem('settings-screen-left');
		toggleElem('settings-screen-right');
	}

	toggle = document.getElementById('toggle');
	settbtn = document.getElementById('settings');

	containerElem = document.getElementById('container')

	document.getElementById("main-img").onload = () => {
		loadConstraints.imageHasLoaded = true;
		loadConstraints.check()
	}

	toggle.onclick = toggleImage
	settbtn.onclick = showHideSettings
	document.querySelector(".hook-close-btn").onclick = showHideSettings

	let ls_classList = localStorage.getItem('classList')
	ls_lastImg = localStorage.getItem('lastimg')

	//this will only update settings
	if (typeof ls_classList !== 'undefined' && ls_classList !== null) {
		console.log("found data in localStorage, loading classList: ", ls_classList)
		containerElem.classList = ls_classList

	}
	loadConstraints.layoutHasApplied = true;
	loadConstraints.check()

	document.getElementById('styles').innerHTML = `:root{--maxwidth:${Container.p.width}rem;}`
	updateClock()
	initlinks()
	initsettings()
	Object.keys(Container.m).forEach(key => { miscUpdate(key, Container.m[key], false) }) //this should reflect the values from settings
})

function initlinks() {
	for (let i = 0; i < Object.keys(settings.l).length; i++) {
		loadlinks(`col-${i + 1}`, settings.l[`col${i + 1}`], 'normal')
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

		let link = new LinkElem(val.name, val.url, mode)
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
function blinkElem(query) {
	let elem = document.querySelector(query)

	elem.classList.remove('fade')
	elem.classList.remove('invis')
	setTimeout(() => {
		elem.classList.add('fade')
		elem.classList.add('invis')
	}, 0)
}

const dateHTML = `<span id="date"></span>`
const clockHTML = `<span id="greeting-clock">00:00</span>`

/**
 * update the h1.greeting. values are only for overrides, defaults are dynamic.
 * no need to provide any args. it should work.
 * automaticaly calls updateDate & updateClock if they are enabled
 * @param {string} greeting greeting text. falls back to what is in container
 * @param {boolean} dateEnabled if date is enabled
 * @param {boolean} greetClockEnabled if greet type clock is enabled
 */
function updateGreetingElem(
	greeting = Container.m.greeting,
	dateEnabled = Container.p.greetingtype === "greeting+date" || Container.p.greetingtype === 'date',
	greetClockEnabled = Container.p.clocktype === "greeting"
) { 
	if (!containerElem.classList.contains("soft-hide-greeting")) {
		document.querySelector("h1.title.greeting").innerHTML = `${greeting} <span class="accent">~</span> ${dateEnabled ? dateHTML : ""} ${greetClockEnabled ? clockHTML : ""}`
	} else {
		document.querySelector("h1.title.greeting").innerHTML = `${dateEnabled ? dateHTML : ""} <span class="accent">~</span> ${greetClockEnabled ? clockHTML : ""}`
	}
	
	if (dateEnabled) updateDate()
	if (greetClockEnabled) updateClock() // should be fine bc it clears the timeout anyway
}

/**
 * add functionality to the misc settings
 * @param {string} what 'incognito'
 * @param {string | boolean} value the new value
 * @param {boolean} genuine if the value is coming from settings (default;true), or restoring from localStorage (false)
 */
function miscUpdate(what, value, genuine = true) {
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
			updateGreetingElem(value)
			if (Container.p.greetingtype === "greeting+date") updateDate()
			break;
		case "col1Title":
		case "col2Title":
		case "col3Title":
			document.querySelector(`div.title.${what}`).innerHTML = value || "..."
			break;
		case "imgPath":
			let img = document.getElementById('main-img')
			if (Container.m.imgGallery && Container.m.imgGallery !== "" && !genuine) {
				let items = Container.m.imgGallery.split("\n")
				if (items.length > 0) {
					items.push(value) // add the imgPath to the pool
					// ensure uniqueness each time by remembering last image
					if (ls_lastImg && ls_lastImg !== null) items = items.filter(img => img !== ls_lastImg)
					const index = randomNumberBetween(0, items.length - 1)
					localStorage.setItem("lastimg", items[index] )
					checkAndApplyImg(`img/${items[index]}`, img)
				} else {
					checkAndApplyImg(`img/${value}`, img)
				}
			} else {
				checkAndApplyImg(`img/${value}`, img)
			}
		break;
		case "customfont":
			//add some rules to apply the custom font
			{
				let ff = `
								@font-face {
										font-family: "Customfont";
										src: url('fonts/${value}') format('woff');
								}
								.container .links,
								.container .title,
								.container .search, 
								.container .search input {
										font-family: Customfont,Verdana,sans-serif !important;
										font-size: 20px;
										line-height: 1.5;
								}
								`
				if (value !== undefined && value !== '') {
					document.getElementById("customfont").innerHTML = ff
				} else {
					document.getElementById("customfont").innerHTML = ''
				}
			}
			break;
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
 * update date. call this whenever a date update is needed. no timeout is being set.
 */
function updateDate(template = Container.p.dateformat) {
	if (Container.p.greetingtype === "date" || Container.p.greetingtype.endsWith("date")) {
		try {
			const formattedDate = tinydate(template)(time)
			document.getElementById("date").innerHTML = formattedDate
		} catch (e) { console.warn("invalid date format. noop") }
	}
}

/**
 * update the #clock. call this function once, it will itself every minute (adjusts automatically)
 */
function updateClock() {
	time.setTime(Date.now())

	let timestr = time.toTimeString()
	let t = timestr.split(":")

	//calculate when to next update time
	let next = new Date()
	next.setHours(time.getHours())
	next.setMinutes(time.getMinutes() + 1)
	next.setSeconds(0)

	let diffTime = Math.abs(next - time) - 1;

	switch (Container.p.clocktype) {
		case "greeting":
			document.getElementById("greeting-clock").innerHTML = `${t[0][0]}${t[0][1]}:${t[1][0]}${t[1][1]}`;
			break;
		default:
			document.getElementById('clock').innerHTML = `
			<span class="clockdigit">${t[0][0]}</span>
			<span class="clockdigit">${t[0][1]}</span>
			<span class="clockdigit">-</span>
			<span class="clockdigit">${t[1][0]}</span>
			<span class="clockdigit">${t[1][1]}</span>`
			break;
	}
	updateDate()

	if (clockTimeout !== null) clearTimeout(clockTimeout)
	clockTimeout = setTimeout(updateClock, diffTime)
	console.log(time.toTimeString(), "clock update")
}