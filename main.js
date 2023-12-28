// Import the roles for different types of creeps
var roleHarvester = require("role.harvester");
var roleBuilder = require("role.builder");
var roleUpgrader = require("role.upgrader");
var roleRepairer = require("role.repairer");
var roleStaticHarvester = require("role.staticHarvester");
var roleCarrier = require("role.carrier");
var creepFunctions = require("creepFunctions");
var roomPositionFunctions = require("roomPositionFunctions");

// Function to calculate the body parts of a creep based on available energy in the room

function getBody(segment, room) {
  // Calculate the cost of a single segment of body parts
  const segmentCost = _.sum(segment, (s) => BODYPART_COST[s]);

  let energyAvailable = room.energyAvailable;

  // If the available energy is less than the cost of one segment, return an empty array or minimal viable body
  if (energyAvailable < segmentCost) {
    return []; // Or return a minimal viable body, e.g., [MOVE]
  }

  // Calculate the maximum number of segments
  let maxSegments = Math.floor(energyAvailable / segmentCost);
  let body = [];

  // Efficiently build the body array
  for (let i = 0; i < maxSegments; i++) {
    body.push(...segment);
  }

  return body;
}

// Main game loop
module.exports.loop = function () {
  // Only run memory cleanup if the number of creeps in memory doesn't match the number of creeps in the game
  if (Object.keys(Memory.creeps).length !== Object.keys(Game.creeps).length) {
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
        console.log("Clearing non-existing creep memory:", name);
      }
    }
  }

  // Iterate over all rooms controlled by the player
  _.forEach(Game.rooms, function (room) {
    // Check if the room has a controller and it belongs to the player
    if (room && room.controller && room.controller.my) {
      if (!room.memory.sourcesData) {
        room.memory.sourcesData = {};
        const sources = room.find(FIND_SOURCES);
        for (const source of sources) {
          const openPositions = source.pos.getOpenPositions().length;
          room.memory.sourcesData[source.id] = { openSpots: openPositions };
        }
      }

      if (room.memory.sources) {
        room.memory.sources = room.memory.sources.filter((id) => Game.getObjectById(id));
        if (!room.memory.sources.length) {
          delete room.memory.sources;
        }
      }
      // Determine the target number of harvesters for this room
      // let harvesterTarget = _.get(room.memory, ["census", "harvester"], 6);
      // // Get the current number of harvester creeps
      // var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester");
      // console.log("Harvesters: " + harvesters.length);

      // // If there are fewer harvesters than the target, spawn new harvesters
      // if (harvesters.length < harvesterTarget) {
      //   var newName = "Harvester" + Game.time;
      //   console.log(
      //     "Spawning new harvester: " + newName,
      //     Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
      //       memory: { role: "harvester" },
      //     })
      //   );
      //   Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
      //     memory: { role: "harvester" },
      //   });
      // }

      // let repairerTarget = _.get(room.memory, ["census", "repairer"], 3); // Adjust the target as needed
      // var repairers = _.filter(
      //   Game.creeps,
      //   (creep) => creep.memory.role == "repairer"
      // );
      // console.log("Repairers: " + repairers.length);

      // // If there are fewer repairers than the target, spawn new repairers
      // if (repairers.length < repairerTarget) {
      //   var newName = "Repairer" + Game.time;
      //   console.log("Spawning new repairer: " + newName);
      //   Game.spawns["Spawn1"].spawnCreep(
      //     getBody([WORK, CARRY, MOVE], room),
      //     newName,
      //     {
      //       memory: { role: "repairer" },
      //     }
      //   );
      // }

      let builderTarget = _.get(room.memory, ["census", "builder"], 2);
      var builders = _.filter(Game.creeps, (creep) => creep.memory.role == "builder");
      console.log("builders: " + builders.length);

      // Check for construction sites in the room
      let sites = room.find(FIND_CONSTRUCTION_SITES);

      // Spawn new builders if there are construction sites and fewer builders than the target
      if (sites.length > 0 && builders.length < builderTarget) {
        var newName = "builder" + Game.time;
        console.log("Spawning new builder: " + newName);
        Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
          memory: { role: "builder" },
        });
      }
      // Similar logic for upgraders and builders
      let upgraderTarget = _.get(room.memory, ["census", "upgrader"], 3);
      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == "upgrader");
      console.log("upgraders: " + upgraders.length);

      if (upgraders.length < upgraderTarget) {
        var newName = "upgrader" + Game.time;
        console.log("Spawning new upgrader: " + newName);
        Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
          memory: { role: "upgrader" },
        });
      }

      let carrierTarget = _.get(room.memory, ["census", "carrier"], 4);
      var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == "carrier");
      console.log("Carriers: " + carriers.length);

      if (carriers.length < carrierTarget) {
        var newName = "Carrier" + Game.time;
        console.log("Spawning new carrier: " + newName);
        Game.spawns["Spawn1"].spawnCreep(getBody([CARRY, MOVE, MOVE], room), newName, {
          memory: { role: "carrier" },
        });
      }
      _.forEach(room.memory.sourcesData, (sourceData, sourceId) => {
        let staticHarvesters = _.filter(
          Game.creeps,
          (creep) => creep.memory.role == "staticHarvester" && creep.memory.sourceId == sourceId
        );

        console.log("Static Harvesters for source " + sourceId + ": " + staticHarvesters.length);

        if (staticHarvesters.length < sourceData.openSpots) {
          var newName = "StaticHarvester" + Game.time;
          console.log("Spawning new static harvester: " + newName + " for source: " + sourceId);
          Game.spawns["Spawn1"].spawnCreep(getBody([WORK, WORK, MOVE], room), newName, {
            memory: { role: "staticHarvester", sourceId: sourceId },
          });
        }
      });
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
    if (creep.memory.role == "repairer") {
      roleRepairer.run(creep);
    }
    if (creep.memory.role == "staticHarvester") {
      roleStaticHarvester.run(creep);
    }
    if (creep.memory.role == "carrier") {
      roleCarrier.run(creep);
    }
  }
};
