var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.store.getFreeCapacity() > 0) {
      creep.harvestEnergy();
    } else {
      if (creep.transfer(Game.spawns["Spawn1"], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(Game.spawns["Spawn1"], { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  },
};

module.exports = roleHarvester;
