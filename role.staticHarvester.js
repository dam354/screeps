var roleStaticHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    if (creep.harvest(Game.getObjectById(creep.memory.sourceId)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.getObjectById(creep.memory.sourceId), { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  },
};

module.exports = roleStaticHarvester;
