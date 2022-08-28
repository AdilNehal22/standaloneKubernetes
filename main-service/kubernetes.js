const { exec } = require("child_process");
const chalk = require('chalk');

async function makeKubernetesCluster(){
  try {
    exec('sudo su', (error, stdout, stderr) => {
      if(error){
        console.log(chalk.red(`error: ${error.message}`));
        return;
      }
      if(stderr){
        console.log(chalk.red(`stderr: ${stderr}`));
        return;
      }
      console.log(chalk.green(`stdout: ${stdout}`));
    });
  } catch (error) {
    console.log(chalk.red('error while making cluster ========= ', error));
  }
}

