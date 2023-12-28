var roleUpgrader = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Switch states between working and harvesting
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.memory.path = null; // Clear the cached path
      creep.say("🌾 harvest");
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.memory.path = null; // Clear the cached path
      creep.say("📈 upgrade");
    }

    if (creep.memory.working) {
      if (!creep.memory.path) {
        // Generate and cache the path
        creep.memory.path = creep.room.findPath(creep.pos, creep.room.controller.pos, {
          ignoreCreeps: true,
        });
      }
      let upgradeResult = creep.upgradeController(creep.room.controller);
      if (upgradeResult == ERR_NOT_IN_RANGE) {
        creep.moveByPath(creep.memory.path);
      } else if (upgradeResult == OK) {
        // Build or repair roads on the creep's path
        if (creep.pos.lookFor(LOOK_STRUCTURES).filter((s) => s.structureType == STRUCTURE_ROAD).length == 0) {
          creep.pos.createConstructionSite(STRUCTURE_ROAD);
        }
      }
    } else {
      creep.harvestEnergy(); // Make sure this function is efficient as well
    }
  },
};

module.exports = roleUpgrader;
