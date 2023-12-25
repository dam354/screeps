Creep.prototype.findEnergySource = function () {
  let sources = this.room.find(FIND_SOURCES);
  if (sources.length) {
    let source = _.find(sources, function (s) {
      console.log(s.pos, s.pos.getOpenPositions());
      return s.pos.getOpenPositions().length > 0;
    });

    console.log(sources.length, source);
    if (source) {
      this.memory.source = source.id;
      return source;
    }
  }
};

Creep.prototype.harvestEnergy = function harvestEnergy() {
  let storedSource = Game.getObjectById(this.memory.source);
  if (!storedSource || (!storedSource.pos.getOpenPositions().length && !this.pos.isNearTo(storedSource))) {
    delete this.memory.source;
    storedSource = this.findEnergySource();
  }
  if (storedSource) {
    if (this.pos.isNearTo(storedSource)) {
      this.harvest(storedSource);
    } else {
      this.moveTo(storedSource);
    }

    if (this.harvest(storedSource) == ERR_NOT_IN_RANGE) {
      this.moveTo(storedSource, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
};
