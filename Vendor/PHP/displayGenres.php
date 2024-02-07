<?php

header('Content-Type: application/json; charset=utf-8');
$displayGenresResponse = array();

if (isset($_POST['genreValue'])) {
  $genreVal = $_POST['genreValue'];

  $displayGenresCURL = curl_init();

  curl_setopt_array($displayGenresCURL, [
    CURLOPT_URL => 'https://api.rawg.io/api/games?key=ce159359e89a44c69acc5360188d2333&genres=' . strtolower($genreVal),
    CURLOPT_RETURNTRANSFER => TRUE
  ]);

  $displayGenresResult = curl_exec($displayGenresCURL);
  $displayGenresERR = curl_error($displayGenresCURL);
  curl_close($displayGenresCURL);

  if (!$displayGenresERR) {
    $decodeDisplayGenresResult = json_decode($displayGenresResult);

    if ($decodeDisplayGenresResult !== null) {
      $displayGenresResponse['success'] = true;
      $displayGenresResponse['message'] = 'Genre retrieved successfully';
      $displayGenresResponse['data'] = $decodeDisplayGenresResult;
    } else {
      $displayGenresResponse['success'] = false;
      $displayGenresResponse['message'] = 'No result found';
    }
  } else {
    $displayGenresResponse['success'] = false;
    $displayGenresResponse['message'] = 'Error retrieving genre:' . $displayGenresERR;
  }

  echo json_encode($displayGenresResponse);
} else {
  // Handle case where genreValue is not set
  $displayGenresResponse['success'] = false;
  $displayGenresResponse['message'] = 'Genre value not provided';
  echo json_encode($displayGenresResponse);
}

?>

