import { Entity } from '@engine/entity/entity.ts';

// TODO: implement
export class FallingMath extends Entity {
	private text: string = 'text';

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('FallingMath Entity Created');
	}

	getText() {
		return this.text;
	}
}
