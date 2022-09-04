const { mkdir } = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function initializeKubernetesAddUser(){
  try {
    const initializeKubernetes = await exec('kubeadm init --pod-network-cidr=10.244.0.0/16');
    if(initializeKubernetes.stderr){
      initializeKubernetes.stderr.on('data', function(data){
        console.log(`error while initializing kubernetes ${data.toString()}`);
        return;
      });
    }
    if(initializeKubernetes.stdout){
      initializeKubernetes.stdout.on('data', function(data){
        console.log(`intializing kubernetes ${data.toString()}`);
        let makeDir = await exec('mkdir -p $HOME/.kube');
        if(makeDir.stderr){
          console.log(`error while making dir $HOME/.kube ${makeDir.stderr}`);
        }
        if(makeDir.stdout){
          console.log(`make dir $HOME/.kube ${makeDir.stdout}`)
          const copyKubeConfig = await exec('yes | cp -i /etc/kubernetes/admin.conf $HOME/.kube/config');
          if(copyKubeConfig.stderr){
            console.log(`error while copying kube config ${copyKubeConfig.stderr}`);
            return;
          }
          if(copyKubeConfig.stdout){
            console.log(`copied kube config ${copyKubeConfig.stdout}`);
            const chownId = await exec('chown $(id -u):$(id -g) $HOME/.kube/config');
            if(chownId.stderr){
              console.log(`error while chown id ${chownId.stderr}`);
              return;
            }
            if(chownId.stdout){
              console.log(`chown-ed id ${chownId.stdout}`);
            }
          }
        }
      });
    }
  } catch (error) {
    console.log(`error while initializing and adding regular user ${error}`);
  }

}

module.exports = {
  initializeKubernetesAddUser
}