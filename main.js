// Import the roles for different types of creeps
var roleHarvester = require("role.harvester");
var roleBuilder = require("role.builder");
var roleUpgrader = require("role.upgrader");
var creepFunctions = require("creepFunctions");
var roomPositionFunctions = require("roomPositionFunctions");

function getBody(segment, room) {
  let body = [];
  // how much each sement cost
  let segmentCost = _.sum(segment, (s) => BODYPART_COST[s]);

  // how much energey we can use total
  let energyAvailable = room.energyCapacityAvailable;

  // how many times we can include the segment with room energy
  let maxSegments = Math.floor(energyAvailable / segmentCost);

  _.times(maxSegments, function () {
    _.forEach(segment, (s) => body.push(s));
  });

  return body;
}

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
        Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
          memory: { role: "harvester" },
        });
      }
      let upgraderTarget = _.get(room.memory, ["census", "upgrader"], 4);
      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader");
      console.log("upgraders: " + upgraders.length);

      if (upgraders.length < upgraderTarget) {
        var newName = "upgrader" + Game.time;
        console.log("Spawning new upgrader: " + newName);
        Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, { memory: { role: "upgrader" } });
      }

      let builderTarget = _.get(room.memory, ["census", "builder"], 4);
      var builders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder");
      console.log("builders: " + builders.length);

      let sites = room.find(FIND_CONSTRUCTION_SITES);

      if (sites.length > 0 && builders.length < builderTarget) {
        var newName = "builder" + Game.time;
        console.log("Spawning new builder: " + newName);
        Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, { memory: { role: "builder" } });
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
      roleBuilder.run(creep);
    }
  }
};
