var roleHarvester = require("role.harvester");
var roleBuilder = require("role.builder");
var roleUpgrader = require("role.upgrader");

// Export the main game loop
module.exports.loop = function () {
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }
  var builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  console.log("Builders: " + builders.length);

  if (builders.length < 2) {
    var newName = "Builder" + Game.time;
    console.log("Spawning new builder: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "builder" },
    });
  }

  var harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  console.log("Harvesters: " + harvesters.length);

  if (harvesters.length < 2) {
    var newName = "Harvester" + Game.time;
    console.log("Spawning new harvester: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "harvester" },
    });
  }

  var upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  console.log("upgraders: " + upgraders.length);

  if (upgraders.length < 2) {
    var newName = "upgrader" + Game.time;
    console.log("Spawning new upgrader: " + newName);
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: "upgrader" },
    });
  }

  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  // Iterate over all creeps in the game
  for (var name in Game.creeps) {
    // Get the current creep object
    var creep = Game.creeps[name];

    // If the creep's role is harvester
    if (creep.memory.role == "harvester") {
      // Run the harvester role logic for this creep
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
    // If the creep's role is upgrader
    if (creep.memory.role == "upgrader") {
      // Run the upgrader role logic for this creep
      roleUpgrader.run(creep);
    }
  }
};