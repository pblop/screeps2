interface Role {
  str: string;
  create: () => CreepMemory;
  run: (creep: Creep) => void;
  getBodySize: (energyAvailable: number) => BodyPartConstant[];
}
