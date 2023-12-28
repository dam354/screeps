// roleCarrier.js
const roleCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Creep renewal logic
    if (creep.ticksToLive < 50) {
      creep.say("Renewing");
      creep.moveTo(Game.spawns["Spawn1"]);
      Game.spawns["Spawn1"].renewCreep(creep);
      return; // Exit early to avoid further action this tick
    }

    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      creep.memory.delivering = true;
    } else if (creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.delivering = false;
    }
    // Determine whether the creep should be collecting or delivering energy
    if (creep.memory.delivering) {
      // Delivering energy to a structure
      let target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });

      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      } else {
        // Switch to collecting mode if no delivery targets
        creep.memory.delivering = false;
        creep.memory.targetId = null;
      }
    } else {
      // Collecting energy from dropped resources or containers
      let target = Game.getObjectById(creep.memory.targetId);

      if (!target) {
        target = this.findEnergyTarget(creep);
        creep.memory.targetId = target ? target.id : null;
      }

      if (target) {
        let actionResult = target instanceof Resource ? creep.pickup(target) : creep.withdraw(target, RESOURCE_ENERGY);
        if (actionResult == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      } else {
        // If no targets are found, move to a standby position
        this.moveToStandbyPosition(creep);
      }
    }
  },

  // Function to find targets, prioritizing distant ones if no nearby targets are found
  findEnergyTarget: function (creep) {
    let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
    });

    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
      });
    }

    // If no close target is found, look for the farthest one
    if (!target) {
      let allTargets = creep.room
        .find(FIND_DROPPED_RESOURCES, {
          filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
        })
        .concat(
          creep.room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
          })
        );

      if (allTargets.length > 0) {
        allTargets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
        target = allTargets[allTargets.length - 1]; // Select the farthest target
      }
    }

    return target;
  },

  // Logic for handling full spots near static harvesters
  moveToStandbyPosition: function (creep) {
    // Define standby positions or calculate them
    const standbyPos = new RoomPosition(25, 25, creep.room.name); // Example standby position
    creep.moveTo(standbyPos, { visualizePathStyle: { stroke: "#ffaa00" } });
  },
};

module.exports = roleCarrier;
