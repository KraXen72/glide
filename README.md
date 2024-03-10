# glide
*a modular but comfy startpage for many scenarios*  
  
![main](screenshots/main.png)
![layout](screenshots/layout.png)
![settings](screenshots/settings.png)
  
# features:
- fully modular layout! combine options to create your own unique startpage layout!  
- 2/3 columns, search, image, clock, category labels, greeting  
- drag and drop link editor! visual settings!
- image carousel option (shuffle or cycle in-order)
- [rosebox](https://github.com/KraXen72/rosebox) color scheme & ability to customize color scheme  
- saving to localstorage, importing and exporting of settings  
- instant load/startup *(looking at you, nightTab)*  
- click bottom right ◐ to toggle the visibility of the image  
- click bottom left ⚙ to open the settings popup 
  
### installation (chrome / chromium)
1. Clone this repo / download the zip and unzip it
2. go to `chrome://extensions` and enable developer mode (top right)
3. Click `Load unpacked` and select the folder which has a `manifest.json` file in it
4. If there are some warnings/errors, but the new tab works, ignore them.
![unpacked](screenshots/unpacked.png)  

### installation (firefox-based browsers)
> [!NOTE]
> This extension will currently only work for Firefox ESR, Developer Edition, Nightly or Floorp (and othe firefox-based browsers) - [Reasoning](https://support.mozilla.org/en-US/kb/add-on-signing-in-firefox?as=u)  
> It will not work in normal Firefox Stable! This is planned for the future.
  
1. First, download this repository as a .zip file or zip the contents of the repository if you cloned it.
2. In Firefox open `Settings` > `Extension & Themes`. 
3. Click on the settings icon at the top and choose "Install Add-on from file..." and choose the .zip file. 
4. Firefox will warn you that the extension is unsafe (due to it being unverified), but it is safe to use.

> [!NOTE]  
> Firefox has gone out of their way to make setting a local html file as a new tab page as hard as possible
> - Unsigned extensions are not supported, and even if signed, you'd have to re-package & sign it a lot if you change the images folder
> - Since version 41 or something, they removed `browser.newtab.url` from `about:config`, which was an easy way to set a custom new tab
> - Extensions like [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/) are still crippled by the fact that firefox doesen't allow `file://` (local files) url's to be set as a new tab - you'd have to host the extension online (won't work without internet connection), or run a local server, which is *absolutely ridiculous*

### custom images
if you want a custom image, put it in the ``img`` folder.
the image should be either a standard portrait image (good for left image) or a wide slice/landscape image (good for top image).   

After you put it in the img folder you can just change the image path in settings to the filename (don't add img/)
- custom css: you can create a `custom.css` to apply custom css (wow, unheard of)
  
### support development
[![Recurring donation via Liberapay](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/KraXen72)
[![One-time donation via ko-fi.com](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/kraxen72)  
Any donations are highly appreciated! <3

### thanks to:
- [this startpage](https://github.com/WahyuHidayattz/startpage-new) for inspiration & original html/css boilerplate  
- image `floccinauci.jpg` - album cover of Floccinaucinihilipilification (feat. Grim Salvo)  
- images/reze, images/yoruasa screenshots from chainsawman, (edited by me) found online  
- images from "Smoking with you behind the supermarket" manga, found online
- **i do not own most of the included images. I will provide credit/remove from the repo if requested.**
  
### libraries used:  
[object-observer](https://www.npmjs.com/package/@gullerya/object-observer) to automatically update layout when object changes - [repo](https://github.com/gullerya/object-observer)  
[sortablejs](https://www.npmjs.com/package/sortablejs) to enable drag and drop reordering of links - [repo](https://github.com/SortableJS/Sortable)    
[circle-assign](https://github.com/hammy2899/circle-assign) to enable deep object assigning (i can't believe js does not have it by default)  
[tinydate](https://github.com/lukeed/tinydate) super small date formatting library (modified to fit startpage's needs)  
  
**commit history (before inital release here):** [commit history](https://github.com/KraXen72/startpage-new)