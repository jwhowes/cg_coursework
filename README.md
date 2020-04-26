Webgl Living Room
=================

Installation
------------
If you choose to run the program via an http server, ensure node is installed and run:
	`$ npm install` From a command line

Execution
---------
To ensure textures work correctly do one of:
	1. Run chrome with allow-file-access-from-files enabled
		* e.g. `$ chrome.exe --allow-file-access-from-files`
	2. Open the file with a browser that supports cross-origin textures e.g. microsoft edge
	3. Create a local http server
		* Run `$ npx http-server`
		* Go to localhost:8080 in a browser

Controls
--------
To control the animations:
	- 'Space' changes TV channel
	- 'wasd' control camera position
	- left and right arrow keys rotate camera
	- 'Left control' toggles chair movement
	- 'L' and 'J' rotate the table
	- 'R' resets the scene (camera position, TV channel etc.)