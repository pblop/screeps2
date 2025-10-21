export const roleHarvester = {
  run: (creep: Creep) => {
    if (creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = false;
      creep.say('🔄 deliver');
    }

    if (!creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = true;
      creep.say('⚡ harvest');
    }

    if (creep.memory.working) {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
      if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    } else {
      // Find targets
      const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure): structure is StructureSpawn | StructureExtension | StructureTower => {
          // This "type predicate" (the 'is' part) tells TS
          // that the returned structures will be one of these types.
          return (structure.structureType === STRUCTURE_EXTENSION ||
                  structure.structureType === STRUCTURE_SPAWN ||
                  structure.structureType === STRUCTURE_TOWER) &&
                  structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      if (target) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};
