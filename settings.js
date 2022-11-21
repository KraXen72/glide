//DONE update these settings' values when i load the json from localstorage (before generating load from localstorage)
const settings = {
	s: [ //DONE change this to an array maybe??
		{ title: "Settings", type: 'heading', key: "settingTitle" },
		{ title: `Connect columns`, desc: `connects link columns together`, type: 'bool', key: 'connect', classes: ['connect', ''] },
		{ title: `Compact links`, desc: `make links not take up as much space`, type: 'bool', key: 'compact', classes: ['compact', ''] },
		{ title: `Move Image to left`, desc: `Move image to left instead of top.`, type: 'bool', key: 'leftpic', classes: ['leftpic', ''] },
		{ title: `Portrait left image`, desc: `force (358*279.72px) image aspect ratio, good for manga/movie cover`, type: 'bool', key: 'tallpic', classes: ['tallpic', ''] },
		{ title: `Container width (rem)`, desc: `set the container thickness. default is 40rem`, type: 'num', optType: 'Number', key: 'width', min: 32, max: 65 },
		{ title: `Number of columns`, desc: `How many columns to show: either 2 or 3`, type: 'sel', optType: 'Number', opts: [3, 2], key: 'cols', classes: ['cols-3', 'cols-2'] },
		{ title: `Clock style`, desc: `Which clock style to use: Hidden, Side, Greeting (needs visible title)`, type: 'sel', optType: 'String', opts: ["noclock", "side", "greeting"], key: "clocktype" },
		{ title: `Greeting style`, desc: '', key: 'greetingtype', type: 'sel', opts: ['nogreeting', 'greeting', 'greeting+date', 'date'], optType: 'String', desc: "what type of greeting to use (or none)" },
		{ title: `Date format`, key: 'dateformat', desc: 'date format to use. Check right setting pane for help.', type: 'autocomp', opts: ['{wn}, {dd}. {Mn}', '{_wn}, {dd}.{mm}', '{Wn}, {mm}/{dd}/{YY}', '{Wn}', '{wn}, {ddt} {mn}']},
		{ title: `Use Verdana font`, desc: `Use Verdana font instead of Roboto`, type: 'bool', key: 'verdana', classes: ['verdana', ''] },
		{ title: "Hiding elements", type: 'heading', key: "hidingTitle" },
		{ title: `Hide Search`, desc: '', type: 'bool', key: 'nosearch', classes: ['nosearch', ''] },
		{ title: `Hide Image`, desc: '', type: 'bool', key: 'nopic', classes: ['nopic', ''] },
		{ title: `Hide Title`, desc: '', key: 'notitle', type: 'bool', classes: ['notitle', ''] },
		{ title: `Hide Links (Experimental)`, desc: 'Only looks good with &quot;Move Image to left&quot; on', type: 'bool', key: 'nolinks', classes: ['nolinks', ''] },
		{ title: `Misc`, type: 'heading', key: "miscTitle" },
		{ title: `Make settings & toggle buttons incognito`, desc: 'make the small settings & toggle buttons invisible & only appear on hover', key: 'incognito', type: 'bool', classes: ['incognito', ''], updateCallback: 'misc' },
		{ title: `Custom font:`, key: 'customfont', type: 'text', updateCallback: 'misc', value: '', desc: 'place your custom font in /fonts. in format woff2. type the filename here. leave empty to reset.' },
		{ title: `Greeting text:`, key: 'greeting', type: 'text', updateCallback: 'misc', value: 'heya' },
		{ title: `1st column title:`, key: 'col1Title', type: 'text', updateCallback: 'misc', value: 'links' },
		{ title: `2nd column title:`, key: 'col2Title', type: 'text', updateCallback: 'misc', value: 'social' },
		{ title: `3rd column title:`, key: 'col3Title', type: 'text', updateCallback: 'misc', value: 'other' },
		{ title: `image path:`, key: 'imgPath', type: 'text', updateCallback: 'misc' },
		{ title: `additional images (1 per line):`, key: 'imgGallery', type: 'textarea', updateCallback: 'misc', desc: "1 image per line. Each time an image will be randomly selected." }
	],
	l: { //links
		col1: [
			{ name: "link 1", url: "#" },
			{ name: "link 2", url: "#" },
			{ name: "link 3", url: "#" },
			{ name: "link 4", url: "#" },
			{ name: "link 5", url: "#" },
		],
		col2: [
			{ name: "link 1", url: "#" },
			{ name: "link 2", url: "#" },
			{ name: "link 3", url: "#" },
			{ name: "link 4", url: "#" },
			{ name: "link 5", url: "#" },
		],
		col3: [
			{ name: "link 1", url: "#" },
			{ name: "link 2", url: "#" },
			{ name: "link 3", url: "#" },
			{ name: "link 4", url: "#" },
			{ name: "link 5", url: "#" },
		]
	}
}
var Sortables = []

