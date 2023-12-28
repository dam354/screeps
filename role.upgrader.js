var roleUpgrader = {
  run: function (creep) {
    // Switch states between working and harvesting
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say("🌾 harvest");
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say("📈 upgrade");
    }

    if (creep.memory.working) {
      // Attempt to upgrade the controller
      let upgradeResult = creep.upgradeController(creep.room.controller);

      // Move to the controller if not in range
      if (upgradeResult == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
          reusePath: 5, // Reuse the path for 5 ticks
        });
      } else if (upgradeResult == OK) {
        // Maintain the existing behavior for building roads
        if (creep.pos.lookFor(LOOK_STRUCTURES).filter((s) => s.structureType == STRUCTURE_ROAD).length == 0) {
          creep.pos.createConstructionSite(STRUCTURE_ROAD);
        }
      }
    } else {
      // Harvest energy using the existing function or logic
      creep.harvestEnergy();
    }
  },
};

module.exports = roleUpgrader;
