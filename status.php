<?php
header("Content-Type: application/json");

$data = [
    "status" => "OPEN",
    "open_time" => "11:55",
    "close_time" => "15:55"
];

echo json_encode($data);
?>
