const util = require('util');
const exec = util.promisify(require('child_process').exec);

let isChownId;
async function initializeKubernetesAddUser(){
  try {
    console.log('executing =================== kubeadm init --pod-network-cidr=10.244.0.0/16');
    const initializeKubernetes = await exec('kubeadm init --pod-network-cidr=10.244.0.0/16');
    console.log(initializeKubernetes)
    if(initializeKubernetes.stderr !== ""){
      console.log(`error while initializing kubernetes ${data.toString()}`);
      return;
    }
    if(initializeKubernetes.stdout){
      console.log(`intializing kubernetes ${initializeKubernetes.stdout}`);
      console.log('executing =================== mkdir -p $HOME/.kube')
      let makeDir = await exec('mkdir -p $HOME/.kube');
      console.log(`makeDir ${JSON.stringify(makeDir)}`)
      if(makeDir.stderr !== ""){
        console.log(`error while making dir $HOME/.kube ${makeDir.stderr}`);
      }
      if(makeDir.stdout === ""){
        console.log(`make dir $HOME/.kube ${makeDir.stdout}`)
        console.log('executing =================== yes | cp -i /etc/kubernetes/admin.conf $HOME/.kube/config')
        const copyKubeConfig = await exec('yes | cp -i /etc/kubernetes/admin.conf $HOME/.kube/config');
        console.log(`copyKubeConfig ${copyKubeConfig}`)
        if(copyKubeConfig.stderr !== ""){
          console.log(`error while copying kube config ${copyKubeConfig.stderr}`);
          return;
        }
        if(copyKubeConfig.stdout === ""){
          console.log(`copied kube config ${copyKubeConfig.stdout}`);
          console.log('executing =================== chown $(id -u):$(id -g) $HOME/.kube/config')
          const chownId = await exec('chown $(id -u):$(id -g) $HOME/.kube/config');
          console.log('chownId', chownId)
          if(chownId.stderr !== ""){
            console.log(`error while chown id ${chownId.stderr}`);
            return;
          }
          if(chownId.stdout === ""){
            console.log(`chown-ed id ${chownId.stdout}`);
            isChownId = true;
            console.log('fresh kubernetes cluster is setup, NEXT IS TO INSTALL THE CONTAINER NETWORK INTERFACE');
          }
        }
      }

    }
    return isChownId;
  } catch (error) {
    console.log(`error while initializing and adding regular user ${error}`);
  }

}

module.exports = {
  initializeKubernetesAddUser, isChownId
}