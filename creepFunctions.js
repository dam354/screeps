Creep.prototype.findEnergySource = function () {
  if (!this.room.memory.sources) {
    // Initialize sources if it's not already defined
    this.room.memory.sources = this.room.find(FIND_SOURCES).map((source) => source.id);
  }

  let source = this.memory.source ? Game.getObjectById(this.memory.source) : null;
  if (source && source.pos.getOpenPositions().length > 0) {
    return source;
  }

  let sources = this.room.memory.sources.map((id) => Game.getObjectById(id));
  source = _.find(sources, (s) => s && s.pos.getOpenPositions().length > 0);
  if (source) {
    this.memory.source = source.id;
  }
  return source;
};

Creep.prototype.harvestEnergy = function harvestEnergy() {
  // let storedSource = Game.getObjectById(this.memory.source);
  // // Validate the stored source or find a new one
  // if (!storedSource || (storedSource.pos.getOpenPositions().length === 0 && !this.pos.isNearTo(storedSource))) {
  //   delete this.memory.source;
  //   storedSource = this.findEnergySource();
  // }
  // // Perform the harvest operation
  // if (storedSource) {
  //   const harvestResult = this.harvest(storedSource);
  //   if (harvestResult === ERR_NOT_IN_RANGE) {
  //     this.moveTo(storedSource, {
  //       visualizePathStyle: { stroke: "#ffaa00" },
  //       reusePath: 5,
  //     });
  //   }
  // }
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
  }
};
