// Loads .env.pg into the environment, then runs `cds watch`, which passes it on to the server
const { spawn } = require('child_process')

process.loadEnvFile('.env.pg')

spawn('cds', ['watch', ...process.argv.slice(2)], { stdio: 'inherit', shell: true })
  .on('exit', code => process.exit(code ?? 0))
