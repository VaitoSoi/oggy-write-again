const fs = require('node:fs')

module.exports = (client) => {
    const eventFiles = fs.readdirSync('./events/').filter(file => file.endsWith('.js'));
    
    console.log('[CLIENT]\x1b[33m LOADING EVENTS\x1b[0m');

    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.run(...args));
        } else {
            client.on(event.name, (...args) => event.run(...args));
        }
    }

    console.log('[CLIENT]\x1b[32m LOADED EVENTS\x1b[0m')
}