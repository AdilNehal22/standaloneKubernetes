const util = require('util');
const exec = util.promisify(require('child_process').exec);

let signingKeyResponseAsState;

async function enableDockerAddKubeSigningKey(){
  try {
    console.log('executing ====================== systemctl enable docker')
    const enableDocker = await exec('systemctl enable docker');
    if(enableDocker.stderr !== ""){
      console.log(`stderr in enabling docker ${enableDocker.stderr}`);
      return;
    }
    if(enableDocker.stdout === ""){
      console.log('enabling docker in the system', enableDocker.stdout);
      console.log(`executing ====================== curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add}`)
      const addKubernetesSigningKey = await exec('curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add');
      console.log('addKubernetesSigningKey', addKubernetesSigningKey)
      if(!addKubernetesSigningKey.stderr.startsWith('Warning')){
        console.log('error while adding kubernetes signing key', addKubernetesSigningKey.stderr);
        return;
      }
      if(addKubernetesSigningKey.stdout && addKubernetesSigningKey.stdout.trimRight() == "OK"){
        signingKeyResponseAsState = addKubernetesSigningKey.stdout.trimRight();
        console.log('signingKeyResponseAsState in actual function =============== ', addKubernetesSigningKey.stdout.trimRight());
        console.log('Kubernetes signing key added');
      }
    }
    return signingKeyResponseAsState;
  } catch (error) {
    console.log(`error while enabling docker and adding kubernetes signing key ${error}`);
    return;
  }
}

module.exports = {enableDockerAddKubeSigningKey};