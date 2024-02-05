const episodes = getAllEpisodes();

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

function render() {
  const episodeCards = episodes.map(createEpisodeCard);
  document.getElementById("root").append(...episodeCards);
}

window.onload = render;
