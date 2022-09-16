const util = require('util');
const exec = util.promisify(require('child_process').exec);
var readline = require('readline');
const { finallyCheckPods } = require('../helper-services/checkPods.js')


let CNI;

async function takeUserCNIAndInstall(){
  try {
    var rl = readline.createInterface(process.stdin, process.stdout)

    rl.question("Which CNI do you want to install on your Kubernetes cluster CALICO or FLANNEL?", (answer) => {
      CNI = answer;
      console.log(`will install ${answer} for cluster`);
      rl.close()
    });
    rl.on('close', async () => {
      console.log(`installing ${CNI}`);
      await installingClusterCNI(CNI);
    });
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
            console.log('installed calico custom resource', addCalicoCustomResource.stdout);
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
          console.log('installed flannel', addFlannel.stdout);
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