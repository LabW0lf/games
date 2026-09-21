import { type Renderer } from '@engine/core/renderer.ts';
import { config } from '@engine/config.ts';
import { Entity } from '@engine/entity/entity.ts';
import { Scene } from '@engine/scenes/scene.ts';
import { Input } from '@engine/core/input.ts';
import { Game } from '@engine/core/game.ts';
import { MenuScene } from '@engine/scenes/menuScene.ts';
import type { AssetLoader } from '@engine/assets/assetloader.ts';

// important global variables:

// Border.height;
//

export class CHEATS {
	static GOTHMODE: boolean = false;
	static SONIC: boolean = false;

}

// ENTITIES
class Border extends Entity {
	// you loose life here
	public static height: number = 148;
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	update() {
		Border.height = this.y;
	}

	render(r: Renderer) {
		r.drawRect(this.x, this.y, this.w, this.h, config.theme.colors.yellow);
	}
}

export class Score extends Entity {
	static score: number = 0;
	static last_score: number = Score.score;
	score_digits: number = String(Score.score).length;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	//////////////////////////////////////////////// LEVELING ////////////////////////////////////////
	update() {
		// move score number to the right after every new digit is reached
		if (String(Score.score).length > this.score_digits) {
			for (let i = 0; i < String(Score.score).length - this.score_digits; i++) {
				this.x += 4;
			}
			this.score_digits = String(Score.score).length;
		}

		if (Score.last_score + 60 === Score.score) {
			Level.lvl += 1;
			Score.last_score = Score.score;
		}
	}

	render(r: Renderer) {
		r.advancedText(String(Score.score), this.x, this.y, config.theme.colors.white, {
			textAlign: 'center',
			textBaseline: 'middle',
		});
	}
}

class Difficulty extends Entity {
	static difficulty: string[] = [
		'very easy',
		'easy',
		'medium',
		'hard',
		'very hard',
		'super hard',
		'impossible',
	];
	atReachedLevel: number[] = [
		5, // easy words
		10, // easy words, easy math
		25, // easy & medium words, easy math, country flags
		50, // easy & medium & hard words, easy math, country flags
		75, // easy & medium & hard words, easy & medium math, country flags
		100, // easy & medium & hard words, easy & medium & hard math, country flags
	];

	static current = 0;
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	//////////////////////////////////////////////// LEVELING ////////////////////////////////////////
	update() {
		if (Level.lvl === this.atReachedLevel[Difficulty.current]) {
			Difficulty.current += 1;
			Border.height -= 5;
			console.log('NEXT DIFFICULTY REACHED: ' + Difficulty.difficulty[Difficulty.current]);
			console.log('INCREASED CHANCE FOR SUPERCHARGES: 1 in ' + GameScene.supercharge_odds);
			console.log('HEIGHT INCREASED: ' + Border.height);
		}
	}

	render(r: Renderer) {
		r.advancedText(
			Difficulty.difficulty[Difficulty.current],
			this.x,
			this.y,
			config.theme.colors.dark_purple,
			{
				textAlign: 'right',
				textBaseline: 'middle',
			},
		);
	}
}

export class Level extends Entity {
	static lvl: number = 0;
	previous_lvl: number = 0;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	update() {
		if (Level.lvl > this.previous_lvl && !CHEATS.SONIC) {
			GameScene.spawn_per_second = GameScene.spawn_per_second * 0.986; // 1.04 speed at lvl 75
			this.previous_lvl += 1;
			console.log('NEW SPEED: ONE FALLING WORD EVERY ' + GameScene.spawn_per_second + ' seconds!');
		}
	}

	render(r: Renderer) {
		r.advancedText('LVL ' + String(Level.lvl), this.x, this.y, config.theme.colors.purple, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
	}
}

export class Life extends Entity {
	static lives: number = 2;
	static streak: number = 0; // reach 10 to earn a life
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	update() {
		if (Life.streak >= 10) {
			Life.lives += 1;
			Life.streak = 0;
		}

		if (Life.lives === 0) {
			GameScene.game_over();
		}
	}

	render(r: Renderer) {
		r.advancedText('HP: ' + String(Life.lives), this.x, this.y, config.theme.colors.red, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
	}
}

export class PlayerInput extends Entity {
	static enableTyping = true;
	static text = '';
	input: Input = new Input();
	color = config.theme.colors.black;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		this.input.onKeyDown((key) => {
			if (PlayerInput.enableTyping) {
				if (key.length === 1 && PlayerInput.text.length < 25) {
					PlayerInput.text += key.toLowerCase();
				}
				if (key === 'Backspace') {
					PlayerInput.text = PlayerInput.text.slice(0, -1);
				}
				if (key === 'Enter') {
					FallingWords.isHit(PlayerInput.text);
					PlayerInput.text = '';
				}
			}
		});
	}

	update() {
		if (PlayerInput.text.length >= 25) {
			this.color = config.theme.colors.red;
		} else {
			this.color = config.theme.colors.black;
		}
	}

