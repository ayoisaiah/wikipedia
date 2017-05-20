"use strict";

const input = document.querySelector(".searchForm-input");
const form = document.querySelector(".searchForm");
const loadMore = document.querySelector(".moreResults-button");

const params = {
  searchTerm: "",
  sroffset: ""
};

function handleValueChange (event) {
  const container = document.querySelector(".container");
  if (!container.classList.contains("top-container")) {
    container.classList.add("top-container");
  }
}

function handleSubmit (event) {

  event.preventDefault();
  params.searchTerm =  input.value.trim();
  params.sroffset = "";

  const resultsContainer = document.querySelector(".resultsContainer");
  resultsContainer.innerHTML = "";

  loadMore.classList.add("hidden");
  document.querySelector(".moreResults p").classList.add("hidden");

  fetchResults(params.searchTerm, params.sroffset);
}

function fetchResults (keywords, number) {

  if (!keywords.length) return;

  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${keywords}&prop=info&inprop=url&utf8=&format=json&origin=*&sroffset=${number}&srlimit=20`;

  document.querySelector(".loading-indicator").classList.remove("hidden");

  fetch(url)
  .then(response => response.json())
  .then(data => {

    document.querySelector(".loading-indicator").classList.add("hidden");

    if (data.query.searchinfo.totalhits) {
      displayResults(data);
      return;
    }

    displayErrorMessage(keywords);
  });
}

function displayResults(data) {

  const result = data.query.search;
  params.sroffset = data.continue ? data.continue.sroffset : "";

  const resultsContainer = document.querySelector(".resultsContainer");

  result.forEach(result => {
    const url = `https://en.wikipedia.org/wiki/${result.title.replace(/ /g, "_")}`;

    resultsContainer.insertAdjacentHTML("beforeend",
      `<div class='resultItem'>
        <h3 class='resultItem-title'>
          <a href=${url} target='_blank'>${result.title}</a>
        </h3>
        <span class='resultItem-link'>${url}</span><br>
        <span class='resultItem-snippet'>${result.snippet}</span><br>
      </div>`
    );
  });

  if (data.continue) {
    loadMore.classList.remove("hidden");
    return;
  }

  document.querySelector(".moreResults p").classList.remove("hidden");
  loadMore.classList.add("hidden");

}

function displayErrorMessage (keywords) {

  const resultsContainer = document.querySelector(".resultsContainer");
  resultsContainer.innerHTML = "";

  loadMore.classList.add("hidden");
  document.querySelector(".moreResults p").classList.add("hidden");

  resultsContainer.insertAdjacentHTML("beforeend",
    `<div class='errorMessage'>
      <p>Your search - <span class='keyword'>${keywords}</span> - did not match any documents.</p>
        <li>Make sure that all words are spelled correctly.</li>
        <li>Try different keywords.</li>
        <li>Try more general keywords.</li>
      </p>
    </div>`
  );

}

input.addEventListener("input", handleValueChange);
form.addEventListener("submit", handleSubmit);

loadMore.addEventListener("click", () => {
  fetchResults(params.searchTerm, params.sroffset);
});
