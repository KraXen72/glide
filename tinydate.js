// modified version of https://github.com/lukeed/tinydate
var RGX = /([^{]*?)\w(?=\})/g;
const DATE_LOCALE = 'en-US'

const YY = (d) => d.getFullYear().toString()
const Mn = (d) => d.toLocaleDateString(DATE_LOCALE, { month: 'long' })
const mn = (d) => d.toLocaleDateString(DATE_LOCALE, { month: 'short' })
const Wn = (d) => d.toLocaleDateString(DATE_LOCALE, { weekday: 'long' })
const wn = (d) => d.toLocaleDateString(DATE_LOCALE, { weekday: 'short' })

//https://stackoverflow.com/a/15208341/13342359
// function ordinal(r){if(r>20||r<10)switch(r%10){case 1:return"st";case 2:return"nd";case 3:return"rd"}return"th"}
//swapped for superscript letters
function ordinal(r){if(r>20||r<10)switch(r%10){case 1:return"ˢᵗ";case 2:return"ⁿᵈ";case 3:return"ʳᵈ"}return"ᵗʰ"}

// custom map: remove time stuff, add more date stuff
var MAP = {
	YY,
	yy: (d) => YY(d).slice(2),
	mm: (d) => d.getMonth() + 1,
	Mn,
	_Mn: (d) => Mn(d).toLowerCase(),
	mn,
	_mn: (d) => mn(d).toLowerCase(),
	dd: 'getDate',
	ddt: (d) => `${d.getDate()}${ordinal(d.getDate())}`,
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