import { managerSpawn } from "managers/spawn";
import { roleHarvester } from "roles/harvester";
import { ErrorMapper } from "utils/ErrorMapper";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // console.log(`Current game tick is ${Game.time}`);

  // SPAWNING LOGIC
  // We can safely assume 'Spawn1' exists for this simple bot
  const mySpawn = Game.spawns.Spawn1;
  if (mySpawn) {
    managerSpawn.run(mySpawn);
  }

  // CREEP LOGIC
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    // Your IDE will now autocomplete 'creep.memory.role'
    // and warn you if you make a typo!
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
      // roleUpgrader.run(creep); // (once you create this file)
    }
    if (creep.memory.role === 'builder') {
      // roleBuilder.run(creep); // (once you create this file)
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
