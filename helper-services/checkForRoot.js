const util = require('util');
const exec = util.promisify(require('child_process').exec);

let dockerVersionAsState;
async function checkForRootInstallDocker(){
	try {
		console.log('executing ================= whoami')
		const checkForRoot = await exec(`whoami`);
		if(checkForRoot.stderr){
			console.log(`stderr in checking for root ${stdout}`);
			return;
		}
		if(checkForRoot.stdout && checkForRoot.stdout.trimRight() == "root"){
			console.log('executing ================= apt-get install -y docker.io')
			const installDocker = await exec('apt-get install -y docker.io');
			if(installDocker.stdout){
				console.log('docker installing',installDocker.stdout, '\nexecuting ================= docker --version');
				const checkDocker = await exec('docker --version');
				if(checkDocker.stderr){
					console.log(`Docker not installed ${checkDocker.stderr}`);
					return;
				}
				if(checkDocker.stdout){
					dockerVersionAsState = checkDocker.stdout.trimRight();
					console.log(`Docker installed successfully ${checkDocker.stdout}`);
				}
			}
			if(installDocker.stderr){
				installDocker.stderr.on('data', function(data){
					console.log(`error in installing docker ${data.toString()}`);
					return;
				});
			}
		}else {
			console.log('This service will only run when user will run it as a root user');
			return;
		}
		return dockerVersionAsState
	} catch (error) {
		console.log(`error while checking for root user and installing docker ${error}`);
		return;
	}
}

module.exports = {
	checkForRootInstallDocker
}
