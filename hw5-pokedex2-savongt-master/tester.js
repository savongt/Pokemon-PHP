/**
 * Made by Kiet Sam.
 * Spring 2018
 * Updated by Lauren Bricker - Fall 2018
 *
 * Used for testing HW5.
 * Test output will be shown in the console.
 */

(function () {
  "use strict";

  const TEST_DESCRIPTIONS = {};

  /**
   * Loads the page.
   */
  window.addEventListener("load", loadPage);

  function loadPage() {
    startTests();
  }

  async function startTests() {
    let result = true;
    result &= await test(testSelectEmpty);

    result &= await test(testInsertNoNicknames);
    result &= await test(testInsertWithNicknames);
    result &= await test(testInsertMissingNameParam);

    result &= await test(testDeleteUnknownMode);
    result &= await test(testDeleteMissingNameParam);

    result &= await test(testDeleteSinglePokemonFound);
    result &= await test(testDeleteSinglePokemonFoundWithLetterCasing);
    result &= await test(testDeleteSinglePokemonFoundWithLetterCasing2);
    result &= await test(testDeleteSinglePokemonNotFound);
    result &= await test(testDeleteSinglePokemonNotFoundWithLetterCasing);

    result &= await test(testDeleteAllNoPokemon);
    result &= await test(testDeleteAllOnePokemon);
    result &= await test(testDeleteAllMultiplePokemon);

    result &= await test(testTradeNoParams);
    result &= await test(testTrade);
    result &= await test(testTradeLetterCasing);
    result &= await test(testTradeNotFound);
    result &= await test(testTradeAlreadyHave);

    result &= await test(testUpdateParams);
    result &= await test(testUpdateNotFound);
    result &= await test(testUpdateNoNickname);
    result &= await test(testUpdateWithNickname);

    if (result) {
      console.log("ALL TESTS PASSED!");
    } else {
      console.log("ALL TESTS DIDN'T PASS!");
    }
  }

  async function testSelectEmpty() {
    try {
      let results = await selectAll();
      assert(results["pokemon"].length == 0);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testSelectEmpty"] = "Calls select.php and making sure there are there are no pokemon in the array.";

  async function testInsertNoNicknames() {
    try {
      let pokemons = ["charmander", "bulbasaur", "squirtle"];
      await insertPokemons(pokemons);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testInsertNoNicknames"] = "Calls insert.php with charmander, bulbasaur, and squirtle.";

  async function testInsertWithNicknames() {
    try {
      let pokemons = ["charmander", "bulbasaur", "squirtle"];
      let pokemonsNicknames = ["charry", "bulby", "squirty"];
      await insertPokemonsWithNickNamesAndVerify(pokemons, pokemonsNicknames);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testInsertWithNicknames"] = "Calls insert.php with charmander (as charry), bulbasaur (as bulby), and squirtle (as squirty).";

  async function testInsertMissingNameParam() {
    try {
      let result = await insert();
      assertMessage(result["error"] === "Missing name parameter.");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testInsertMissingNameParam"] = "Calls insert.php with no parameters. It should error \"Missing name parameter.\".";

  async function testDeleteUnknownMode() {
    try {
      let invalidMode = "abc";
      let result = await remove(null, invalidMode);
      assertMessage(result["error"] === "Error: Unknown mode " + invalidMode + ".");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteUnknownMode"] = "Calls delete.php with mode=abc. It should error \"Error: Unknown mode abc.\".";

  async function testDeleteMissingNameParam() {
    try {
      let result = await remove();
      assertMessage(result["error"] === "Missing name or mode parameter.");
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteMissingNameParam"] = "Calls delete.php with no parameter. It should error \"Missing name or mode parameter.\".";

  async function testDeleteSinglePokemonFound() {
    try {
      let pokemons = ["charmander"];
      await insertPokemons(pokemons);

      let result = await remove(pokemons[0]);
      assertMessage(result["success"] === "Success! " + pokemons[0] + " removed from your Pokedex!")
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteSinglePokemonFound"] = "Calls insert.php with charmander. Then removes it with delete.php. Delete.php should show \"Success! charmander removed from your Pokedex!\".";

  async function testDeleteSinglePokemonFoundWithLetterCasing() {
    try {
      let pokemons = ["charMANder"];
      await insertPokemons(pokemons);

      let result = await remove(pokemons[0]);
      assertMessage(result["success"] === "Success! " + pokemons[0] + " removed from your Pokedex!")
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteSinglePokemonFoundWithLetterCasing"] = "Insert charMANder into pokedex and removes it. Delete.php should show \"Success! charMANder removed from your Pokedex!\".";

  async function testDeleteSinglePokemonFoundWithLetterCasing2() {
    try {
      let pokemons = ["charMANder"];
      await insertPokemons(pokemons);

      let result = await remove(pokemons[0].toUpperCase());
      assertMessage(result["success"] === "Success! " + pokemons[0].toUpperCase() + " removed from your Pokedex!")
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteSinglePokemonFoundWithLetterCasing2"] = "Insert charMANder into pokedex and removes it with CHARMANDER. Delete.php should show \"Success! CHARMANDER removed from your Pokedex!\".";

  async function testDeleteSinglePokemonNotFound() {
    try {
      let pokemons = ["charmander"];

      let result = await remove(pokemons[0]);
      assertMessage(result["error"] === "Error: Pokemon " + pokemons[0] + " not found in your Pokedex.")
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteSinglePokemonNotFound"] = "Removes charmander from pokedex without any initial pokemon in the dex. Delete.php should show \"Error: Pokemon charmander not found in your Pokedex.\".";

  async function testDeleteSinglePokemonNotFoundWithLetterCasing() {
    try {
      let pokemons = ["charMANder"];

      let result = await remove(pokemons[0]);
      assertMessage(result["error"] === "Error: Pokemon " + pokemons[0] + " not found in your Pokedex.")
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteSinglePokemonNotFoundWithLetterCasing"] = "Removes charMANder from pokedex without any initial pokemon in the dex. Delete.php should show \"Error: Pokemon charMANder not found in your Pokedex.\".";

  async function testDeleteAllNoPokemon() {
    try {
      let allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length === 0);

      let result = await removeAll();
      assertMessage(result["success"] === "Success! All Pokemon removed from your Pokedex!")

      allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length === 0);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteAllNoPokemon"] = "Making sure that there are no pokemon in the database. Then calling remove all (should display \"Success! All Pokemon removed from your Pokedex!\") and then making sure that the list of pokemons are still empty.";

  async function testDeleteAllOnePokemon() {
    try {
      let allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length === 0);

      let pokemons = ["charmander"];
      await insertPokemons(pokemons);

      let result = await removeAll();
      assertMessage(result["success"] === "Success! All Pokemon removed from your Pokedex!")

      allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length === 0);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteAllOnePokemon"] = "Making sure that there are no pokemon in the database. Then inserting charmander in Pokedex. Next, calling remove all (should display \"Success! All Pokemon removed from your Pokedex!\"). Last, making sure that the list of pokemons are empty.";

  async function testDeleteAllMultiplePokemon() {
    try {
      let allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length === 0);

      let pokemons = ["charmander", "squiRTle", "bulbasAUR"];
      await insertPokemons(pokemons);

      let result = await removeAll();
      assertMessage(result["success"] === "Success! All Pokemon removed from your Pokedex!")

      allPokemons = await selectAll();
      assert(allPokemons["pokemon"].length === 0);

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testDeleteAllMultiplePokemon"] = "Making sure that there are no pokemon in the database. Then inserting charmander, squiRTle, and bulbasAUR. After calling removeall, delete.php should show \"Success! All Pokemon removed from your Pokedex!\". Finally asserting that there are no pokemon in pokedex.";

  async function testTradeNoParams() {
    try {
      let result = await trade();
      assertMessage(result["error"] === "Missing mypokemon and theirpokemon parameter.");

      result = await trade("mine");
      assertMessage(result["error"] === "Missing mypokemon or theirpokemon parameter.");

      result = await trade(undefined, "theirs");
      assertMessage(result["error"] === "Missing mypokemon or theirpokemon parameter.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testTradeNoParams"] = "Calling trade.php with no parameter. Then calling trade.php with 'mine' as mypokemon. Last, calling trade with 'theirs' as theirpokemon.";

  async function testTrade() {
    try {
      let pokemons = ["charmander"];

      await insertPokemons(pokemons);

      let result = await trade("charmander", "squirtle");
      assertMessage(result["success"] === "Success! You have traded your charmander for squirtle!");

      result = await selectAll();
      pokemons = result["pokemon"];
      assert(pokemons.length == 1);
      assert(pokemons[0].name === "squirtle");
      assert(pokemons[0].nickname === "SQUIRTLE");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testTrade"] = "Inserts charmander into the pokedex. Then trade our charmander for their squirtle. Trade.php should show \"Success! You have traded your charmander for squirtle!\". Then making sure that the pokedex only has one pokemon whose name is squirtle and nickname as SQUIRTLE.";

  async function testTradeLetterCasing() {
    try {
      let pokemons = ["charMANder"];

      await insertPokemons(pokemons);

      let result = await trade("charMANder", "SQUIRTle");
      assertMessage(result["success"] === "Success! You have traded your charMANder for SQUIRTle!");

      result = await selectAll();
      pokemons = result["pokemon"];
      assert(pokemons.length == 1);
      assert(pokemons[0].name === "squirtle");
      assert(pokemons[0].nickname === "SQUIRTLE");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testTradeLetterCasing"] = "Inserts charMANder into the pokedex. Then trade charMANder with their SQUIRTle. Trade.php should show \"Success! You have traded your charMANder for SQUIRTle!\". Then making sure that the pokedex only has one pokemon whose name is squirtle and nickname as SQUIRTLE.";

  async function testTradeNotFound() {
    try {
      let result = await trade("charMANder", "SQUIRTle");
      assertMessage(result["error"] === "Error: Pokemon charMANder not found in your Pokedex.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testTradeNotFound"] = "With no pokemon in the database, we trade charMANder with SQUIRTle. Trade.php should show \"Error: Pokemon charMANder not found in your Pokedex.\".";

  async function testTradeAlreadyHave() {
    try {
      let pokemons = ["charMANder", "SQUIRTle"];

      await insertPokemons(pokemons);

      let result = await trade("charMANder", "SQUIRTle");
      assertMessage(result["error"] === "Error: You have already found SQUIRTle.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testTradeAlreadyHave"] = "Insert charMANder and SQUIRTle into the pokedex. Then trade charMANder with SQUIRTle. Trade.php should error \"Error: You have already found SQUIRTle.\".";

  async function testUpdateParams() {
    try {
      let result = await update();
      assertMessage(result["error"] === "Missing name parameter.");

      result = await update(undefined, "stuff");
      assertMessage(result["error"] === "Missing name parameter.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testUpdateParams"] = "Calls update.php with no parameter. Should error \"Missing name parameter.\", Then calling update.php with only nickname parameter. Should still error \"Missing name parameter.\".";

  async function testUpdateNotFound() {
    try {
      let result = await update("charMANder");
      assertMessage(result["error"] === "Error: Pokemon charMANder not found in your Pokedex.");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testUpdateNotFound"] = "Calls update.php with charMANder when there are no pokemon in the pokedex. Should error \"Error: Pokemon charMANder not found in your Pokedex.\".";

  async function testUpdateNoNickname() {
    try {
      await insertPokemonsWithNickNames(["charMANder"], ["milky"]);

      let result = await update("charMANder");
      assertMessage(result["success"] === "Success! Your charMANder is now named CHARMANDER!");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testUpdateNoNickname"] = "Insert charMANder with nickname as milky. Then call update.php with charMANder. It should output \"Success! Your charMANder is now named CHARMANDER!\".";

  async function testUpdateWithNickname() {
    try {
      await insertPokemonsWithNickNames(["charMANder"], ["milky"]);

      let result = await update("charMANder", "flabby");
      assertMessage(result["success"] === "Success! Your charMANder is now named flabby!");

      let pokemons = (await selectAll())["pokemon"];
      console.log(pokemons);
      assert(pokemons[0].name == "charmander");
      assert(pokemons[0].nickname == "flabby");

      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  TEST_DESCRIPTIONS["testUpdateWithNickname"] = "Insert charMANder with nickname as milky. Then updates charMANder with nickname flabby. Update.php should show \"Success! Your charMANder is now named flabby!\". Last, asserting that the first pokemon whose name is charmander and nickname is flabby.";

  async function test(testFunction) {
    logTestHeader(testFunction);
    let removeResult = await removeAll();
    assertMessage(removeResult["success"] === "Success! All Pokemon removed from your Pokedex!");

    let passed = await testFunction();

    if (passed) {
      console.log("%c:) " + testFunction.name + " passed!", "background-color: lightgreen;");
    } else {
      console.log("%c:( " + testFunction.name + " failed.", "background-color: hotpink;");
    }

    return passed;
  }

  async function insertPokemons(pokemons) {
    let pokemonNicknames = [];
    for (let i = 0; i < pokemons.length; i++) {
      pokemonNicknames.push(undefined);
    }
    await insertPokemonsWithNickNamesAndVerify(pokemons, pokemonNicknames);
  }

  async function insertPokemonsWithNickNames(pokemons, pokemonNicknames) {
    // Make a copy of the original pokemon list and pokemon nickname list
    let pokemonsOriginal = pokemons.slice();
    let pokemonNicknamesOriginal = pokemonNicknames.slice();


    // Inser all of the pokemon into the DB and make sure it's a success
    for (let i = 0; i < pokemonsOriginal.length; i++) {
      let results = await insert(pokemonsOriginal[i], pokemonNicknamesOriginal[i]);
      assertMessage(results["success"] === "Success! " + pokemonsOriginal[i] + " added to your Pokedex!");

      // This sets up the two "Original" arrays to be name in lowercase, nickname in UPPERCASE (if
      // not in the original nickname array), so we can test that everything was in fact
      // inserted into the db... by doing a select on the DB and comparing.
      if (pokemonNicknamesOriginal[i] === undefined) {
        pokemonNicknamesOriginal[i] = pokemonsOriginal[i].toUpperCase();
      }
      pokemonsOriginal[i] = pokemonsOriginal[i].toLowerCase();
    }

    // Do a select on the DB and get the results.
    let results = await selectAll();
    // First check the results have the same length as the original array!
    assert(results["pokemon"].length === pokemonsOriginal.length);
    // now find both the name and the nickname of the pokemon in the two comparison arrays.
    for (let pokemonResult of results["pokemon"]) {
      let name = pokemonResult["name"];
      assert(pokemonsOriginal.includes(name));

      let nickname = pokemonResult["nickname"];
      assert(pokemonNicknamesOriginal.includes(nickname));

      let pokemonIndex = pokemonsOriginal.indexOf(name);
      let pokemonNicknameIndex = pokemonNicknamesOriginal.indexOf(nickname);
      assert(pokemonIndex == pokemonNicknameIndex);

      // clear out the location in the name and nickname arrays once we've found them in the
      // results
      pokemonsOriginal[pokemonIndex] = null;
      pokemonNicknamesOriginal[pokemonNicknameIndex] = null;
    }

    // Everything worked out if everything in those original arrays is back to null.
    for (let i = 0; i < pokemonsOriginal.length; i++) {
      assert(pokemonsOriginal[i] == null);
      assert(pokemonNicknamesOriginal[i] == null);
    }
  }


  async function insertPokemonsWithNickNamesAndVerify(pokemons, pokemonNicknames) {
    // Make a copy of the arrays used for testing at the end that the insert actually worked.
    let pokemonsCopy = pokemons.slice();
    let pokemonNicknamesCopy = pokemonNicknames.slice();

    await insertPokemonsWithNickNames(pokemons, pokemonNicknames);

    // Try the inserts again, this time all insertions should be failures
    for (let i = 0; i < pokemonsCopy.length; i++) {
      let results = await insert(pokemonsCopy[i], pokemonNicknamesCopy[i]);
      assertMessage(results["error"] === "Error: Pokemon " + pokemonsCopy[i] + " already found.");
    }
  }



  async function update(name, nickname) {
    let url = "update.php";

    let data = new FormData();
    if (name !== undefined) {
      data.append("name", name);
    }
    if (nickname !== undefined) {
      data.append("nickname", nickname);
    }

    let resp = await fetch(url, {method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  async function trade(mine, theirs) {
    let url = "trade.php";

    let data = new FormData();
    if (mine !== undefined) {
      data.append("mypokemon", mine);
    }
    if (theirs !== undefined) {
      data.append("theirpokemon", theirs);
    }

    let resp = await fetch(url,{method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  async function insert(pokemon, nickname) {
    let url = "insert.php";

    let data = new FormData();
    if (pokemon !== undefined) {
      data.append("name", pokemon);
    }
    if (nickname !== undefined) {
      data.append("nickname", nickname);
    }

    let resp = await fetch(url, {method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  async function selectAll() {
    let url = "select.php";
    let resp = await fetch(url)
    .then(checkStatus)
    .then(JSON.parse)
    .then(function (response) {
      return response;
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return response;
    });

    // Check that all names are lower case.
    for (let pokemon of resp["pokemon"]) {
      assert(pokemon.name === pokemon.name.toLowerCase());
    }
    return resp;
  }

  async function removeAll() {
    return remove(null, "removeall");
  }

  async function remove($pokemon, $mode) {
    let url = "delete.php";

    let data = new FormData();
    if ($pokemon !== null && $pokemon !== undefined) {
      data.append("name", $pokemon);
    }
    else if ($mode !== null && $mode !== undefined) {
      data.append("mode", $mode);
    }

    let resp = await fetch(url, {method: "POST", body: data})
    .then(checkStatus)
    .then(function (response) {
      return JSON.parse(response);
    })
    .catch(function (response) {
      console.log("Your response is: " + response);
      return JSON.parse(response);
    });

    return resp;
  }

  /***********************************************************************************
   * HELPER FUNCTIONS BELOW
   ***********************************************************************************/

  function assert(condition) {
    if (!condition) {
      let e = new Error("Expected condition failed!");
      throw e;
    }
  }

  function assertMessage(condition) {
    if (!condition) {
      let e = new Error("Output message incorrect!");
      throw e;
    }
  }

  function logTestHeader(testFunction) {
    let header = "Test: " + testFunction.name;
    let description = TEST_DESCRIPTIONS[testFunction.name];
    let headerStyle = "background: #9BDBF5; color: black; font-size: 14pt; font-weight: bold;";
    let descriptionStyle = "background: #FAF5AB; color: #02534D; font-size: 10pt;";
    console.log('%c ' + header + " \n%c" + description, headerStyle, descriptionStyle);
  }

  /**
   * Hides the given DOM element by adding the "hidden" class to the associated DOM.
   * @param {string} id of a DOM element
   */
  function hide(id) {
    $(id).classList.toggle("hidden", true);
  }

  /**
   * Shows the given DOM element by removing the "hidden" class from the associated DOM.
   * @param {string} id of a DOM element
   */
  function show(id) {
    $(id).classList.toggle("hidden", false);
  }

  /**
    * Function to check the status of an Ajax call, boiler plate code to include,
    * based on: https://developers.google.com/web/updates/2015/03/introduction-to-fetch
    * @param the response text from the url call
    * @return did we succeed or not, so we know whether or not to continue with the handling of
    * this promise
    */
   function checkStatus(response) {
    const OK = 200;
    const ERROR = 300;
    let responseText = response.text();
    if (response.status >= OK && response.status < ERROR || response.status === 0) {
      return responseText;
    } else {
      //return response.text();
      return responseText.then(Promise.reject.bind(Promise));
    }
  }

  /**
   * Returns the DOM element for the given id.
   * @param {string} id - of DOM element to get.
   * @returns {DOM object} the DOM element for the given id.
   */
  function $(id) {
    return document.getElementById(id);
  }

  /**
   * Returns the first DOM element for the given query.
   * @param {string} q - a CSS selector query
   * @returns {DOM object} the first DOM element for the given query.
   */
  function qs(q) {
    return document.querySelector(q);
  }

  /**
   * Creates and returns a DOM object with the specified tag.
   * @param {string} e - tag of the DOM object to create
   * @returns {DOM object} a newly created DOM object with the given tag.
   */
  function ce(e) {
    return document.createElement(e);
  }
})();
