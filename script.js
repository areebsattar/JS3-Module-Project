//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  for (const episode of episodeList) {
    const card = document.getElementById("show-card").content.cloneNode(true);
    const title = card.querySelector("#show-title");
    title.textContent = episode.name;
    title.setAttribute("href", episode.url);
    card.querySelector("#episode-code").textContent = episodeCode(episode.season, episode.number);
    card.querySelector("#episode-img").src = episode.image.medium;
    card.querySelector("#episode-summary").innerHTML = episode.summary;
    rootElem.append(card);
  }
}

function episodeCode(season, number) {
  let s = season < 10 ? `0${season}` : season;
  let num = number < 10 ? `0${number}` : number;
  let code = `S${s}E${num}`;
  return code;
}
window.onload = setup;