	render(r: Renderer) {
		r.advancedText(PlayerInput.text, this.x, this.y, this.color, {
			textAlign: 'center',
			textBaseline: 'middle',
		});
	}
}

export class FallingWords extends Entity {
	text: string;
	supercharged: boolean = false;
	static universal_speed = 15; //////////////////// UNIVERSAL SPEED /////////////////////
	static arena: string[] = [];

	// ARRAYS
	static easy_words: string[] = [
		'cat',
		'dog',
		'sun',
		'hat',
		'book',
		'tree',
		'fish',
		'house',
		'car',
		'milk',
		'ball',
		'star',
		'door',
		'rain',
		'bird',
		'hand',
		'shoe',
		'cake',
		'moon',
		'apple',
	];

	static medium_words: string[] = [
		'garden',
		'window',
		'yellow',
		'purple',
		'friend',
		'school',
		'planet',
		'summer',
		'winter',
		'forest',
		'bridge',
		'market',
		'rabbit',
		'coffee',
		'pencil',
		'flower',
		'castle',
		'button',
		'bottle',
		'rocket',
	];

	static hard_words: string[] = [
		'adventure',
		'beautiful',
		'knowledge',
		'important',
		'challenge',
		'excellent',
		'mysterious',
		'experience',
		'necessary',
		'different',
		'algorithm',
		'technology',
		'environment',
		'opportunity',
		'extraordinary',
		'responsibility',
		'communication',
		'imagination',
		'determination',
		'architecture',
	];

	constructor(x: number, y: number, w: number, h: number, text: string, supercharged = false) {
		super(x, y, w, h);
		this.text = text;
		this.supercharged = supercharged;
	}

	static isHit(input: string) {
		console.log('ENTERED: ' + input);

		// cheatcodes
		if (input === 'gothmode') {
			CHEATS.GOTHMODE = !CHEATS.GOTHMODE;
			console.log('TOGGLED GOTHMODE: ' + CHEATS.GOTHMODE);
		}
		if (input === 'sonic') {

			FallingWords.universal_speed = 120;
			GameScene.spawn_per_second = 0.5;

			if (CHEATS.SONIC) {
				FallingWords.universal_speed = 15;
				GameScene.spawn_per_second = Math.pow(3 * 0.986, Level.lvl);
			}
			CHEATS.SONIC = !CHEATS.SONIC;
			console.log('TOGGLED SONIC: ' + CHEATS.SONIC);
		}

		for (let i = 0; i < FallingWords.arena.length; i++) {
			if (input === FallingWords.arena[i]) {
				console.log('HIT: ' + FallingWords.arena[i]);
				for (let j = 0; j < GameScene.entities.length; j++) {
					const entity = GameScene.entities[j];
					if (entity instanceof FallingWords && entity.text === input) {
						GameScene.entities.splice(j, 1);
						break;
					}
				}

				FallingWords.arena.splice(i, 1);
				Life.streak += 1;
				Score.score += 20;
				break;
			}
		}
	}
	update(dt: number) {
		this.y += FallingWords.universal_speed * dt;

		if (this.supercharged) {
			this.color = config.theme.colors.yellow;
			FallingWords.universal_speed = FallingWords.universal_speed * 3;
		}

		if (this.y >= Border.height) {
			for (let i = 0; i < FallingWords.arena.length; i++) {
				if (this.text === FallingWords.arena[i]) {
					for (let j = 0; j < GameScene.entities.length; j++) {
						const entity = GameScene.entities[j];
						if (entity instanceof FallingWords && entity.text === this.text) {
							GameScene.entities.splice(j, 1);
							break;
						}
					}
					FallingWords.arena.splice(i, 1);
					break;
				}
			}
			if (CHEATS.GOTHMODE) {
				Score.score += 20;
				return;
			} else {
				console.log(this.text + ' HAS CROSSED THE BORDER! STREAK RESET AND LOST 1 HP!');
				Life.lives -= 1;
				Life.streak = 0;
			}
		}
	}

	color = config.theme.colors.white;
	render(r: Renderer) {
		r.advancedText(this.text, this.x, this.y, this.color, {
			textAlign: 'center',
		});
	}
}

export class GameOver extends Entity {
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	timer = 0;
	isRed = false;
	color = config.theme.colors.white;
	update(delta: number) {
		this.timer += delta;
		if (this.timer >= 1) {
			console.log(this.isRed);
			if (this.isRed) {
				this.color = config.theme.colors.red;
			} else {
				this.color = config.theme.colors.white;
			}
			this.isRed = !this.isRed;
			this.timer = 0;
		}
	}

	render(r: Renderer) {
		r.drawRect(0, 0, 240, 180, config.theme.colors.dark_gray);
		r.advancedText('GAME OVER', 120, 90, this.color, { textAlign: 'center' });
		r.advancedText('press ENTER to retry!', 120, 100, this.color, { textAlign: 'center' });
	}
}

// GAME SCENE
type GameState = 'start' | 'running' | 'end';

export class GameScene extends Scene {
	public static entities: Entity[] = [];

