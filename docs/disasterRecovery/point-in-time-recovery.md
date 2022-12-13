# CCBC Point In Time Recovery
Based on : cas-postgres
CircleCI

---
# Source Base
https://github.com/bcgov/cas-postgres#point-in-time-recovery


This repository contains the Spilo + pgtap docker container and helm chart used by the various applications deployed by the CAS team.

# Docker container
The docker container adds the pgtap extension (unit testing for PostgreSQL) and a couple of utility scripts to the official Spilo container developed by Zalando.

BATS tests for the aforementioned scripts can be run using the corresponding make commands (run make help for more information).

# Helm Charts
The helm/patroni folder contains a fork of the patroni helm chart that was in the (now deprecated) helm charts incubator, and can be reused by other teams. The helm/cas-patroni](helm/cas-patroni) folder contains helm values used by the CAS team, as well as a job definition for the [cas-shelf` image, which provisions object storage buckets when WAL-G backups are enabled.

# Installation
Installation of the cas-postgres helm chart is simply done via the helm install command. See helm/cas-postgres/values.yaml for more information on the values that should be provided

# Steps for a complete fresh install (will lose all data)
helm delete the cas-ciip-portal release ex: helm delete --namespace wksv3k-dev cas-ciip-portal
delete the cas-ciip-portal patroni pvcs's (can be done from the openshift ui under storage)
delete the cas-ciip-portal patroni configmaps (can be done from the openshift ui under Resources -> Configmaps)
the trigger-dag job may possibly need to be deleted as well. Look for the job in the openshift ui under Resources -> Other Resources, if you find the job, delete it.
clear the namespace's gcs ciip-backup box in google storage ex: wksv3k-dev-ciip-backups

# Point in Time Recovery
In the event a database needs to be recovered from a backup to a specific point in time, these are the steps to follow. Spilo is shipped with a clone_with_wale method that we can leverage to handle this for us with the addition of a few environment variables.

These steps assume you are using Google Cloud to store backups. If you are using something else (like S3), the process should be similar for other providers and the necessary environment variables are described in the configure_spilo script here.

# Steps
Scale the patroni statefulset down to 0

Delete the patroni configmaps (any configmaps prefixed by your patroni-cluster-name)

# Samples
example: <patroni-cluster>-leader, <patroni-cluster>-config, <patroni-cluster>-failover
Delete the patroni PVCs relating to your cluster

example: storage-volume-<patroni-cluster>-0, storage-volume-<patroni>-1
Add the following environment variables to your patroni statefulset:

```
CLONE_SCOPE: <patroni-cluster-name>
CLONE_METHOD: CLONE_WITH_WALE
CLONE_TARGET_TIME: <timestamp-with-timezone-to-recover-to>
example: 2022-06-05 08:00:00-08:00
CLONE_WALG_GS_PREFIX: <google-cloud-prefix>
example: gs://[bucket-name]/[folder-name]
CLONE_GOOGLE_APPLICATION_CREDENTIALS: <path-to-json-credentials>
documentation: Google Cloud Authentication
PGVERSION: <major-postgres-version-to-restore-to> example: 12
PGVERSION is optional, but if the major version of your postgres backup is older than the psql version you are using, then it will automatically upgrade Posgtgres during restore and begin an entirely new timeline starting at 00000001. This will cause issues with replication as the replica will become confused about what timeline to bootstrap from when starting up.
Note: You likely already have WALG_GS_PREFIX and GOOGLE_APPLICATION_CREDENTIALS set as environment variables since they're needed to perform backups. The clone_with_wale method specifically looks for these variables with the CLONE_ prefix, so just copying the contents of these existing environment variables into new variables prefixed with CLONE_ is all that is needed here.
```

Do not forget to save your environment variables. The SAVE button is at the bottom of the page

Scale up the patroni statefulset

Patroni will then start up your database and restore to the point defined in CLONE_TARGET_TIME.

If successful you will see something like this in your logs: (docs/images/success.png)

Patroni will begin bootstrapping your backup. You will see a lot "Not Healthy..bootstrap in progress..rejecting connections" in your logs for a while as shown below. This is normal, do not stop the process. (docs/images/bootstrapping.png) This will repeat for a few moments. Once the bootstrap is finished you'll see a bunch of SQL statements followed eventually by your pod declaring it is the leader with the lock. At this point you're all done!

Command-Line Walkthrough
Esure you are in the correct namespace!

oc project will show you what namespace you are in
oc scale statefulset <statefulset-name> --replicas=0
This will scale your statefulset to 0
The statefulset name is probably the same as your patroni cluster
To get a list of all statefulsets use oc get statefulsets
oc delete configmap <configmap-name>
You'll need to do this for each configmap prefixed by the name of your patroni cluster
example: <patroni-cluster>-leader, <patroni-cluster>-config, <patroni-cluster>-failover
To get a list of all configmaps use oc get configmaps
oc delete pvc <pvc-name>
Again, you'll need to do this for each PVC that contains the name of your patroni cluster
example: storage-volume-<patroni-cluster>-0, storage-volume-<patroni>-1
To get a list of all PVCs use oc get pvc
oc set env statefulset/<statefulset-name> CLONE_SCOPE=<patroni-cluster-name> CLONE_METHOD=CLONE_WITH_WALE CLONE_WALG_GS_PREFIX=<google-cloud-prefix> CLONE_GOOGLE_APPLICATION_CREDENTIALS=<path-to-credentials> CLONE_TARGET_TIME='<target-restore-time-with-timezone>' PGVERSION=<major-postgres-version-to-restore-with>
To get a list of all environment variables in your statefulset use oc set env statefulset/<statefulset-name> --list
Examples of values between< > are above in the steps section
oc scale statefulset <statefulset-name> --replicas=<n> with 'n' being desired number of pods.
Openshift UI Walkthrough
Scale your statefulset to 0
Under Workloads in the left pane, go to StatefulSets (docs/images/ss.png)
Use the arrows to scale your pods down to 0 (docs/images/scaled-down.png)
Delete configmaps
Under Workloads in the left pane, go to ConfigMaps (docs/images/config.png)
Delete all configmaps in the list that are prefixed by your patroni cluster name
example: <patroni-cluster>-leader, <patroni-cluster>-config, <patroni-cluster>-failover
Delete PVCs
Under Storage in the left pane, go to PersistentVolumeClaims (docs/images/pvc.png)
Delete all PVCs in the list that contain your patroni cluster name
example: storage-volume-<patroni-cluster>-0, storage-volume-<patroni>-1
Set environment variables
Under Workloads in the left pane, go back to StatefulSets (docs/images/ss.png)
Select your statefulset & go to the Environment tab
Add the environment variables described in the Steps section above
Save your environment variables with the save button at the bottom of the page
Scale up your statefulset
Go to the Details tab & use the arrows to scale up your statefulset