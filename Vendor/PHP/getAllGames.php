<?php

header('Content-Type: application/json; charset=utf-8');
$getGamesResponse = array();

$getGamesCURL = curl_init();

curl_setopt_array($getGamesCURL, [
  CURLOPT_URL => 'https://api.rawg.io/api/games?key=ce159359e89a44c69acc5360188d2333&page_size=99',
  CURLOPT_RETURNTRANSFER => TRUE,
]);

$getGamesResult = curl_exec($getGamesCURL);
$getGamesERR = curl_error($getGamesCURL);
curl_close($getGamesCURL);

$decodeGamesResult = json_decode($getGamesResult, true);

if (!$getGamesERR) {
  $getGamesResponse['success'] = true;
  $getGamesResponse['message'] = 'Games retrieved successfully';
  $getGamesResponse['data'] = $decodeGamesResult;
  echo json_encode($getGamesResponse);

} else {
  $getGamesResponse['success'] = false;
  $getGamesResponse['message'] = 'Error retrieving data #:' . $getGamesERR;
  echo json_encode($getGamesResponse);
}

?>