//update from localstorage here
let ls_settings = localStorage.getItem('links')

//this will only update links & misc settings
if (typeof ls_settings !== 'undefined' && ls_settings !== null) {
	let parsed = JSON.parse(ls_settings)
	console.log("found data in localStorage, loading settings: ", parsed)
	Object.assign(settings.l, parsed) //update the current settings object with the one from localstorage
}

/**
 * creates a new Setting element
 */
class SettingElem {
	//s-update is the class for element to watch
	constructor(props) {
		/**@type {String} is the key to get checked when writing an update, for checkboxes it's checked, for selects its value etc.*/
		this.updateKey = ''
		/**@type {String} is the eventlistener to use. for checkbox its be onclick, for select its be onchange etc. */
		this.updateMethod = ''
		/** @type {Object} save the props from constructor to this class (instance) */
		this.props = props
		/** @type {'bool' | 'sel' | 'heading' | 'text' |'textarea' | 'num' | 'autocomp'} type of this settingElem */
		this.type = props.type
		/** @type {Boolean} if this setting actually changes something and can be updated. titles are immutable */
		this.mutable = false
		/** @type {String} innerHTML for settingElement */
		this.HTML = ''
		/** @type {Number | String} (only for 'sel' type) if Number, parseInt before assigning to Container */
		this.optType = ''
		/** @type {Function | 'misc' | 'normal'} custom callback for update function. 'misc' is for misc settings if nothing then default is 'normal' */
		this.updateCallback = props.updateCallback || 'normal'

		const descElem = (cls = "") => (!!props.desc && props.desc !== "") ? `<span class="setting-desc ${cls}" title="${props.desc}">?</span>` : ""
		const inlineDescElem = () => descElem("inline")

		switch (props.type) {
			case 'bool':
				this.HTML = `<span class="setting-title" title="${props.desc}">${props.title}</span> 
                <label class="switch">
                    <input class="s-update" type="checkbox" ${props.value ? "checked" : ""}/>
                    <div class="slider round"></div>
                </label>${descElem()}`
				this.mutable = true
				this.updateKey = `checked`
				this.updateMethod = 'onchange'
				break;
			case 'heading':
				this.HTML = `<h1 class="setting-title">${props.title}</h1>`
				this.mutable = false
				break;
			case 'sel':
				let selectStyle = false
				if (props.optType === "String") {
					const longest = props.opts.reduce((p, c) => c.length > p ? c.length : p, Number.NEGATIVE_INFINITY)
					const FONT_SIZE_REM = 1
					selectStyle = `style="width:${(longest * (FONT_SIZE_REM * 16))}px;left:initial;"`
				}
				this.HTML = `<span class="setting-title" title="${props.desc}">${props.title}</span> 
        						<label class="switch">
										<select class="s-update" ${selectStyle ? selectStyle : ""}>${props.opts.map(o => `<option value ="${o}">${o}</option>`).join("")}</select>
										</label>${descElem()}`
				this.mutable = true
				this.updateKey = `value`
				this.updateMethod = 'onchange'
				this.optType = props.optType
				break;
			case 'textarea':
				this.HTML = `<span class="setting-title" style="height: auto">${props.title}${inlineDescElem()}</span>
				<span><textarea class="rb-input s-update" name="${props.key}" autocomplete="off">${props.value ?? ""}</textarea></span>`
				this.mutable = true
				this.updateKey = `value`
				this.updateMethod = `oninput`
				this.optType = props.optType
				break;
			case 'text':
				this.HTML = `<span class="setting-title">${props.title} ${inlineDescElem()}</span>
				<span> <input type="text" class="rb-input s-update" name="${props.key}" autocomplete="off" value="${props.value}"> </span>`
				this.mutable = true
				this.updateKey = `value`
				this.updateMethod = `oninput`
				this.optType = props.optType
				break;
			case 'autocomp':
				const joinedTitle = props.title.replaceAll(" ", "-")
				this.HTML = `<span class="setting-title">${joinedTitle} ${inlineDescElem()}</span>
				<span><input type="text" class="rb-input s-update" name="${props.key}" autocomplete value="${props.value}" list="datalist-${joinedTitle}">
				<datalist id="datalist-${joinedTitle}">${props.opts.map(o => `<option value ="${o}">${o}</option>`).join("")}</datalist></span>`
				this.mutable = true
				this.updateKey = `value`
				this.updateMethod = `oninput`
				this.optType = 'String'
				break;
			case 'num':
				this.HTML = `<span class="setting-title">${props.title}</span>
				<span><input type="number" class="rb-input marright s-update" name="${props.key}" autocomplete="off" value="${props.value}" min="${props.min ?? -1}" max="${props.max ?? 1000}"></span>${descElem()}`
				this.mutable = true
				this.updateKey = `value`
				this.updateMethod = `onchange`
				this.optType = props.optType
				break;
			default:
				this.HTML = `<span class="setting-title">${props.title}</span><span>Unknown setting type</span>`
				this.mutable = false
		}
	}
	//this reflects the changes on the actual layout
	/**
	 * update the layout through updating global container object
	 * @param {{elem: Element, callback: 'normal'|Function}} elemAndCb
	 */
	set update({ elem, callback }) {
		let target = elem.getElementsByClassName('s-update')[0]
		let value = target[this.updateKey]

		//console.log(`dry run: would update '${this.props.key}' to '${value}'`)
		if (callback === 'normal') {
			//update the main container object that is bound to layout
			if (this.optType !== '' && this.optType === 'Number') {
				if (this.type === 'num') {
					//check it does not exceed range and updat the input if does
					console.log(value)
					value = parseInt(value)
					value = value > this.props.max ? this.props.max : value < this.props.min ? this.props.min : value
					target.value = value
					Container.p[this.props.key] = value
				} else {
					Container.p[this.props.key] = parseInt(value)
				}
			} else {
				Container.p[this.props.key] = value
			}
			//saveSettings()
		} else if (callback === 'misc') {
			//misc settings
			Container.m[this.props.key] = value
		} else { //this adds support for custom callbacks (custom settings)
			callback()
		}
	}

