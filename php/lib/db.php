<?php
class db {
    private static $_instance = null;
    private $db;
    public static function getInstance() {
        if (self::$_instance == null) {
            self::$_instance = new db();
        }
        return self::$_instance;
    }
    private function __construct() {
        $this->Connect(USERNAME, PASSWORD, DB, HOST);
    }
    private function __sleep() {}
    private function __wakeup() {}
    private function __clone() {}
    public function Connect($user, $password, $base, $host = 'localhost', $port = 3306)
    {
        $connectString = 'mysql:host=' . $host . ';port= ' . $port . ';dbname=' . $base . ';charset=utf8;';
        $this->db = new PDO($connectString, $user, $password,
            [
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            ]
        );
    }
    public function Create($query)
    {
        return $this->db->query($query) ? true : false;
    }
    public function Query($query, $params = [])
    {
        $res = $this->db->prepare($query);
        $res->execute($params);
        return $res;
    }
    public function Select($query, $params = [])
    {
        $result = $this->Query($query, $params);
        if ($result) {
            return $result->fetchAll();
        }
    }
    public function SelectRow($query, $params = [])
    {
        $result = $this->Query($query, $params);
        if ($result) {
            return $result->fetchColumn();
        }
    }
}