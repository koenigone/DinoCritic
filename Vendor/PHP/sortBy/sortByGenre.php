<?php

header('Content-Type: application/json; charset=utf-8');
$sortGenresResponse = array();

if (isset($_POST['genreValue'])) {
  $genreVal = $_POST['genreValue'];

  $sortGenresCURL = curl_init();

  curl_setopt_array($sortGenresCURL, [
    CURLOPT_URL => 'https://api.rawg.io/api/games?key=ce159359e89a44c69acc5360188d2333&page_size=100&genres=' . 
                    $genreVal = ($genreVal === 'RPG') ? strtoupper($genreVal) : strtolower($genreVal), // if RPB, keep uppercase, else, lowercase input
    CURLOPT_RETURNTRANSFER => TRUE
  ]);

  $sortGenresResult = curl_exec($sortGenresCURL);
  $sortGenresERR = curl_error($sortGenresCURL);
  curl_close($sortGenresCURL);

  if (!$sortGenresERR) {
    $decodeSortGenresResult = json_decode($sortGenresResult);

    if ($decodeSortGenresResult !== null) {
      $sortGenresResponse['success'] = true;
      $sortGenresResponse['message'] = 'Games sorted by genre';
      $sortGenresResponse['data'] = $decodeSortGenresResult;
    } else {
      $sortGenresResponse['success'] = false;
      $sortGenresResponse['message'] = 'Sort by genre: no result found';
    }
  } else {
    $sortGenresResponse['success'] = false;
    $sortGenresResponse['message'] = 'Error sorting by genre:' . $sortGenresERR;
  }
} else {
  $sortGenresResponse['success'] = false;
  $sortGenresResponse['message'] = 'Genre value not provided';
}

echo json_encode($sortGenresResponse);

?>

