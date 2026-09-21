import { type Renderer } from '@engine/core/renderer.ts';
import { config } from '@engine/config.ts';
import { Entity } from '@engine/entity/entity.ts';
import { Scene } from '@engine/scenes/scene.ts';
import { Input } from '@engine/core/input.ts';
import { Game } from '@engine/core/game.ts';
import { MenuScene } from '@engine/scenes/menuScene.ts';
import type { AssetLoader } from '@engine/assets/assetloader.ts';

// ENTITIES
class Border extends Entity {
	// you loose life here
	public static height: number = 148;
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	render(r: Renderer) {
		r.drawRect(this.x, this.y, this.w, this.h, config.theme.colors.yellow);
	}
}

class Score extends Entity {
	score: number = 0;
	score_digits: number = String(this.score).length;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	update(dt: number) {
		// move score number to the right after every new digit is reached
		if (String(this.score).length > this.score_digits) {
			for (let i = 0; i < String(this.score).length - this.score_digits; i++) {
				this.x += 4;
			}
			this.score_digits = String(this.score).length;
		}
	}

	render(r: Renderer) {
		r.advancedText(String(this.score), this.x, this.y, config.theme.colors.white, {
			textAlign: 'center',
			textBaseline: 'middle',
		});
	}
}

class Difficulty extends Entity {
	difficulty: string[] = [
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

	update(dt: number) {
		if (Level.lvl === this.atReachedLevel[Difficulty.current]) {
			Difficulty.current += 1;
		}
	}

	render(r: Renderer) {
		r.advancedText(
			this.difficulty[Difficulty.current],
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

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	update(dt: number) {}

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

	update(dt: number) {
		if (Life.streak >= 10) {
			Life.lives += 1;
			Life.streak = 0;
		}

		if (Life.lives <= 0) {
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
	enableTyping = true;
	static text = '';
	input: Input = new Input();
	color = config.theme.colors.black;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		this.input.onKeyDown((key) => {
			if (this.enableTyping) {
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

	update(dt: number) {
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
	static universal_speed = 5;
	speed: number = FallingWords.universal_speed;
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
		console.log('input: ' + input);
		for (let i = 0; i < FallingWords.arena.length; i++) {
			if (input === FallingWords.arena[i]) {
				console.log('HIT: ' + FallingWords.arena[i]);
				console.log('CURRENT ARENA: ' + FallingWords.arena);

				for (let j = 0; j < GameScene.entities.length; j++) {
					const entity = GameScene.entities[j];
					if (entity instanceof FallingWords && entity.text === input) {
						GameScene.entities.splice(j, 1);
						break;
					}
				}

				FallingWords.arena.splice(i, 1);
				Life.streak += 1;
				break;
			}
		}
	}
	update(dt: number) {
		this.y += this.speed * dt;

		if (this.supercharged) {
			this.color = config.theme.colors.yellow;
			this.speed = FallingWords.universal_speed * 5;
		}

		if (this.y >= Border.height) {
			console.log(this.text + 'HAS CROSSED THE BORDER!');

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

			Life.lives -= 1;
			Life.streak = 0;
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

	static supercharge_odds = 2;
	addRandomFallingWord() {
		const min = 15;
		const max = 225;
		const random_text = Math.floor(Math.random() * 20);
		let random_x = Math.floor(Math.random() * (max - min + 1)) + min;
		const supercharge_number = Math.floor(Math.random() * GameScene.supercharge_odds);

		let text = 'text';
		let supercharged = false;

		if (Difficulty.current === 0) {
			text = FallingWords.easy_words[random_text];
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

	timer = 0;
	spawn_per_second = 2;
	update(dt: number, input: Input) {
		if (GameScene.gamestate === 'running') {
			for (const entity of GameScene.entities) {
				entity.update(dt);
			}
		}

		this.timer += dt;
		if (this.timer >= this.spawn_per_second) {
			this.addRandomFallingWord();
			this.timer = 0;
		}
	}

	static game_over() {
		this.gamestate = 'end';

		GameScene.entities.push(new GameOver(0, 0, 0, 0));

		FinalStand.disable_reset = false;
	}
}

// GAME
export class FinalStand extends Game {
	static disable_reset = false;
	constructor() {
		super();

		this.scene = new MenuScene(() => {
			this.scene = new GameScene();
		});
	}

	reset() {
		// no resets, only startup
		if (!FinalStand.disable_reset) {
			this.scene = new GameScene();
			FinalStand.disable_reset = true;
		}
	}

	loadAssets(loader: AssetLoader) {
		super.loadAssets(loader);

		// sounds & images
	}
}
