<?php

header('Content-Type: application/json; charset=utf-8');
$sortPlatformsResponse = array();

if (isset($_POST['platformValue'])) {
  $platformVal = $_POST['platformValue'];

  $sortPlatformCURL = curl_init();

  curl_setopt_array($sortPlatformCURL ,[
    CURLOPT_URL => 'https://api.rawg.io/api/games?key=ce159359e89a44c69acc5360188d2333&page_size=100&platforms=' . urlencode($platformVal),
    CURLOPT_RETURNTRANSFER => TRUE
  ]);

  $sortPlatformsResult = curl_exec($sortPlatformCURL);
  $sortPlatformERR = curl_error($sortPlatformCURL);
  curl_close($sortPlatformCURL);

  if (!$sortPlatformERR) {
    $decodeSortPlatform = json_decode($sortPlatformsResult);

    if ($decodeSortPlatform !== null) {
      $sortPlatformsResponse['success'] = true;
      $sortPlatformsResponse['message'] = 'Games sorted by platform';
      $sortPlatformsResponse['data'] = $decodeSortPlatform;
    } else {
      $sortPlatformsResponse['success'] = false;
      $sortPlatformsResponse['message'] = 'Sort by platform: no result found';
    }
  } else {
    $sortPlatformsResponse['success'] = false;
    $sortPlatformsResponse['message'] = 'Error sorting by platform: ' . $sortPlatformERR;
  }
} else {
  $sortPlatformsResponse['success'] = false;
  $sortPlatformsResponse['message'] = 'Platform not set';
}

echo json_encode($sortPlatformsResponse);

?>