// Function to generate game card HTML
function generateGameCardHTML(game) {
  const ratingsHTML = game.ratings.map(rating => {
    let backgroundColor = '';
    if (rating.percent >= 40) {
      backgroundColor = 'bg-success';
    } else if (rating.percent >= 25 && rating.percent <= 39) {
      backgroundColor = 'bg-primary';
    } else if (rating.percent >= 18 && rating.percent <= 24) {
      backgroundColor = 'bg-secondary';
    } else if (rating.percent >= 10 && rating.percent <= 17) {
      backgroundColor = 'bg-warning'
    } else {
      backgroundColor = 'bg-danger';
    }
    return `
      <div class="mb-3">
        <span class="${backgroundColor} text-light rounded p-2">${rating.title}:</span>
        <span class="fw-bold">${rating.percent}%</span>
      </div>
    `;
  }).join('');

  const platformsHTML = game.platforms.map(platform => `
    <span class="bg-info text-light rounded p-2 m-1">${platform.platform.name}</span>
  `).join('');

  return `
    <div class="game-card-container">
      <div class="card flex-row mb-3">
        <img class="card-img-left card-img-responsive" src="${game.background_image}" />
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div class="game-title-holder">
              <h5 class="card-title" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${game.name}</h5>
            </div>
            <span class="bg-success rounded p-2 text-light" title="Metacritic Rating">${game.metacritic}</span>
          </div>
          <p class="card-text">${game.released}</p>
          <div class="d-flex justify-content-center">
            <a href="#" class="show_desc_btn d-flex justify-content-end">Reviews & Info</a>
          </div>
        </div>
      </div>

      <div class="card-slider">
        <div class="bg-secondary text-light rounded p-2 d-flex justify-content-around mb-3">
          <span>Game length: ${game.playtime}h</span>
          <span>Genre: ${game.genres[0].name}</span>

        </div>
        <div class="text-center mb-3">
          <div class="platforms-container d-flex flex-wrap justify-content-center">${platformsHTML}</div>
        </div>
        <div class="d-flex justify-content-between m-4">
          <span>${ratingsHTML}</span>
        </div>
      </div>
    </div>
  `; //  <span>Rating: ${game.esrb_rating[0].name}</span>
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
      url: 'vendor/PHP/getGameCritic.php',
      data: { gameName: gameName },
      method: 'POST',
      dataType: 'JSON',
      success: function (response) {
        if (response.success) {
          var games = response.data.results;
          gameContainer.html('');
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
    url: 'vendor/PHP/getAllGames.php',
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