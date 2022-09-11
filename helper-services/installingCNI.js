const util = require('util');
const exec = util.promisify(require('child_process').exec);
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let CNI;
let isCNIinstalledAsState;

async function installingClusterCNI(){
  try {
    rl.question("Which CNI do you want to install on your Kubernetes cluster CALICO or FLANNEL?", function(answer){
      CNI = answer;
      console.log(`will install ${answer} for cluster`);
      rl.close()
    });
    rl.on('close', function(){
      console.log(`installing ${CNI}`);
      process.exit(0);
    });

    switch(CNI){
      case "CALICO":
        const addCalico = await exec('kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/tigera-operator.yaml');
        if(addCalico.stderr){
          console.log('error while installing calico tigera operator', data.toString());
          return;
        }
        if(addCalico.stdout){
          addCalico.stdout.on('data', async function(data){
            console.log('adding calico tigera operator', data.toString());
            const addCalicoCustomResource = await exec('kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.24.1/manifests/custom-resources.yaml');
            if(addCalicoCustomResource.stderr){
              addCalicoCustomResource.stderr.on('data', function(data){
                console.log('error while installing calico custom resource', data.toString());
                return;
              });
            }
            if(addCalico.stdout){
              addCalico.stdout.on('data', function(data){
                console.log('installed calico custom resource', data.toString());
              });
              isCNIinstalledAsState = true;
            }
          })
        }
        break;
      case "FLANNEL":
        const addFlannel = await exec('sudo kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml');
        if(addFlannel.stderr){
          addFlannel.stderr.on('data', function(data){
            console.log('error while installing flannel', data.toString());
            return;
          });
        }
        if(addFlannel.stdout){
          addFlannel.stdout.on('data', function(data){
            console.log('installed flannel', data.toString());
          });
          isCNIinstalledAsState = true;
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
  installingClusterCNI, isCNIinstalledAsState
}