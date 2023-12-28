var roleStaticHarvester = {
  run: function (creep) {
    // Attempt to harvest from the source
    var harvestResult = creep.harvest(Game.getObjectById(creep.memory.sourceId));

    // If not in range, move to the source
    if (harvestResult == ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.getObjectById(creep.memory.sourceId), { visualizePathStyle: { stroke: "#ffaa00" } });
    }

    // If the creep is full, drop the energy
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
      creep.drop(RESOURCE_ENERGY);
    }
  },
};

module.exports = roleStaticHarvester;
