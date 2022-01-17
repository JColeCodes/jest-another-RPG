const Potion = require('../lib/Potion');
const Character = require('./Character');

class Player extends Character {
    constructor(name = '') {
        // Call parent constructor
        super(name);

        this.inventory = [new Potion('health'), new Potion()];
    }

    // Returns an object with various player properties
    getStats() {
        return {
            potions: this.inventory.length,
            health: this.health,
            strength: this.strength,
            agility: this.agility
        };
    }

    // Returns the inventory array or false if empty
    getInventory() {
        if (this.inventory.length) {
            return this.inventory;
        }
        return false;
    }

    // Adds a potion to the inventory
    addPotion(potion) {
        this.inventory.push(potion);
    }
    
    // Uses a potion from inventory
    usePotion(index) {
        const potion = this.getInventory().splice(index, 1)[0];
    
        switch (potion.name) {
            case 'agility':
                this.agility += potion.value;
                break;
            case 'health':
                this.health += potion.value;
                break;
            case 'strength':
                this.strength += potion.value;
                break;
        }
    }
}

module.exports = Player;