$(document).ready(function() {
  $('#main_search_form').submit(function(e) {
      e.preventDefault();

      var gameName = $('#searchGameInput').val();
      const gameContainer = $('#searched_game_container');

      $.ajax({
          url: 'getGameCritic.php',
          data: { gameName: gameName },
          method: 'POST',
          dataType: 'JSON',
          success: function(response) {
              if (response.success) {
                  var games = response.data.results;

                  games.forEach(function(game) {
                      var searchedGameHTML = `
                          <div class="card game-card">
                              <div class="card-image">
                                  <img src="${game.background_image}" height="50px">
                              </div>
                              <div class="card-title">
                                  <span>${game.name}</span>
                              </div>
                              <button class="show_desc_btn">Description</button>
                              <div class="card-body">
                                  <span>${game.rating}</span>
                                  <span>${game.released}</span>
                                  <div class="description_container">
                                      <p>desc</p>
                                  </div>
                              </div>
                          </div>
                      `;

                      gameContainer.append(searchedGameHTML);
                  });
              } else {
                  alert(response.message);
              }
          },
          error: function() {
              alert('Error fetching data');
          }
      });
  });
});

$(document).ready(function() {
  const gameContainer = $('#games_container');

  $.ajax({
    url: 'getAllGames.php',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.success) {
        const responseResult = response.data.results;
    
        responseResult.forEach(game => {
            var getGamesHTML = `
                <div class="card game-card">
                    <div class="card-image">
                        <img src="${game.background_image}" height="50px">
                    </div>
                    <div class="card-title">
                        <span>${game.name}</span>
                    </div>
                    <button class="show_desc_btn">Description</button>
                    <div class="card-body">
                        <span>${game.rating}</span>
                        <span>${game.released}</span>
                        <div class="description_container">
                            <p>desc</p>
                        </div>
                    </div>
                </div>
            `;
    
            gameContainer.append(getGamesHTML);
        });
    
        $('.description_container').hide();
    
        $('.show_desc_btn').click(function() {
            $(this).siblings('.card-body').find('.description_container').slideToggle();
        });
    }
     else {
        alert(response.message);
      }
    },
    error: function() {
      alert('Error fetching data');
    }
  });
});