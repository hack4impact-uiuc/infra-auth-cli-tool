const spawn = require('child_process').spawn;

execPromise = (command, file, args) => {
    return new Promise((resolve, reject) => {
      const child = spawn(command, file, args)
  
      child.on('close', (code) => {
        if (code !== 0) {
            return reject("Gmail token creator exited unsuccessfully");
        }
        return resolve()
      })
    })
  }
module.exports = execPromise;