const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { checkForRootInstallDocker } = require('../helper-services/checkForRoot.js');
const { enableDockerAddKubeSigningKey } = require('../helper-services/enableDockerKubeKey.js');
const { addXenialKubeServiceAddKubeadm } = require('../helper-services/addXenialService&kubeadm.js');
const { namingMasterNode } = require('../helper-services/namingNode.js');
const { initializeKubernetesAddUser, isChownId } = require('../helper-services/initializingKubernetes.js');
const { installingClusterCNI, isCNIinstalledAsState } = require('../helper-services/installingCNI');

let dockerVersionAsState;
let signingKeyResponseAsState;
let kubeadmVersionAsState;
let nodeNamed;

async function makeKubernetesCluster(){
  try {
    console.log('Checking if the user is ROOT and installing docker ========================= ');
    dockerVersionAsState = await checkForRootInstallDocker()
    // console.log('in caller', dockerVersionAsState)
    if(dockerVersionAsState){
      console.log('enabling docker in system and adding kubernetes signing key ========================= ');
      signingKeyResponseAsState = await enableDockerAddKubeSigningKey();
    }
    console.log(signingKeyResponseAsState)
    if(signingKeyResponseAsState == 'OK'){
      console.log('adding xenial kubernetes repositories and installing kubeadm ========================= ');
      kubeadmVersionAsState = await addXenialKubeServiceAddKubeadm();
    }
    console.log(kubeadmVersionAsState)
    if(kubeadmVersionAsState){
      console.log('naming the nodes ========================= ');
      nodeNamed = await namingMasterNode();
    }
    console.log(nodeNamed)
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