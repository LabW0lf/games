import { Entity } from '@engine/entity/entity.ts';
import { config } from '@engine/config.ts';
import type { GameScene } from '@games/the-final-stand/game.ts';
import type { Renderer } from '@engine/core/renderer.ts';

export class GameOver extends Entity {
	private color = config.theme.colors.gray;
	private comment_text: string = '';
	private comment_color = config.theme.colors.blue;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		private scene: GameScene,
	) {
		super(x, y, w, h);
		console.log('GameOver Entity Created');
		this.comment_text = this.comment();
	}

	render(r: Renderer) {
		r.drawRect(0, 0, 240, 180, config.theme.colors.black);

		r.advancedText('[GAME OVER]', 120, 10, config.theme.colors.white, {
			textAlign: 'center',
			textBaseline: 'middle',
		});

		r.advancedText('RESULTS:', 10, 30, config.theme.colors.white, {
			textAlign: 'left',
			textBaseline: 'middle',
		});

		r.advancedText(
			'score: ' + String(this.scene.score.getScore()),
			10,
			50,
			config.theme.colors.yellow,
			{
				textAlign: 'left',
				textBaseline: 'middle',
			},
		);

		r.advancedText(
			'level: ' + String(this.scene.level.getLvl()),
			10,
			70,
			config.theme.colors.purple,
			{
				textAlign: 'left',
				textBaseline: 'middle',
			},
		);

		r.advancedText(
			'difficulty: ' + String(this.scene.level.difficulties[this.scene.level.getStage()]),
			10,
			90,
			config.theme.colors.dark_purple,
			{
				textAlign: 'left',
				textBaseline: 'middle',
			},
		);

		r.advancedText(
			'words typed: ' + String(this.scene.score.getTypedWords()),
			10,
			110,
			config.theme.colors.dark_green,
			{
				textAlign: 'left',
				textBaseline: 'middle',
			},
		);

		r.advancedText('"' + this.comment_text + '"', 120, 140, this.comment_color, {
			textAlign: 'center',
			textBaseline: 'middle',
		});

		r.advancedText('press "ENTER" to retry!', 120, 160, this.color, {
			textAlign: 'center',
			textBaseline: 'middle',
		});
	}

	comment(): string {
		let result: string = '';

		const very_easy_comments: string[] = [
			'aww wittle baby!',
			'let me help you grandma!',
			'baby fingers!',
			'move you cat away!',
			'not your day huh?',
			'put on your glasses!',
			'experimental ape?',
			'more than a noob!',
		];
		const easy_comments: string[] = [
			'try harder!',
			'not even close!',
			'better than an ape!',
			'keep going!',
			'you can do better!',
			'are you a kid?',
			'newby!',
			'give it some more!',
		];
		const medium_comments: string[] = [
			'not bad!',
			'interesting!',
			"now we're talking!",
			'getting close!',
			'fruity :)',
		];
		const hard_comments: string[] = [
			'solid!',
			'proper typing there!',
			'legitimate!',
			'even more interesting!',
		];
		const very_hard_comments: string[] = ['be proud!', 'very interesting!', 'a real one!'];
		const super_duper_hard_comments: string[] = [
			'nailed it!',
			'very fantastic!',
			'unstoppable!',
		];
		const impossible_comments: string[] = [
			'godtier!',
			'ultimate!',
			'super duper amazing',
			'perfect!',
			'master typer!',
			'true programmer!',
			'magic fingers',
		];

		if (this.scene.level.getStage() === 0) {
			result = very_easy_comments[Math.floor(Math.random() * very_easy_comments.length)];
		}
		if (this.scene.level.getStage() === 1) {
			result = easy_comments[Math.floor(Math.random() * easy_comments.length)];
		}
		if (this.scene.level.getStage() === 2) {
			result = medium_comments[Math.floor(Math.random() * medium_comments.length)];
		}
		if (this.scene.level.getStage() === 3) {
			result = hard_comments[Math.floor(Math.random() * hard_comments.length)];
		}
		if (this.scene.level.getStage() === 4) {
			result = very_hard_comments[Math.floor(Math.random() * very_hard_comments.length)];
		}
		if (this.scene.level.getStage() === 5) {
			result =
				super_duper_hard_comments[
					Math.floor(Math.random() * super_duper_hard_comments.length)
				];
		}
		if (this.scene.level.getStage() === 6) {
			result = impossible_comments[Math.floor(Math.random() * impossible_comments.length)];
		}

		return result;
	}

	timer1 = 0;
	timer2 = 0;
	isGray = true;
	isBlue = false;
	update(dt: number) {
		this.timer1 += dt;
		if (this.timer1 >= 0.7) {
			if (this.isGray) {
				this.color = config.theme.colors.black;
				this.isGray = !this.isGray;
			} else {
				this.color = config.theme.colors.gray;
				this.isGray = !this.isGray;
			}
			this.timer1 = 0;
			console.log('blink');
		}
		this.timer2 += dt;
		if (this.timer2 >= 0.3) {
			if (this.isBlue) {
				this.comment_color = config.theme.colors.yellow;
			} else {
				this.comment_color = config.theme.colors.blue;
			}
			this.isBlue = !this.isBlue;
			this.timer2 = 0;
		}
	}
}
