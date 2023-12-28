var roleRepairer = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.working = false;
      creep.say("🌾 harvest");
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
      creep.memory.working = true;
      creep.say("🔋 FILLING");
    }

    if (creep.memory.working) {
      var targets = creep.room.find(FIND_MY_STRUCTURES);
      targets = _.filter(targets, function (struct) {
        return (
          (struct.structureType == STRUCTURE_CONTAINER ||
            struct.structureType == STRUCTURE_EXTENSION ||
            struct.structureType == STRUCTURE_TOWER ||
            struct.structureType == STRUCTURE_SPAWN) &&
          struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
        );
      });

      if (targets.length) {
        let target = creep.pos.findClosestByRange(targets);
        if (creep.pos.isNearTo(target)) {
          creep.transfer(target, RESOURCE_ENERGY);
        } else {
          creep.moveTo(target);
        }
      }
    } else {
      creep.harvestEnergy();
    }
  },
};

module.exports = roleRepairer;
