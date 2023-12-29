var roleHarvester = {
  /** @param {Creep} creep **/
  run: function (creep) {
    // Ensure room sources are cached
    if (!creep.room.memory.sources) {
      let sources = creep.room.find(FIND_SOURCES);
      creep.room.memory.sources = sources.map(source => source.id);
    }

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
      let source = Game.getObjectById(creep.memory.sourceId);
      if (!source) {
        // Assign a new source if the current one is invalid or not set
        source = this.assignNewSource(creep);
      }
      if (source && creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source, {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    }
  },

  // Function to assign a new source to the creep
  assignNewSource: function (creep) {
    let availableSources = creep.room.memory.sources.map(id => Game.getObjectById(id));
    // Filter out sources that are already at capacity
    availableSources = availableSources.filter(source => {
      let creepsAssigned = _.filter(Game.creeps, (c) => c.memory.sourceId === source.id);
      return creepsAssigned.length < 2; // Example: max 2 creeps per source
    });
    if (availableSources.length > 0) {
      let source = creep.pos.findClosestByPath(availableSources);
      if (source) {
        creep.memory.sourceId = source.id;
        return source;
      }
    }
    return null;
  },
};

module.exports = roleHarvester;
