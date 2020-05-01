Webgl Living Room
=================

Installation
------------
If you choose to run the program via an http server, ensure node is installed and run:
	`$ npm install` From a command line

Execution
---------
For best results I recommend not using Google Chrome. Microsoft Edge or Firefox are more efficient at executing webgl animations.
The file to run is: ./src/main.html
To ensure textures work correctly do one of:
	1. Open the file with a browser that supports cross-origin textures e.g. Microsoft Edge
	2. Run chrome with allow-file-access-from-files enabled
		* e.g. `$ chrome.exe --allow-file-access-from-files`
	3. Create a local http server (the textures may take a second to load)
		* Run `$ npx http-server`
		* Go to localhost:8080 in a browser
		* Navigate to src/main.html
		* Or simply load localhost:8080/src/main.html directly from a browser

Controls
--------
To control the animations:
	- 'Space' changes TV channel
	- 'wasd' control camera position
	- left and right arrow keys rotate camera
	- 'Left control' toggles chair movement
	- 'L' and 'J' rotate the table
	- 'R' resets the scene (camera position, TV channel etc.)