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
  _.forEach(Game.rooms, function (room) {
    console.log(room);
  });

  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleUpgrader.run(creep);
    }
  }
};
