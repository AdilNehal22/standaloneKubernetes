# standaloneKubernetes

MANUALLY MAKING A KUBERNETES CLUSTER WAS LIKE A DONKEY-WORK TO ME. 

**This service, for now, only runs on Ubuntu servers. Plus run the service after doing SUDO SU **

This Nodejs Utility or Microservice will make you a standalone Kubernetes cluster and install the container network interface after asking if you want to install CALICO 
or FLANNEL. 

**Before running the service you must install curl package, as it don't install curl by itself.**

Moreover after cloning the repository, you don't need to install node-modules, as this utility is completely 'node-native' means, it don't containes any outside packages 
that you've to install right after cloning(my biggest pain-point). 

After cloning, 
do...

cd standaloneKubernetes/main-service
node kubernetes.js

after the above, sit back and wait for 7 minutes. 



