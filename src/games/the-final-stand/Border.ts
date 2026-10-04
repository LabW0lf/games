import { type Renderer } from '@engine/core/renderer.ts';
import { config } from '@engine/config.ts';
import { Entity } from '@engine/entity/entity.ts';
import type { GameScene } from '@games/the-final-stand/game.ts';

export class Border extends Entity {
	private color = config.theme.colors.yellow;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		private scene: GameScene,
	) {
		super(x, y, w, h);
		console.log('Border Entity Created');
	}

	update(delta: number) {}

	render(r: Renderer) {
		r.drawRect(this.x, this.y, this.w, this.h, this.color);
	}

	changeColor(color: string) {
		if (color in config.theme.colors) {
			this.color = color;
		} else {
			console.log(
				'failed to change color of Border to ' + color + ': not in config.theme.colors!',
			);
		}
	}

	increaseBorderHeight(n: number) {
		this.y += n;
		this.scene.playerInput.y += n;
	}
}
