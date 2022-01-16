const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player');

function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemey;
    this.player;    
}

// Initialize Game
Game.prototype.initializeGame = function() {
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));
    this.currentEnemey = this.enemies[0];

    inquirer.prompt({
        type: 'text',
        name: 'name',
        message: 'What is your name?'
    }).then(({ name }) => {
        this.player = new Player(name);

        this.startNewBattle();
    });
}

// Start new battle
Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemey.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    console.log('Your stats are as follows:');
    console.table(this.player.getStats());
    console.log(this.currentEnemey.getDescription());

    this.battle();
}

// Battle!
Game.prototype.battle = function() {
    if (this.isPlayerTurn) {
        inquirer.prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'action',
            choices: ['Attack', 'Use Potion']
        }).then(({ action }) => {
            if (action === 'Use Potion') {
                if (!this.player.getInventory()) {
                    console.log("You don't have any potions!");
                    return this.checkEndOfBattle();
                }
                inquirer.prompt({
                    type: 'list',
                    message: 'Which potion would you like to use?',
                    name: 'action',
                    choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                }).then(({ action }) => {
                    const potionDetails = action.split(': ');

                    this.player.usePotion(potionDetails[0] - 1);
                    var article = 'a';
                    if (potionDetails[1] == 'agility') { article = 'an' };
                    console.log(`You used ${article} ${potionDetails[1]} potion.`);

                    this.checkEndOfBattle();
                });
            } else {
                const damage = this.player.getAttackValue();
                this.currentEnemey.reduceHealth(damage);

                console.log(`You attacked the ${this.currentEnemey.name}`);
                console.log(this.currentEnemey.getHealth());

                this.checkEndOfBattle();
            }
        });
    } else {
        const damage = this.currentEnemey.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemey.name}`);
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
}

// Check end of battle
Game.prototype.checkEndOfBattle = function() {
    if (this.player.isAlive() && this.currentEnemey.isAlive()) {
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } else if (this.player.isAlive() && !this.currentEnemey.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemey.name}`);

        this.player.addPotion(this.currentEnemey.potion);
        var article = 'a';
        if (this.currentEnemey.potion.name == 'agility') { article = 'an' };
        console.log(`${this.player.name} found ${article} ${this.currentEnemey.potion.name} potion`);

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemey = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('You win!');
        }
    } else {
        console.log('You have been defeated!');
    }
}

module.exports = Game;