-- Savong Tan
-- HW5 Pokedex Part 2
-- CSE 154 AC

-- This table represents a a player's pokedex of which pokemon that they have
-- caught.

DROP TABLE IF EXISTS Pokedex;
CREATE TABLE Pokedex(
  name VARCHAR(30) NOT NULL PRIMARY KEY,
  nickname VARCHAR(30),
  datefound DATETIME
);
