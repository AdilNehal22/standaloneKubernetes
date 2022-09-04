const { dockerVersionAsState, checkForRootInstallDocker } = require('../helper-services/checkForRoot.js');
const { enableDockerAddKubeSigningKey, signingKeyResponseAsState } = require('../helper-services/enableDockerKubeKey.js');

async function makeKubernetesCluster(){
  try {
    console.log('Checking if the user is ROOT and installing docker ========================= ');
    checkForRootInstallDocker();
    if(dockerVersionAsState){
      console.log('enabling docker in system and adding kubernetes signing key ========================= ');
      enableDockerAddKubeSigningKey();
    }else{
      return;
    }
    if(signingKeyResponseAsState == 'OK'){
      console.log('adding xenial kubernetes repositories and installing kubeadm ========================= ');

    }
  } catch (error) {
    console.log(`error while installing kubernetes cluster ${error}`);
  }
}


makeKubernetesCluster();