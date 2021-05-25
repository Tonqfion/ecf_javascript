import { API_URL } from "./config.js";
import { SEARCH_FIELD_VALUE } from "./config.js";
import { SEARCH_BUTTON } from "./config.js";
import { getJSON } from "./helpers.js";
import { shortenString } from "./helpers.js";

const resultBox = document.getElementById("result-box");
const resultsHeader = document.getElementById("results-header");

let searchResults = [];
let idNbr;
let currentSearch;
let limit = 20;

resultsHeader.insertAdjacentHTML(
	"afterend",
	` <div id="result-message" class="bg-blue-200 p-2 flex justify-center">
    <p class="font-bold italic text-center text-blue-800">Start searching...</p>
  </div>`
);

SEARCH_BUTTON.addEventListener("click", function () {
	idNbr = 1;
	const parentEl = document.getElementById("results-grid");
	parentEl.innerHTML = "";
	currentSearch = SEARCH_FIELD_VALUE.value;
	loadSearchResults(currentSearch, parentEl, idNbr, limit);
});

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

const loadSearchResults = async function (query, parent, start, maxResults) {
	try {
		const resultMessage = document.getElementById("result-message");
		resultMessage.innerHTML = `<div id="result-message" class="bg-blue-200 p-2 flex justify-center">
        
      <svg
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
    </svg>
      </div>`;

		const data = await getJSON(
			`${API_URL}?query=artistname:"${query}"&fmt=json&limit=${maxResults}&offset=${start}`
		);
		const totalResults = "";
		start = idNbr;
		resultMessage.innerHTML = "";
		resultMessage.classList.remove("p-2");
		searchResults = data.recordings.map((rec) => {
			return {
				rank: start++,
				id: rec.id,
				title: shortenString(rec.title, 50),
				artist: shortenString(rec["artist-credit"][0].name, 50),
				mainRelease: rec.hasOwnProperty("releases")
					? shortenString(rec.releases[0].title, 80)
					: "No information on release",
			};
		});
		idNbr = start;
		console.log(searchResults);
		function generateMarkUp(data) {
			if (data.length > 0) {
				const markUp = data.map(generateMarkupRow).join("");
				console.log(markUp);
				return markUp;
			} else {
				resultMessage.innerHTML = ` <div id="result-message" class="bg-blue-200 p-2 flex justify-center">
        <p class="font-bold italic text-center text-blue-800">Sorry, no results were found. Check your spelling or try a new search query.</p>
      </div>`;
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
		return idNbr;
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

document.addEventListener("scroll", function (event) {
	if (getDocHeight() == getScrollXY()[1] + window.innerHeight) {
		const parentEl = document.getElementById("results-grid");
		loadSearchResults(currentSearch, parentEl, idNbr, limit);
	}
});
