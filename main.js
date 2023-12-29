var creepFunctions = require("creepFunctions");
var roomPositionFunctions = require("roomPositionFunctions");
const profiler = require("screeps-profiler");

// main.js
const roles = {
  harvester: require("role.harvester"),
  builder: require("role.builder"),
  upgrader: require("role.upgrader"),
  repairer: require("role.repairer"),
  staticHarvester: require("role.staticHarvester"),
  carrier: require("role.carrier"),
};
profiler.enable();
const METRICS_INTERVAL = 300; // 5 seconds
const METRICS_DURATION = 72000; // 1 hour
// Function to calculate the body parts of a creep based on available energy in the room
const PROGRESS_CHECK_INTERVAL = 5; // Check every 100 ticks
/**
 * Constructs a body for a creep based on available energy and a body segment.
 * @param {Array} segment - An array of body parts (e.g., [MOVE, WORK]).
 * @param {Object} room - The room object with energyAvailable property.
 * @return {Array} An array representing the body of the creep.
 */
function getBody(segment, room) {
  // Validate inputs
  if (!Array.isArray(segment) || !room || typeof room.energyAvailable !== "number") {
    console.error("Invalid input");
    return [];
  }

  const segmentCost = _.sum(segment, (s) => BODYPART_COST[s] || 0);

  let energyAvailable = room.energyAvailable;
  if (energyAvailable < segmentCost) {
    return []; // Return empty array if not enough energy for minimum body
  }

  let maxSegments = Math.floor(energyAvailable / segmentCost);
  let body = [];
  for (let i = 0; i < maxSegments; i++) {
    body = body.concat(segment);
  }

  // Ensure the body size does not exceed the game's limit
  if (body.length > MAX_CREEP_SIZE) {
    body = body.slice(0, MAX_CREEP_SIZE);
  }

  return body;
}
// Main game loop
module.exports.loop = function () {
  profiler.wrap(function () {
    for (let name in Game.creeps) {
      let creep = Game.creeps[name];

      // Check if the creep has less than 2 body parts
      if (creep.body.length < 2) {
        // Instruct the creep to remove itself from the game
        creep.suicide();

        console.log(`Creep ${name} with less than 2 body parts has been removed.`);
      }
    }

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

        let repairerTarget = _.get(room.memory, ["census", "repairer"], 3); // Adjust the target as needed
        var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == "repairer");
        console.log("Repairers: " + repairers.length);

        // If there are fewer repairers than the target, spawn new repairers
        if (repairers.length < repairerTarget) {
          var newName = "Repairer" + Game.time;
          console.log("Spawning new repairer: " + newName);
          Game.spawns["Spawn1"].spawnCreep(getBody([WORK, CARRY, MOVE], room), newName, {
            memory: { role: "repairer" },
          });
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

            // Check if the spawn is already in the process of spawning a creep
            if (!Game.spawns["Spawn1"].spawning) {
              console.log("Spawning new static harvester: " + newName + " for source: " + sourceId);
              Game.spawns["Spawn1"].spawnCreep(getBody([WORK, WORK, MOVE], room), newName, {
                memory: { role: "staticHarvester", sourceId: sourceId },
              });
            }
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
    // Track controller progress
    if (Game.time % PROGRESS_CHECK_INTERVAL === 0) {
      Memory.progressTracking = Memory.progressTracking || {};
      const roomNames = Object.keys(Game.rooms);

      roomNames.forEach((roomName) => {
        const room = Game.rooms[roomName];
        if (room.controller && room.controller.my) {
          const currentProgress = room.controller.progress;
          const lastCheck = Memory.progressTracking[roomName];

          if (lastCheck) {
            const progressDelta = currentProgress - lastCheck.progress;
            const ticksDelta = Game.time - lastCheck.time;
            const ratePerTick = progressDelta / ticksDelta;

            const remainingProgress = room.controller.progressTotal - currentProgress;
            const estimatedTicksToNextLevel = Math.ceil(remainingProgress / ratePerTick);

            console.log(`Room ${roomName}: Estimated ${estimatedTicksToNextLevel} ticks to next level.`);
          }

          // Update the tracking information
          Memory.progressTracking[roomName] = {
            progress: currentProgress,
            time: Game.time,
          };
        }
      });
    }
    // Then in your loop
    for (var name in Game.creeps) {
      var creep = Game.creeps[name];
      if (roles[creep.memory.role]) {
        roles[creep.memory.role].run(creep);
      }
    }
    trackMetrics();
  });
};

function trackMetrics() {
  // Initialize metrics in memory if they don't exist
  Memory.metrics = Memory.metrics || { tick: Game.time, data: [] };

  // Record metrics
  const metrics = {
    time: Game.time,
    creeps: Object.keys(Game.creeps).length,
    energy: _.sum(Game.rooms, (room) => room.energyAvailable),
    cpuUsed: Game.cpu.getUsed(),
    bucket: Game.cpu.bucket,
    avgCreepLife: _.sum(Game.creeps, (creep) => creep.ticksToLive) / Object.keys(Game.creeps).length,
    roomControl: _.sum(Game.rooms, (room) => (room.controller ? room.controller.level : 0)),
    creepRoles: _.countBy(Game.creeps, (creep) => creep.memory.role),
    // Add more metrics as needed
  };
  Memory.metrics.data.push(metrics);

  // Remove old metrics
  while (Memory.metrics.data.length > METRICS_DURATION) {
    Memory.metrics.data.shift();
  }

  // Print metrics every METRICS_INTERVAL ticks
  if ((Game.time - Memory.metrics.tick) % METRICS_INTERVAL === 0) {
    console.log(JSON.stringify(Memory.metrics.data));
  }
}
