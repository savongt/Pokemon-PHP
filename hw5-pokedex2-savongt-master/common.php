<?php
/*
* Savong Tan
* CSE 154 AC
*
* Common file for hw5 Pokedex project.
*/

error_reporting(E_ALL);
ini_set('display_errors', 1);
date_default_timezone_set('America/Los_Angeles');

/**
* Returns a PDO object connected to the hw5 database. Throws
* a PDOException if an error occurs when connecting to database.
* @return {PDO}
*/
function get_PDO() {
  $host =  "localhost";
  $port = "3306";
  $user = "root";
  $password = "root";
  $dbname = "hw5";
  $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";
  try {
    $db = new PDO($ds, $user, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $db;
  } catch (PDOException $ex) {
    handle_error("A database error has occured. Under attack by magikarps!", $ex);
  }
}

/**
* Prints out a json 400 error message given $msg.
* @param $msg {string} - json 400 message to output
*/
function handle_error($msg) {
  header("HTTP/1.1 400 Invalid Request");
  header("Content-type: text/json");
  echo (json_encode(Array("error"=> "{$msg}")));
}

/**
* Prints out a json success message given $msg.
* @param $msg {string} - json success message to output
*/
function success($msg) {
  header("HTTP/1.1 400 Invalid Request");
  header("Content-type: text/json");
  echo (json_encode(Array("success"=> "{$msg}")));
}
?>
