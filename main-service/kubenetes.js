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

  } catch (error) {
    console.log(`error while installing kubernetes cluster ${error}`);
  }
}


makeKubernetesCluster();