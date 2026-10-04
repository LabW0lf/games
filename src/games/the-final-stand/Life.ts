import { Entity } from '@engine/entity/entity.ts';
import { config } from '@engine/config.ts';
import type { Renderer } from '@engine/core/renderer.ts';
import type { GameScene } from '@games/the-final-stand/game.ts';

export class Life extends Entity {
	private hp: number = 2;
	private color = config.theme.colors.red;
	private streak = 0;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		private scene: GameScene,
	) {
		super(x, y, w, h);
		console.log('Life Entity Created');
		this.color = config.theme.colors.red;
	}

	update(r: number) {
		if (this.hp < 1) {
			this.scene.gamestate = 'pause';

			let counter = 0;
			let isRed = true;
			const interval = setInterval(() => {
				if (isRed) {
					this.color = config.theme.colors.white;
				} else {
					this.color = config.theme.colors.red;
				}
				isRed = !isRed;

				console.log('blink');
				counter += 1;
				if (counter > 21) {
					this.color = config.theme.colors.black;
					this.scene.game_over();
					clearInterval(interval);
				}
			}, 50);
		}
	}

	increaseStreak() {
		this.streak += 1;
		if (this.streak >= 10) {
			this.hp += 1;
			this.streak = 0;
		}
	}

	render(r: Renderer) {
		r.advancedText('HP ' + String(this.hp), this.x, this.y, this.color, {
			textAlign: 'left',
			textBaseline: 'middle',
		});
	}

	increaseHp(hp: number) {
		this.hp += hp;
	}

	setHp(n: number) {
		this.hp = n;
	}
}
