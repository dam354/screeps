// Import the roles for different types of creeps
var roleHarvester = require("role.harvester");
var roleBuilder = require("role.builder");
var roleUpgrader = require("role.upgrader");
var creepFunctions = require("creepFunctions");
var roomPositionFunctions = require("roomPositionFunctions");

// Function to calculate the body parts of a creep based on available energy in the room
function getBody(segment, room) {
  let body = [];
  // Calculate the cost of a single segment of body parts
  let segmentCost = _.sum(segment, (s) => BODYPART_COST[s]);

  // Retrieve the total energy capacity available in the room
  let energyAvailable = room.energyCapacityAvailable;

  // Determine the maximum number of segments that can be created with the available energy
  let maxSegments = Math.floor(energyAvailable / segmentCost);

  // Construct the body parts array based on the maximum segments possible
  _.times(maxSegments, function () {
    _.forEach(segment, (s) => body.push(s));
  });

  return body;
}

// Main game loop
module.exports.loop = function () {
  // Iterate over all creeps stored in memory
  for (var name in Memory.creeps) {
    // Remove creeps from memory that no longer exist in the game
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  // Iterate over all rooms controlled by the player
  _.forEach(Game.rooms, function (room) {
    // Check if the room has a controller and it belongs to the player
    if (room && room.controller && room.controller.my) {
      // Determine the target number of harvesters for this room
      let harvesterTarget = _.get(room.memory, ["census", "harvester"], 4);
      // Get the current number of harvester creeps
      var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester");
      console.log("Harvesters: " + harvesters.length);

      // If there are fewer harvesters than the target, spawn new harvesters
      if (harvesters.length < harvesterTarget) {
        var newName = "Harvester" + Game.time;
        console.log(
          "Spawning new harvester: " + newName,
          Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
            memory: { role: "harvester" },
          })
        );
        Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
          memory: { role: "harvester" },
        });
      }

      // Similar logic for upgraders and builders
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

      // Check for construction sites in the room
      let sites = room.find(FIND_CONSTRUCTION_SITES);

      // Spawn new builders if there are construction sites and fewer builders than the target
      if (sites.length > 0 && builders.length < builderTarget) {
        var newName = "builder" + Game.time;
        console.log("Spawning new builder: " + newName);
        Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, { memory: { role: "builder" } });
      }
    }
  });

  // Display a visual notification when a creep is being spawned
  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  // Iterate over all creeps and execute their role-specific logic
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
