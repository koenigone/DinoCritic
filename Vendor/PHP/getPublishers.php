<?php

header('Content-Type: application/json; charset=utf-8');
$getPublishersResponse = array();

$publishersCURL = curl_init();

curl_setopt_array($publishersCURL, [
  CURLOPT_URL => 'https://api.rawg.io/api/publishers?key=ce159359e89a44c69acc5360188d2333&page_size=50',
  CURLOPT_RETURNTRANSFER => TRUE
]);

$getPublishersResult = curl_exec($publishersCURL);
$getPublishersERR = curl_error($publishersCURL);

curl_close($publishersCURL);

if (!$getPublishersERR) {
  $decodePublisherResult = json_decode($getPublishersResult);

  if ($decodePublisherResult !== null) {
    $getPublishersResponse['success'] = true;
    $getPublishersResponse['message'] = 'Publishers retrieved successfully';
    $getPublishersResponse['data'] = $decodePublisherResult;
  } else {
    $getPublishersResponse['success'] = false;
    $getPublishersResponse['message'] = 'No publishers found';
  }
} else {
  $getPublishersResponse['success'] = false;
  $getPublishersResponse['message'] = 'Error retrieving publishers' . $getPublishersERR;
}

echo json_encode($getPublishersResponse);

?>