# glide
*a modular but comfy startpage for many scenarios*  
  
![main](screenshots/main.png)
![layout](screenshots/layout.png)
![settings](screenshots/settings.png)
  
# features:
- fully modular layout! combine options to create your own unique startpage layout!  
- 2/3 columns, search, image, clock, category labels, greeting  
- drag and drop link editor! visual settings!  
- [rosebox](https://github.com/KraXen72/rosebox) color scheme & ability to customize color scheme  
- saving to localstorage, importing and exporting of settings  
- fast startup time *(looking at you, nightTab)*  
- click bottom right ◐ to toggle the visibility of the image  
- click bottom left ⚙ to open the settings popup  
  
### installation (chrome / chromium)
I included a simple ``manifest.json`` so you can import it as a chrome extension.  
just clone this repo and load unpacked extension. (you have to enable developer mode)    
![unpacked](screenshots/unpacked.png)  
you can also install this in firefox or any browser, just set the ``index.html`` to your new tab page / create an addon which replaces the new tab page with this ``index.html``

### custom images
if you want a custom image, put it in the ``img`` folder.
the image should be either a standard portrait image (good for left image) or a wide slice/landscape image (good for top image).   
After you put it in the img folder you can just change the image path in settings to the filename (don't add img/)

### thanks to:
[this startpage](https://github.com/WahyuHidayattz/startpage-new) for inspiration & original html/css boilerplate
  
### libraries used:  
[object-observer](https://github.com/gullerya/object-observer/blob/main/src/object-observer.js) to automatically update layout when object changes - [repo](https://github.com/gullerya/object-observer)  
[sortablejs](http://sortablejs.github.io/Sortable/Sortable.js) to enable drag and drop reordering of links - [repo](https://github.com/SortableJS/Sortable)    