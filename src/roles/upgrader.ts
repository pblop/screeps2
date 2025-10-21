export const roleUpgrader: Role = {
  str: 'upgrader',
  create: (): CreepMemory => {
    return {
      role: roleUpgrader.str,
      working: false
    };
  },
  run: (creep: Creep) => {
  }
};
