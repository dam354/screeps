Creep.prototype.findEnergySource = function () {
  let sources = this.room.find(FIND_SOURCES);
  if (sources.length) {
    this.memory.source = sources[0].id;
    return sources[0];
  }
};

Creep.prototype.harvestEnergy = function harvestEnergy() {
  let storedSource = Game.getObjectById(this.memory.source);
  if (!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))) {
    delete this.memory.source;
    storedSource = this.findEnergySource();
  }
  if (storedSource) {
    if (this.isNearTo(storedSource)) {
      this.harvest(storedSource);
    } else {
      this.moveTo(storedSource);
    }

    if (this.harvest(storedSource) == ERR_NOT_IN_RANGE) {
      this.moveTo(storedSource, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
};
