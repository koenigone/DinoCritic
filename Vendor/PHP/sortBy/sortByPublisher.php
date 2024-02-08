<?php

header('Content-Type: application/json; charset=utf-8');
$sortByPublisherResponse = array();

if (isset($_POST['publisherValue'])) {
  $publisherValue = $_POST['publisherValue'];

  $sortByPublisherCURL = curl_init();

  curl_setopt_array($sortByPublisherCURL, [
    CURLOPT_URL => 'https://api.rawg.io/api/games?key=ce159359e89a44c69acc5360188d2333&page_size=100&publishers=' . $publisherValue,
    CURLOPT_RETURNTRANSFER => TRUE
  ]);

  $sortByPublisherResult = curl_exec($sortByPublisherCURL);
  $sortByPublisherERR = curl_error($sortByPublisherCURL);
  curl_close($sortByPublisherCURL);

  if (!$sortByPublisherERR) {
    $decodeSortByPublisher = json_decode($sortByPublisherResult);

    if ($decodeSortByPublisher !== null) {
      $sortByPublisherResponse['success'] = true;
      $sortByPublisherResponse['message'] = 'Sorted by publisher';
      $sortByPublisherResponse['data'] = $decodeSortByPublisher;
    } else {
      $sortByPublisherResponse['success'] = false;
      $sortByPublisherResponse['message'] = 'Sort by publisher: no result found';
    }
  } else {
    $sortByPublisherResponse['success'] = false;
    $sortByPublisherResponse['message'] = 'Error sorting by publisher' . $sortByPublisherERR;
  }
} else {
  $sortByPublisherResponse['success'] = false;
  $sortByPublisherResponse['message'] = 'No publisher selected';
}

echo json_encode($sortByPublisherResponse);

?>