const util = require('util');
const exec = util.promisify(require('child_process').exec);

let kubeadmVersionAsState;
async function addXenialKubeServiceAddKubeadm(){
  try {
    const addXenialKubernetesRep = await exec('apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"');
    if(addXenialKubernetesRep.stderr){
      console.log(`failed to add xenial kubernetes repository ${addXenialKubernetesRep.stderr}`);
    }
    if(addXenialKubernetesRep.stdout){
      console.log(`adding xenial kubernetes repository ${addXenialKubernetesRep.stdout}`)
      const installKubeadm = await exec('apt install -y kubeadm');
      if(installKubeadm.stderr){
        console.log(`error while installing kubeadm ${installKubeadm.stderr}`);
        return;
      }
      if(installKubeadm.stdout){
        console.log(`installing kubeadm ${installKubeadm.stdout}`)
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
    console.log(`error while adding xenial kubernetes repositories and installing kubeadm ${error}`);
  }
}

module.exports = {
  addXenialKubeServiceAddKubeadm, kubeadmVersionAsState
}