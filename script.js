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

function render() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";
  const filteredEpisodes = state.episodes.filter(function (episode) {
    const lowercaseName = episode.name.toLowerCase();
    const lowercaseSummary = episode.summary.toLowerCase();
    return lowercaseName.includes(state.searchTerm.toLowerCase()) || lowercaseSummary.includes(state.searchTerm.toLowerCase());
  });

  const episodeCards = filteredEpisodes.map(createEpisodeCard);
  rootElem.append(...episodeCards);
}

render();
