import { Entity } from '@engine/entity/entity.ts';
import { config } from '@engine/config.ts';
import type { Renderer } from '@engine/core/renderer.ts';
import type { GameScene } from '@games/the-final-stand/game.ts';

export class Score extends Entity {
	private score: number = this.w;
	private last_score: number = this.w;
	private color = config.theme.colors.white;
	private typedWords = 0;
	private scoreToReach = 300; // score interval between each level up

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		private scene: GameScene,
	) {
		super(x, y, w, h);
		console.log('Score Entity Created');
	}

	render(r: Renderer) {
		r.advancedText(String(this.score), this.x, this.y, this.color, {
			textAlign: 'left',
			textBaseline: 'middle',
		});
	}

	increaseScore(n: number) {
		if (this.score + n <= 0) {
			this.score = 0;
		} else {
			this.score += n;
		}
		// next level
		if (this.score >= this.last_score + this.scoreToReach) {
			this.scene.level.increaseLvl(1);
			this.scene.spawn_delay = this.scene.spawn_delay * 0.989;
			console.log(
				'DECREASED SPAWN DELAY: 1 Entity/' +
					this.scene.spawn_delay.toPrecision(4) +
					' sec!',
			);
			this.last_score = this.score;
		}
		this.scene.life.increaseStreak();
	}
	increaseTypedWords(n: number) {
		this.typedWords += n;
	}

	getScore() {
		return this.score;
	}

	getTypedWords() {
		return this.typedWords;
	}

	getscoreToReach() {
		return this.scoreToReach;
	}

	setScoreToReach(n: number) {
		this.scoreToReach = n;
	}
}
