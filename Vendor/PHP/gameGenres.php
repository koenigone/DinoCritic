<?php

header('Content-Type: application/json; charset=utf-8');
$getGamesGenresResponse = array();

$genresCURL = curl_init();

curl_setopt_array($genresCURL, [
  CURLOPT_URL => 'https://api.rawg.io/api/genres?key=ce159359e89a44c69acc5360188d2333',
  CURLOPT_RETURNTRANSFER => true,
]);

$gameGenresResult = curl_exec($genresCURL);
$gameGenresERR = curl_error($genresCURL);

curl_close($genresCURL);

if (!$gameGenresERR) {
  $decodeGenres = json_decode($gameGenresResult);

  if ($decodeGenres !== null) {
    $getGamesGenresResponse['success'] = true;
    $getGamesGenresResponse['message'] = 'Game genres retrieved successfully';
    $getGamesGenresResponse['data'] = $decodeGenres;
  } else {
    $getGamesGenresResponse['success'] = false;
    $getGamesGenresResponse['message'] = 'Error decoding game genres JSON';
  }
} else {
  $getGamesGenresResponse['success'] = false;
  $getGamesGenresResponse['message'] = 'Error retrieving game genres' . $gameGenresERR;
}

echo json_encode($getGamesGenresResponse);

?>
