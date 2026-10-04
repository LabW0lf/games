import { config } from '@engine/config.ts';
import type { Renderer } from '@engine/core/renderer.ts';
import type { GameScene } from '@games/the-final-stand/game.ts';
import { FallingEntity } from '@games/the-final-stand/FallingEntity.ts';
import type { Entity } from '@engine/entity/entity.ts';

export class FallingWords extends FallingEntity {
	speed: number = 11;
	text: string = 'text';
	supercharged = false;
	color = config.theme.colors.white;

	static easy_words: string[] = [
		'code',
		'data',
		'byte',
		'file',
		'user',
		'root',
		'node',
		'host',
		'port',
		'bash',
		'linux',
		'git',
		'api',
		'sql',
		'html',
		'css',
		'java',
		'bug',
		'loop',
		'class',
		'array',
		'debug',
		'cloud',
		'cache',
		'stack',
	];

	static medium_words: string[] = [
		'integer',
		'boolean',
		'variable',
		'function',
		'pointer',
		'compiler',
		'terminal',
		'network',
		'database',
		'backend',
		'frontend',
		'runtime',
		'process',
		'thread',
		'package',
		'browser',
		'firewall',
		'storage',
		'version',
		'commit',
		'request',
		'response',
		'socket',
		'docker',
		'kernel',
		'virtual',
		'decimal',
		'encrypt',
		'session',
	];

	static hard_words: string[] = [
		'vulnerability',
		'authentication',
		'authorization',
		'virtualization',
		'microservices',
		'architecture',
		'cybersecurity',
		'cryptography',
		'infrastructure',
		'implementation',
		'configuration',
		'serialization',
		'asynchronous',
		'concurrency',
		'dependency',
		'repository',
		'optimization',
		'abstraction',
		'polymorphism',
		'encapsulation',
		'programming',
		'deprecation',
		'containerization',
		'observability',
		'troubleshooting',
		'interoperability',
		'accessibility',
	];

	constructor(
		x: number,
		y: number,
		difficulty: number,
		h: number,
		private scene: GameScene,
		supercharged: boolean,
		speed: number,
	) {
		super(x, y, difficulty, h);
		this.w = Math.floor(Math.random() * 3) + 1;
		this.x = Math.floor(Math.random() * 230) + 10; // random position

		// makes sure no falling entity is out of bounds
		if (this.x + this.text.length * 8 > 230) {
			this.x = 230;
		}
		if (this.x - this.text.length * 8 < 10) {
			this.x = 10;
		}

		this.speed = speed;

		if (difficulty === 2) {
			this.speed = speed * 0.4;
		}
		if (difficulty === 3) {
			this.speed = speed * 0.1;
			this.x = 120;
		}

		this.supercharged = supercharged;
		if (supercharged) {
			this.speed = this.speed * 1.5;
			this.color = config.theme.colors.yellow;
		}

		this.y = -10; // starts off over the top

		// easy array
		if (difficulty === 1) {
			this.text =
				FallingWords.easy_words[Math.floor(Math.random() * FallingWords.easy_words.length)]; // choose random easy word
		} else if (difficulty === 2) {
			this.text =
				FallingWords.medium_words[
					Math.floor(Math.random() * FallingWords.medium_words.length)
				]; // choose random medium word
		} else if (difficulty === 3) {
			this.text =
				FallingWords.hard_words[Math.floor(Math.random() * FallingWords.hard_words.length)]; // choose random hard word
		} else {
			console.log(
				'failed to create a falling word: difficulty ' + difficulty + 'does not exist!',
			);
			return;
		}
		console.log(
			'=====================\nFALLING WORD CREATED: \n' +
				this.text +
				'\nSPEED: ' +
				this.speed +
				'\nSUPERCHARGED: ' +
				this.supercharged +
				'\n=====================',
		);
	}

	render(r: Renderer) {
		if (this.x === 10) {
			r.advancedText(this.text, this.x, this.y, this.color, {
				textAlign: 'left',
				textBaseline: 'middle',
			});
		} else if (this.x === 230) {
			r.advancedText(this.text, this.x, this.y, this.color, {
				textAlign: 'right',
				textBaseline: 'middle',
			});
		} else {
			r.advancedText(this.text, this.x, this.y, this.color, {
				textAlign: 'center',
				textBaseline: 'middle',
			});
		}
	}
	update(dt: number) {
		this.y += this.speed * dt;
		if (this.scene.border.collidesWith(this)) {
			this.scene.fallingEntityLost(this.text);
		}
	}

	collidesWith(other: Entity): boolean {
		return super.collidesWith(other);
	}

	getText() {
		return this.text;
	}

	isSupercharged(): boolean {
		return this.supercharged;
	}
}
