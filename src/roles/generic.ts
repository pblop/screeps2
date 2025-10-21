export const roleGeneric: Role = {
  str: 'generic',
  create: (): CreepMemory => {
    return {
      role: roleGeneric.str,
      working: true
    };
  },
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
    } else if (Memory.genericTarget) {
      // Find targets
      const target = Game.getObjectById<Structure>(Memory.genericTarget);
      if (target?.structureType === STRUCTURE_CONTROLLER) {
        if (creep.upgradeController(target as StructureController) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else if (target?.structureType === STRUCTURE_SPAWN ||
                 target?.structureType === STRUCTURE_EXTENSION ||
                 target?.structureType === STRUCTURE_TOWER) {
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};
