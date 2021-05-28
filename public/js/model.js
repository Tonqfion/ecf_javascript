import { API_URL } from "./config.js";
import { SEARCH_FIELD_VALUE } from "./config.js";
import { SEARCH_BUTTON } from "./config.js";
import { PARENT_ELEMENT } from "./config.js";
import { SEARCH_FILTER } from "./config.js";

import { getJSON } from "./helpers.js";
import { shortenString } from "./helpers.js";

const resultBox = document.getElementById("result-box");
const resultsHeader = document.getElementById("results-header");

let searchResults = [];
let idNbr;
let currentSearch;
let limit = 25;
let startingPoint;
let totalResults;
let constructedURL;
let searchFilterInput = SEARCH_FILTER.value;

SEARCH_FILTER.addEventListener("input", function (ev) {
	ev.preventDefault();
	searchFilterInput = ev.target.value;
	console.log(searchFilterInput);
});

// Event listener au clic et à la touche entrée pour initialiser la première recherche
SEARCH_BUTTON.addEventListener("click", function () {
	// J'initialise (ou réinitialise) ma recherche en mettant l'offset (startingPoint) à 0, en relançant le compteur de résultats (affichage uniquement) et en vidant la grille de résultat
	startingPoint = 0;
	idNbr = 1;
	PARENT_ELEMENT.innerHTML = "";
	currentSearch = SEARCH_FIELD_VALUE.value;
	constructURLpart(searchFilterInput, currentSearch);
	console.log(constructedURL);
	loadSearchResults(PARENT_ELEMENT, startingPoint, limit);
});

document.addEventListener(
	"scroll",
	_.throttle(function (event) {
		if (getDocHeight() == getScrollXY()[1] + window.innerHeight) {
			if (startingPoint >= totalResults) {
			} else {
				loadSearchResults(PARENT_ELEMENT, startingPoint, limit);
			}
		}
	}, 1000)
);

// export const loadDetail = async function (id) {
//   try {
//     const data = await getJSON(`${API_URL}${id}`);

//     const { recipe } = data.data;
//     state.recipe = {
//       id: recipe.id,
//       title: recipe.title,
//       publisher: recipe.publisher,
//       sourceUrl: recipe.source_url,
//       image: recipe.image_url,
//       servings: recipe.servings,
//       cookingTime: recipe.cooking_time,
//       ingredients: recipe.ingredients,
//     };
//   } catch (err) {
//     throw err;
//   }
// };

// http://musicbrainz.org/ws/2/recording/?query=artistname:%22daft%20punk%22&fmt=json

const loadSearchResults = async function (parent, start, maxResults) {
	try {
		const resultMessage = document.getElementById("result-message");
		resultMessage.innerHTML = `<svg
      class="animate-spin ml-1 mr-3 h-5 w-5 text-blue-800"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>`;

		const data = await getJSON(
			encodeURI(
				`${API_URL}?query=${constructedURL}&fmt=json&limit=${maxResults}&offset=${start}`
			)
		);
		console.log(
			encodeURI(
				`${API_URL}?query=${constructedURL}&fmt=json&limit=${maxResults}&offset=${start}`
			)
		);
		totalResults = data.count;
		console.log(totalResults);
		resultMessage.innerHTML = "";
		resultMessage.classList.remove("p-2");
		searchResults = data.recordings.map((rec) => {
			return {
				rank: idNbr++,
				id: rec.id,
				title: shortenString(rec.title, 50),
				artist: shortenString(rec["artist-credit"][0].name, 50), //
				mainRelease: rec.hasOwnProperty("releases")
					? shortenString(rec.releases[0].title, 80)
					: "No information on release",
			};
		});
		console.log(startingPoint);
		console.log(idNbr);
		startingPoint += maxResults;
		function generateMarkUp(data) {
			if (data.length > 0) {
				const markUp = data.map(generateMarkupRow).join("");
				return markUp;
			} else {
				resultMessage.innerHTML = ` <div id="result-message" class="bg-blue-200 p-2 flex justify-center">
        <p class="font-bold italic text-center text-blue-800">Sorry, no results were found. Check your spelling or try a new search query.</p>
      </div>`;
				const markUp = "";
				return markUp;
			}
		}

		function generateMarkupRow(result) {
			return `<div class="result-row flex items-center px-2 py-4 border-gray-400 border-b-2">
          <p class="w-1/12 text-center">${result.rank}</p>
          <p class="w-3/12 border-l-2 border-blue-100 pl-3">${result.artist}</p>
          <p class="w-3/12 border-l-2 border-blue-100 pl-3">${result.title}</p>
          <p class="w-3/12 border-l-2 border-blue-100 pl-3">${result.mainRelease}</p>
          <p class="w-2/12 border-l-2 border-blue-100 pl-3">Action</p>
      </div>`;
		}

		parent.insertAdjacentHTML("beforeend", generateMarkUp(searchResults));
		// return idNbr;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

//below taken from http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
function getScrollXY() {
	var scrOfX = 0,
		scrOfY = 0;
	if (typeof window.pageYOffset == "number") {
		//Netscape compliant
		scrOfY = window.pageYOffset;
		scrOfX = window.pageXOffset;
	} else if (
		document.body &&
		(document.body.scrollLeft || document.body.scrollTop)
	) {
		//DOM compliant
		scrOfY = document.body.scrollTop;
		scrOfX = document.body.scrollLeft;
	} else if (
		document.documentElement &&
		(document.documentElement.scrollLeft || document.documentElement.scrollTop)
	) {
		//IE6 standards compliant mode
		scrOfY = document.documentElement.scrollTop;
		scrOfX = document.documentElement.scrollLeft;
	}
	return [scrOfX, scrOfY];
}

//taken from http://james.padolsey.com/javascript/get-document-height-cross-browser/
function getDocHeight() {
	var D = document;
	return Math.max(
		D.body.scrollHeight,
		D.documentElement.scrollHeight,
		D.body.offsetHeight,
		D.documentElement.offsetHeight,
		D.body.clientHeight,
		D.documentElement.clientHeight
	);
}

function constructURLpart(searchType, query) {
	if (searchType === "artist-opt") {
		constructedURL = `artist:"${query}" OR artistname:"${query}"`;
	} else if (searchType === "track-opt") {
		constructedURL = `recording:"${query}"`;
	} else if (searchType === "release-opt") {
		constructedURL = `release:"${query}"`;
	} else {
		constructedURL = `recording:"${query}" OR release:"${query}" OR artist:"${query}" OR artistname:"${query}"`;
	}
}
