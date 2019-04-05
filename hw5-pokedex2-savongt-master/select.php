<?php
/*
* Savong Tan
* CSE 154 AC
* Returns the list of pokemon currently in the player's pokedex.
*
* Output Format: JSON
*/

include("common.php");

$db = get_PDO();
$rows = $db->query("SELECT * FROM Pokedex;");
$output['pokemon'] = array();
foreach($rows as $row){
  $pokemoninfo = array();
  $pokemoninfo["name"] = $row["name"];
  $pokemoninfo["nickname"] = $row["nickname"];
  $pokemoninfo["datefound"] = $row["datefound"];
  array_push($output['pokemon'], $pokemoninfo);
}

header("Content-Type: application/json");
print(json_encode($output));

?>
