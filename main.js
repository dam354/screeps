// Import the roles for different types of creeps
var roleHarvester = require("role.harvester");
var roleBuilder = require("role.builder");
var roleUpgrader = require("role.upgrader");

// Export the main game loop
module.exports.loop = function () {
  // Iterate over all creeps in memory
  for (var name in Memory.creeps) {
    // If a creep no longer exists in the game, remove it from memory
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  // Filter the creeps in the game to find the builders
  var builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  console.log("Builders: " + builders.length);

  // If there are less than 2 builders, spawn a new one
  if (builders.length < 2) {
    var newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "builder" },
    });
  }

  // Filter the creeps in the game to find the harvesters
  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  console.log("Harvesters: " + harvesters.length);

  // If there are less than 2 harvesters, spawn a new one
  if (harvesters.length < 2) {
    var newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester" },
    });
  }
};
