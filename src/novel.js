import { getCubeScene, getDroneScene, getShedScene } from "./script"
/* **SUPER IMPORTANT**  PUT THE URL OF THE JSON FILE WHERE YOU INSERTED ALL YOUR DATA HERE !! */
const vnData = '/VNData.json'


// Creates the HTML and inserts it into the document 
const insertHTML = () => {
	return `
        <div id='mainbox'>
			<div id='spritebox' class='rightalign'>
				<img src=''>
			</div>
			<div id='namebox'>
					<span>Loading...</span>
			</div>
			<div id='textbox'>
				<p>Loading...</p>
				<div id='optionsbox'></div>
			</div>
		</div>
    `
}

const htmlData = insertHTML()
document.getElementById('VisualNovelEngine').insertAdjacentHTML("beforebegin", htmlData)

// Creates constants based off of the HTML created
const $textbox = document.querySelector("#textbox p")
const $optionsbox = document.querySelector('#optionsbox')
const $namebox = document.querySelector("#namebox span")
// const $spritebox = document.querySelector("#spritebox img");
// const $mainbox = document.querySelector('#mainbox')

let json, to

//Tracks what "Page Number" the user is on
var pageNum = 0
var currentPage

async function grabData() {
	// Load the data

	/* Fetches the data from the server */
	const resp = await fetch(vnData)

	/* Putting the data into an array */
	json = await resp.json()

	currentPage = Object.keys(json.Scene1.PAGES)[pageNum]

	// Initialize the data 
	initialize(json)
	handleOptions(json)

}

// Initializes the data & also handles page turning 
async function initialize(data) {

	//cleans it all
	// $spritebox.src = '';
	$namebox.innerText = ''
	$textbox.innerText = '';

	//Changes appropriate HTML elements to the new attributes based on the data given when page turns/ program is initialized
	// $spritebox.src = data.Characters[data.Scene1.PAGES[currentPage].Character][data.Scene1.PAGES[currentPage].Sprite];

	$namebox.innerText = data.Scene1.PAGES[currentPage].Character

	typeWriter(data.Scene1.PAGES[currentPage].PageText)
	// $textbox.innerText = data.Scene1.PAGES[pageNum][2]; //Uncomment this part for no typewriter effect 

	// $mainbox.style.backgroundImage = "url(" + data.Scene1.Background + ")"; 

}

const handleOptions = (data) => {

	//Cleans it out
	$optionsbox.innerHTML = ""

	if (data.Scene1.PAGES[currentPage].hasOwnProperty('Options')) {
		var o = data.Scene1.PAGES[currentPage].Options
		var str = Object.keys(o).forEach(k => {
			const row = document.createElement('div')
			row.innerHTML = `${k}`
			$optionsbox.appendChild(row)
			row.addEventListener('click', () => {

				currentPage = (o[k])
				pageNum = Object.keys(json.Scene1.PAGES).indexOf(currentPage)
				initialize(json)
				$optionsbox.innerHTML = ""
			})

		})
	}


}

//Typewriter Effect 
const typeWriter = (txt, i) => {
	i = i || 0;
	if (!i) {
		$textbox.innerHTML = ''
		clearTimeout(to);
	}
	var speed = 30; /* The speed/duration of the effect in milliseconds */
	if (i < txt.length) {
		var c = txt.charAt(i++)
		if (c === ' ') c = '&nbsp;'
		$textbox.innerHTML += c
		to = setTimeout(function () {
			typeWriter(txt, i)
		}, speed)
	}
}

const checkPage = (data) => {
	if (data.Scene1.PAGES[currentPage].hasOwnProperty('Options')) return false
	if (data.Scene1.PAGES[currentPage].hasOwnProperty('NextPage')) {
		if (data.Scene1.PAGES[currentPage].NextPage == "End") return false
	}

	return true
}



//Handles page turning when right or left arrow key is pressed 
document.addEventListener('keydown', (e) => {
	if (!json) return;
	if (e.code == "Space" && checkPage(json)) {

		if (json.Scene1.PAGES[currentPage].hasOwnProperty('NextPage')) {
			currentPage = json.Scene1.PAGES[currentPage].NextPage
		}
		else {
			pageNum++;
			currentPage = Object.keys(json.Scene1.PAGES)[pageNum]
		}

		initialize(json);
		handleOptions(json);

		if (json.Scene1.PAGES[currentPage].hasOwnProperty('Back')) {
			if (json.Scene1.PAGES[currentPage].Back == "Cube") {
				getCubeScene()
			} else if (json.Scene1.PAGES[currentPage].Back == "Drone") { 
				getDroneScene() 
			} else if (json.Scene1.PAGES[currentPage].Back == "Shed") { 
				getShedScene()
			} else return


		} else return
	}
	else return

})



//Grabs the json data from the server
grabData()