const path = require('path');
const fs = require('fs');

console.log('Directorio de comandos:', path.join(__dirname, 'commands'));
console.log('Archivos:', fs.readdirSync(path.join(__dirname, 'commands')));

for (const file of fs.readdirSync(path.join(__dirname, 'commands'))) {
    if (file.endsWith('.js')) {
        console.log(`Require: ${file}`);
        try {
            const cmd = require(path.join(__dirname, 'commands', file));
            console.log(`  ✓ ${cmd.data.name}`);
        } catch (e) {
            console.log(`  ✗ ${e.message}`);
        }
    }
}
