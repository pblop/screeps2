import { managerSpawn } from "managers/spawn";
import { roleHarvester } from "roles/harvester";
import { roleUpgrader } from "roles/upgrader";
import { ErrorMapper } from "utils/ErrorMapper";

const roles: { [name: string]: Role } = {
  harvester: roleHarvester,
  upgrader: roleUpgrader,
}
export const loop = ErrorMapper.wrapLoop(() => {
  // SPAWNING LOGIC
  const mySpawn = Game.spawns.Spawn1;
  if (mySpawn) {
    managerSpawn.run(mySpawn);
  }

  // CREEP LOGIC
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    roles[creep.memory.role]?.run(creep);
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  // Generate pixel if bucket is full
  if (Game.cpu.generatePixel && Game.cpu.bucket >= 10000) {
    console.log('generating a pixel');
    Game.cpu.generatePixel();
  }
});
