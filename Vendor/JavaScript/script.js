function ratingsColors(rating) { // change rating background color
  let color = '';
  if (rating >= 40) {
    color = 'custom-green';
  } else if (rating >= 25 && rating <= 39) {
    color = 'custom-blue';
  } else if (rating >= 18 && rating <= 24) {
    color = 'custom-gray';
  } else if (rating >= 10 && rating <= 17) {
    color = 'custom-yellow';
  } else {
    color = 'custom-red';
  }
  return color; 
}

function platformIcons(platform) { // change platform name to icon
  let icon = '';
  if (platform === 'PlayStation') {
    icon = '<i class="fa-brands fa-playstation" title="Playstation"></i>';
  } else if (platform === 'PC') {
    icon = '<i class="fa-solid fa-desktop" title="PC"></i>';
  } else if (platform === 'Xbox') {
    icon = '<i class="fa-brands fa-xbox" title="Xbox"></i>';
  } else if (platform === 'Apple Macintosh' || platform === 'iOS') {
    icon = '<i class="fa-brands fa-apple" title="Apple Macintosh or iOS"></i>';
  } else if (platform === 'Android') {
    icon = '<i class="fa-brands fa-android" title="Android"></i>';
  } else if (platform === 'Linux') {
    icon = '<i class="fa-brands fa-linux" title="Linux"></i>';
  } 
  return icon;
}

function getGameAchievements(gameSlug) { // retrieve game achievements
  $.ajax({
    url: `https://api.rawg.io/api/games/${gameSlug}/achievements?key=ce159359e89a44c69acc5360188d2333`,
    method: 'GET',
    dataType: 'JSON',
    success: function(data) {
      if (data.results.length > 0) {
        const achievementsHTML = data.results.map(achievement => `
        <div class="game-achievement-container">
          <div>
            <a href="#" class="achievement-name"><img src="${achievement.image}" height="20px" title="${achievement.name}"> &nbsp;<i class="fa-solid fa-caret-down"></i>&nbsp; ${achievement.name}</a>
          </div>
          <div class="mr-3 achievement-description-container">
            <span>${achievement.description}</span>
          </div>
        </div>
        `).join('');
        $(`.achievements-${gameSlug}`).html(achievementsHTML);
      } else {
        $(`.achievements-${gameSlug}`).html('<span>No achievements found</span>');
      }

      $('.achievement-description-container').hide();
      $('.achievement-name').off('click').on('click', function() { // Open one
        $(this).closest('.game-achievement-container').find('.achievement-description-container').slideToggle();
      });

      $('.achievement-open-all').off('click').on('click', function() { // Open all
        $(this).closest('.game-card-container').find('.achievement-description-container').slideToggle();
      });
    },
    error: function() {
      $(`.achievements-${gameSlug}`).html('<span>Error loading achievements</span>');
    }
  });
}

