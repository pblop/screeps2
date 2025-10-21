import { roleGeneric } from "roles/generic";
import { roleBuilder } from "roles/builder";
import { roleUpgrader } from "roles/upgrader";
// import { roleUpgrader } from "roles/upgrader";

function getCreepCountByRole(roleStr: string): number {
  return _.filter(Game.creeps, (creep) => creep.memory.role === roleStr).length;
}

function getCreepsRemainingToSpawn(counts: [Role, number][]): number {
  return _.sum(counts, ([role, maxCount]) => {
    return Math.max(0, maxCount - getCreepCountByRole(role.str));
  });
}

export const managerSpawn = {
  run: (spawn: StructureSpawn) => {

    const controller = spawn.room.controller;
    const controllerLevel = controller?.level || 0;
    if (true) {
      const roles: [Role, number][] = [[roleGeneric, 10]];

      // Spawn is busy
      if (spawn.spawning || getCreepsRemainingToSpawn(roles) === 0) {
        Memory.genericTarget = controller?.id;
      } else {
        Memory.genericTarget = spawn.id;
        for (const [role, maxCount] of roles) {
          const creeps = _.filter(Game.creeps, (creep) => creep.memory.role === role.str);
          if (creeps.length < maxCount) {
            const newName = `${role.str}${Game.time}`;
            const body = [WORK, CARRY, MOVE]; // 200 energy

            const memory = role.create();

            // Check if we have enough energy
            if (spawn.room.energyAvailable >= 200) {
              spawn.spawnCreep(body, newName, { memory: memory });
              console.log(`Spawning new ${memory.role}: ${newName}`);
            }
            return;
          }
        }
      }
    }
  }
};
