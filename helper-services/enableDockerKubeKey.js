const util = require('util');
const exec = util.promisify(require('child_process').exec);

let signingKeyResponseAsState;

async function enableDockerAddKubeSigningKey(){
  try {
    const enableDocker = await exec('systemctl enable docker');
    if(enableDocker.stderr){
      console.log(`stderr in enabling docker ${stderr}`);
      return;
    }
    if(enableDocker.stdout){
      console.log('enabling docker in the system', enableDocker.stdout);
      const addKubernetesSigningKey = await exec('curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add');
      if(addKubernetesSigningKey.stderr){
        console.log('error while adding kubernetes signing key');
        return;
      }
      if(addKubernetesSigningKey.stdout && addKubernetesSigningKey.stdout.trimRight() == "OK"){
        signingKeyResponse = addKubernetesSigningKey.stdout.trimRight();
        console.log('Kubernetes signing key added');
      }
    }
  } catch (error) {
    console.log(`error while enabling docker and adding kubernetes signing key ${error}`);
    return;
  }
}

module.exports = {enableDockerAddKubeSigningKey, signingKeyResponseAsState};