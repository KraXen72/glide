// modified version of https://github.com/lukeed/tinydate
var RGX = /([^{]*?)\w(?=\})/g;

// added these constants
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// abstracted methods that are used multiple times
const getMonthNameByIndex = (index) => MONTHS[index]
const getWeekdayNameByIndex = (index) => WEEKDAYS[index]

const YY = (d) => d.getFullYear().toString()
const Mn = (d) => getMonthNameByIndex(d.getMonth())
const mn = (d) => Mn(d).slice(0, 3)
const Wn = (d) => getWeekdayNameByIndex(d.getDay()-1)
const wn = (d) => Wn(d).slice(0, 3)

// custom map: remove time stuff, add more date stuff
var MAP = {
	YY,
	yy: (d) => "'" + YY(d).slice(2),
	m: (d) => d.getMonth() + 1,
	mm: (d) => d.getMonth() + 1,
	Mn,
	_Mn: (d) => Mn(d).toLowerCase(),
	mn,
	_mn: (d) => mn(d).toLowerCase(),
	d: 'getDay',
	dd: 'getDay',
	Wn,
	_Wn: (d) => Wn(d).toLowerCase(),
	wn,
	_wn: (d) => wn(d).toLowerCase()
};

//  modified export function to a global one
function tinydate(str, custom) {
	var parts=[], offset=0;

	str.replace(RGX, function (key, _, idx) {
		// save preceding string
		parts.push(str.substring(offset, idx - 1));
		offset = idx += key.length + 1;
		// save function. patched slicing, so it won't slice off long stuff
		parts.push(custom && custom[key] || function (d) {
			// abstracted val out of return, only pad numbers
			const val = (typeof MAP[key] === 'string' ? d[MAP[key]]() : MAP[key](d))
			return typeof val === "number" ? ('00' + val).slice(-key.length) : val;
		});
	});

	if (offset !== str.length) {
		parts.push(str.substring(offset));
	}

	return function (arg) {
		var out='', i=0, d=arg||new Date();
		for (; i<parts.length; i++) {
			out += (typeof parts[i]==='string') ? parts[i] : parts[i](d);
		}
		return out;
	};
}