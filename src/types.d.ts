/** biome-ignore-all lint/correctness/noUnusedVariables: Interfaces are extensions, they will not be used directly. */

// This extends the global CreepMemory interface
interface CreepMemory {
  role: string;
  working: boolean;
  // Add other memory properties here
  // e.g., targetSource?: Id<Source>;
  // e.g., targetContainer?: Id<StructureContainer>;
}

interface Memory {
  uuid: number;
  genericTarget: Id<Structure> | undefined;
  // log: any;
}

// interface RoomMemory {
//   // e.g., sourceIds: Id<Source>[];
// }

// This allows TypeScript to understand global.myVar
declare namespace NodeJS {
  interface Global {
    SCRIPT_VERSION: string;
  }
}
