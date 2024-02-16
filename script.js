const state = {
  shows: [],
  episodes: [],
  searchTerm: "",
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
    state.selectedShowId = state.shows[0].id;
    fetchEpisodes();
  } catch (error) {
    state.error = "Error getting shows, Please try again later";
  }
  render();
}

async function fetchEpisodes() {
  try {
    const showId = state.selectedShowId;
    const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);
    const data = await response.json();
    state.episodes = data;
  } catch (error) {
    state.error = "Error getting episodes, Please try again later";
  }
  render();
}

function createEpisodeCard(episode) {
  const card = document.getElementById("episode-card").content.cloneNode(true);
  const title = card.querySelector("#episode-title");
  title.textContent = episode.name;
  title.setAttribute("href", episode.url);
  card.querySelector("#episode-code").textContent = episodeCode(episode.season, episode.number);
  card.querySelector("#episode-img").src = episode.image.medium;
  card.querySelector("#episode-summary").innerHTML = episode.summary;
  return card;
}

function episodeCode(season, number) {
  let s = season < 10 ? `0${season}` : season;
  let num = number < 10 ? `0${number}` : number;
  let code = `S${s}E${num}`;
  return code;
}

const searchBox = document.getElementById("search");
searchBox.addEventListener("input", handleSearchInput);

function handleSearchInput(event) {
  state.searchTerm = event.target.value;
  console.log(state.searchTerm);
  renderBySearch();
}

const showSelector = document.getElementById("show-selector");
showSelector.addEventListener("change", handleShowSelect);

function handleShowSelect(event) {
  state.selectedShowId = event.target.value;
  console.log(state.selectedShowId);
  fetchEpisodes();
}

function createShowListItem(show) {
  const showListItem = document.getElementById("show-list").content.cloneNode(true);
  const option = showListItem.querySelector("option");
  option.textContent = show.name;
  option.setAttribute("value", show.id);
  return showListItem;
}

const episodeSelector = document.getElementById("episode-selector");
episodeSelector.addEventListener("change", handleEpisodeSelect);

function handleEpisodeSelect(event) {
  state.selectedEpisodeId = event.target.value;
  console.log(state.selectedEpisodeId);
  renderByEpisodeSelect();
}

function createEpisodeListItem(episode) {
  const episodeListItem = document.getElementById("episode-list").content.cloneNode(true);
  const option = episodeListItem.querySelector("option");
  option.textContent = `${episodeCode(episode.season, episode.number)} - ${episode.name}`;
  option.setAttribute("value", episode.id);

  return episodeListItem;
}

function fillShowList() {
  const shows = state.shows;
  for (s of shows) {
    const showListItem = createShowListItem(s);
    document.getElementById("show-selector").append(showListItem);
    if (s.id == state.selectedShowId) {
      document.getElementById("show-selector").value = s.id;
    }
  }
}

function fillEpisodeList() {
  episodeSelector.textContent = "";
  const defaultOption = document.createElement("option");
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.innerHTML = "Select an option";
  document.getElementById("episode-selector").append(defaultOption);

  const episodes = state.episodes;
  for (e of episodes) {
    const episodeListItem = createEpisodeListItem(e);
    document.getElementById("episode-selector").append(episodeListItem);
  }
}

function renderByEpisodeSelect() {
  searchBox.value = "";
  state.searchTerm = "";
  renderByFilter((episode) => state.selectedEpisodeId == episode.id);
}

function renderBySearch() {
  episodeSelector.selectedIndex = 0;
  state.selectedEpisodeId = "";
  renderByFilter(filterBySearch);
}

function filterBySearch(episode) {
  const lowercaseName = episode.name.toLowerCase();
  const lowercaseSummary = episode.summary.toLowerCase();
  return lowercaseName.includes(state.searchTerm.toLowerCase()) || lowercaseSummary.includes(state.searchTerm.toLowerCase());
}

function renderByFilter(filterFunction) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const filteredEpisodes = state.episodes.filter(filterFunction);
  const episodeCards = filteredEpisodes.map(createEpisodeCard);
  rootElem.append(...episodeCards);

  document.getElementById("filter-info").textContent = `Displaying ${filteredEpisodes.length}/${state.episodes.length} episodes`;
}

document.getElementById("all-episodes").addEventListener("click", render);

function render() {
  fillShowList();
  fillEpisodeList();
  renderByEpisodeSelect();
  renderBySearch();
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = state.error || ""; // Display the error or an empty string if no error
}

fetchShows();