	/**
	 * this initializes the element and its eventlisteners. 
	 * @returns {Element}
	*/
	get elem() {
		// i only create the element after .elem is called so i don't pollute the dom with virutal elements when making settings
		let w = document.createElement('div') //w stands for wrapper
		w.classList.add("setting")
		w.id = `settingElem-${this.props.key}`
		w.classList.add(this.type) //add bool or title etc
		w.innerHTML = this.HTML

		if (this.type === 'sel') { w.querySelector('select').value = this.props.value } //select value applying is fucky so like fix it i guess

		//add an eventlistener if the setting is mutable
		if (this.mutable) {
			w[this.updateMethod] = () => {
				this.update = { elem: w, callback: this.updateCallback }
			}
		}
		return w //return the element
	}
}
/**
 * initialize settings elements. only call after DOM init. only call once.
 */
function initsettings() {
	//add value key to all settings from the container (after container is initialized)
	
	for (let i = 0; i < settings.s.length; i++) {
		const setting = settings.s[i];

		if (setting.type !== 'heading') {
			if (typeof setting.updateCallback !== 'undefined' && setting.updateCallback === 'misc') {
				setting.value = Container.m[setting.key] ?? ""
			} else {
				setting.value = Container.p[setting.key] ?? ""
			}
		}
	}

	//generate the setting elements
	for (let i = 0; i < settings.s.length; i++) {
		const val = settings.s[i]

		let set = new SettingElem(val)
		document.getElementById("layout-settings").appendChild(set.elem)
	}

	// autoresize textareas
	const tx = document.getElementsByTagName("textarea");
	const tx_updateFunc = (elem) => {
			elem.style.height = 0;
			elem.style.height = (elem.scrollHeight) + "px";
	}
	for (let i = 0; i < tx.length; i++) {
		tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
		tx[i].addEventListener("input", () => tx_updateFunc(tx[i]), false);
		tx[i].addEventListener("focus", () => tx_updateFunc(tx[i]), false);
		console.log(tx[i], tx[i].scrollHeight)
	}

	//generate sortable links
	//load links into columns - repeat once for every column
	Sortables = []
	for (let i = 0; i < Object.keys(settings.l).length; i++) {
		loadlinks(`sortable-col${i + 1}`, settings.l[`col${i + 1}`], 'config')
		let col = document.getElementById(`sortable-col${i + 1}`)
		let sort = new Sortable(col, {
			group: 'shared',
			animation: 150,
			handle: '.link-text',
			ghostClass: 'links-ghost'
		})
		Sortables.push(sort)
	}

	//add links submit form
	const addlink = document.getElementById('add-link')
	addlink.onsubmit = (event) => {
		event.preventDefault()
		const formData = new FormData(addlink);
		const entries = formData.entries();
		const data = Object.fromEntries(entries);

		addlink.querySelectorAll(`input.rb-input`).forEach(input => { input.value = "" }) //clear the values

		let linkValid = new RegExp(/^(http|https):/, "g").test(data['link-url'])
		if (!linkValid) { data['link-url'] = "https://" + data["link-url"] }

		let link = new LinkElem(data["link-name"], data['link-url'], 'config')
		let fewestChildrenColumnSelector = getFewestChildren(['#sortable-col1', '#sortable-col2', '#sortable-col3'])
		console.log(fewestChildrenColumnSelector)
		document.querySelector(fewestChildrenColumnSelector).appendChild(link.elem)
	}

	//add onclick listeners for saving
	[...document.getElementsByClassName('hook-save-btn')].forEach(btn => { btn.onclick = saveSettings })

	//backup
	document.getElementById('export-json').onclick = exportJson
	document.getElementById('import-json').onclick = importJson

	console.log("sucessfully generated settings")
}

