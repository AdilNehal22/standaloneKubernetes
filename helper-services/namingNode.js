const util = require('util');
const exec = util.promisify(require('child_process').exec);

let nodeNamed;
async function namingMasterNode(){
  try {
    console.log('executing ====================== swapoff -a')
    const disableSwapMemory = await exec('swapoff -a');
    if(disableSwapMemory.stderr !== ""){
      console.log(`error while disbale swap memory ${disableSwapMemory.stderr}`);
      return;
    }
    if(disableSwapMemory.stdout === ""){
      console.log(`disbale swaped memory ${disableSwapMemory.stdout}\ngiving unique names to nodes`);
      console.log('executing ====================== hostnamectl set-hostname master-node')
      const givingNametoMasterNode = await exec('hostnamectl set-hostname master-node');
      if(givingNametoMasterNode.stderr !== ""){
        console.log(`error while giving name to master node ${givingNametoMasterNode.stderr}`);
        return;
      }
      if(givingNametoMasterNode.stdout === ""){
        console.log(`name given to master node ${givingNametoMasterNode.stdout}`);
        nodeNamed = true;
      }
    }
    return nodeNamed;
  } catch (error) {
    console.log(`error while disabling swap memory and naming the master node ${error}`);
  }
}

module.exports = {
  namingMasterNode
}