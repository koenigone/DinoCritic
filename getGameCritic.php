<?php
header('Content-Type: application/json; charset=utf-8');
$getCriticResponse = array();

if (isset($_POST['gameName'])) {
    $gameName = $_POST['gameName'];

    // Initializing cURL session
    $gameCriticCURL = curl_init();

    curl_setopt_array($gameCriticCURL, [
      CURLOPT_URL => 'https://api.rawg.io/api/games?key=ce159359e89a44c69acc5360188d2333&search=' . urlencode($gameName),
      CURLOPT_RETURNTRANSFER => true,
    ]);  

    // Execute cURL session and get the response
    $gameCriticResult = curl_exec($gameCriticCURL);
    $gameCriticERR = curl_error($gameCriticCURL);
    curl_close($gameCriticCURL);

    $decodeGameCriticResult = json_decode($gameCriticResult, true);

    if (!$gameCriticERR) { // If no error, get data
        $getCriticResponse['success'] = true;
        $getCriticResponse['message'] = 'Games retrieved successfully';
        $getCriticResponse['data'] = $decodeGameCriticResult;
        echo json_encode($getCriticResponse);

    } else {
        $getCriticResponse['success'] = false;
        $getCriticResponse['message'] = 'cURL Error #:' . $gameCriticERR;

        echo json_encode($getCriticResponse);
    }
} else {
    $getCriticResponse['success'] = false;
    $getCriticResponse['message'] = 'Game name not found';

    echo json_encode($getCriticResponse);
}
?>