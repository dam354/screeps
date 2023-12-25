RoomPosition.prototype.getNearbyPositions = function getNearbyFunctions() {
  var positions = [];
  let startX = this.x - 1 || 1;
  let startY = this.y - 1 || 1;

  for (let x = startX; x <= this.x && x < 49; x++) {
    for (let y = startY; y <= this.y + 1 && y < 49; y++) {
      if (x !== this.x || y !== this.y) {
        positions.push(new RoomPosition(x, y, this.roomName));
      }
    }
  }
  return positions;
};

RoomPosition.prototype.getOpenPositions = function getOpenPositions() {
  let nearbypositions = this.getNearbyPositions();

  let terrain = Game.map.getRoomTerrain(this.roomName);

  let walkablePositions = _.filter(nearbypositions, function (pos) {
    return terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL;
  });
  let freePositions = _.filter(walkablePositions, function (pos) {
    return !pos.lookFor(LOOK_CREEPS).length;
  });

  return freePositions;
};