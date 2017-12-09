'use strict';


module.exports = class Argv {


	constructor() {
		this.length = process.argv.length;
	}


	add(...items) {
		process.argv.push(...items);
	}


	clear() {
        for (let l = process.argv.length, i = this.length; i < l; i++) delete process.argv[i]; 
	}
}