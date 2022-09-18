const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function finallyCheckPods(){
    try {
        console.log("executing =============================== kubectl get nodes")
        const checkNodes = await exec('kubectl get nodes');
        if(checkNodes.stderr){
          console.log('error while showing nodes', checkNodes.stderr);
        }
        if(checkNodes.stdout){
          console.log('Cluster Finally installed +++++++++++++++++++++++++++++++++++++++ ',checkNodes.stdout, '\nchecking pods ++++++++++++++++++++++ ');
          const checkPods = await exec('kubectl get pods --all-namespaces');
          if(checkPods.stderr){
            console.log(checkPods.stderr);
          }
          if(checkPods.stdout){
            console.log(checkPods.stdout);
            console.log('CLUSTER is made now, you may search for TAINTS and erase them if there are any')
            return;
          }
        }
    } catch (error) {
      console.log('error while checking pods', error);
    }
}

module.exports = {
  finallyCheckPods
}
