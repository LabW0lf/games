import { type Renderer } from '@engine/core/renderer.ts';
import { config } from '@engine/config.ts';
import { Entity } from '@engine/entity/entity.ts';
import { Scene } from '@engine/scenes/scene.ts';
import { Input } from '@engine/core/input.ts';
import { Game } from '@engine/core/game.ts';
import { MenuScene } from '@engine/scenes/menuScene.ts';
import type { AssetLoader } from '@engine/assets/assetloader.ts';
import { FallingWords } from '@games/the-final-stand/FallingWords.ts';
import { FallingMath } from '@games/the-final-stand/FallingMath.ts';
import { FallingFlags } from '@games/the-final-stand/FallingFlags.ts';
import { Border } from '@games/the-final-stand/Border.ts';
import { Score } from '@games/the-final-stand/Score.ts';
import { Life } from '@games/the-final-stand/Life.ts';
import { Level } from '@games/the-final-stand/Level.ts';
import { GameOver } from '@games/the-final-stand/GameOver.ts';
import { FallingEntity } from '@games/the-final-stand/FallingEntity.ts';

// DEBUG COMMANDS (CHEATS)
export class CHEATS {
	static GOTHMODE: boolean = false; // typing 'gothmode' grants player godmode
}

export class PlayerInput extends Entity {
	text = '';
	color: string = config.theme.colors.black;
	reachedMax = false;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
		private scene: GameScene,
	) {
		super(x, y, w, h);
		console.log('PlayerInput Entity Created');
	}

	render(r: Renderer) {
		r.advancedText(this.text, this.x, this.y, this.color, {
			textAlign: 'center',
			textBaseline: 'middle',
		});
	}

	update(dt: number) {
		if (this.text.length >= 25) {
			this.color = config.theme.colors.red;
			this.reachedMax = true;
		} else {
			this.color = config.theme.colors.black;
			this.reachedMax = false;
		}
	}

	confirm() {
		if (this.scene.gamestate === 'running') {
			if (this.text === 'gothmode') {
				CHEATS.GOTHMODE = !CHEATS.GOTHMODE;
				console.log('DEBUG: GOTHMODE');
				return;
			}

			let hit = false;
			for (let i = 0; i < this.scene.entities.length; ++i) {
				const e: Entity = this.scene.entities[i];
				if (e instanceof FallingEntity) {
					// HIT
					if (this.text === e.getText()) {
						this.scene.entities.splice(i, 1);
						if (e.isSupercharged()) {
							this.scene.score.increaseScore(this.scene.score.getscoreToReach());
						}
						this.scene.score.increaseScore(this.scene.score.getscoreToReach() / 2);
						this.scene.score.increaseTypedWords(1);
						this.scene.border.changeColor('green');
						console.log('HIT: ' + this.text);
						hit = true;
						break;
					}
				}
			}
			if (!hit) {
				this.scene.border.changeColor('gray');
				console.log('MISSED: ' + this.text);
				this.scene.score.increaseScore(-50);
			}

			setTimeout(() => {
				this.scene.border.changeColor('yellow');
			}, 100);
		}
	}

	setText(user_input: string) {
		this.text = user_input;
	}

	addText(user_input: string) {
		this.text += user_input;
	}

	getText(): string {
		return this.text;
	}
}

// TODO: implement pause and explain mechanic
export class Explanation extends Entity {
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('Explanation Entity Created');
	}
}

type GameState = 'start' | 'running' | 'gameover' | 'pause' | 'end';

// GAMESCENE
export class GameScene extends Scene {
	entities: Entity[] = [];
	gamestate: GameState = 'running';
	inputIsBusy = false; // can completely shut off input in the game
	input = new Input();
	supercharged_odds = 50; // 1 in n chances to get a supercharged
	spawn_delay: number = 3;
	universal_speed = 11;

	// UI Entities
	border = new Border(0, 143, 240, 10, this);
	score = new Score(10, 170, 0, 0, this);
	life = new Life(100, 170, 0, 0, this);
	level = new Level(230, 170, 230, 160, this);
	playerInput = new PlayerInput(120, 149, 0, 0, this);

	constructor() {
		super();
		console.log('========== NEW GAMESCENE ==========');

		this.entities.push(this.border);
		this.entities.push(this.score);
		this.entities.push(this.level);
		this.entities.push(this.life);
		this.entities.push(this.playerInput);
	}

	timer: number = 0;
	update(dt: number) {
		if (this.gamestate === 'pause') {
			return;
		}

		if (this.gamestate === 'gameover') {
			for (const e of this.entities) {
				e.update(dt);
			}
		}
		if (this.gamestate === 'running') {
			for (const e of this.entities) {
				e.update(dt);
			}

			this.timer += dt;
			if (this.timer >= this.spawn_delay) {
				this.addFallingEntity();
				this.timer = 0;
			}

			if (!this.inputIsBusy) {
				this.handleInput();
				this.inputIsBusy = true;
			}
		}
	}

