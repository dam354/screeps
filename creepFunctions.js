Creep.prototype.findEnergySource = function () {
  // Check if the creep has a valid stored source with open positions
  const storedSource = Game.getObjectById(this.memory.source);
  if (storedSource && storedSource.pos.getOpenPositions().length > 0) {
    return storedSource;
  }

  // Find a new source, considering distance and load balancing
  const sources = this.room.memory.sources
    .map((id) => Game.getObjectById(id))
    .filter((source) => source && source.pos.getOpenPositions().length > 0);

  const closestSource = this.pos.findClosestByPath(sources);
  if (closestSource) {
    this.memory.source = closestSource.id;
    return closestSource;
  }
};

Creep.prototype.harvestEnergy = function harvestEnergy() {
  let storedSource = Game.getObjectById(this.memory.source);

  // Validate the stored source or find a new one
  if (!storedSource || (storedSource.pos.getOpenPositions().length === 0 && !this.pos.isNearTo(storedSource))) {
    delete this.memory.source;
    storedSource = this.findEnergySource();
  }

  // Perform the harvest operation
  if (storedSource) {
    const harvestResult = this.harvest(storedSource);
    if (harvestResult === ERR_NOT_IN_RANGE) {
      this.moveTo(storedSource, {
        visualizePathStyle: { stroke: "#ffaa00" },
        reusePath: 5,
      });
    }
  }
};
