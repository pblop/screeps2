import { roleGeneric } from "roles/generic";
import { roleBuilder } from "roles/builder";

const AVAILABLE_EXTENSION_COUNTS: { [level: number]: number } = {
  1: 0,
  2: 5,
  3: 10,
  4: 20,
  5: 30,
  6: 40,
  7: 50,
  8: 60,
};

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

function getEmptyPositionAround(room: Room, pos: RoomPosition): [number, number] | null {
  const area = room.lookAtArea(
    Math.max(0, pos.y - 1),
    Math.max(0, pos.x - 1),
    Math.min(49, pos.y + 1),
    Math.min(49, pos.x + 1),
    true
  );
  for (const look of area) {
    if (look.x === pos.x && look.y === pos.y) continue;

    const hasTerrain = look.terrain && (look.terrain === 'plain');
    if (!hasTerrain) continue;

    return [look.x, look.y];
  }
  return null;
}

function findGenericTarget(spawn: StructureSpawn, wantsToSpawn: boolean): [Structure | ConstructionSite | null, "structure" | "construction" | undefined] {
  const controller = spawn.room.controller;
  const room = spawn.room;

  const needEnergyToSpawn = wantsToSpawn && !spawn.spawning;

  // If the spawn needs energy, target it.
  if (needEnergyToSpawn && spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    return [spawn, "structure"];
  }

  // Otherwise, if any spawn expansion needs energy, target it.
  if (needEnergyToSpawn) {
    const extensions = room.find<StructureExtension>(FIND_MY_STRUCTURES, {
      filter: (structure): structure is StructureExtension => {
        return structure.structureType === STRUCTURE_EXTENSION &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
      }
    });

    if (extensions.length > 0) {
      return [extensions[0], "structure"];
    }
  }

  // Otherwise, if there are construction sites, target the first one.
  const constructionSites = room.find(FIND_CONSTRUCTION_SITES) as ConstructionSite[];
  if (constructionSites.length > 0) {
    return [constructionSites[0], "construction"];
  }

  // Otherwise, target the controller.
  return [controller || null, "structure"];
}

export const managerSpawn = {
  run: (spawn: StructureSpawn) => {
    const controller = spawn.room.controller;
    const controllerLevel = controller?.level || 0;
    const energyCapacity = spawn.room.energyCapacityAvailable;

    const roles: [Role, number][] = [[roleGeneric, 10]];
    const wantsToSpawn = getCreepsRemainingToSpawn(roles) > 0;

    const [target, targetType] = findGenericTarget(spawn, wantsToSpawn);
    Memory.genericTarget = target?.id;
    Memory.genericTargetType = targetType;

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
          break;
        }
      }
    }

    // If we're not building anything, build an extension
    if (controllerLevel >= 2) {
      if (Memory.constructionSitesNumber === 0) {
        const pos = getEmptyPositionAround(spawn.room, spawn.pos);
        if (pos != null) {
          const [x, y] = pos;
          const newSite = spawn.room.createConstructionSite(x, y, STRUCTURE_EXTENSION);
          console.log(`Creating new extension construction site at ${x}, ${y}: ${newSite}`);
          if (newSite === OK) {
            Memory.constructionSitesNumber++;
          }
        } else {
          console.error('No empty position found around spawn to build extension');
        }
      }
      if (Game.time % 100 === 0) {
        const constructionSites = spawn.room.find(FIND_CONSTRUCTION_SITES) as ConstructionSite[];
        Memory.constructionSitesNumber = constructionSites.length;
      }
    }
  }
};
