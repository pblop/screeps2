import { managerSpawn } from "managers/spawn";
import { roleGeneric } from "roles/generic";
import { ErrorMapper } from "utils/ErrorMapper";

const roles: { [name: string]: Role } = {
  generic: roleGeneric,
}
export const loop = ErrorMapper.wrapLoop(() => {
  Memory.constructionSites ??= [];
  Memory.constructionSitesNumber ??= 0;

  // SPAWNING LOGIC
  const mySpawn = Game.spawns.Spawn1;

  // display global SCRIPT_VERSION above the spawn
  if (global.SCRIPT_VERSION) {
    mySpawn.room.visual.text(String(global.SCRIPT_VERSION), mySpawn.pos.x, mySpawn.pos.y - 1, {
      align: 'center',
      opacity: 0.8,
      color: '#ffffff'
    });
  }

  if (Memory.genericTarget) {
    const target = Game.getObjectById<Structure>(Memory.genericTarget);
    if (target) {
      mySpawn.room.visual.circle(target.pos.x, target.pos.y, { radius: 0.5, fill: 'transparent', stroke: '#00ff00', strokeWidth: 0.1, opacity: 0.8 });
    }
  }

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
