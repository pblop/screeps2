export const managerSpawn = {
  run: (spawn: StructureSpawn) => {
    const maxHarvesters = 4;


    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');

    if (spawn.spawning) {
      return; // Spawn is busy
    }

    // Try to spawn a harvester
    if (harvesters.length < maxHarvesters) {
      const newName = `Harvester${Game.time}`;
      const body = [WORK, CARRY, MOVE]; // 200 energy

      const memory: CreepMemory = {
        role: 'harvester',
        working: true
      };

      // Check if we have enough energy
      if (spawn.room.energyAvailable >= 200) {
        spawn.spawnCreep(body, newName, { memory: memory });
        console.log(`Spawning new harvester: ${newName}`);
      }
    }

    // ... add logic for builders, upgraders, etc. ...
  }
};
