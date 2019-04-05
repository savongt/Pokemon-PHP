<?php
/*
* Savong Tan
* CSE 154 AC
* POST request to change the nickname of a pokemon in your pokedex
* Resets it to uppercase version of the pokemon's name if no nickname
*
* Required POST parameters:
* name -- name of the pokemon to rename
* nickname(optional)  -- new nickname to give to the pokemon
*
* Output Format: JSON
*/

include("common.php");

# check if a name has been passed or a nickname, if no nickname was passed
# then set the nickname to the pokemon's name in uppcase
if (isset($_POST["name"])){
  $name = $_POST["name"];
  if (isset($_POST["nickname"])){
    $nickname = $_POST["nickname"];
  } else {
    $nickname = strtoupper($name);
  }
  # check if pokemon is in database
  $db = get_PDO();
  $qry = "SELECT name FROM pokedex WHERE name=:name";
  $stmt = $db->prepare($qry);
  $params = array("name" => $name);
  $stmt->execute($params);
  $row = $stmt->fetch();
  if ($row) {
    change_name($db, $name, $nickname);
  } else {
    handle_error("Error: Pokemon {$name} not found in your Pokedex.");
  }
} else {
  handle_error("Missing name parameter.");
}

/**
* Changes the nickname of the given pokemon to a new nickname
*
* @param $db - database where Pokedex is located
* @param $nameid - the name of the pokemon from user input(not case sensitive)
* @param $nickname - the nickname of the pokemon(name in uppercase
*                                                if no nickname passed)
*/
function change_name($db, $name, $nickname){
  $sql = "UPDATE pokedex SET nickname=:nickname WHERE name=:name";
  $stmt = $db->prepare($sql);
  $params = array("name"=> $name, "nickname" => $nickname);
  $stmt->execute($params);
  success("Success! Your {$name} is now named {$nickname}!");
}

?>
