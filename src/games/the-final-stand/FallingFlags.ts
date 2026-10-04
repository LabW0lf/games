import { Entity } from '@engine/entity/entity.ts';

// TODO: implement
export class FallingFlags extends Entity {
	private text: string = 'text';

	constructor(x: number, y: number, w: number, h: number, speed: number) {
		super(x, y, w, h);
		console.log('FallingFlags Entity Created');
	}

	getText() {
		return this.text;
	}
}
