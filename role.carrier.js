// roleCarrier.js
const roleCarrier = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Creep renewal logic
    if (creep.ticksToLive < 50) {
      creep.say("Renewing");
      creep.moveTo(Game.spawns["Spawn1"], { visualizePathStyle: { stroke: "#00ff00" } }); // Green path for renewing
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
          creep.moveTo(target, { visualizePathStyle: { stroke: "#0000ff" } }); // Blue path for delivering
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
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } }); // Orange path for collecting
        }
      } else {
        // If no targets are found, move to a standby position
        this.moveToStandbyPosition(creep);
      }
    }
  },

  // Function to find targets for picking up energy
  findEnergyTarget: function (creep) {
    // Find all dropped resources in the room
    const droppedResources = creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
    });

    // Sort the dropped resources by amount, descending
    droppedResources.sort((a, b) => b.amount - a.amount);

    // Select the dropped resource with the most energy, if available
    if (droppedResources.length > 0) {
      return droppedResources[0];
    }

    // If no dropped resources, then look for containers with energy
    let containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
      filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });

    // Sort containers by energy amount, descending
    if (containersWithEnergy.length > 0) {
      containersWithEnergy.sort(
        (a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY)
      );
      return containersWithEnergy[0]; // Select the container with the most energy
    }

    return null; // Return null if no targets are found
  },

  // Logic for handling full spots near static harvesters
  moveToStandbyPosition: function (creep) {
    // Define standby positions or calculate them
    const standbyPos = new RoomPosition(25, 25, creep.room.name); // Example standby position
    creep.moveTo(standbyPos, { visualizePathStyle: { stroke: "#00ff00" } }); // Green path for standby position
  },
};

module.exports = roleCarrier;
