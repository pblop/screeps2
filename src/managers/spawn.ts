import { roleHarvester } from "roles/harvester";
import { roleBuilder } from "roles/builder";
// import { roleUpgrader } from "roles/upgrader";

const roles: [Role, number][] = [[roleHarvester, 4]];

export const managerSpawn = {
  run: (spawn: StructureSpawn) => {
    // Spawn is busy
    if (spawn.spawning) {
      return;
    }

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
};
