var roleStaticHarvester = {
  run: function (creep) {
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      if (creep.harvest(Game.getObjectById(creep.memory.sourceId)) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.getObjectById(creep.memory.sourceId), { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    } else {
      creep.drop(RESOURCE_ENERGY);
    }
  },
};

module.exports = roleStaticHarvester;
