const { dockerVersionAsState, checkForRootInstallDocker } = require('../helper-services/checkForRoot.js');
const { enableDockerAddKubeSigningKey, signingKeyResponseAsState } = require('../helper-services/enableDockerKubeKey.js');
const { addXenialKubeServiceAddKubeadm, kubeadmVersionAsState } = require('../helper-services/addXenialService&kubeadm.js');
const { namingMasterNode, nodeNamed } = require('../helper-services/namingNode.js');


async function makeKubernetesCluster(){
  try {
    console.log('Checking if the user is ROOT and installing docker ========================= ');
    checkForRootInstallDocker();
    if(dockerVersionAsState != null){
      console.log('enabling docker in system and adding kubernetes signing key ========================= ');
      enableDockerAddKubeSigningKey();
    }else{
      return;
    }
    if(signingKeyResponseAsState == 'OK'){
      console.log('adding xenial kubernetes repositories and installing kubeadm ========================= ');
      addXenialKubeServiceAddKubeadm();
    }else{
      return;
    }
    if(kubeadmVersionAsState != null){
      console.log('now finally installing kubernetes cluster ========================= ');
      namingMasterNode();
    }else{
      return;
    }
    if(nodeNamed){
      console.log("initializing the kubernetes cluster and setting regualr user ========================= ");
      
    }else{
      return;
    }
  } catch (error) {
    console.log(`error while installing kubernetes cluster ${error}`);
  }
}


makeKubernetesCluster();