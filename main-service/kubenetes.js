const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { checkForRootInstallDocker } = require('../helper-services/checkForRoot.js');
const { enableDockerAddKubeSigningKey } = require('../helper-services/enableDockerKubeKey.js');
const { addXenialKubeServiceAddKubeadm } = require('../helper-services/addXenialService&kubeadm.js');
const { namingMasterNode } = require('../helper-services/namingNode.js');
const { initializeKubernetesAddUser } = require('../helper-services/initializingKubernetes.js');
const { takeUserCNIAndInstall } = require('../helper-services/installingCNI');

let dockerVersionAsState;
let signingKeyResponseAsState;
let kubeadmVersionAsState;
let nodeNamed;
let isChownId;
let isCNIinstalledAsState;

async function makeKubernetesCluster(){
  try {
    // console.log('Checking if the user is ROOT and installing docker ========================= ');

    // dockerVersionAsState = await checkForRootInstallDocker()

    // if(dockerVersionAsState){
    //   console.log('enabling docker in system and adding kubernetes signing key ========================= ');
    //   signingKeyResponseAsState = await enableDockerAddKubeSigningKey();
    // }

    // if(signingKeyResponseAsState == 'OK'){
    //   console.log('adding xenial kubernetes repositories and installing kubeadm ========================= ');
    //   kubeadmVersionAsState = await addXenialKubeServiceAddKubeadm();
    // }

    // if(kubeadmVersionAsState){
    //   console.log('naming the nodes ========================= ');
    //   nodeNamed = await namingMasterNode();
    // }

    // if(nodeNamed){
      // console.log("initializing the kubernetes cluster and setting regualr user ========================= ");
      // isChownId = await initializeKubernetesAddUser();
    // }

    // if(isChownId){
      console.log("installing CONTAINER NETWORK INTERFACE, on your input ========================= ");
      await takeUserCNIAndInstall();
    // }
    // console.log(isCNIinstalledAsState)
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