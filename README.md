# 737-2023-t1-prac9.1P

## GitHub Repository:

https://github.com/DaGoblin/737-2023-t1-prac9.1P.git

Setup has a 3 Stateful Set of mongo DB running along with a 3 replica set of a Authorisation Node.js app that can perform CRUD operations storing data in Mongo DB.

## Kubernetes Dashboard showing deployment and Pod setup

![images showing Kubernetes dashboard](./doco/images/Dahsboard1.png)

![images showing Kubernetes dashboard2](./doco/images/Dahsboard2.png)

Kubectl results for get commands

-   kubectl get secret
-   kubectl get service
-   kubectl get pv
-   kubectl get pvc
-   kubectl get statefulset
-   kubectl get deployment
-   kubectl get configmap

![images showing Kubernetes get CLI outputs](./doco/images/commandCLIresults.png)

## Setup Commands and scripts

-   kubectl apply -f .\createConfigMap.yaml
-   kubectl apply -f .\createMongoDbSecret.yaml
-   kubectl apply -f .\createMongoDBUserSecret.yaml
    -   Not Actually used at the moment as MongoDB is not doing authentication at the moment but Secret is accessible inside Auth_MS as an environmental variable
-   kubectl apply -f .\createPersistantVolume.yaml
-   kubectl apply -f .\createStorageClass.yaml
-   kubectl apply -f .\createStatefulSet.yaml
-   kubectl apply -f .\createHeadlessService.yaml
-   kubectl apply -f .\createDeployment.yaml
-   kubectl apply -f .\createServiceNode.yaml

### Docker Image update and release

AuthMS docker Image built and updated with script  
`release.sh`

### AuthMS port-forwarding

Command to port forward AuthMS to host OS (will look at how to make this permanent or other ways of accessing MS in cluster)

`kubectl port-forward deployment/auth-ms 3010:4000`

## Testing and verification (CRUD)

### Create User (create)

![images showing postman creating a user](./doco/images/CreateUser.png)

### Login User (Retrieve)

![images showing postman logging a user in](./doco/images/LoginUser.png)

### Update Password (Update)

![images showing postman updating a users password](./doco/images/UpdatePassword.png)

### Show Password has changed

#### Old Password

![images showing postman testing old password and failing](./doco/images/OldPassword.png)

#### New Password

![images showing postman testing New password and working](./doco/images/NewPassword.png)

### Delete User (Delete)

![images showing postman deleting a user](./doco/images/DeleteUser.png)

## Mongo DB Replica set updating

show's MongoDB containers are replicating

### Primary

![images showing Primary MongoDB database results](./doco/images/Primary.png)

### Secondary

![images showing Secondary MongoDB database results](./doco/images/Secondary.png)
