const searchInput = document.querySelector("#lecture-search");
const lectureCards = [...document.querySelectorAll(".lecture-card")];
const emptyState = document.querySelector("#empty-state");

searchInput?.addEventListener("input", () => {
  const query = searchInput.value.trim().toLocaleLowerCase();
  let visible = 0;

  lectureCards.forEach((card) => {
    const matches = !query || card.dataset.search.toLocaleLowerCase().includes(query);
    card.hidden = !matches;
    if (matches) visible += 1;
  });

  emptyState.hidden = visible !== 0;
});
