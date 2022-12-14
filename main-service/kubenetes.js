const { checkForRootInstallDocker } = require('../helper-services/checkForRoot.js');
const { enableDockerAddKubeSigningKey } = require('../helper-services/enableDockerKubeKey.js');
const { addXenialKubeServiceAddKubeadm } = require('../helper-services/addXenialService&kubeadm.js');
const { namingMasterNode } = require('../helper-services/namingNode.js');
const { initializeKubernetesAddUser } = require('../helper-services/initializingKubernetes.js');
const { takeUserCNIAndInstall } = require('../helper-services/installingCNI');
const { checkPodsAfterAMinute } = require('../helper-services/checkPods.js')

let dockerVersionAsState;
let signingKeyResponseAsState;
let kubeadmVersionAsState;
let nodeNamed;
let isChownId;
let isCNIinstalled;

async function makeKubernetesCluster(){
  try {
    console.log('Checking if the user is ROOT and installing docker ========================= ');

    dockerVersionAsState = await checkForRootInstallDocker()

    if(dockerVersionAsState){
      console.log('enabling docker in system and adding kubernetes signing key ========================= ');
      signingKeyResponseAsState = await enableDockerAddKubeSigningKey();
    }

    if(signingKeyResponseAsState == 'OK'){
      console.log('adding xenial kubernetes repositories and installing kubeadm ========================= ');
      kubeadmVersionAsState = await addXenialKubeServiceAddKubeadm();
    }

    if(kubeadmVersionAsState){
      console.log('naming the nodes ========================= ');
      nodeNamed = await namingMasterNode();
    }

    if(nodeNamed){
      console.log("initializing the kubernetes cluster and setting regualr user ========================= ");
      isChownId = await initializeKubernetesAddUser();
    }

    if(isChownId){
      console.log("installing CONTAINER NETWORK INTERFACE, on your input ========================= ");
      isCNIinstalled = await takeUserCNIAndInstall();
    }

    if(isCNIinstalled){
      console.log('finally checking for the pods ========================= ');
      await checkPodsAfterAMinute();
      return;
    }

  } catch (error) {
    console.log(`error while installing kubernetes cluster ${error}`);
  }
}


makeKubernetesCluster();