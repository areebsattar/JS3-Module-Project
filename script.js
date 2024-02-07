const state = {
  episodes: getAllEpisodes(),
  searchTerm: "",
};

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
  render();
}

// Search
// <<<<<--------------------------------------------->>>>>>
// Select down



function createEpisodeListItem(episode) {
  const episodeListItem = document.getElementById("episode-list").content.cloneNode(true);
  episodeListItem.querySelector("option").textContent = `${episodeCode(episode.season, episode.number)} - ${episode.name}`;
  return episodeListItem;
}

function renderEpisodeList() {
  const episodes = state.episodes;
  for (episode of episodes) {
    const episodeListItem = createEpisodeListItem(episode);
    document.getElementById("episode-selector").append(episodeListItem);
  }
}

function render() {
  renderEpisodeList();

  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const filteredEpisodes = state.episodes.filter(function (episode) {
    const lowercaseName = episode.name.toLowerCase();
    const lowercaseSummary = episode.summary.toLowerCase();
    return lowercaseName.includes(state.searchTerm.toLowerCase()) || lowercaseSummary.includes(state.searchTerm.toLowerCase());
  });

  // Creating DOM elements based on the data..
  const episodeCards = filteredEpisodes.map(createEpisodeCard);
  // Appending to the HTML
  rootElem.append(...episodeCards);

  document.getElementById("filter-info").textContent = `Displaying ${filteredEpisodes.length}/${state.episodes.length} episodes`;
}

render();
