<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $_POST['repo']); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
echo curl_exec($ch);
?>
