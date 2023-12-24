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
    if (room && room.controller && room.controller.my) {
      let harvesterTarget = _.get(room.memory, ["census", "harvester"], 4);
      var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester");
      console.log("Harvesters: " + harvesters.length);

      if (harvesters.length < harvesterTarget) {
        var newName = "Harvester" + Game.time;
        console.log("Spawning new harvester: " + newName);
        Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "harvester" } });
      }
      let upgraderTarget = _.get(room.memory, ["census", "upgrader"], 4);
      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader");
      console.log("upgraders: " + upgraders.length);

      if (upgraders.length < upgraderTarget) {
        var newName = "upgrader" + Game.time;
        console.log("Spawning new upgrader: " + newName);
        Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, { memory: { role: "upgrader" } });
      }
    }
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