	static gamestate: GameState = 'running';

	constructor() {
		super();
		// created entities #######################################
		GameScene.entities.push(new Border(0, 143, 240, 10));
		GameScene.entities.push(new Score(10, 170, 0, 0));
		GameScene.entities.push(new Level(230, 170, 0, 0));
		GameScene.entities.push(new Life(config.canvas_width / 2, 170, 0, 0));
		GameScene.entities.push(new Difficulty(230, 160, 0, 0));
		GameScene.entities.push(new PlayerInput(config.canvas_width / 2, 149, 0, 0));
	}

	/////////////////////////////// SUPERCHARGE ODDS //////////////////////////////////////////////
	static supercharge_odds = 30;
	addRandomFallingWord() {
		const min = 15;
		const max = 225;
		const random_text = Math.floor(Math.random() * 20);
		let random_x = Math.floor(Math.random() * (max - min + 1)) + min;
		const supercharge_number = Math.floor(Math.random() * GameScene.supercharge_odds);

		let text = 'text';
		let supercharged = false;

		// very easy & easy
		if (Difficulty.current <= 1) {
			text = FallingWords.easy_words[random_text];
		}

		// medium
		if (Difficulty.current === 2) {
			// 10:20 chance
			if (random_text >= 9) {
				text = FallingWords.easy_words[random_text];
			} else {
				text = FallingWords.medium_words[random_text];
			}
			GameScene.supercharge_odds = 20;
		}

		// hard
		if (Difficulty.current === 3) {
			// 5:20 chance
			if (random_text <= 4) {
				text = FallingWords.easy_words[random_text];
			}
			// 10:20 chance
			if (random_text >= 5 && random_text <= 15) {
				text = FallingWords.medium_words[random_text];
			}
			// 5:20 chance
			if (random_text >= 14) {
				text = FallingWords.hard_words[random_text];
			}
			GameScene.supercharge_odds = 10;
		}

		// very hard
		if (Difficulty.current === 4) {
			// 5:20 chance
			if (random_text <= 4) {
				text = FallingWords.easy_words[random_text];
			}
			// 5:20 chance
			if (random_text >= 5 && random_text <= 9) {
				text = FallingWords.medium_words[random_text];
			}
			// 10:20 chance
			if (random_text >= 10) {
				text = FallingWords.hard_words[random_text];
			}
			GameScene.supercharge_odds = 5;
		}

		// impossible
		if (Difficulty.current === 5) {
			// 1:20 chance
			if (random_text <= 1) {
				text = FallingWords.easy_words[random_text];
			}
			// 4:20 chance
			if (random_text >= 2 && random_text <= 5) {
				text = FallingWords.medium_words[random_text];
			}
			// 15:20 chance
			if (random_text >= 6) {
				text = FallingWords.hard_words[random_text];
			}
			GameScene.supercharge_odds = 2;
		}



		// if text is too far on the right
		if (random_x + (text.length / 2) * 7 > max) {
			random_x = max - (text.length / 2) * 7;
		}

		// if text is too far on the left
		if (random_x - (text.length / 2) * 7 < min) {
			random_x = min + (text.length / 2) * 7;
		}

		if (supercharge_number === 1) {
			supercharged = true;
		}

		FallingWords.arena.push(text);
		GameScene.entities.push(new FallingWords(random_x, -5, 0, 0, text, supercharged));
	}

	render(r: Renderer) {
		for (const entity of GameScene.entities) {
			entity.render(r);
		}
	}

	static timer = 0;
	static spawn_per_second = 3; //////////////////////////////// ADD NEW AFTER THIS MANY SECONDS ////////////////////////////////
	update(dt: number) {
		if (GameScene.gamestate === 'running') {
			for (const entity of GameScene.entities) {
				entity.update(dt);
			}
		}

		GameScene.timer += dt;
		if (GameScene.timer >= GameScene.spawn_per_second) {
			this.addRandomFallingWord();
			GameScene.timer = 0;
		}
	}

	static game_over() {
		PlayerInput.enableTyping = false;
		this.gamestate = 'end';
		GameScene.entities.push(new GameOver(0, 0, 0, 0));
		FinalStand.disable_reset = false;

		const input: Input = new Input();
		input.onKeyDown((key) => {
			if (key === 'Enter') {

				FinalStand.reset2();
			}
		});
	}
}

// GAME
export class FinalStand extends Game {
	static disable_reset = false;
	private static scene: GameScene;
	constructor() {
		super();

		this.scene = new MenuScene(() => {
			this.scene = new GameScene();
		});
	}

	reset() {
		// no resets until game over
		if (!FinalStand.disable_reset) {
			this.scene = new GameScene();
			FinalStand.disable_reset = true;
		}
	}

	static reset2() {
		FinalStand.scene = new GameScene();
	}

	loadAssets(loader: AssetLoader) {
		super.loadAssets(loader);

		// sounds & images
	}
}
