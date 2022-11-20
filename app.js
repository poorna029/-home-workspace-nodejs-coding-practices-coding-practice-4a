const express = require("express");
const app = express();
module.exports = app;
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
let db = null;
module.exports = app;
const dbpath = path.join(__dirname, "cricketTeam.db");
const initializeDBandServer = async () => {
  try {
    db = await open({ filename: dbpath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server at port 3000 is running");
    });
  } catch (e) {
    console.log(`DBerror : ${e.Message}`);
    process.exit(1);
  }
};
initializeDBandServer();

// write api to get list of players from cricket_team table;------> 1

app.get("/players/", async (request, response) => {
  const queryToList_of_players = `select player_id as playerId,player_name 
  as playerName,jersey_number as jerseyNumber ,role from cricket_team;`;
  const list_of_players = await db.all(queryToList_of_players);

  response.send(list_of_players);
});

// write API for adding a player to /players/ path;-----------------> 2

app.post("/players/", async (request, response) => {
  let playerDetails = request.body;
  let { playerName, jerseyNumber, role } = playerDetails;
  //   console.log(playerDetails);
  const queryToAddPlayer = `insert into cricket_team (player_name,jersey_number,role)
   values("${playerName}",${jerseyNumber},"${role}") ;`;
  const dbresponse = await db.run(queryToAddPlayer);
  //   const playerId = dbresponse.lastID;
  response.send("Player Added to Team");
});

// write api to get player from cricket_team table;-------------------> 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const GetPlayerById = `select player_id as playerId,player_name 
  as playerName,jersey_number as jerseyNumber ,role from cricket_team where player_id=${playerId};`;
  const player = await db.get(GetPlayerById);
  response.send(player);
});

//  API for updating player details to /players/:player_id/ path;----> 4

app.put("/players/:player_id/", async (request, response) => {
  const { player_id } = request.params;
  let playerDetails = request.body;
  console.log(player_id, playerDetails);
  let { playerName, jerseyNumber, role } = playerDetails;
  const queryToUpdatePlayer = `update cricket_team set player_name="${playerName}",
  jersey_number=${jerseyNumber},role="${role}"
   where player_id=${player_id};`;
  const dbresponse = await db.run(queryToUpdatePlayer);

  response.send("Player Details Updated");
  //   response.send({ playerId: playerId });
});

// API deleting player from cricket_team table;--------------------->5

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const GetPlayerById = `select player_name from cricket_team where player_id=${playerId};`;
  const player_name = await db.get(GetPlayerById);
  //   console.log(player_name.player_name);
  const deletingPlayerQuery = `delete from cricket_team where player_id=${playerId};`;
  const deletedResponse = await db.run(deletingPlayerQuery);

  response.send("Player Removed");
});
