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
  // Get all ratings
  const ratingsHTML = game.ratings.map(rating => {
    const backgroundColor = ratingsColors(rating.percent);
    return `
      <div class="mb-3">
        <span class="${backgroundColor} text-light rounded p-2">${rating.title ? rating.title: 'N/A'}:</span>
        <span class="fw-bold">${rating.percent ? rating.percent: 'N/A'}%</span>
      </div>
    `;
  }).join('');

  // Get all platforms
  const platformsHTML = game.platforms.map(platform => `
    <span class="bg-info text-light rounded p-2 m-1">${platform.platform.name ? platform.platform.name: 'N/A'}</span>
  `).join('');

  // Get all genres
  const genresHTML = game.genres.map(genre => `
    <span>${genre.name ? genre.name: 'N/A'}</span>
  `).join('');

  // Get all tags
  const tagsHTML = game.tags.map(tag => `
    <span class="bg-secondary rounded p-1 text-light mr-1 game-tags-span">${tag.name}</span>
  `).join('');

  // Fetch game achievements
  function getGameAchievements(gameSlug) {
    $.ajax({
      url: `https://api.rawg.io/api/games/${gameSlug}/achievements?key=ce159359e89a44c69acc5360188d2333`,
      method: 'GET',
      dataType: 'JSON',
      success: function(data) {
        if (data.results.length > 0) {
          const achievementsHTML = data.results.map(achievement => `
            <div>
              <span>${achievement.name}</span>
              <span>${achievement.description}</span>
            </div>
          `).join('');
          $(`.achievements-container-${gameSlug}`).html(achievementsHTML);
        } else {
          $(`.achievements-container-${gameSlug}`).html('<span>No achievements found</span>');
        }
      },
      error: function() {
        $(`.achievements-container-${gameSlug}`).html('<span>Error loading achievements</span>');
      }
    });
  }  

  getGameAchievements(game.slug);

  const screenshotsHTML = game.short_screenshots.map((screenshot, index) => `
    <div class="slide ${index === 0 ? 'active' : ''}">
      <img src="${screenshot.image}" alt="Slide ${index + 1}">
    </div>
  `).join('');

  const dotsHTML = game.short_screenshots.map((screenshot, index) => `
    <div class="dot ${index === 0 ? 'active-dot' : ''}"></div>
  `).join('');

  $(document).ready(function () {
    let currentIndex = 0;
    let slideCount = $('.slide').length;
  
    $('.prev').on('click', function () {
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = 0; // Prevent scrolling beyond the first image
      }
      showSlide(currentIndex);
    });
  
    $('.next').on('click', function () {
      currentIndex++;
      if (currentIndex >= slideCount) {
        currentIndex = slideCount -1;
      } else {
        showSlide(currentIndex);
      }
    });
  
    $('.dot').on('click', function () {
      currentIndex = $(this).index();
      showSlide(currentIndex);
    });
  
    function showSlide(index) {
      $('.slide').hide().removeClass('active');
      $('.dot').removeClass('active-dot');
      $('.slide').eq(index).show().addClass('active');
      $('.dot').eq(index).addClass('active-dot');
    }
  
    showSlide(currentIndex);
  });  

  return `
    <div class="game-card-container">
      <div class="card flex-row mb-3">
        <img class="card-img-left card-img-responsive" src="${game.background_image}" />
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div class="game-title-holder">
              <h5 class="card-title" style="white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${game.name}</h5>
            </div>
            <span class="bg-success rounded p-2 text-light" title="Metacritic Rating">${game.metacritic ? game.metacritic: 'N/A'}</span>
          </div>
          <p class="card-text">${game.released ? game.released: 'N/A'}</p>
          <div class="d-flex justify-content-center">
            <a href="#" class="show_desc_btn d-flex justify-content-end">Reviews & Info</a>
          </div>
        </div>
      </div>

      <div class="card-slider">
        <div class="bg-secondary text-light rounded p-2 d-flex justify-content-around mb-3">
          <span>Game length: ${game.playtime ? game.playtime + 'h' : 'N/A'}</span>
          <span>Genre: ${genresHTML}</span>
          <span>Rating: ${game.esrb_rating ? game.esrb_rating.name : 'N/A'}</span>
        </div>
        <div class="text-center mb-3">
          <div class="platforms-container d-flex flex-wrap justify-content-center">${platformsHTML}</div>
        </div>
        <div class="d-flex justify-content-between m-4">
          <span>${ratingsHTML}</span>
          <span class="achievements-container-${game.slug}"></span> <!-- Use specific class for each game -->
        </div>

        <div class="slider-container">
            
          ${screenshotsHTML}

          <button class="prev">❮</button>
          <button class="next">❯</button>

          <div class="dots">
            ${dotsHTML}
          </div>
        </div>

        <div class="d-flex justify-content-between m-4">
          <span>${tagsHTML}</span>
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