// Function to generate game card HTML
function generateGameCardHTML(game) {
  // Get all ratings
  const ratingsHTML = game.ratings.map(rating => {
    const backgroundColor = ratingsColors(rating.percent);
    return `
      <div class="mb-4">
        <span class="${backgroundColor} custom-white rounded p-2">${rating.title ? rating.title: 'N/A'}:</span>
        <span class="fw-bold">${rating.percent ? rating.percent: 'N/A'}%</span>
      </div>
    `;
  }).join('');

  // Get all platforms
  const parentPlatformHTML = game.parent_platforms.map(parentPlatform => {
    const platformIcon = platformIcons(parentPlatform.platform.name);
    return `
    <span class="rounded p-2 m-1 custom-blue custom-white">${platformIcon ? platformIcon: parentPlatform.platform.name}</span>
    `;
  }).join('');

  // Get all genres
  const genresHTML = game.genres.map(genre => `
    <span>${genre.name ? genre.name: 'N/A'}</span>
  `).join('');

  getGameAchievements(game.slug);

  const screenshotsHTML = game.short_screenshots.map((screenshot) => `
    <a href="#" class="card-image-enlarge" data-image-src="${screenshot.image}">
      <img src="${screenshot.image}" class="m-2 rounded" height="120px">
    </a>

    <div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <img src="${screenshot.image}" id="imagepreview" >
        </div>
      </div>
    </div>
  `).join('');

  $(".card-image-enlarge").on("click", function() {
    var imageUrl = $(this).data('image-src');
    $('#imagepreview').attr('src', imageUrl);
    $('#imagemodal').modal('show');
  });

  return `
  <div class="game-card-container">
  <div class="card flex-row mb-3 custom-gray">
    <img class="card-img-left card-img-responsive" src="${game.background_image}" />
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <div class="game-title-holder">
          <h5 class="card-title custom-white">${game.name}</h5>
        </div>
        <p class="custom-calm-white"><span class="metacritic-title">Metacritic</span> &nbsp;<span class="rounded p-2 text-light custom-green" title="Metacritic Rating">${game.metacritic ? game.metacritic: 'N/A'}</span></p>
      </div>
      <p class="card-text custom-calm-white"><i class="fa-solid fa-calendar-days"></i>&nbsp; ${game.released ? game.released: 'N/A'}</p>
      <div class="d-flex justify-content-center">
        <a href="#" class="show_desc_btn d-flex fw-bold justify-content-end custom-calm-blue">More Details</a>
      </div>
    </div>
  </div>

  <div class="card-slider mb-4 fw-bold">
    <div class="rounded p-2 d-flex justify-content-around mb-3 custom-gray">
      <span>Game length: ${game.playtime ? game.playtime + 'h' : 'N/A'}</span>
      <span>Genre: ${genresHTML}</span>
      <span>Rating: ${game.esrb_rating ? game.esrb_rating.name : 'N/A'}</span>
    </div>
    <div class="text-center mb-3">
      <div class="platforms-container d-flex flex-wrap justify-content-center">${parentPlatformHTML}</div>
    </div>

    <div class="d-flex justify-content-between mb-4 achievements-ratings-container">
      <div>
        <div>
          <h5 class="fw-bold">Achievements</h5>
        </div>
        <div class="d-flex justify-content-center open-all-container">
          <a href="#" class="achievement-open-all custom-white">open all &nbsp;<i class="fa-solid fa-caret-down"></i></a>
        </div>
        <span class="achievements-${game.slug}"></span>
      </div>

      <div>
        ${ratingsHTML}
      </div>
    </div>

    <div class="d-flex flex-wrap justify-content-center">
      ${screenshotsHTML}
    </div>
  </div>
</div>
  `;
}

// Generate game cards and append them to a container
function generateGameCards(container, games) {
  games.forEach(function (game) {
    const gameCardHTML = generateGameCardHTML(game);
    container.append(gameCardHTML);
  });

  $('.card-slider').hide();

  $('.show_desc_btn').click(function () {
    $(this).closest('.game-card-container').find('.card-slider').slideToggle();
  });
}

// Search for games
$(document).ready(function () {
  $('#main_search_form').submit(function (e) {
    e.preventDefault();

    var gameName = $('#searchGameInput').val();
    const searchedGameContainer = $('#searched_game_container');
    const gameContainer = $('#games_container');

    $.ajax({
      url: 'vendor/PHP/getGameCritic.php',
      data: { gameName: gameName },
      method: 'POST',
      dataType: 'JSON',
      success: function (response) {
        if (response.success) {
          var games = response.data.results;
          searchedGameContainer.html('');
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

// Display all games
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

  const gameContainer = $('#games_container');

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
          <option value="${platform.id}">${platform.name}</option>
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
          <option value="${publisher.id}">${publisher.name}</option>
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

  $(selectGenre).change(function() { // sort games by genre
    const genreValue = $(this).val();
  
    $.ajax({
      url: 'Vendor/PHP/sortBy/sortByGenre.php',
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
        alert('Error sorting by genre');
      }
    });
  });

  $(selectPlatform).change(function() { // sort games by platform
    const platformValue = $(this).val();
  
    $.ajax({
      url: 'Vendor/PHP/sortBy/sortByPlatform.php',
      method: 'POST',
      dataType: 'JSON',
      data: { platformValue: platformValue },
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
        alert('Error sorting by genre');
      }
    });
  });

  $(selectPublisher).change(function() {
    const publisherValue = $(this).val();

    $.ajax({
      url: 'Vendor/PHP/sortBy/sortByPublisher.php',
      method: 'POST',
      dataType: 'JSON',
      data: { publisherValue: publisherValue },
      success: function(response) {
        if (response.success) {
          var selectedData = response.data.results;
          gameContainer.html('');
          generateGameCards(gameContainer, selectedData);
        } else {
          alert(response.message);
        }
      },
      error: function() {
        alert('Error sorting by publisher');
      }
    });
  })
});