const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function finallyCheckPods(){
    try {
        console.log("executing =============================== kubectl get pods --all-namespaces")
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
    } catch (error) {
        console.log('error while checking pods', error);
    }
}

module.exports = {
    finallyCheckPods
}
