var roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Check if creep should switch state between working and harvesting
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say("🌾 harvest");
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say("🔧 repairing");
    }

    if (creep.memory.working) {
      // Find structures that need repairs
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (object) => object.hits < object.hitsMax,
      });

      // Sort targets by most damaged
      targets.sort((a, b) => a.hits - b.hits);

      if (targets.length > 0) {
        if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          // Move to the target if not in range
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 20,
          });
        }
      }
    } else {
      creep.harvestEnergy();
    }
  },
};

module.exports = roleRepairer;