/**
 * saves settings in localstorage. requires settings to be initialized and Sortables array to be populated.
 */
function saveSettings() {
	//save links
	let content = Sortables.map(s => s.el).map(el => serializeSortable(el))
	let finalobj = {
		col1: content[0],
		col2: content[1],
		col3: content[2]
	}
	Object.assign(settings, { l: finalobj })
	localStorage.setItem('links', JSON.stringify(finalobj))

	//yeet all the links
	let linkstodel = document.querySelector('.colwrap').getElementsByClassName('links')
	linkstodel = [...linkstodel]
	linkstodel.forEach(link => link.remove());
	initlinks() //load them again

	//save layout
	let saveme = serializeContainer()
	localStorage.setItem('Container', JSON.stringify(saveme))

	//save classlist
	let classList = [...document.getElementById('container').classList].join(' ')
	localStorage.setItem('classList', classList)

	console.log('saved')
	blinkElem("#savedmsg") //show saved message
}

/**
 * pass an array of queryselectors, get the one with fewest children back
 */
function getFewestChildren(selectorArray) {
	const children = selectorArray.map(selector => {
		return { selector, children: document.querySelector(selector).children.length }
	})

	children.sort((a, b) => { //sort from smallest to biggest
		return a.children - b.children
	})

	return children[0].selector;
}

/**
 * provided a html element that is a valid sortable, this will parse all its children, get the values and return an object
 * @param {Element} SortableElem the Element that is a valid sortable
 * @returns {Object} object in the same structure as settings.l
 */
function serializeSortable(SortableElem) {
	let children = [...SortableElem.children]
	let content = children.map(span => {
		return { name: span.querySelector('.link-text').textContent, url: span.href }
	})
	return content
}

/**
 * serialize links, container and classList, stringify and fill in the export input
 */
function exportJson() {
	let exportObj = { links: {}, Container: {}, classList: "", type: "valid-startpage-backup" }

	//add links
	let content = Sortables.map(s => s.el).map(el => serializeSortable(el))
	exportObj.links = {
		col1: content[0],
		col2: content[1],
		col3: content[2]
	}

	//add settings/Container
	let saveme = serializeContainer()
	exportObj.Container = saveme

	//add classlist
	exportObj.classList = [...document.getElementById('container').classList].join(' ')

	document.getElementById('export-json').previousElementSibling.value = JSON.stringify(exportObj)
}

/**
 * import a valid string (stringified object) as settings + links, save to localstorage & refresh
 */
function importJson() {
	let input = document.getElementById('import-json').previousElementSibling
	try {
		let val = JSON.parse(input.value)
		if (val.type === "valid-startpage-backup") {
			localStorage.setItem('links', JSON.stringify(val.links))
			localStorage.setItem('Container', JSON.stringify(val.Container))
			localStorage.setItem('classList', val.classList)

			window.location.reload()
		} else {
			throw "not a valid backup";
		}
	} catch (e) {
		console.error(e)
		alert("not a valid backup !")
		input.value = ""
	}

}