	// Adds a random falling entity depending on the current difficultly set
	addFallingEntity() {
		const r = Math.floor(Math.random() * 20) + 1;

		const number = Math.floor(Math.random() * this.supercharged_odds) + 1;
		let charged = false;
		if (number === 1) {
			charged = true;
		}

		if (this.level.getStage() <= 1) {
			this.entities.push(new FallingWords(0, 0, 1, 0, this, charged, this.universal_speed));
		}

		if (this.level.getStage() === 2) {
			if (r <= 10) {
				this.entities.push(
					new FallingWords(0, 0, 1, 0, this, charged, this.universal_speed),
				);
			} else {
				this.entities.push(
					new FallingWords(0, 0, 2, 0, this, charged, this.universal_speed),
				);
			}
		}
		if (this.level.getStage() === 3) {
			if (r <= 5) {
				this.entities.push(
					new FallingWords(0, 0, 1, 0, this, charged, this.universal_speed),
				);
			} else {
				this.entities.push(
					new FallingWords(0, 0, 2, 0, this, charged, this.universal_speed),
				);
			}
		}

		if (this.level.getStage() === 4) {
			if (r <= 5) {
				this.entities.push(
					new FallingWords(0, 0, 1, 0, this, charged, this.universal_speed),
				);
			} else if (r >= 15) {
				this.entities.push(
					new FallingWords(0, 0, 3, 0, this, charged, this.universal_speed),
				);
			} else {
				this.entities.push(
					new FallingWords(0, 0, 2, 0, this, charged, this.universal_speed),
				);
			}
		}
		if (this.level.getStage() === 5) {
			if (r <= 5) {
				this.entities.push(
					new FallingWords(0, 0, 1, 0, this, charged, this.universal_speed),
				);
			} else if (r >= 15) {
				this.entities.push(
					new FallingWords(0, 0, 2, 0, this, charged, this.universal_speed),
				);
			} else {
				this.entities.push(
					new FallingWords(0, 0, 3, 0, this, charged, this.universal_speed),
				);
			}
		}
		if (this.level.getStage() === 6) {
			if (r <= 5) {
				this.entities.push(
					new FallingWords(0, 0, 1, 0, this, charged, this.universal_speed),
				);
			} else if (r >= 15) {
				this.entities.push(
					new FallingWords(0, 0, 2, 0, this, charged, this.universal_speed),
				);
			} else {
				this.entities.push(
					new FallingWords(0, 0, 3, 0, this, charged, this.universal_speed),
				);
			}
		}
	}

	fallingEntityLost(text: string) {
		for (let i = 0; i < this.entities.length; ++i) {
			const e: Entity = this.entities[i];
			if (
				e instanceof FallingWords ||
				e instanceof FallingMath ||
				e instanceof FallingFlags
			) {
				// remove falling entity
				if (text === e.getText()) {
					this.entities.splice(i, 1);
					this.border.changeColor('red');
					break;
				}
			}
		}
		setTimeout(() => {
			this.border.changeColor('yellow');
		}, 100);
		if (!CHEATS.GOTHMODE) {
			this.life.increaseHp(-1);
		} else {
			this.score.increaseScore(this.score.getscoreToReach());
		}
	}

	handleInput() {
		this.input.onKeyDown((key) => {
			if (this.gamestate === 'gameover') {
				if (key === 'Enter') {
					this.entities.length = 0;

					this.border = new Border(0, 143, 240, 10, this);
					this.score = new Score(10, 170, 0, 0, this);
					this.life = new Life(100, 170, 0, 0, this);
					this.level = new Level(230, 170, 230, 160, this);
					this.playerInput = new PlayerInput(120, 149, 0, 0, this);

					this.entities.push(this.border);
					this.entities.push(this.score);
					this.entities.push(this.level);
					this.entities.push(this.life);
					this.entities.push(this.playerInput);

					CHEATS.GOTHMODE = false;

					this.spawn_delay = 3;
					this.universal_speed = 11;
					this.supercharged_odds = 50;

					console.log('======== GAME RESETED! =========');
					this.gamestate = 'running';
				}
			}

			if (this.gamestate === 'running') {
				if (/^[a-zA-Z0-9]$/.test(key) && !this.playerInput.reachedMax) {
					this.playerInput.addText(key.toLowerCase());
				} else if (key === 'Backspace') {
					const text = this.playerInput.getText();
					this.playerInput.setText('');
					this.playerInput.addText(text.slice(0, -1));
				} else if (key === 'Enter') {
					this.playerInput.confirm();
					this.playerInput.setText('');
				}
			}
		});
	}

	render(r: Renderer) {
		super.render(r);

		for (const e of this.entities) {
			e.render(r);
		}
	}

	game_over() {
		// actually show gameover screen after 2 seconds
		setTimeout(() => {
			this.gamestate = 'gameover';
			console.log('GAME OVER!');

			this.entities.length = 0;

			console.log(
				'REMOVED ALL ENTITIES: ' + this.entities.length + ' CURRENTLY ACTIVE ENTITIES!',
			);

			this.entities.push(new GameOver(0, 0, 0, 0, this));

			console.log('SHOWING GAME OVER SCREEN!');
		}, 2000);

		if (!this.inputIsBusy) {
			this.handleInput();
			this.inputIsBusy = true;
		}
	}
}

// GAME
export class FinalStand extends Game {
	gameIsRunning = true;

	constructor() {
		super();

		this.scene = new MenuScene(() => {
			if (this.gameIsRunning) {
				this.scene = new GameScene();
				this.gameIsRunning = false;
			}
		});
	}

	loadAssets(loader: AssetLoader) {
		super.loadAssets(loader);
	}
}
