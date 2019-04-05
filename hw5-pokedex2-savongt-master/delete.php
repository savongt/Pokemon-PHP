<?php
/*
* Savong Tan
* CSE 154 AC
* POST request to delete a pokemon of the given name from the player's Pokedex.
*
* Required POST parameters:
* name -- name of pokemon to add
* mode=removeall(optional) -- removes all pokemon from pokedex
* Output Format: JSON
*/

include('common.php');

# check if mode has been assigned, or if a name was assigned
if (isset($_POST["mode"])) {
  $mode = strtolower($_POST["mode"]);
  if ($mode === "removeall"){
    # removes all pokemon from the pokedex
    $db = get_PDO();
    $sql = ("DELETE FROM pokedex;");
    $stmt = $db->prepare($sql);
    $params = array("name" => "",
    "nickname" => "",
    "date" => ""
  );
  $stmt->execute($params);
  success("Success! All Pokemon removed from your Pokedex!");
} else {
  handle_error("Error: Unknown mode {$mode}.");
  }
} else if (isset($_POST["name"])){
  $name = $_POST["name"];
  remove_from_db($name);
} else {
  handle_error("Missing name or mode parameter.");
}

/**
 * Removes a pokemon from the database with the given name
 *
 * @param $name - name of the pokemon to be removed
 */
function remove_from_db($name){
  $db = get_PDO();
  $qry = "SELECT name FROM pokedex WHERE name=:name";
  $stmt = $db->prepare($qry);
  $params = array("name" => $name);
  $stmt->execute($params);
  $row = $stmt->fetch();
  if ($row) {
    $sql = "DELETE FROM pokedex WHERE name =:name;";
    $stmt = $db->prepare($sql);
    $params = array("name" => $name);
    $stmt->execute($params);
    success("Success! {$name} removed from your Pokedex!");
  } else {
    handle_error("Error: Pokemon {$name} not found in your Pokedex.");
  }
}

?>
