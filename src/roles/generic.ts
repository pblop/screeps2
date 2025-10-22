const initialBody = [WORK, CARRY, MOVE];
const initialCost =
	BODYPART_COST[WORK] + BODYPART_COST[CARRY] + BODYPART_COST[MOVE];
const nextBodyParts = [CARRY, MOVE, WORK, WORK, CARRY, MOVE, WORK];

export const roleGeneric: Role = {
	str: "generic",
	create: (): CreepMemory => {
		return {
			role: roleGeneric.str,
			working: true,
		};
	},
	getBodySize: (energy: number): BodyPartConstant[] => {
		const body = [...initialBody];
		let cost = initialCost;

		// cost < energy breaks early if we have exactly enough energy
		// for the current body.
		for (let i = 0; i < nextBodyParts.length && cost < energy; i++) {
			const bodyPart = nextBodyParts[i];
			const partCost = BODYPART_COST[bodyPart];

			if (cost + partCost > energy || body.length === 50) {
				break;
			}

			body.push(bodyPart);
			cost += partCost;
		}

		return body;
	},
	run: (creep: Creep) => {
		if (creep.memory.working && creep.store.getFreeCapacity() === 0) {
			creep.memory.working = false;
			creep.say("🏠 deliver");
		}

		if (!creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
			creep.memory.working = true;
			creep.say("⛏️ harvest");
		}

		if (creep.memory.working) {
			const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
				creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
			}
		} else if (Memory.genericTarget) {
			// Find targets
			const target = Game.getObjectById<Structure | ConstructionSite>(Memory.genericTarget);
			if (!target) {
				console.error(
					`Generic role: target with id ${Memory.genericTarget} not found`,
				);
				return;
			}

      if (Memory.genericTargetType === "construction") {
        if (creep.build(target as ConstructionSite) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
        }
      } else if (target?.structureType === STRUCTURE_CONTROLLER) {
				if (
					creep.upgradeController(target as StructureController) ===
					ERR_NOT_IN_RANGE
				) {
					creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
				}
			} else if (
				target?.structureType === STRUCTURE_SPAWN ||
				target?.structureType === STRUCTURE_EXTENSION ||
				target?.structureType === STRUCTURE_TOWER
			) {
				if (creep.transfer(target as StructureTower, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
					creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
				}
			}
		}
	},
};
