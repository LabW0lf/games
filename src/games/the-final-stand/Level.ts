import { Entity } from '@engine/entity/entity.ts';
import type { Renderer } from '@engine/core/renderer.ts';
import { config } from '@engine/config.ts';
import type { GameScene } from '@games/the-final-stand/game.ts';

export class Level extends Entity {
	private lvl: number = 1;
	private difficulty: string = 'very easy';
	private stage = 0;
	difficulties: string[] = [
		'very easy', // Easy  words
		'easy', // Easy  words
		'intermediate', // Easy, medium words 		+ easy math
		'hard', // easy, Medium words 		+ easy math 		+ flags
		'very hard', // easy, Medium, Hard words + easy math 		+ flags
		'super duper hard', // easy, medium, hard words + easy, medium math + flags(less)
		'impossible', // easy, medium, hard words	+ easy, medium, hard math + flags
	];
	// this level has to be reached to get to the next difficulty
	toBeReached: number[] = [
		5, // easy 10 lvls
		15, // intermediate 40 lvls
		55, // hard 20 lvls
		75, // very hard 15 lvls
		90, // super duper hard 10 lvls
		100, // impossible infinity mode
	];

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		private scene: GameScene,
	) {
		super(x, y, w, h);
		console.log('Level Entity Created');
		this.scene.universal_speed = this.lvl + 10;
	}

	render(r: Renderer) {
		r.advancedText('LVL ' + String(this.lvl), this.x, this.y, config.theme.colors.purple, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
		r.advancedText(String(this.difficulty), this.w, this.h, config.theme.colors.dark_purple, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
	}

	increaseLvl(n: number) {
		this.lvl += n;
		if (this.stage <= 2) {
			this.scene.universal_speed = this.lvl + 1.5;
		} else {
			this.scene.universal_speed = this.lvl + 0.2;
		}
		console.log('NEW UNIVERSAL SPEED: ' + this.scene.universal_speed);
		// next difficulty
		if (this.lvl >= this.toBeReached[this.stage]) {
			this.stage += 1;
			this.difficulty = this.difficulties[this.stage];
			this.scene.border.increaseBorderHeight(-5);
			this.scene.supercharged_odds -= 5;
			if (this.stage >= 3) {
				this.scene.spawn_delay += 0.5;
			}
		}
	}

	getLvl() {
		return this.lvl;
	}

	getStage(): number {
		return this.stage;
	}
}
