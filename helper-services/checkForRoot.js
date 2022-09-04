const util = require('util');
const exec = util.promisify(require('child_process').exec);

let dockerVersionAsState;
async function checkForRootInstallDocker(){
	try {
		const checkForRoot = await exec(`whoami`);
		if(checkForRoot.stderr){
			console.log(`stderr in checking for root ${stdout}`);
			return;
		}
		if(checkForRoot.stdout && checkForRoot.stdout.trimRight() == "root"){
			const installDocker = await exec('apt-get install -y docker.io');
			if(installDocker.stderr){
				stderr.on('data', function(data){
					console.log(`error in installing docker ${data.toString()}`);
					return;
				});
			}
			if(installDocker.stdout){
				stdout.on('data', function(data){
					console.log(`installing docker ${data.toString()}`);
				});
			}
			const checkDocker = await exec('docker --version');
			if(checkDocker.stderr){
				console.log(`Docker not installed ${stderr}`);
				return;
			}
			if(checkDocker.stdout){
				dockerVersionAsState = checkDocker.stdout.trimRight();
				console.log(`Docker installed successfully ${stdout}`);
			}
		}else {
			console.log('This service will only run when user will run it as a root user');
			return;
		}
	} catch (error) {
		console.log(`error while checking for root user and installing docker ${error}`);
		return;
	}
}

module.exports = {
	checkForRootInstallDocker,
	dockerVersionAsState
}