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
	public height: number = 5;
	constructor(
		x: number,
		y: number,
		w: number,
		h: number) {
		super(x, y, w, h);
	}
	update(dt: number) {
		this.y -= dt;
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

		this.score += 0;
	}

	render(r: Renderer) {
		r.advancedText(String(this.score), this.x, this.y, config.theme.colors.white, {
			textAlign: 'center',
			textBaseline: 'middle',
		});
	}
}

class Level extends Entity {
	lvl: number = 0;

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
		r.advancedText('LVL ' + String(this.lvl), this.x, this.y, config.theme.colors.purple, {
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
