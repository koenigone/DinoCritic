function ratingsColors(rating) { // change rating background color
  let color = '';
  if (rating >= 40) {
    color = 'bg-success';
  } else if (rating >= 25 && rating <= 39) {
    color = 'bg-primary';
  } else if (rating >= 18 && rating <= 24) {
    color = 'bg-secondary';
  } else if (rating >= 10 && rating <= 17) {
    color = 'bg-warning';
  } else {
    color = 'bg-danger';
  }
  return color; 
}

// Function to generate game card HTML
function generateGameCardHTML(game) {
  const ratingsHTML = game.ratings.map(rating => {
    const backgroundColor = ratingsColors(rating.percent);
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
          <span>Game length: ${game.playtime ? game.playtime : 'N/A'}h</span>
          <span>Genre: ${game.genres[0].name ? game.genres[0].name : 'N/A'}</span>
          <span>Rating: ${game.esrb_rating ? game.esrb_rating.name : 'N/A'}</span>

        </div>
        <div class="text-center mb-3">
          <div class="platforms-container d-flex flex-wrap justify-content-center">${platformsHTML}</div>
        </div>
        <div class="d-flex justify-content-between m-4">
          <span>${ratingsHTML}</span>
        </div>
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


// Generate Options for Select Elements genres, platforms and publishers
$(document).ready(function() {
  // Select Elements
  const selectGenre = $('#select_genre_input');
  const selectPlatform = $('#select_platform_input');
  const selectPublisher = $('#select_publisher_input');

  $.ajax({ // Generate game genres
    url: 'Vendor/PHP/gameGenres.php',
    method: 'GET',
    dataType: 'JSON',
    success: function(response) {
      if (response.success) {
        const genresData = response.data.results;

        genresData.forEach(function(genre) {
          var genresOptions = `
          <option value="${genre.name}">${genre.name}</option>
          `;
          selectGenre.append(genresOptions);
        });

      } else {
        alert(response.message);
      }
    },
    error: function() {
      alert('Failed fetching genres');
    }
  });

  $.ajax({ // Generate platforms
    url: 'Vendor/PHP/getPlatforms.php',
    method: 'GET',
    dataType: 'JSON',
    success: function(response) {
      if (response.success) {
        const platformData = response.data.results;

        platformData.forEach(function(platform) {
          platformsOptions = `
          <option value="${platform.name}">${platform.name}</option>
          `;

          selectPlatform.append(platformsOptions);
        })
      } else {
        alert(response.message);
      }
    },
    error: function() {
      alert('Error fetching platforms');
    }
  });

  $.ajax({ // Generate game publishers
    url: 'Vendor/PHP/getPublishers.php',
    method: 'GET',
    dataType: 'JSON',
    success: function(response) {
      if (response.success) {
        const publishersData = response.data.results;

        publishersData.forEach(function(publisher) {
          var publisherOptions = `
          <option value="${publisher.name}">${publisher.name}</option>
          `;

          selectPublisher.append(publisherOptions);
        })
      } else {
        alert(response.message);
      }
    },
    error: function() {
      alert('Error fetching publishers');
    }
  });

  $(selectGenre).change(function() { // display games by genre
    const genreValue = $(this).val();
    const gameContainer = $('#games_container');
  
    $.ajax({
      url: 'Vendor/PHP/displayGenres.php',
      method: 'POST',
      dataType: 'JSON',
      data: { genreValue: genreValue },
      success: function(response) {
        if (response.success) {
          gameContainer.html('');
          var selectedData = response.data.results;
          generateGameCards(gameContainer, selectedData);
        } else {
          alert(response.message);
        }
      },
      error: function() {
        alert('Error fetching genre data');
      }
    });
  });
    
});