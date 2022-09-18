const util = require('util');
const exec = util.promisify(require('child_process').exec);
var readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});


let installedCNIStdout;
let stdoutInstalledCNI;

function question(query) {
  return new Promise(resolve => {
    readline.question(query, resolve);
  });
}

async function takeUserCNIAndInstall(){
  try {
    const CNI = await question('Which CNI do you want to install on your Kubernetes cluster CALICO or FLANNEL? ');
    console.log(`installing ${CNI}`);
    stdoutInstalledCNI = await installingClusterCNI(CNI);
    return stdoutInstalledCNI

  } catch (error) {
    console.log('error while taking user input for CNI', error)
  }
}

async function installingClusterCNI(userCNI){
  try {
    switch(userCNI){
      case "CALICO":
        const addCalico = await exec('kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/tigera-operator.yaml');
        if(addCalico.stderr){
          console.log('error while installing calico tigera operator', addCalico.stderr);
          return;
        }
        if(addCalico.stdout){
          console.log('adding calico tigera operator', addCalico.stdout);
          const addCalicoCustomResource = await exec('kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/custom-resources.yaml');
          if(addCalicoCustomResource.stderr){
            console.log('error while installing calico custom resource', addCalicoCustomResource.stderr);
            return;
          }
          if(addCalicoCustomResource.stdout){
            installedCNIStdout = addCalicoCustomResource.stdout;
            console.log('installed calico custom resource', installedCNIStdout);
            return installedCNIStdout
          }
        }
        break;
      case "FLANNEL":
        const addFlannel = await exec('sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml');
        if(addFlannel.stderr){
          console.log('error while installing flannel', addFlannel.stderr);
          return;
        }
        if(addFlannel.stdout){
          installedCNIStdout = addFlannel.stdout;
          console.log('installed flannel', installedCNIStdout);
          return installedCNIStdout;
        }
        break;
      default:
        console.log(`consoling the CNI ${CNI}, it is not installed`);
        break;
    }
  } catch (error) {
    console.log(`error while installing the Container Network Interface ${error}`);
  }
}

module.exports = {
  takeUserCNIAndInstall
}