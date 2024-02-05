// Function to generate game card HTML
function generateGameCardHTML(game) {
  const ratingsHTML = game.ratings.map(rating => `
    <div>
      <span>${rating.title}:</span>
      <span>${rating.percent}%</span>
    </div>
  `).join('');

  const platformsHTML = game.platforms.map(platform => `
    <div>
      <span>${platform.platform.name}</span>
    </div>
  `).join('');

  return `
    <div class="game-card-container">
      <div class="card flex-row mb-3">
        <img class="card-img-left card-img-responsive" src="${game.background_image}" />
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div style="width: 200px; overflow: hidden;">
              <h5 class="card-title" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${game.name}</h5>
            </div>
            <span class="bg-success rounded p-2 text-light" title="Metacritic Rating">${game.metacritic}</span>
          </div>
          <p class="card-text">${game.released}</p>
          <div class="d-flex justify-content-center">
            <a href="#" class="show_desc_btn d-flex justify-content-end">Top Reviews</a>
          </div>
        </div>
      </div>

      <div class="card-slider">
        <span>${ratingsHTML}</span>
        <span>Game length: ${game.playtime}</span>
        <span>Last updated: ${game.updated}</span>
        <div class="platforms">${platformsHTML}</div>
      </div>
    </div>
  `;
}

// Function to generate game cards and append them to a container
function generateGameCards(container, games) {
  games.forEach(function (game) {
    if (game.metacritic !== null) {
      const gameCardHTML = generateGameCardHTML(game);
      container.append(gameCardHTML);
    }
  });

  $('.card-slider').hide();

  $('.show_desc_btn').click(function () {
    $(this).closest('.game-card-container').find('.card-slider').slideToggle();
  });
}

$(document).ready(function () {
  $('#main_search_form').submit(function (e) {
    e.preventDefault();

    var gameName = $('#searchGameInput').val();
    const gameContainer = $('#searched_game_container');

    $.ajax({
      url: 'getGameCritic.php',
      data: { gameName: gameName },
      method: 'POST',
      dataType: 'JSON',
      success: function (response) {
        if (response.success) {
          var games = response.data.results;
          generateGameCards(gameContainer, games);
        } else {
          alert(response.message);
        }
      },
      error: function () {
        alert('Error fetching data');
      }
    });
  });
});

$(document).ready(function () {
  const allGamesContainer = $('#games_container');

  $.ajax({
    url: 'getAllGames.php',
    method: 'GET',
    dataType: 'json',
    success: function (response) {
      if (response.success) {
        const allGames = response.data.results;
        generateGameCards(allGamesContainer, allGames);
      } else {
        alert(response.message);
      }
    },
    error: function () {
      alert('Error fetching data');
    }
  });
});