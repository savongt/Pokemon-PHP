<?php
/*
* Savong Tan
* CSE 154 AC
* POST request to add a pokemon to the player's Pokedex.
*
* Required POST parameters:
* name -- name of pokemon to add
* nickname (optional) -- nickname of added Pokemon
*
* Output Format: JSON
*/

include('common.php');
# check if name parameter was passed
# assign nickname as name in all caps if no nickname passed
if (isset($_POST["name"])) {
  $db = get_PDO();
  $nameid = $_POST["name"];
  if (isset($_POST["nickname"])){
    $nickname = $_POST["nickname"];
  } else {
    $nickname = strtoupper($nameid);
  }
  insert_to_db($db, $nameid, $nickname);
} else {
  handle_error("Missing name parameter.");
}

/**
* Inserts a pokemon with the given name and nickname(optional)
*
* @param $db - database where Pokedex is located
* @param $nameid - the name of the pokemon from user input(not case sensitive)
* @param $nickname - the nickname of the pokemon(name in uppercase
*                                                if no nickname passed)
*/

function insert_to_db($db, $nameid, $nickname){
  $name = strtolower($nameid);
  $qry = "SELECT name FROM Pokedex WHERE name=:name";
  $stmt = $db->prepare($qry);
  $params = array("name" => $name);
  $stmt->execute($params);
  $row = $stmt->fetch();
  if ($row) {
    handle_error("Error: Pokemon {$nameid} already found.");
  } else {
    $time = date('y-m-d H:i:s');
    $sql = "INSERT INTO Pokedex(name, nickname, datefound) VALUES(:name, :nickname, NOW())";
    $stmt = $db->prepare($sql);
    $params = array("name" => $name,
    "nickname"=> $nickname
  );
  $stmt->execute($params);
  success("Success! {$nameid} added to your Pokedex!");
  }
}

?>
