RoomPosition.prototype.getNearbyPositions = function getNearbyFunctions() {
  var positions = [];
  let startX = Math.max(this.x - 1, 1);
  let startY = Math.max(this.y - 1, 1);

  for (let x = startX; x <= this.x + 1 && x < 49; x++) {
    for (let y = startY; y <= this.y + 1 && y < 49; y++) {
      if (x !== this.x || y !== this.y) {
        positions.push({ x, y });
      }
    }
  }
  return positions;
};

RoomPosition.prototype.getOpenPositions = function getOpenPositions() {
  let nearbypositions = this.getNearbyPositions();

  let terrain = Game.map.getRoomTerrain(this.roomName);

  let freePositions = nearbypositions.filter((pos) => {
    return (
      terrain.get(pos.x, pos.y) !== TERRAIN_MASK_WALL &&
      !new RoomPosition(pos.x, pos.y, this.roomName).lookFor(LOOK_CREEPS).length
    );
  });

  return freePositions;
};
