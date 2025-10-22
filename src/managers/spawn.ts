import { roleGeneric } from "roles/generic";
import { roleBuilder } from "roles/builder";

function getCreepCountByRole(roleStr: string): number {
  return _.filter(Game.creeps, (creep) => creep.memory.role === roleStr).length;
}

function getCreepsRemainingToSpawn(counts: [Role, number][]): number {
  return _.sum(counts, ([role, maxCount]) => {
    return Math.max(0, maxCount - getCreepCountByRole(role.str));
  });
}

function getBodyCost(body: BodyPartConstant[]): number {
  return _.sum(body, (part) => BODYPART_COST[part]);
}

export const managerSpawn = {
  run: (spawn: StructureSpawn) => {
    const controller = spawn.room.controller;
    const controllerLevel = controller?.level || 0;
    const energyCapacity = spawn.room.energyCapacityAvailable;

    const roles: [Role, number][] = [[roleGeneric, 10]];
    const wantsToSpawn = getCreepsRemainingToSpawn(roles) > 0;

    // If the spawn needs energy, target it.
    // Otherwise, if any spawn expansion needs energy, target it.
    if (spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && wantsToSpawn && !spawn.spawning) {
      Memory.genericTarget = spawn.id;
    } else if (wantsToSpawn && !spawn.spawning) {
      const extensions = spawn.room.find<StructureExtension>(FIND_MY_STRUCTURES, {
        filter: (structure): structure is StructureExtension => {
          return structure.structureType === STRUCTURE_EXTENSION &&
                  structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      });

      if (extensions.length > 0) {
        Memory.genericTarget = extensions[0].id;
      } else {
        Memory.genericTarget = controller?.id;
      }
    } else {
      Memory.genericTarget = controller?.id;
    }

    // Spawn is busy
    if (wantsToSpawn && !spawn.spawning) {
      for (const [role, maxCount] of roles) {
        const creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role.str);
        if (creeps.length < maxCount) {
          const newName = `${role.str}${Game.time}`;
          const energyCost = controllerLevel === 0 ? 200 : energyCapacity;

          const body = role.getBodySize(spawn.room.energyAvailable);
          const memory = role.create();

          // Check if we have enough energy
          if (spawn.room.energyAvailable >= energyCost) {
            spawn.spawnCreep(body, newName, { memory: memory });
            console.log(`Spawning new ${memory.role}: ${newName}`);
          }
          return;
        }
      }
    }
  }
};
