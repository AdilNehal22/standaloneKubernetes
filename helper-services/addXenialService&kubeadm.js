const util = require('util');
const exec = util.promisify(require('child_process').exec);

let kubeadmVersionAsState;
async function addXenialKubeServiceAddKubeadm(){
  try {
    console.log('executing ==================== apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"',)
    const addXenialKubernetesRep = await exec('apt-add-repository "deb http://apt.kubernetes.io/ kubernetes-xenial main"');
    if(addXenialKubernetesRep.stderr){
      console.log(`failed to add xenial kubernetes repository ${addXenialKubernetesRep.stderr}`);
    }
    if(addXenialKubernetesRep.stdout){
      console.log(`added xenial kubernetes repository ${addXenialKubernetesRep.stdout}`);
      console.log('executing ==================== apt install -y kubeadm');
      const installKubeadm = await exec('apt install -y kubeadm');
      if(!installKubeadm.stderr.startsWith('\nWARNING')){
        console.log(`error while installing kubeadm ${installKubeadm.stderr}`);
        return;
      }
      if(installKubeadm.stdout){
        console.log(`installing kubeadm ${installKubeadm.stdout}`)
        console.log('executing ==================== kubeadm version')
        const checkKubeadm = await exec('kubeadm version');
        if(checkKubeadm.stderr){
          console.log(`kubeadm not installed ${checkKubeadm.stderr}`);
          return;
        }
        if(checkKubeadm.stdout){
          kubeadmVersionAsState = checkKubeadm.stdout.trimRight();
          console.log(`kubeadm installed ${checkKubeadm.stdout}`);
        }
      }
    }
    return kubeadmVersionAsState;
  } catch (error) {
    console.log(`error while adding xenial kubernetes repositories and installing kubeadm ${error}`);
  }
}

module.exports = {
  addXenialKubeServiceAddKubeadm, kubeadmVersionAsState
}