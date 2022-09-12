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
      isCNIinstalledAsState = await takeUserCNIAndInstall();
    }

    if(isCNIinstalledAsState){
      const checkPods = await exec('kubectl get pods --all-namespaces');
      if(checkPods.stderr){
        console.log('error while showing pods', checkPods.stderr);
      }
      if(checkPods.stdout){
        console.log('Cluster Finally installed +++++++++++++++++++++++++++++++++++++++ ',checkPods.stdout, '\nTainiting nodes ++++++++++++++++++++++ ');
        const taintMaster = await exec('kubectl taint nodes --all node-role.kubernetes.io/master-');
        if(taintMaster.stderr){
          console.log(taintMaster.stderr);
        }
        if(taintMaster.stdout){
          console.log(taintMaster.stdout);
        }
        const taintNoScheduler = await exec('kubectl taint nodes --all node.kubernetes.io/not-ready:NoSchedule-');
        if(taintNoScheduler.stderr){
          console.log(taintNoScheduler.stderr);
          return;
        }
        if(taintNoScheduler.stdout){
          console.log(taintNoScheduler.stdout);
          return;
        }
      }
    }
  } catch (error) {
    console.log(`error while installing kubernetes cluster ${error}`);
  }
}


makeKubernetesCluster();