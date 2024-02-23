const showSearchBox = document.getElementById("show-search");
showSearchBox.addEventListener("input", handleShowSearchInput);

function handleShowSearchInput(event) {
  state.showSearchTerm = event.target.value;
  renderByShowSearch();
}

const state = {
  shows: [],
  episodes: [],
  showSearchTerm: "",
  episodeSearchTerm: "",
  selectedShowId: "",
  selectedEpisodeId: "",
  error: null,
};

async function fetchShows() {
  try {
    const response = await fetch("https://api.tvmaze.com/shows");
    const data = await response.json();
    state.shows = data;

    state.shows.sort(function (a, b) {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
    state.error = null;
    renderShows();
  } catch (error) {
    state.error = "Error getting shows, Please try again later";
  }
  render();
}

async function fetchEpisodes() {
  try {
    const showId = state.selectedShowId;
    const response = await fetch(
      `https://api.tvmaze.com/shows/${showId}/episodes`
    );
    const data = await response.json();
    state.episodes = data;

    state.error = null;
    const rootElem = document.getElementById("root");
    rootElem.style.display = "grid";
  } catch (error) {
    state.error = "Error getting episodes, Please try again later";
  }
  render();
}

function renderShows() {
  const showListContainer = document.getElementById("show-list-container");
  showListContainer.innerHTML = "";

  const rootElem = document.getElementById("root");
  const episodeSearch = document.getElementById("episode-search");
  const episodeSelector = document.getElementById("episode-selector");
  const episodesButton = document.getElementById("all-episodes");
  if (state.selectedShowId) {
    showListContainer.style.display = "none";
    rootElem.style.display = "grid";
    episodeSearch.style.display = "block"; // Show the episode search box
    episodeSelector.style.display = "block"; // Show the episode selector
    episodesButton.style.display = "block"; //To show the button Show All Episodes 
    if (state.episodes.length === 0) {
      fetchEpisodes();
    }
  } else {
    showListContainer.style.display = "grid";
    rootElem.style.display = "none";
    episodeSearch.style.display = "none"; // Hide the episode search box
    episodeSelector.style.display = "none"; // Hide the episode selector
    episodesButton.style.display = "none"; //To hide the button Show All Episodes
  }
  const shows = state.shows;
  for (const show of shows) {
    const showCard = document
      .getElementById("show-card")
      .content.cloneNode(true);
    const titleElement = showCard.querySelector("#show-title");
    titleElement.textContent = show.name;

    titleElement.addEventListener("click", () => {
      state.selectedShowId = show.id;
      fetchEpisodes();
    });
    showCard.querySelector("#show-img").src = show.image.medium;
    showCard.querySelector("#show-img").alt = `Image for ${show.name}`;
    showCard.querySelector("#show-summary").innerHTML = show.summary;
    showCard.querySelector(
      "#show-genres"
    ).textContent = `Genres: ${show.genres}`;
    showCard.querySelector(
      "#show-status"
    ).textContent = `Status: ${show.status}`;
    showCard.querySelector(
      "#show-rating"
    ).textContent = `Rating: ${show.rating.average}`;
    showCard.querySelector(
      "#show-runtime"
    ).textContent = `Runtime: ${show.runtime}`;
    showListContainer.appendChild(showCard);
  }
}

function createEpisodeCard(episode) {
  const card = document.getElementById("episode-card").content.cloneNode(true);
  const title = card.querySelector("#episode-title");
  title.textContent = episode.name;
  title.setAttribute("href", episode.url);
  card.querySelector("#episode-code").textContent = episodeCode(
    episode.season,
    episode.number
  );
  card.querySelector("#episode-img").src = episode.image.medium;
  card.querySelector("#episode-img").alt = `Image for ${episode.name}`;
  card.querySelector("#episode-summary").innerHTML = episode.summary;
  return card;
}

function episodeCode(season, number) {
  let s = season < 10 ? `0${season}` : season;
  let num = number < 10 ? `0${number}` : number;
  let code = `S${s}E${num}`;
  return code;
}

const searchBox = document.getElementById("episode-search");
searchBox.addEventListener("input", handleSearchInput);

function handleSearchInput(event) {
  state.episodeSearchTerm = event.target.value;
  console.log(state.episodeSearchTerm);
  renderByEpisodeSearch();
}

const showSelector = document.getElementById("show-selector");
showSelector.addEventListener("change", handleShowSelect);

function handleShowSelect(event) {
  const selectedValue = event.target.value;
  if (selectedValue === "all") {
    state.selectedShowId = "";
    render();
  } else {
    state.selectedShowId = selectedValue;
    fetchEpisodes();
  }
}

function createShowListItem(show) {
  const showListItem = document.createElement("option");
  showListItem.textContent = show.name;
  showListItem.setAttribute("value", show.id);

  showListItem.addEventListener("click", () => {
    state.selectedShowId = show.id;
    fetchEpisodes();
  });
  return showListItem;
}

function createShowAllOption() {
  const showAllOption = document.createElement("option");
  showAllOption.textContent = "Show All Shows";
  showAllOption.setAttribute("value", "all");
  return showAllOption;
}

const episodeSelector = document.getElementById("episode-selector");
episodeSelector.addEventListener("change", handleEpisodeSelect);

function handleEpisodeSelect(event) {
  const selectedValue = event.target.value;
  if (selectedValue === "all-episodes") {
    renderByFilter(() => true);
  } else {
    state.selectedEpisodeId = selectedValue;
    renderByEpisodeSelect();
  }
}

function createEpisodeListItem(episode) {
  const episodeListItem = document
    .getElementById("episode-list")
    .content.cloneNode(true);
  const option = episodeListItem.querySelector("option");
  option.textContent = `${episodeCode(episode.season, episode.number)} - ${
    episode.name
  }`;
  option.setAttribute("value", episode.id);

  return episodeListItem;
}

function fillShowList() {
  const showSelector = document.getElementById("show-selector");
  showSelector.innerHTML = "";

  const showAllOption = createShowAllOption();
  showSelector.appendChild(showAllOption);

  const shows = state.shows;
  for (const show of shows) {
    const showListItem = createShowListItem(show);
    document.getElementById("show-selector").append(showListItem);
    if (show.id == state.selectedShowId) {
      document.getElementById("show-selector").value = show.id;
    }
  }
}

function fillEpisodeList() {
  episodeSelector.textContent = "";

  const allEpisodesOption = document.createElement("option");
  allEpisodesOption.value = "all-episodes";
  allEpisodesOption.textContent = "Show All Episodes";
  document.getElementById("episode-selector").append(allEpisodesOption);

  const episodes = state.episodes;
  for (const episode of episodes) {
    const episodeListItem = createEpisodeListItem(episode);
    document.getElementById("episode-selector").append(episodeListItem);
  }
}

function renderByEpisodeSelect() {
  searchBox.value = "";
  state.episodeSearchTerm = "";
  renderByFilter((episode) => state.selectedEpisodeId == episode.id);
}

function renderByShowSearch() {
  const showListContainer = document.getElementById("show-list-container");
  showListContainer.innerHTML = "";

  const filteredShows = state.shows.filter(filterByShowSearch);
  for (const show of filteredShows) {
    const showCard = document
      .getElementById("show-card")
      .content.cloneNode(true);
    showCard.querySelector("#show-title").textContent = show.name;
    showCard.querySelector("#show-img").src = show.image.medium;
    showCard.querySelector("#show-img").alt = `Image for ${show.name}`;
    showCard.querySelector("#show-summary").innerHTML = show.summary;
    showCard.querySelector(
      "#show-genres"
    ).textContent = `Genres: ${show.genres}`;
    showCard.querySelector(
      "#show-status"
    ).textContent = `Status: ${show.status}`;
    showCard.querySelector(
      "#show-rating"
    ).textContent = `Rating: ${show.rating.average}`;
    showCard.querySelector(
      "#show-runtime"
    ).textContent = `Runtime: ${show.runtime}`;
    showListContainer.appendChild(showCard);
  }
  document.getElementById(
    "filter-info"
  ).textContent = `Displaying ${filteredShows.length}/${state.shows.length} shows`;
}

function renderByEpisodeSearch() {
  episodeSelector.selectedIndex = 0;
  state.selectedEpisodeId = "";
  renderByFilter(filterByEpisodeSearch);
}

function filterByShowSearch(show) {
  const lowercaseName = show.name.toLowerCase();
  const lowercaseSummary = show.summary.toLowerCase();
  const lowercaseGenres = show.genres.join(", ").toLowerCase();
  const searchTerm = state.showSearchTerm.toLowerCase();

  return (
    lowercaseName.includes(searchTerm) ||
    lowercaseSummary.includes(searchTerm) ||
    lowercaseGenres.includes(searchTerm)
  );
}

function filterByEpisodeSearch(episode) {
  const lowercaseName = episode.name.toLowerCase();
  const lowercaseSummary = episode.summary.toLowerCase();
  return (
    lowercaseName.includes(state.episodeSearchTerm.toLowerCase()) ||
    lowercaseSummary.includes(state.episodeSearchTerm.toLowerCase())
  );
}

function renderByFilter(filterFunction) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const filteredEpisodes = state.episodes.filter(filterFunction);
  const episodeCards = filteredEpisodes.map(createEpisodeCard);
  rootElem.append(...episodeCards);

  document.getElementById(
    "filter-info"
  ).textContent = `Displaying ${filteredEpisodes.length}/${state.episodes.length} episodes`; //This displays the number of episodes shown on the page
}

document.getElementById("all-episodes").addEventListener("click", render);
document.getElementById("all-shows").addEventListener("click", showAllShows);
function showAllShows() {
  state.selectedShowId = "";
  fetchEpisodes();
}

function render() {
  fillShowList();
  fillEpisodeList();
  renderByEpisodeSelect();
  renderByEpisodeSearch();
  renderByShowSearch();
  renderShows();
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = state.error || ""; // Display the error or an empty string if no error
}

fetchShows();
