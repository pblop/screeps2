export const roleBuilder: Role = {
  str: 'builder',
  create: (): CreepMemory => {
    return {
      role: roleBuilder.str,
      working: false
    };
  },
  run: (creep: Creep) => {
  }
};
