import { Entity } from '@engine/entity/entity.ts';

export abstract class FallingEntity extends Entity {
	abstract speed: number;
	abstract text: string;
	abstract supercharged: boolean;
	abstract color: string;

	abstract isSupercharged(): boolean;
	abstract getText(): string;
}
