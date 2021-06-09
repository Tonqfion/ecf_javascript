import { CONSTANTS } from "./config.js";
import * as detailsModel from "./detailsModel.js";
import { GET_JSON } from "./helpers.js";
import { SHORTEN_STRING } from "./helpers.js";
import { CONSTRUCT_URL_PART } from "./helpers.js";
import TrackView from "./view/trackView.js";

detailsModel.loadTrackDetail("738920d3-c6e6-41c7-b504-57761bb625fd");

let searchResults = [];
let idNbr;
let currentSearch;
let limit = 25;
let startingPoint;
let totalResults;
let searchFilterInput = CONSTANTS.SEARCH_FILTER.value;
let constructedURL;

CONSTANTS.SEARCH_FILTER.addEventListener("input", function (ev) {
  ev.preventDefault();
  searchFilterInput = ev.target.value;
  console.log(searchFilterInput);
});

// Event listener au clic et à la touche entrée pour initialiser la première recherche
CONSTANTS.SEARCH_BUTTON.addEventListener("click", function () {
  // J'initialise (ou réinitialise) ma recherche en mettant l'offset (startingPoint) à 0, en relançant le compteur de résultats (affichage uniquement) et en vidant la grille de résultat
  startingPoint = 0;
  idNbr = 1;
  CONSTANTS.PARENT_ELEMENT.innerHTML = "";
  currentSearch = CONSTANTS.SEARCH_FIELD_VALUE.value;
  constructedURL = CONSTRUCT_URL_PART(searchFilterInput, currentSearch);
  console.log(constructedURL);
  loadSearchResults(CONSTANTS.PARENT_ELEMENT, startingPoint, limit);
});

// export const loadDetail = async function (id) {
//   try {
//     const data = await GET_JSON(`${API_URL}${id}`);

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
  document.removeEventListener("scroll", scrollLoad);
  try {
    CONSTANTS.RESULT_MESSAGE.innerHTML = "";
    CONSTANTS.RESULT_MESSAGE.innerHTML = `<svg
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

    const data = await GET_JSON(
      encodeURI(
        `${CONSTANTS.API_URL}?query=${constructedURL}&fmt=json&limit=${maxResults}&offset=${start}`
      )
    );
    console.log(
      encodeURI(
        `${CONSTANTS.API_URL}?query=${constructedURL}&fmt=json&limit=${maxResults}&offset=${start}`
      )
    );
    totalResults = data.count;
    CONSTANTS.RESULT_COUNT_MESSAGE.classList.remove("hidden");
    CONSTANTS.RESULT_COUNT_MESSAGE.classList.add("flex");
    CONSTANTS.RESULT_COUNT_MESSAGE.innerHTML = `<p class="font-bold italic text-center text-blue-800">
      We found ${totalResults} results for this search.
    </p>`;
    searchResults = data.recordings.map((rec) => {
      return {
        rank: idNbr++,
        recordingID: rec.id,
        title: SHORTEN_STRING(rec.title, 50),
        artist:
          rec["artist-credit"].length === 1
            ? SHORTEN_STRING(rec["artist-credit"][0].name, 50)
            : SHORTEN_STRING(rec["artist-credit"][0].name, 50) +
              '<span class="italic"> & </span>' +
              SHORTEN_STRING(rec["artist-credit"][1].name, 50),
        artistID: rec["artist-credit"][0].artist.id,
        mainRelease: rec.hasOwnProperty("releases")
          ? SHORTEN_STRING(rec.releases[0].title, 80)
          : '<span class="font-bold italic text-red-800">No information on releases</span>',
        mainRelaseID: rec.hasOwnProperty("releases")
          ? rec["releases"][0].id
          : "",
      };
    });
    console.log(searchResults);
    startingPoint += maxResults;

    function generateMarkUp(data) {
      if (data.length > 0) {
        const markUp = data.map(generateMarkupRow).join("");
        return markUp;
      } else {
        CONSTANTS.RESULT_MESSAGE.innerHTML = `
        <p class="font-bold italic text-center text-blue-800">Sorry, no results were found. Check your spelling or try a new search query.</p>
      `;
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
          <p class="w-2/12 border-l-2 border-blue-100 pl-3">
          <button type="button" id=${result.recordingID}
              class="view-track-details w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
              View Track Details
          </button></p>
      </div>`;
    }

    parent.insertAdjacentHTML("beforeend", generateMarkUp(searchResults));
    if (totalResults <= limit) {
      CONSTANTS.RESULT_MESSAGE.innerHTML = `
    <p class="font-bold italic text-center text-blue-800">No more results to show!</p>
  `;
    }
    document.addEventListener("scroll", scrollLoad);

    const trackDetailsBtn = document.querySelectorAll(".view-track-details");
    trackDetailsBtn.forEach(function (trackDetailBtn) {
      trackDetailBtn.addEventListener("click", function () {
        const trackToShow = trackDetailBtn.id;
        controlTrackDetail(trackToShow);
      });
    });
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

function scrollLoad() {
  if (getDocHeight() == getScrollXY()[1] + window.innerHeight) {
    if (startingPoint >= totalResults) {
      CONSTANTS.RESULT_MESSAGE.innerHTML = `
        <p class="font-bold italic text-center text-blue-800">No more results to show!</p>
      `;
    } else {
      loadSearchResults(CONSTANTS.PARENT_ELEMENT, startingPoint, limit);
    }
  }
}

//https://musicbrainz.org/ws/2/recording/bd44e72c-efaf-47c3-b284-5da787d02583?inc=genres+artists+ratings&fmt=json

const controlTrackDetail = async function (trackID) {
  try {
    TrackView.renderSpinner();

    await detailsModel.loadTrackDetail(trackID);

    // 2) Rendering Recipe
    TrackView.render(detailsModel.details.trackDetails);
  } catch (err) {
    console.log(err);
  }
};

CONSTANTS.CLOSE_MODAL.addEventListener("click", function () {
  CONSTANTS.MODAL_WINDOW.classList.toggle("hidden");
});
