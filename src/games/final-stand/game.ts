import { type Renderer } from '@engine/core/renderer.ts';
import { config } from '@engine/config.ts';
import { Entity } from '@engine/entity/entity.ts';
import { Scene } from '@engine/scenes/scene.ts';
import type { Input } from '@engine/core/input.ts';
import { Game } from '@engine/core/game.ts';
import { MenuScene } from '@engine/scenes/menuScene.ts';
import type { AssetLoader } from '@engine/assets/assetloader.ts';


// DEBUG COMMANDS (CHEATS)
export class CHEATS {
	static GOTHMODE: boolean = false; 		// typing 'gothmode' grants player godmode
	static SUPERSONIC: boolean = false;    	// typing 'supersonic' speeds up the game
}


// ENTITIES
export class Border extends Entity {
	private color = config.theme.colors.yellow;

	constructor(x: number, y: number, w: number, h: number) {
		super(x,y,w,h);
		console.log('Border Entity Created');
	}

	update(delta: number) {
	}

	render(r: Renderer) {
		r.drawRect(this.x, this.y, this.w, this.h, this.color);
	}

	changeColor(color: string) {
		if (color in config.theme.colors) {
			this.color = color;
		} else {
			console.log('failed to change color of Border to ' + color + ': not in config.theme.colors!');
		}
	}

	increaseBorderHeight(n: number) {
		this.y += 1;
	}
}




class Score extends Entity {
	private score: number = 0;
	private color = config.theme.colors.white;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('Score Entity Created');
	}

	render(r: Renderer) {
		r.advancedText(String(this.score), this.x, this.y, this.color, { textAlign: 'left', textBaseline: 'middle' });
	}

	increaseScore(score: number) {
		this.score += score;
	}
}




class Difficulty extends Entity {
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('Difficulty Entity Created');
	}
}




class Level extends Entity {
	private lvl: number = 0;
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

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('Level Entity Created');
	}

	update(dt: number) {
		if (this.lvl >= this.toBeReached[this.stage]) {
			this.stage += 1;
			this.difficulty = this.difficulties[this.stage];
		}

	}

	render(r: Renderer) {
		r.advancedText(String(this.lvl), this.x, this.y, config.theme.colors.purple, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
		r.advancedText(String(this.difficulty), this.w, this.h, config.theme.colors.dark_purple, {
			textAlign: 'right',
			textBaseline: 'middle',
		});
	}
}




class Life extends Entity {
	private hp: number = 2;
	private color = config.theme.colors.red;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('Life Entity Created');
	}

	update(r: number) {
		if (this.hp < 1) {
			GameScene.game_over();
		}
	}

	render(r: Renderer) {
		r.advancedText('HP ' + String(this.hp), this.x, this.y, this.color, {textAlign: 'left', textBaseline: 'middle'} );
	}

	increaseHp(hp: number) {
		this.hp += hp;
	}
}




export class PlayerInput extends Entity {
	text = '';
	color: string = config.theme.colors.black;
	reachedMax = false;

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('PlayerInput Entity Created');


	}

	render(r: Renderer) {
		r.advancedText(this.text, this.x, this.y, this.color, {
			textAlign: 'center',
			textBaseline: 'middle'
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
		for (let i = 0; i < Arena.arena.length; ++i) {
			if (this.text === Arena.arena[i].getText()) {
				Arena.arena.splice(i, 1);
				GameScene.border.changeColor('green');
				setTimeout(() => {
					GameScene.border.changeColor('yellow');
				}, 50);
			}
		}
		GameScene.border.changeColor('red');

		setTimeout(() => {
			GameScene.border.changeColor('yellow');
		}, 100);

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



//////////////////////////////////////////////////////// FALLING ENTITIES //////////////////////////////////////////////
class Arena {
	static arena: (FallingWords | FallingMath | FallingFlags)[] = []; // Array with all the currently falling entities

	addFallingEntity() {

	}
}

class FallingWords extends Entity {
	private text: string = 'text';

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('FallingWords Entity Created');
	}

	getText() {
		return this.text;
	}
}

class FallingMath extends Entity {
	private text: string = 'text';

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('FallingMath Entity Created');
	}

	getText() {
		return this.text;
	}
}

class FallingFlags extends Entity {
	private text: string = 'text';

	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('FallingFlags Entity Created');
	}

	getText() {
		return this.text;
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




class GameOver extends Entity {
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('GameOver Entity Created');
	}
}

export class Explanation extends Entity {
	constructor(x: number, y: number, w: number, h: number) {
		super(x, y, w, h);
		console.log('Explanation Entity Created');
	}
}




// GAME SCENE
type GameState = 'start' | 'running' | 'end';


// GAMESCENE
export class GameScene extends Scene {
	entities: Entity[] = [];
	gamestate: GameState = 'running';
	static inputIsBusy = false; // can completely shut off input in the game

	// UI Entities
	static border = new Border(0, 143, 240, 10);
	static score = new Score(10, 170, 0, 0);
	static life = new Life(100, 170, 0, 0);
	static level = new Level(230, 170, 230, 160);
	static difficulty = new Difficulty(230, 160, 0, 0);
	static playerInput = new PlayerInput(120, 149, 0, 0);

	constructor() {
		super();
		this.entities.push(GameScene.border);
		this.entities.push(GameScene.score);
		this.entities.push(GameScene.level);
		this.entities.push(GameScene.life);
		this.entities.push(GameScene.difficulty);
		this.entities.push(GameScene.playerInput);
	}

	update(delta: number, input: Input) {
		if (this.gamestate === 'running') {
			for (const e of this.entities) {
				e.update(delta);
			}
		}

		if (!GameScene.inputIsBusy) {
			this.handleInput(input);
		}
	}

	handleInput(input: Input) {
		input.onKeyDown((key) => {
			if (/^[a-zA-Z0-9]$/.test(key) && !GameScene.playerInput.reachedMax) {
				GameScene.playerInput.addText(key.toLowerCase());
			}
			else if (key === 'Backspace') {
				const text = GameScene.playerInput.getText();
				GameScene.playerInput.setText('');
				GameScene.playerInput.addText(text.slice(0, -1));
			}
			else if (key === 'Enter') {
				GameScene.playerInput.confirm();
				GameScene.playerInput.setText('');
			}
		});
		GameScene.inputIsBusy = true;
	}

	render(r: Renderer) {
		super.render(r);

		for (const e of this.entities) {
			e.render(r);
		}
	}

	static game_over() {}
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
	}
}
