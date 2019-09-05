<?php
require_once '../../config.php';
include_once APP_DIR.'/php/lib/db.php';
header("Access-Control-Allow-Orgin: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json;");
$result = ["status" => "500", "error" => "request method != post"];
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    $rest_json = file_get_contents("php://input");
    $_POST = json_decode($rest_json, true);
    $content = '';
    if(!empty($_POST)) {
        foreach ($_POST as $k => $v) {
            if (empty($v)) {
                $result["error"] = "пустой POST";
                echo json_encode($result);
                return;
            }
            $content .= "{$k}:{$v};";
        }
    } else {
        $content .= date('Y-m-d / H:i:s') . "\nPOST не дошел!";
        $result["error"] = $content;
        echo json_encode($result);
        return;
    }
    $serialize = serialize($content);
    if(checkDB()) {
        $table_name = TABLE_NAME;
        $query = "INSERT INTO $table_name (fields) VALUES (:fields)";
        $params = ['fields' => $serialize];
        $insert = db::getInstance()->Query($query, $params);
        if($insert){
            $result["status"] = "200";
            $result["error"] = "0";
        }
    }
}
echo json_encode($result);