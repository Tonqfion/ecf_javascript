import { CONSTANTS } from "../config.js";

class TrackView {
  #modal = CONSTANTS.MODAL_WINDOW;
  #parentElement = document.getElementById("modal-content");
  #data;

  render(data) {
    this.#data = data;
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  #clear() {
    this.#parentElement.innerHTML = "";
  }
  renderSpinner() {
    this.#modal.classList.toggle("hidden");
    const markup = `<div class="mx-auto flex-col justify-center	items-center"><svg
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
  </div>
          `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  #generateMarkup() {
    return `<h2 class="text-3xl leading-6 font-medium text-gray-900" id="modal-title">
    ${this.#data.trackTitle}
  </h2>
  <div class="mt-2">
    <p class="border-b-2 pb-2">
     First release : ${this.#data.trackReleaseDate} - Length : ${
      this.#data.trackLength
    }
    </p>
    <h3 class="mt-2 text-xl text-gray-900">Artist credits</h3>
    <p class="border-b-2 pb-2">
      ${this.#data.trackArtists[0].name}
    </p>
    <h3 class="mt-2 text-xl text-gray-900">Release list</h3>
    <p class="border-b-2 pb-2">
    ${this.#data.trackReleasesCleanOne[0].title}
    </p>
    <h3 class="mt-2 text-xl text-gray-900">Genres</h3>
    <p class="border-b-2 pb-2">
    ${this.#data.trackGenres[0].name}
    </p>
    <h3 class="mt-2 text-xl text-gray-900">Rating</h3>
    <p class="border-b-2 pb-2">
    ${this.#data.trackRating}
    </p>
    <h2 class="mt-16 text-3xl leading-6 font-medium text-gray-900" id="modal-title">
      Cover arts
    </h2>
  </div>`;
  }

  /*
  #generateMarkupBase() {
    return `<figure class="recipe__fig">
    <img src="${this.#data.image}" alt="${
      this.#data.title
    }" class="recipe__img" />
    <h1 class="recipe__title">
      <span>${this.#data.title}</span>
    </h1>
  </figure>

  <div class="recipe__details">
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${
        this.#data.cookingTime
      }</span>
      <span class="recipe__info-text">minutes</span>
    </div>
    <div class="recipe__info">
      <svg class="recipe__info-icon">
        <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${
        this.#data.servings
      }</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
        <button class="btn--tiny btn--increase-servings">
          <svg>
            <use href="${icons}#icon-minus-circle"></use>
          </svg>
        </button>
        <button class="btn--tiny btn--increase-servings">
          <svg>
            <use href="${icons}#icon-plus-circle"></use>
          </svg>
        </button>
      </div>
    </div>

    <div class="recipe__user-generated">
      <svg>
        <use href="${icons}#icon-user"></use>
      </svg>
    </div>
    <button class="btn--round">
      <svg class="">
        <use href="${icons}#icon-bookmark-fill"></use>
      </svg>
    </button>
  </div>

  <div class="recipe__ingredients">
    <h2 class="heading--2">Recipe ingredients</h2>
    <ul class="recipe__ingredient-list">
    ${this.#data.ingredients.map(this.#generateMarkupIngredient).join("")}
    </ul>
  </div>

  <div class="recipe__directions">
    <h2 class="heading--2">How to cook it</h2>
    <p class="recipe__directions-text">
      This recipe was carefully designed and tested by
      <span class="recipe__publisher">${
        this.#data.publisher
      }</span>. Please check out
      directions at their website.
    </p>
    <a
      class="btn--small recipe__btn"
      href="${this.#data.sourceUrl}"
      target="_blank"
    >
      <span>Directions</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </a>
  </div>`;
  }

  #generateMarkupAristList(artist) {
    return `
      <li class="recipe__ingredient">
        <svg class="recipe__icon">
          <use href="${icons}#icon-check"></use>
        </svg>
        <div class="recipe__quantity">${ing.quantity ? ing.quantity : ""}</div>
        <div class="recipe__description">
          <span class="recipe__unit">${ing.unit}</span>
          ${ing.description}
        </div>
      </li>`;
  }
  */
}

export default new TrackView();
