import  { type Renderer } from '@engine/core/renderer.ts';
import { config } from '@engine/config.ts';
import { Entity } from '@engine/entity/entity.ts';
import { Scene } from '@engine/scenes/scene.ts';
import type { Input } from '@engine/core/input.ts';
import { Game } from '@engine/core/game.ts';
import { MenuScene } from '@engine/scenes/menuScene.ts';
import type { AssetLoader } from '@engine/assets/assetloader.ts';
import { ScoreDisplay } from '@engine/entity/scoreDisplay.ts';

// ENTITIES
class Border extends Entity {
	// you loose life here
	public static height: number = 5;
	constructor(
		x: number,
		y: number,
		w: number,
		h: number) {
		super(x, y, w, h);
	}
	update(dt: number) {

	}

	render(r: Renderer) {
		r.drawRect(this.x, this.y, this.w, this.h, config.theme.colors.yellow);
	}
}

class Score extends Entity {
	score: number = 0;
	score_digits: number = String(this.score).length;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
	) {
		super(x, y, w, h);
	}

	update(dt: number) {
		// move score number to the right after every new digit is reached
		if (String(this.score).length > this.score_digits) {
			for (let i = 0; i < (String(this.score).length - this.score_digits); i++) {
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
		5,   // easy words
		10,  // easy words, easy math
		25,  // easy & medium words, easy math, country flags
		50,  // easy & medium & hard words, easy math, country flags
		75,  // easy & medium & hard words, easy & medium math, country flags
		100, // easy & medium & hard words, easy & medium & hard math, country flags
	];

	current = 0;
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	update(dt: number) {
		if (Level.lvl === this.atReachedLevel[this.current]) {
			this.current += 1;
		}
	}

	render(r: Renderer) {
		r.advancedText(this.difficulty[this.current], this.x, this.y, config.theme.colors.dark_purple, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
	}
}

export class Level extends Entity {
	static lvl: number = 0;

	constructor(
		x: number,
		y: number,
		w: number,
		h: number,
	) {
		super(x, y, w, h);
	}

	update(dt: number) {
	}

	render(r: Renderer) {
		r.advancedText('LVL ' + String(Level.lvl), this.x, this.y, config.theme.colors.purple, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
	}
}

class Life extends Entity {
	lives: number = 2;
	streak: number = 10; // reach this number to earn a life
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
	}

	update(dt: number) {

	}

	render(r: Renderer) {
		r.advancedText('HP: ' + String(this.lives), this.x, this.y, config.theme.colors.red, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
	}
}


// GAME SCENE
type GameState = 'start' | 'running' | 'end';

class GameScene extends Scene {
	public entities: Entity[] = [];

	gamestate: GameState = 'running';

	constructor() {
		super();

		// created entities #######################################
		this.entities.push(new Border(0,150, 240, 5));
		this.entities.push(new Score(10,170,0,0));
		this.entities.push(new Level(230, 170, 0, 0));
		this.entities.push(new Life(120, 170, 0, 0));
		this.entities.push(new Difficulty(230, 160, 0, 0));
	}

	render(r: Renderer) {
		for (const entity of this.entities) {
			entity.render(r);
		}
	}

	update(dt: number, input: Input) {
		if (this.gamestate === 'running') {
			for (const entity of this.entities) {
				entity.update(dt);
			}
		}

		this.handleInput(input);
	}

	handleInput(input: Input) {
		// TODO: Handle keyboard/controller input here
		// if (input.isDown(config.keys.confirm)) {
	}
}

// GAME
export class FinalStand extends Game {
	constructor() {
		super();

		this.scene = new MenuScene(() => {
			this.scene = new GameScene();
		});
	}

	reset() {
		this.scene = new GameScene();
	}

	loadAssets(loader: AssetLoader) {
		super.loadAssets(loader);

		// sounds & images
	}
}
