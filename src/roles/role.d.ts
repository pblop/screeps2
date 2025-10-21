interface Role {
  str: string;
  create: () => CreepMemory;
  run: (creep: Creep) => void;
}
