export const roleUpgrader: Role = {
  str: 'upgrader',
  create: (): CreepMemory => {
    return {
      role: roleUpgrader.str,
      working: false
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
    } else {
      // Find targets
      const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        filter: (structure): structure is StructureController => {
          return structure.structureType === STRUCTURE_CONTROLLER;
        }
      });

      if (target) {
        if (creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};
