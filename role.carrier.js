// roleCarrier.js
const roleCarrier = {
  run: function (creep) {
    // Check if the creep needs to renew
    if (creep.ticksToLive < 50) {
      creep.say("Renewing");
      creep.moveTo(Game.spawns["Spawn1"]);
      Game.spawns["Spawn1"].renewCreep(creep);
      return;
    }

    // Determine whether the creep should be collecting or delivering energy
    if (creep.carry.energy < creep.carryCapacity && !creep.memory.delivering) {
      // Energy Collection
      let target = Game.getObjectById(creep.memory.targetId);
      if (!target) {
        const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
          filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
        });

        if (droppedEnergy) {
          target = droppedEnergy;
        } else {
          target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
          });
        }

        if (target) {
          creep.memory.targetId = target.id;
        } else {
          creep.memory.targetId = null;
        }
      }

      if (target) {
        if (creep.pickup(target) == ERR_NOT_IN_RANGE || creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      }
    } else {
      // Energy Delivery
      creep.memory.delivering = true;
      const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.energy < structure.energyCapacity
          );
        },
      });

      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      } else {
        creep.memory.delivering = false;
      }
    }

    // Clear targetId when the task is complete or the target is no longer valid
    if (creep.carry.energy == 0 || !Game.getObjectById(creep.memory.targetId)) {
      creep.memory.targetId = null;
      creep.memory.delivering = false;
    }
  },
};

module.exports = roleCarrier;
