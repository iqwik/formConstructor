<?php
const APP_DIR = __DIR__;
const USERNAME = 'root';
const PASSWORD = '123456';
const DB = 'ikea';
const HOST = 'localhost';
const TABLE_NAME = 'form';

function checkDB(){
    $check = false;
    $createDB = "CREATE DATABASE IF NOT EXISTS " . DB;
    if( db::getInstance()->Create($createDB)) {
        $table_name = TABLE_NAME;
        $createTable = "CREATE TABLE IF NOT EXISTS `$table_name` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `fields` varchar(255) NOT NULL,
            `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (`id`)
            ) Engine=InnoDB DEFAULT CHARSET=utf8;";
        if (db::getInstance()->Create($createTable)){
            $check = true;
        }
    }
    return $check;
}