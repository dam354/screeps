const roleCarrier = {
  run: function (creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      const droppedEnergy = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
      });

      if (droppedEnergy) {
        if (creep.pickup(droppedEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(droppedEnergy, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      } else {
        const container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: (s) => s.structureType == STRUCTURE_CONTAINER && s.store[RESOURCE_ENERGY] > 0,
        });

        if (container && creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(container, { visualizePathStyle: { stroke: "#ffaa00" } });
        }
      }
    } else {
      if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns["Spawn1"], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  },
};

module.exports = roleCarrier;
