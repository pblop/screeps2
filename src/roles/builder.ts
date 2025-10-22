export const roleBuilder: Role = {
  str: 'builder',
  create: (): CreepMemory => {
    return {
      role: roleBuilder.str,
      working: false
    };
  },
  getBodySize: (energyAvailable: number): BodyPartConstant[] => {
    return [WORK, CARRY, MOVE];
  },
  run: (creep: Creep) => {
  },
};
