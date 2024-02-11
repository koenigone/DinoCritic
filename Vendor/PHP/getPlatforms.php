<?php

header('Content-Type: application/json; charset=utf-8');
$getPlatformsResponse = array();

$platformCURL = curl_init();

curl_setopt_array($platformCURL, [
  CURLOPT_URL => 'https://api.rawg.io/api/platforms/lists/parents?key=ce159359e89a44c69acc5360188d2333',
  CURLOPT_RETURNTRANSFER => TRUE
]);

$platformResult = curl_exec($platformCURL);
$platformResultERR = curl_error($platformCURL);
curl_close($platformCURL);

if (!$platformResultERR) {
  $decondePlatformResult = json_decode($platformResult);

  if ($decondePlatformResult !== null) {
    $getPlatformsResponse['success'] = true;
    $getPlatformsResponse['message'] = 'Platforms retrieved successfully';
    $getPlatformsResponse['data'] = $decondePlatformResult;
  } else {
    $getPlatformsResponse['success'] = false;
    $getPlatformsResponse['message'] = 'no results found';
  }
} else {
  $getPlatformsResponse['success'] = false;
  $getPlatformsResponse['message'] = 'Error retrieving platforms' . $platformResultERR;
}

echo json_encode($getPlatformsResponse);

?>