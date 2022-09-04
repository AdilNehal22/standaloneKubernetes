const util = require('util');
const exec = util.promisify(require('child_process').exec);

let kubeadmVersionAsState;
async function addXenialKubeServiceAddKubeadm(){
  try {
    const addXenialKubernetesRep = await exec('apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main');
    if(addXenialKubernetesRep.stderr){
      addXenialKubernetesRep.stderr.on('data', function(data){
        console.log(`failed to add xenial kubernetes repository ${data.toString()}`);
        return;
      });
    }
    if(addXenialKubernetesRep.stdout){
      addXenialKubernetesRep.stdout.on('data', function(data){
        console.log(`adding xenial kubernetes repository ${data.toString()}`);
      });
      const installKubeadm = await exec('apt install kubeadm');
      if(installKubeadm.stderr){
        console.log(`error while installing kubeadm ${installKubeadm.stderr}`);
        return;
      }
      if(installKubeadm.stdout){
        installKubeadm.stdout.on('data', function(data){
          console.log(`installing kubernetes ${data.toString()}`);
        });
        const checkKubeadm = await exec('kubeadm version');
        if(checkKubeadm.stderr){
          console.log(`kubeadm not installed ${checkKubeadm.stderr}`);
          return;
        }
        if(checkKubeadm.stdout){
          kubeadmVersionAsState = checkKubeadm.stdout;
          console.log(`kubeadm installed ${checkKubeadm.stdout}`);
        }
      }
    }
  } catch (error) {
    console.log(`error while adding xenial kubernetes repositories and installing kubeadm`);
  }
}

module.exports = {
  addXenialKubeServiceAddKubeadm, kubeadmVersionAsState
}