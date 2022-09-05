const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { dockerVersionAsState, checkForRootInstallDocker } = require('../helper-services/checkForRoot.js');
const { enableDockerAddKubeSigningKey, signingKeyResponseAsState } = require('../helper-services/enableDockerKubeKey.js');
const { addXenialKubeServiceAddKubeadm, kubeadmVersionAsState } = require('../helper-services/addXenialService&kubeadm.js');
const { namingMasterNode, nodeNamed } = require('../helper-services/namingNode.js');
const { initializeKubernetesAddUser, isChownId } = require('../helper-services/initializingKubernetes.js');
const { installingClusterCNI, isCNIinstalledAsState } = require('../helper-services/installingCNI');


async function makeKubernetesCluster(){
  try {
    console.log('Checking if the user is ROOT and installing docker ========================= ');
    await checkForRootInstallDocker()
    if(dockerVersionAsState){
      console.log('enabling docker in system and adding kubernetes signing key ========================= ');
      await enableDockerAddKubeSigningKey();
    }
    // console.log(dockerVersionAsState)
    // if(dockerVersionAsState){
    //   console.log('dockerVersionAsState ========== ', dockerVersionAsState);
    //   console.log('enabling docker in system and adding kubernetes signing key ========================= ');
    //   await enableDockerAddKubeSigningKey();
    // }
    // console.log('adding xenial kubernetes repositories and installing kubeadm ========================= ');
    // await addXenialKubeServiceAddKubeadm();
    // console.log('naming the nodes ========================= ');
    // await namingMasterNode();
    // console.log("initializing the kubernetes cluster and setting regualr user ========================= ");
    // await initializeKubernetesAddUser();
    // console.log("installing CONTAINER NETWORK INTERFACE, on your input ========================= ");
    // await installingClusterCNI()
    // const checkPods = await exec('kubectl get pods --all-namespaces');
    // if(checkPods.stderr){
    //   console.log('error while showing pods', checkPods.stderr);
    // }
    // if(checkPods.stdout){
    //   console.log(checkPods.stdout);
    // }
  } catch (error) {
    console.log(`error while installing kubernetes cluster ${error}`);
  }
}


makeKubernetesCluster();