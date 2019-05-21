<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers', 'Content-Type');

$url = "api.openweathermap.org/data/2.5/weather?";
$zip = "zip=";
$unit = "&units=imperial";
$key = "&APPID=70c3b785056379e1ae33265fe7cc9f9a";
$input = $_REQUEST['input'];
$input = urlencode($input);
if(is_numeric($input)){
  $input = urlencode($input);
  $zip = $zip . $input;
  $url = $url . $zip;
  $url = $url . $unit;
  $url = $url . $key;

  $curl = curl_init();

  curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
      "cache-control: no-cache"
    ),
  ));

  $response = curl_exec($curl);
  $err = curl_error($curl);
  
  curl_close($curl);
  
  /*$response = json_decode($response, true); *///because of true, it's in an array
  echo $response;
}
else{echo "invalid";}
?>