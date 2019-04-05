<?php
/*
* Savong Tan
* CSE 154 AC
* POST request to trade the player's pokemon with another player's pokemon.
*
* Required POST parameters:
* mypokemon -- pokemon player wants to trade out
* theirpokemon  -- pokemon player wants to recieve from another player
*
* Output Format: JSON
*/
include("common.php");
# check if either mypokemon or theirpokemon was set, then check if both are set
# display errors if none or only one is set, if no error then trade the pokemon
# as long as the user doesn't already have the pokemon to be recieved, and if
# they actually have the pokemon to be traded out.
if(isset($_POST["mypokemon"]) || isset($_POST["theirpokemon"])){
  if (isset($_POST["mypokemon"]) && isset($_POST["theirpokemon"])) {
    $db = get_PDO();
    $mypokemon = $_POST["mypokemon"];
    $theirpokemon = $_POST["theirpokemon"];
    # check if you already have their pokemon
    $qry = "SELECT name FROM Pokedex WHERE name=:name";
    $stmt = $db->prepare($qry);
    $name = $theirpokemon;
    $params = array("name" => $name);
    $stmt->execute($params);
    $row = $stmt->fetch();
    if ($row) {
      handle_error("Error: You have already found {$name}.");
    } else {
      # check if you have the pokemon to trade for or not
      $name = $mypokemon;
      $qry = "SELECT name FROM Pokedex WHERE name=:name";
      $stmt = $db->prepare($qry);
      $params = array("name" => $name);
      $stmt->execute($params);
      $row = $stmt->fetch();
      if ($row){
        trade($db, $mypokemon, $theirpokemon);
      } else {
        handle_error("Error: Pokemon {$mypokemon} not found in your Pokedex.");
      }
    }
  } else {
    handle_error("Missing mypokemon or theirpokemon parameter.");
  }
} else {
  handle_error("Missing mypokemon and theirpokemon parameter.");
}

/**
 * Trades out the player's pokemon for the desired pokemon
 *
 * @param $db - the database where pokedex is located
 * @param $mypokemon - name of the pokemon to trade out
 * @param $theirpokemon - name of pokemon to recieve
 */
function trade($db, $mypokemon, $theirpokemon){
  #remove mypokemon from the pokedex
  $name = strtolower($mypokemon);
  $sql = "DELETE FROM Pokedex WHERE name=:name;";
  $stmt = $db->prepare($sql);
  $params = array("name" => $name);
  $stmt->execute($params);
  #add theirpokemon to the pokedex
  $name = strtolower($theirpokemon);
  $time = date('y-m-d H:i:s');
  $nickname = strtoupper($theirpokemon);
  $sql = "INSERT INTO Pokedex(name, nickname, datefound) VALUES(:name, :nickname, NOW())";
  $stmt = $db->prepare($sql);
  $params = array("name" => $name,
                  "nickname"=> $nickname
                  );
  $stmt->execute($params);
  success("Success! You have traded your {$mypokemon} for {$theirpokemon}!");
}
?>
