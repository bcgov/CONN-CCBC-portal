CCBC - Generic Postgres PGO from Crunchy Data Disaster Recovery & Cloning
===========================================================================

Preface

The following is a generic approach that any DevOps may use as guidance when introducing Postgres PGO disaster recovery and cloning for your Postgres data.


Postgres Operator PGO

PGO, the Postgres Operator from Crunchy Data, gives you a declarative Postgres solution that automatically manages your PostgreSQL clusters.
Designed for your GitOps workflows, it is easy to get started with Postgres on Kubernetes with PGO. You can have a production-grade Postgres cluster complete with high availability, disaster recovery, and monitoring, all over secure TLS communications. You can customize your Postgres cluster to tailor it to your workload.

PGO offers cloning Postgres clusters and using rolling updates to roll out disruptive changes with minimal downtime. PGO is built for resiliency and uptime, it will keep your Postgres cluster in its desired state.

PGO automates Postgres management on Kubernetes, providing a seamless cloud native Postgres solution to keep your data always available.


Installation

Install and get up and running with PGO with the Postgres Operator from Crunchy Data. The following are additional instructions to get Postgres up and running on Kubernetes:

Fork the Postgres Operator examples repository and clone it to your host machine. 
For example:
YOUR_GITHUB_UN="<your GitHub username>"
git clone --depth 1 "git@github.com:${YOUR_GITHUB_UN}/postgres-operator-examples.git"
cd postgres-operator-examples

    Run kubectl apply -k kustomize/install




Cloud Native Postgres for Kubernetes

Create, Scale, & Delete PostgreSQL clusters, while fully customizing your Pods and PostgreSQL configuration with safe, automated failover backed by a distributed consensus high availability solution. PGO uses Pod Anti-Affinity to help resiliency, so you can configure how aggressively it responds. Failed primaries automatically heal, allowing for faster recovery time. There is support for standby PostgreSQL clusters that work both within and across multiple Kubernetes clusters.




Disaster Recovery

Backups and restores leverage the open source pgBackRest utility and includes support for full, incremental, and differential backups as well as efficient delta restores. Set how long you to retain your backups. This works will with large databases.




Security and TLS

PGO enforces that all connections occur over TLS. You can also bring your own TLS infrastructure if you do not want to use the defaults provided by PGO.

PGO runs containers with locked-down settings and provides Postgres credentials in a secure, convenient way for connecting your applications to your data.
Monitoring

Track the health of your PostgreSQL clusters using the open source pgMonitor library.
Upgrade Management

Safely apply PostgreSQL updates with minimal impact to the availability of your PostgreSQL clusters.
Advanced Replication Support

Choose between asynchronous and synchronous replication for workloads that are sensitive to losing transactions.





Cloning

Create new clusters from your existing clusters or backups with efficient data cloning.





Connection Pooling

Advanced connection pooling support using pgBouncer.

Have your PostgreSQL clusters deployed to your preferred Kubernetes Nodes. Set your pod anti-affinity, node affinity, pod tolerations rules to customize your deployment topology.





Scheduled Backups

Choose the type of backup (full, incremental, differential) and the frequency of occurrence on each PostgreSQL cluster.

Backup to Local Storage, S3, GCS, Azure, or a combination of these

Store your backups in Amazon S3 or any object storage system that supports the S3 protocol. You can also store backups in Google Cloud Storage and Azure Blob Storage.
You can also mix-and-match: PGO lets you store backups in multiple locations.






Full Customization

Choose the resources for your Postgres cluster: container resources and storage size. Resize at any time with minimal disruption. Use your own container image repository, including support imagePullSecrets and private repositories




Namespaces

Deploy PGO to watch Postgres clusters in all of your namespaces, or restrict which namespaces you want PGO to manage Postgres clusters in.

Included Components
PostgreSQL containers deployed with the PostgreSQL Operator include the following components:

PostgreSQL
        PostgreSQL Contrib Modules
        PL/Python + PL/Python 3
        PL/Perl
        PL/Tcl
        pgAudit
        pgAudit Analyze
        pg_cron
        pg_partman
        pgnodemx
        set_user
        TimescaleDB (Apache-licensed community edition)
        wal2json
    pgBackRest
    pgBouncer
    pgAdmin 4
    pgMonitor
    Patroni
    LLVM (for JIT compilation)

In addition to the above, the geospatially enhanced PostgreSQL + PostGIS container adds the following components:

    PostGIS
    pgRouting

PostgreSQL Operator Monitoring uses the following components:

    pgMonitor
    Prometheus
    Grafana
    Alertmanager

For more information about which versions of the PostgreSQL Operator include which components, please visit the compatibility section of the documentation.





Supported Platforms

PGO, the Postgres Operator from Crunchy Data, is tested on the following platforms:

    Kubernetes 1.22-1.25
    OpenShift 4.8-4.11
    Rancher
    Google Kubernetes Engine (GKE), including Anthos
    Amazon EKS
    Microsoft AKS
    VMware Tanzu

This list only includes the platforms that the Postgres Operator is specifically tested on as part of the release process: PGO works on other Kubernetes distributions as well.

Ensure you have the following utilities installed on your host machine:

    kubectl
    git





Installation

Step 1: Download the Examples

First, go to GitHub and fork the Postgres Operator examples repository:

https://github.com/CrunchyData/postgres-operator-examples/fork

Once you have forked this repo, you can download it to your working environment with a command similar to this:

YOUR_GITHUB_UN="<your GitHub username>"
git clone --depth 1 "git@github.com:${YOUR_GITHUB_UN}/postgres-operator-examples.git"
cd postgres-operator-examples


Step 2: Install PGO, the Postgres Operator

You can install PGO, the Postgres Operator from Crunchy Data, using the command below:

kubectl apply -k kustomize/install/namespace
kubectl apply --server-side -k kustomize/install/default

This will create a namespace called postgres-operator and create all of the objects required to deploy PGO.

To check on the status of your installation, you can run the following command:

kubectl -n postgres-operator get pods \
  --selector=postgres-operator.crunchydata.com/control-plane=postgres-operator \
  --field-selector=status.phase=Running

If the PGO Pod is healthy, you should see output similar to:

NAME                                                          READY   STATUS    RESTARTS      AGE
postgres-operator-9dd545d64-t4h8d   1/1         Running             0              3s







Creating a Postgres Cluster

Create a simple Postgres cluster. Do this by executing the following command:

kubectl apply -k kustomize/postgres

This will create a Postgres cluster named hippo in the postgres-operator namespace. Track the progress of the cluster using the following command:

kubectl -n postgres-operator describe postgresclusters.postgres-operator.crunchydata.com hippo






Connecting to the Postgres cluster

As part of creating a Postgres cluster, the Postgres Operator creates a PostgreSQL user account. The credentials for this account are stored in a Secret that has the name <clusterName>-pguser-<userName>.

Within this Secret are attributes that provide information allow users to log into the PostgreSQL cluster. These include:

    user: The name of the user account.
    password: The password for the user account.
    dbname: The name of the database that the user has access to by default.
    host: The name of the host of the database. This references the Service of the primary Postgres instance.
    port: The port that the database is listening on.
    uri: A PostgreSQL connection URI that provides all the information for logging into the Postgres database.
    jdbc-uri: A PostgreSQL JDBC connection URI that provides all the information for logging into the Postgres database via the JDBC driver.

If you deploy your Postgres cluster with the PgBouncer connection pooler, there are additional values that are populated in the user Secret, including:

    pgbouncer-host: The name of the host of the PgBouncer connection pooler. This references the Service of the PgBouncer connection pooler.
    pgbouncer-port: The port that the PgBouncer connection pooler is listening on.
    pgbouncer-uri: A PostgreSQL connection URI that provides all the information for logging into the Postgres database via the PgBouncer connection pooler.
    pgbouncer-jdbc-uri: A PostgreSQL JDBC connection URI that provides all the information for logging into the Postgres database via the PgBouncer connection pooler using the JDBC driver.

Note that all connections use TLS. PGO sets up a PKI for your Postgres clusters. Users may choose to bring their own PKI / certificate authority.
Connect via psql in the Terminal




Connecting Directly

If users are on the same network as the PostgreSQL cluster, users may connect directly to it using the following command:

psql $(kubectl -n postgres-operator get secrets hippo-pguser-hippo -o go-template='{{.data.uri | base64decode}}')







Connect Using a Port-Forward

In a new terminal, create a port forward:

PG_CLUSTER_PRIMARY_POD=$(kubectl get pod -n postgres-operator -o name \
  -l postgres-operator.crunchydata.com/cluster=hippo,postgres-operator.crunchydata.com/role=master)
kubectl -n postgres-operator port-forward "${PG_CLUSTER_PRIMARY_POD}" 5432:5432


Establish a connection to the PostgreSQL cluster

PG_CLUSTER_USER_SECRET_NAME=hippo-pguser-hippo

PGPASSWORD=$(kubectl get secrets -n postgres-operator "${PG_CLUSTER_USER_SECRET_NAME}" -o go-template='{{.data.password | base64decode}}') \
PGUSER=$(kubectl get secrets -n postgres-operator "${PG_CLUSTER_USER_SECRET_NAME}" -o go-template='{{.data.user | base64decode}}') \
PGDATABASE=$(kubectl get secrets -n postgres-operator "${PG_CLUSTER_USER_SECRET_NAME}" -o go-template='{{.data.dbname | base64decode}}') \
psql -h localhost





Connect an Application
The information provided in the user Secret will allow users to connect an application directly to the PostgreSQL database.
For example, connecting to Keycloak. Keycloak is a popular open source identity management tool that is backed by a PostgreSQL database. Using the hippo cluster created earlier, users may deploy the following manifest file:

cat <<EOF >> keycloak.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: keycloak
  namespace: postgres-operator
  labels:
    app.kubernetes.io/name: keycloak
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: keycloak
  template:
    metadata:
      labels:
        app.kubernetes.io/name: keycloak
    spec:
      containers:
      - image: quay.io/keycloak/keycloak:latest
        name: keycloak
        env:
        - name: DB_VENDOR
          value: "postgres"
        - name: DB_ADDR
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: host } }
        - name: DB_PORT
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: port } }
        - name: DB_DATABASE
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: dbname } }
        - name: DB_USER
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: user } }
        - name: DB_PASSWORD
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: password } }
        - name: KEYCLOAK_USER
          value: "admin"
        - name: KEYCLOAK_PASSWORD
          value: "admin"
        - name: PROXY_ADDRESS_FORWARDING
          value: "true"
        ports:
        - name: http
          containerPort: 8080
        - name: https
          containerPort: 8443
        readinessProbe:
          httpGet:
            path: /auth/realms/master
            port: 8080
      restartPolicy: Always
EOF

kubectl apply -f keycloak.yaml


There is a full example for how to deploy Keycloak with the Postgres Operator in the kustomize/keycloak folder.
More about the postgresclusters custom resource definition below through kubectl explain:

kubectl explain postgresclusters

When referring to a nested object within a YAML manifest, users may use the . format similar to kubectl explain. For example, if users want to refer to the deepest element in the following YAML file:

spec:
  hippos:
    appetite: huge

would state spec.hippos.appetite.
The kubectl explain command is useful here. You may use kubectl explain postgrescluster to introspect the postgrescluster.postgres-operator.crunchydata.com custom resource definition. You can also review the CRD reference.




How to Create a Postgres Cluster

To create a Postgres cluster using the example in the kustomize/postgres directory, all we have to do is run:
kubectl apply -k kustomize/postgres
and PGO will create a simple Postgres cluster named hippo in the postgres-operator namespace. You can track the status of your Postgres cluster using kubectl describe on the postgresclusters.postgres-operator.crunchydata.com custom resource:
kubectl -n postgres-operator describe postgresclusters.postgres-operator.crunchydata.com hippo
and you can track the state of the Postgres Pod using the following command:
kubectl -n postgres-operator get pods \
  --selector=postgres-operator.crunchydata.com/cluster=hippo,postgres-operator.crunchydata.com/instance



PGO created a Postgres cluster based on the information provided to it in the Kustomize manifests located in the kustomize/postgres directory. Let’s better understand what happened by inspecting the kustomize/postgres/postgres.yaml file:
apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1Gi

When running the kubectl apply command earlier, caused the creation of a PostgresCluster custom resource in Kubernetes. PGO detected that a new PostgresCluster resource was added and started to create all the objects needed to run Postgres in Kubernetes.

PGO read the value from metadata.name to provide the Postgres cluster with the name hippo. Additionally, PGO knew which containers to use for Postgres and pgBackRest by looking at the values in spec.image and spec.backups.pgbackrest.image respectively. The value in spec.postgresVersion is important as it will help PGO track which major version of Postgres you are using.

PGO knows how many Postgres instances to create through the spec.instances section of the manifest. While name is optional, opt to provide the name instance1. Created multiple replicas is also possible and instances during cluster initialization. This issues is discussed in the section on how to scale and create a HA Postgres cluster.

A very important piece of the PostgresCluster custom resource is the dataVolumeClaimSpec section. This describes the storage that your Postgres instance will use. It is modeled after the Persistent Volume Claim. If you do not provide a spec.instances.dataVolumeClaimSpec.storageClassName, then the default storage class in your Kubernetes environment is used.

As part of creating a Postgres cluster, users may also specify information about their backup archive. PGO uses pgBackRest, an open source backup and restore tool designed to handle terabyte-scale backups. As part of initializing the cluster, users can specify where they want their backups and archives (write-ahead logs or WAL) stored. The PostgresCluster spec is described in greater depth in the disaster recovery section and also note where users can store backups in Amazon S3, Google GCS, and Azure Blob Storage.






Troubleshooting

PostgreSQL / pgBackRest Pods Stuck in Pending Phase

The most common occurrence of this is due to PVCs not being bound. Ensure that storage options have correctly been configured in any volumeClaimSpec. Users may update their settings and reapply changes with kubectl apply.
Also ensure that enough persistent volumes are available: the Kubernetes administrator may need to provision more. If on OpenShift, the need to set spec.openshift to true may arise.






Connecting to a Postgres Cluster

PGO creates a series of Kubernetes Services to provide stable endpoints for connecting to Postgres databases. These endpoints make it easy to provide a consistent way for applications to maintain connectivity to data. To inspect what services are available, executing the following command:

kubectl -n postgres-operator get svc --selector=postgres-operator.crunchydata.com/cluster=hippo

will yield something similar to:

NAME                 TYPE            CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
hippo-ha             ClusterIP   10.103.73.92   <none>           5432/TCP   3h14m
hippo-ha-config   ClusterIP   None              <none>           <none>       3h14m
hippo-pods        ClusterIP      None               <none>           <none>      3h14m
hippo-primary     ClusterIP   None                <none>          5432/TCP   3h14m
hippo-replicas    ClusterIP   10.98.110.215  <none>         5432/TCP   3h14m

The above services are used to help manage the overall health of the Postgres cluster. For the purposes of connecting to the database, the Service of interest is called hippo-primary. Thanks to PGO, there is no need to maintain the data as that information is captured within a Secret.
When the Postgres cluster is initialized, PGO will bootstrap a database and Postgres user that your application can access. This information is stored in a Secret named with the pattern <clusterName>-pguser-<userName>. In the case of the hippo cluster, this Secret is called hippo-pguser-hippo. This Secret contains the information needed to connect an application to the Postgres database:

    user: The name of the user account.
    password: The password for the user account.
    dbname: The name of the database that the user has access to by default.
    host: The name of the host of the database. This references the Service of the primary Postgres instance.
    port: The port that the database is listening on.
    uri: A PostgreSQL connection URI that provides all the information for logging into the Postgres database.
    jdbc-uri: A PostgreSQL JDBC connection URI that provides all the information for logging into the Postgres database via the JDBC driver.

All connections are over TLS. PGO provides its own certificate authority (CA) to allow you to securely connect your applications to your Postgres clusters. This allows users to use the verify-full “SSL mode” of Postgres, which provides eavesdropping protection and prevents MITM attacks. Users can also choose to provide their own CA.



Modifying Service Type, NodePort Value and Metadata

By default, PGO deploys Services with the ClusterIP Service type. Based on how users wish to expose their database, users may want to modify the Services to use a different Service type and NodePort value.
You can modify the Services that PGO manages from the following attributes:
    spec.service - this manages the Service for connecting to a Postgres primary.
    spec.proxy.pgBouncer.service - this manages the Service for connecting to the PgBouncer connection pooler.
    spec.userInterface.pgAdmin.service - this manages the Service for connecting to the pgAdmin management tool.

For example, say you want to set the Postgres primary to use a NodePort service, a specific nodePort value, and set a specific annotation and label, you would add the following to your manifest:
spec:
  service:
    metadata:
      annotations:
        my-annotation: value1
      labels:
        my-label: value2
    type: NodePort
    nodePort: 32000

For the hippo cluster, you would see the Service type and nodePort modification as well as the annotation and label. For example:
kubectl -n postgres-operator get svc --selector=postgres-operator.crunchydata.com/cluster=hippo
will yield something similar to:

NAME              TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
hippo-ha          NodePort    10.105.57.191   <none>        5432:32000/TCP   48s
hippo-ha-config   ClusterIP   None            <none>        <none>           48s
hippo-pods        ClusterIP   None            <none>        <none>           48s
hippo-primary     ClusterIP   None            <none>        5432/TCP         48s
hippo-replicas    ClusterIP   10.106.18.99    <none>        5432/TCP         48s

and the top of the output from running

kubectl -n postgres-operator describe svc hippo-ha

will show the custom annotation and label have been added:

Name:              hippo-ha
Namespace:         postgres-operator
Labels:            my-label=value2
                   postgres-operator.crunchydata.com/cluster=hippo
                   postgres-operator.crunchydata.com/patroni=hippo-ha
Annotations:       my-annotation: value1


Note that setting the nodePort value is not allowed when using the (default) ClusterIP type, and it must be in-range and not otherwise in use or the operation will fail. Additionally, be aware that any annotations or labels provided here will win in case of conflicts with any annotations or labels a user configures elsewhere.

If exposing Services externally and are relying on TLS verification, you must use the custom TLS features of PGO).








Connecting an Application

Connect to OpenShift's Keycloak, an open source identity management application. Keycloak can be deployed on Kubernetes and is backed by a Postgres database. While we provide an example of deploying Keycloak and a PostgresCluster in the Postgres Operator examples repository, the manifest below deploys it using the previously created hippo cluster that is already running:
kubectl apply --filename=- <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: keycloak
  namespace: postgres-operator
  labels:
    app.kubernetes.io/name: keycloak
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: keycloak
  template:
    metadata:
      labels:
        app.kubernetes.io/name: keycloak
    spec:
      containers:
      - image: quay.io/keycloak/keycloak:latest
        name: keycloak
        env:
        - name: DB_VENDOR
          value: "postgres"
        - name: DB_ADDR
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: host } }
        - name: DB_PORT
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: port } }
        - name: DB_DATABASE
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: dbname } }
        - name: DB_USER
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: user } }
        - name: DB_PASSWORD
          valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: password } }
        - name: KEYCLOAK_USER
          value: "admin"
        - name: KEYCLOAK_PASSWORD
          value: "admin"
        - name: PROXY_ADDRESS_FORWARDING
          value: "true"
        ports:
        - name: http
          containerPort: 8080
        - name: https
          containerPort: 8443
        readinessProbe:
          httpGet:
            path: /auth/realms/master
            port: 8080
      restartPolicy: Always
EOF

Note below the part of the manifest:

- name: DB_ADDR
  valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: host } }
- name: DB_PORT
  valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: port } }
- name: DB_DATABASE
  valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: dbname } }
- name: DB_USER
  valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: user } }
- name: DB_PASSWORD
  valueFrom: { secretKeyRef: { name: hippo-pguser-hippo, key: password } }

The above manifest shows how all of these values are derived from the hippo-pguser-hippo Secret. This means that users do not need to know any of the connection credentials or have to insecurely pass them around since they are directly available to the application.

Using this method, you can tie applications directly into your GitOps pipeline that connect to Postgres without any prior knowledge of how PGO will deploy Postgres: all of the information your application needs is propagated into the Secret.






System Limitations to Consider

    The database storage disk fails or some other hardware failure occurs
    The network on which the database resides becomes unreachable
    The host operating system becomes unstable and crashes
    A key database file becomes corrupted
    A data center is lost
    A Kubernetes component (e.g. a Service) is accidentally deleted

There may also be downtime events that are due to the normal case of operations, such as performing a minor upgrade, security patching of operating system, hardware upgrade, or other maintenance.








The HA Postgres and Adding Replicas to your Postgres Cluster

PGO provides several ways to add replicas to make a HA cluster:

    Increase the spec.instances.replicas value
    Add an additional entry in spec.instances

For the purposes of this tutorial, we will go with the first method and set spec.instances.replicas to 2. Your manifest should look similar to:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1Gi

Apply these updates to a Postgres cluster with the following command:

kubectl apply -k kustomize/postgres

Shortly thereafter a new Postgres instance initializes. Observe the various Postgres Pods for the hippo cluster by running the following command:

kubectl -n postgres-operator get pods \
  --selector=postgres-operator.crunchydata.com/cluster=hippo,postgres-operator.crunchydata.com/instance-set








General Testing 

To test high availability set up follow the instructions below for testing an HA Cluster. An important part of building a resilient Postgres environment is testing its resiliency.

Test #1: Remove a Service

kubectl -n postgres-operator get svc \
  --selector=postgres-operator.crunchydata.com/cluster=hippo
  
yields something similar to the following:

NAME              TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
hippo-ha          ClusterIP   10.103.73.92   <none>        5432/TCP   4h8m
hippo-ha-config   ClusterIP   None           <none>        <none>     4h8m
hippo-pods        ClusterIP   None           <none>        <none>     4h8m
hippo-primary     ClusterIP   None           <none>        5432/TCP   4h8m
hippo-replicas    ClusterIP   10.98.110.215  <none>        5432/TCP   4h8m

Note the application is connected to the hippo-primary Service. Now, attempt to Delete the Service.

kubectl -n postgres-operator delete svc hippo-primary

Run the above selector once again:

kubectl -n postgres-operator get svc \
  --selector=postgres-operator.crunchydata.com/cluster=hippo

You should see something similar to the following:

NAME              TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
hippo-ha          ClusterIP   10.103.73.92   <none>        5432/TCP   4h8m
hippo-ha-config   ClusterIP   None           <none>        <none>     4h8m
hippo-pods        ClusterIP   None           <none>        <none>     4h8m
hippo-primary     ClusterIP   None           <none>        5432/TCP   3s
hippo-replicas    ClusterIP   10.98.110.215  <none>        5432/TCP   4h8m

PGO detected that the primary Service was deleted and it recreated it.



Test #2: Remove the Primary StatefulSet

StatefulSets are a Kubernetes object that provide helpful mechanisms for managing Pods that interface with stateful applications, such as databases. They provide a stable mechanism for managing Pods to help ensure data is retrievable in a predictable way.

Try to remove the StatefulSet that is pointed to the Pod that represents the Postgres primary.
First, determine which Pod is the primary. We’ll store it in an environmental variable for convenience.

PRIMARY_POD=$(kubectl -n postgres-operator get pods \
  --selector=postgres-operator.crunchydata.com/role=master \
  -o jsonpath='{.items[*].metadata.labels.postgres-operator\.crunchydata\.com/instance}')
  
Inspect the environmental variable to see which Pod is the current primary:

echo $PRIMARY_POD

should yield something similar to:

hippo-instance1-zj5s

We can use the value above to delete the StatefulSet associated with the current Postgres primary instance:

kubectl delete sts -n postgres-operator "${PRIMARY_POD}"

Try getting all of the StatefulSets for the Postgres instances in the hippo cluster:

kubectl get sts -n postgres-operator \
  --selector=postgres-operator.crunchydata.com/cluster=hippo,postgres-operator.crunchydata.com/instance
  
You should see something similar to the following:

NAME                   READY   AGE
hippo-instance1-6kbw   1/1     15m
hippo-instance1-zj5s   0/1     1s

PGO recreated the StatefulSet that was deleted. After this disastrous event, PGO proceeds to heal the Postgres instance so it can rejoin the cluster. 

Check the other instance. We can see that it became the new primary though the following command:

kubectl -n postgres-operator get pods \
  --selector=postgres-operator.crunchydata.com/role=master \
  -o jsonpath='{.items[*].metadata.labels.postgres-operator\.crunchydata\.com/instance}'

which should yield something similar to:

hippo-instance1-6kbw

Test that the failover successfully occurred in a few ways. You can connect to the example Keycloak application that we deployed in the previous section. Based on Keycloak’s connection retry logic, you may need to wait a moment for it to reconnect, but you will see it connected and resume being able to read and write data. You can also connect to the Postgres instance directly and execute the following command:

SELECT NOT pg_catalog.pg_is_in_recovery() is_primary;

If it returns true (or t), then the Postgres instance is a primary.

Check if PGO was down during the downtime event. 
Note that failover would still occur because the Postgres HA system works independently of PGO and can maintain its own uptime. PGO will still need to assist with some of the healing aspects, but your application will still maintain read/write connectivity to your Postgres cluster.






Synchronous Replication

Synchronous replication is a replication mode designed to limit the risk of transaction loss. Synchronous replication waits for a transaction to be written to at least one additional server before it considers the transaction to be committed. For more information on synchronous replication, please read about PGO’s high availability architecture

To add synchronous replication to your Postgres cluster, you can add the following to your spec:

spec:
  patroni:
    dynamicConfiguration:
      synchronous_mode: true

While PostgreSQL defaults synchronous_commit to on, you may also want to explicitly set it, in which case the above block becomes:


spec:
  patroni:
    dynamicConfiguration:
      synchronous_mode: true
      postgresql:
        parameters:
          synchronous_commit: "on"

Note that Patroni, which manages many aspects of the cluster’s availability, will favor availability over synchronicity. This means that if a synchronous replica goes down, Patroni will allow for asynchronous replication to continue as well as writes to the primary. However, if you want to disable all writing if there are no synchronous replicas available, you would have to enable synchronous_mode_strict, i.e.:

spec:
  patroni:
    dynamicConfiguration:
      synchronous_mode: true
      synchronous_mode_strict: true


Kubernetes affinity rules, which include Pod anti-affinity and Node affinity, can help you to define where you want your workloads to reside. Pod anti-affinity is important for high availability: when used correctly, it ensures that your Postgres instances are distributed amongst different Nodes. Node affinity can be used to assign instances to specific Nodes, e.g. to utilize hardware that’s optimized for databases.






Pod Labels

PGO sets up several labels for Postgres cluster management that can be used for Pod anti-affinity or affinity rules in general. These include:

    postgres-operator.crunchydata.com/cluster: This is assigned to all managed Pods in a Postgres cluster. The value of this label is the name of your Postgres cluster, in this case: hippo.
    postgres-operator.crunchydata.com/instance-set: This is assigned to all Postgres instances within a group of spec.instances. In the example above, the value of this label is instance1. If you do not assign a label, the value is automatically set by PGO using a NN format, e.g. 00.
    postgres-operator.crunchydata.com/instance: This is a unique label assigned to each Postgres instance containing the name of the Postgres instance.

Let’s look at how we can set up affinity rules for our Postgres cluster to help improve high availability.



Kubernetes has two types of Pod anti-affinity:

    Preferred: With preferred (preferredDuringSchedulingIgnoredDuringExecution) Pod anti-affinity, Kubernetes will make a best effort to schedule Pods matching the anti-affinity rules to different Nodes. However, if it is not possible to do so, then Kubernetes may schedule one or more Pods to the same Node.
    Required: With required (requiredDuringSchedulingIgnoredDuringExecution) Pod anti-affinity, Kubernetes mandates that each Pod matching the anti-affinity rules must be scheduled to different Nodes. However, a Pod may not be scheduled if Kubernetes cannot find a Node that does not contain a Pod matching the rules.

There is a trade-off with these two types of pod anti-affinity: while “required” anti-affinity will ensure that all the matching Pods are scheduled on different Nodes, if Kubernetes cannot find an available Node, your Postgres instance may not be scheduled. Likewise, while “preferred” anti-affinity will make a best effort to scheduled your Pods on different Nodes, Kubernetes may compromise and schedule more than one Postgres instance of the same cluster on the same Node.

By understanding these trade-offs, the makeup of your Kubernetes cluster, and your requirements, you can choose the method that makes the most sense for your Postgres deployment. We’ll show examples of both methods below.

Deploy your Postgres cluster with preferred Pod anti-affinity. Note that if you have a single-node Kubernetes cluster, you will not see your Postgres instances deployed to different nodes. However, your Postgres instances will be deployed.

Users may set up their HA Postgres cluster with preferred Pod anti-affinity as shown below:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 1
            podAffinityTerm:
              topologyKey: kubernetes.io/hostname
              labelSelector:
                matchLabels:
                  postgres-operator.crunchydata.com/cluster: hippo
                  postgres-operator.crunchydata.com/instance-set: instance1
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1Gi

Apply those changes in your Kubernetes cluster.

affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
    - weight: 1
      podAffinityTerm:
        topologyKey: kubernetes.io/hostname
        labelSelector:
          matchLabels:
            postgres-operator.crunchydata.com/cluster: hippo
            postgres-operator.crunchydata.com/instance-set: instance1

spec.instances.affinity.podAntiAffinity follows the standard Kubernetes Pod anti-affinity spec. The values for the matchLabels are derived from what we described in the previous section: postgres-operator.crunchydata.com/cluster is set to our cluster name of hippo, and postgres-operator.crunchydata.com/instance-set is set to the instance set name of instance1. We choose a topologyKey of kubernetes.io/hostname, which is standard in Kubernetes clusters.

Preferred Pod anti-affinity will perform a best effort to schedule your Postgres Pods to different nodes. Let’s see how you can require your Postgres Pods to be scheduled to different nodes.

Required Pod anti-affinity forces Kubernetes to scheduled your Postgres Pods to different Nodes. Note that if Kubernetes is unable to schedule all Pods to different Nodes, some of your Postgres instances may become unavailable.

Using the previous example, let’s indicate to Kubernetes that we want to use required Pod anti-affinity for our Postgres clusters:
apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: kubernetes.io/hostname
            labelSelector:
              matchLabels:
                postgres-operator.crunchydata.com/cluster: hippo
                postgres-operator.crunchydata.com/instance-set: instance1
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1Gi


Apply those changes in your Kubernetes cluster.

If you are in single Node Kubernetes clusters, you will notice that not all of your Postgres instance Pods will be scheduled. This is due to the requiredDuringSchedulingIgnoredDuringExecution preference. However, if you have enough Nodes available, you will see the Postgres instance Pods scheduled to different Nodes:

kubectl get pods -n postgres-operator -o wide \
  --selector=postgres-operator.crunchydata.com/cluster=hippo,postgres-operator.crunchydata.com/instance


Node affinity can be used to assign your Postgres instances to Nodes with specific hardware or to guarantee a Postgres instance resides in a specific zone. Node affinity can be set within the spec.instances.affinity.nodeAffinity attribute, following the standard Kubernetes node affinity spec.

Let’s see an example with required Node affinity. Let’s say we have a set of Nodes that are reserved for database usage that have a label workload-role=db. We can create a Postgres cluster with a required Node affinity rule to scheduled all of the databases to those Nodes using the following configuration:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: workload-role
                operator: In
                values:
                - db
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1Gi


In addition to affinity and anti-affinity settings, Kubernetes Pod Topology Spread Constraints can also help you to define where you want your workloads to reside. However, while PodAffinity allows any number of Pods to be added to a qualifying topology domain, and PodAntiAffinity allows only one Pod to be scheduled into a single topology domain, topology spread constraints allow you to distribute Pods across different topology domains with a finer level of control.

The spread constraint API fields can be configured for instance, PgBouncer and pgBackRest repo host pods. The basic configuration is as follows:

      topologySpreadConstraints:
      - maxSkew: <integer>
        topologyKey: <string>
        whenUnsatisfiable: <string>
        labelSelector: <object>

where "maxSkew" describes the maximum degree to which Pods can be unevenly distributed, "topologyKey" is the key that defines a topology in the Nodes' Labels, "whenUnsatisfiable" specifies what action should be taken when "maxSkew" can’t be satisfied, and "labelSelector" is used to find matching Pods.


To help illustrate how you might use this with your cluster, we can review examples for configuring spread constraints on our Instance and pgBackRest repo host Pods. For this example, assume we have a three node Kubernetes cluster where the first node is labeled with my-node-label=one, the second node is labeled with my-node-label=two and the final node is labeled my-node-label=three. The label key my-node-label will function as our topologyKey. Note all three nodes in our examples will be schedulable, so a Pod could live on any of the three Nodes.

You can set your topology spread constraints on our cluster Instance Pods. Given this configuration

  instances:
    - name: instance1
      replicas: 5
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: my-node-label
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              postgres-operator.crunchydata.com/instance-set: instance1

we will expect 5 Instance pods to be created. Each of these Pods will have the standard postgres-operator.crunchydata.com/instance-set: instance1 Label set, so each Pod will be properly counted when determining the maxSkew. Since we have 3 nodes with a maxSkew of 1 and we’ve set whenUnsatisfiable to DoNotSchedule, we should see 2 Pods on 2 of the nodes and 1 Pod on the remaining Node, thus ensuring our Pods are distributed as evenly as possible.





pgBackRest Repo Pod Spread Constraints

We can also set topology spread constraints on our cluster’s pgBackRest repo host pod. While we normally will only have a single pod per cluster, we could use a more generic label to add a preference that repo host Pods from different clusters are distributed among our Nodes. For example, by setting our matchLabel value to postgres-operator.crunchydata.com/pgbackrest: "" and our whenUnsatisfiable value to ScheduleAnyway, we will allow our repo host Pods to be scheduled no matter what Nodes may be available, but attempt to minimize skew as much as possible.

      repoHost:
        topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: my-node-label
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              postgres-operator.crunchydata.com/pgbackrest: ""

Putting it All Together

Now that each of our Pods has our desired Topology Spread Constraints defined, let’s put together a complete cluster definition:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 5
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: my-node-label
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              postgres-operator.crunchydata.com/instance-set: instance1
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1G
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repoHost:
        topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: my-node-label
          whenUnsatisfiable: ScheduleAnyway
          labelSelector:
            matchLabels:
              postgres-operator.crunchydata.com/pgbackrest: ""
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1G

You can then apply those changes in your Kubernetes cluster.

Once your cluster finishes deploying, you can check that your Pods are assigned to the correct Nodes:

kubectl get pods -n postgres-operator -o wide --selector=postgres-operator.crunchydata.com/cluster=hippo





Resize a Postgres Cluster

You did it – the application is a success. Traffic is booming, so much so that you need to add more resources to your Postgres cluster. However, you’re worried that any resize operation may cause downtime and create a poor experience for your end users.

This is where PGO comes in: PGO will help orchestrate rolling out any potentially disruptive changes to your cluster to minimize or eliminate and downtime for your application. To do so, we will assume that you have deployed a high availability Postgres cluster as described in the previous section.

Memory and CPU resources are an important component for vertically scaling your Postgres cluster. Coupled with tweaks to your Postgres configuration file, allocating more memory and CPU to your cluster can help it to perform better under load.

It’s important for instances in the same high availability set to have the same resources. PGO lets you adjust CPU and memory within the resources sections of the postgresclusters.postgres-operator.crunchydata.com custom resource. These include:

    spec.instances.resources section, which sets the resource values for the PostgreSQL container, as well as any init containers in the associated pod and containers created by the pgDataVolume and pgWALVolume data migration jobs.
    spec.instances.sidecars.replicaCertCopy.resources section, which sets the resources for the replica-cert-copy sidecar container.
    spec.monitoring.pgmonitor.exporter.resources section, which sets the resources for the exporter sidecar container.
    spec.backups.pgbackrest.repoHost.resources section, which sets the resources for the pgBackRest repo host container, as well as any init containers in the associated pod and containers created by the pgBackRestVolume data migration job.
    spec.backups.pgbackrest.sidecars.pgbackrest.resources section, which sets the resources for the pgbackrest sidecar container.
    spec.backups.pgbackrest.sidecars.pgbackrestConfig.resources section, which sets the resources for the pgbackrest-config sidecar container.
    spec.backups.pgbackrest.jobs.resources section, which sets the resources for any pgBackRest backup job.
    spec.backups.pgbackrest.restore.resources section, which sets the resources for manual pgBackRest restore jobs.
    spec.dataSource.postgresCluster.resources section, which sets the resources for pgBackRest restore jobs created during the cloning process.
    spec.proxy.pgBouncer.resources section, which sets the resources for the pgbouncer container.
    spec.proxy.pgBouncer.sidecars.pgbouncerConfig.resources section, which sets the resources for the pgbouncer-config sidecar container.

The layout of these resources sections should be familiar: they follow the same pattern as the standard Kubernetes structure for setting container resources. Note that these settings also allow for the configuration of QoS classes.

For example, using the spec.instances.resources section, let’s say we want to update our hippo Postgres cluster so that each instance has a limit of 2.0 CPUs and 4Gi of memory. We can make the following changes to the manifest:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      resources:
        limits:
          cpu: 2.0
          memory: 4Gi
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1Gi


We added the following to spec.instances:

resources:
  limits:
    cpu: 2.0
    memory: 4Gi

Apply these updates to your Postgres cluster with the following command:

kubectl apply -k kustomize/postgres

Now, let’s watch how the rollout happens:

watch "kubectl -n postgres-operator get pods \
  --selector=postgres-operator.crunchydata.com/cluster=hippo,postgres-operator.crunchydata.com/instance \
  -o=jsonpath='{range .items[*]}{.metadata.name}{\"\t\"}{.metadata.labels.postgres-operator\.crunchydata\.com/role}{\"\t\"}{.status.phase}{\"\t\"}{.spec.containers[].resources.limits}{\"\n\"}{end}'"


Observe how each Pod is terminated one-at-a-time. This is part of a “rolling update”. Because updating the resources of a Pod is a destructive action, PGO first applies the CPU and memory changes to the replicas. PGO ensures that the changes are successfully applied to a replica instance before moving on to the next replica.

Once all of the changes are applied, PGO will perform a “controlled switchover”: it will promote a replica to become a primary, and apply the changes to the final Postgres instance.

By rolling out the changes in this way, PGO ensures there is minimal to zero disruption to your application: you are able to successfully roll out updates.





Resize PVC

Your application is a success. Your data continues to grow, and it’s becoming apparently that you need more disk. That’s great: you can resize your PVC directly on your postgresclusters.postgres-operator.crunchydata.com custom resource with minimal to zero downtime.

PVC resizing, also known as volume expansion, is a function of your storage class: it must support volume resizing. Additionally, PVCs can only be sized up: you cannot shrink the size of a PVC.

You can adjust PVC sizes on all of the managed storage instances in a Postgres instance that are using Kubernetes storage. These include:

    spec.instances.dataVolumeClaimSpec.resources.requests.storage: The Postgres data directory (aka your database).
    spec.backups.pgbackrest.repos.volume.volumeClaimSpec.resources.requests.storage: The pgBackRest repository when using “volume” storage

The above should be familiar: it follows the same pattern as the standard Kubernetes PVC structure.

For example, let’s say we want to update our hippo Postgres cluster so that each instance now uses a 10Gi PVC and our backup repository uses a 20Gi PVC. We can do so with the following markup:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      resources:
        limits:
          cpu: 2.0
          memory: 4Gi
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 10Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 20Gi

We added the following to spec.instances:

dataVolumeClaimSpec:
  resources:
    requests:
      storage: 10Gi

and added the following to spec.backups.pgbackrest.repos.volume:

volumeClaimSpec:
  accessModes:
  - "ReadWriteOnce"
  resources:
    requests:
      storage: 20Gi

Apply these updates to your Postgres cluster with the following command:

kubectl apply -k kustomize/postgres


Not all Kubernetes Storage Classes allow for volume expansion. However, with PGO, you can still resize your Postgres cluster data volumes even if your storage class does not allow it.

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      resources:
        limits:
          cpu: 2.0
          memory: 4Gi
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 20Gi

First, create a new instance that has the larger volume size. 
Call this instance instance2. The manifest would look like this:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      resources:
        limits:
          cpu: 2.0
          memory: 4Gi
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
    - name: instance2
      replicas: 2
      resources:
        limits:
          cpu: 2.0
          memory: 4Gi
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 10Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 20Gi

Take note of the block that contains instance2:

- name: instance2
  replicas: 2
  resources:
    limits:
      cpu: 2.0
      memory: 4Gi
  dataVolumeClaimSpec:
    accessModes:
    - "ReadWriteOnce"
    resources:
      requests:
        storage: 10Gi


The above creates a second set of two Postgres instances, both of which come up as replicas, that have a larger PVC.

Once this new instance set is available and they are caught to the primary, you can then apply the following manifest:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance2
      replicas: 2
      resources:
        limits:
          cpu: 2.0
          memory: 4Gi
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 10Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 20Gi

This will promote one of the instances with the larger PVC to be the new primary and remove the instances with the smaller PVCs.

This method can also be used to shrink PVCs to use a smaller amount.

There are many reasons why a PostgreSQL Pod may not be scheduled:

    Resources are unavailable. Ensure that you have a Kubernetes Node with enough resources to satisfy your memory or CPU Request.
    PVC cannot be provisioned. Ensure that you request a PVC size that is available, or that your PVC storage class is set up correctly.


Ensure that your storage class supports PVC resizing. You can check that by inspecting the allowVolumeExpansion attribute:

kubectl get sc

If the storage class does not support PVC resizing, you can use the technique described above to resize PVCs using a second instance set.





Customize a Postgres Cluster

Part of the trick of managing multiple instances in a Postgres cluster is ensuring all of the configuration changes are propagated to each of them. This is where PGO helps: when you make a Postgres configuration change for a cluster, PGO will apply it to all of the Postgres instances.

For example, in our previous step we added CPU and memory limits of 2.0 and 4Gi respectively. Let’s tweak some of the Postgres settings to better use our new resources. We can do this in the spec.patroni.dynamicConfiguration section. Here is an example updated manifest that tweaks several settings:

apiVersion: postgres-operator.crunchydata.com/v1beta1
kind: PostgresCluster
metadata:
  name: hippo
spec:
  image: registry.developers.crunchydata.com/crunchydata/crunchy-postgres:ubi8-14.6-2
  postgresVersion: 14
  instances:
    - name: instance1
      replicas: 2
      resources:
        limits:
          cpu: 2.0
          memory: 4Gi
      dataVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi
  backups:
    pgbackrest:
      image: registry.developers.crunchydata.com/crunchydata/crunchy-pgbackrest:ubi8-2.41-2
      repos:
      - name: repo1
        volume:
          volumeClaimSpec:
            accessModes:
            - "ReadWriteOnce"
            resources:
              requests:
                storage: 1Gi
  patroni:
    dynamicConfiguration:
      postgresql:
        parameters:
          max_parallel_workers: 2
          max_worker_processes: 2
          shared_buffers: 1GB
          work_mem: 2MB

In particular, we added the following to spec:

patroni:
  dynamicConfiguration:
    postgresql:
      parameters:
        max_parallel_workers: 2
        max_worker_processes: 2
        shared_buffers: 1GB
        work_mem: 2MB

Apply these updates to your Postgres cluster with the following command:

kubectl apply -k kustomize/postgres

PGO will go and apply these settings, restarting each Postgres instance when necessary. You can verify that the changes are present using the Postgres SHOW command, e.g.

SHOW work_mem;

should yield something similar to:

 work_mem
----------
 2MB


All connections in PGO use TLS to encrypt communication between components. PGO sets up a PKI and certificate authority (CA) that allow you create verifiable endpoints. However, you may want to bring a different TLS infrastructure based upon your organizational requirements. The good news: PGO lets you do this.

If you want to use the TLS infrastructure that PGO provides, you can skip the rest of this section and move on to learning how to apply software updates.


There are a few different TLS endpoints that can be customized for PGO, including those of the Postgres cluster and controlling how Postgres instances authenticate with each other. Let’s look at how we can customize TLS.

Your TLS certificate should have a Common Name (CN) setting that matches the primary Service name. This is the name of the cluster suffixed with -primary. For example, for our hippo cluster this would be hippo-primary.

To customize the TLS for a Postgres cluster, you will need to create a Secret in the Namespace of your Postgres cluster that contains the TLS key (tls.key), TLS certificate (tls.crt) and the CA certificate (ca.crt) to use. The Secret should contain the following values:

data:
  ca.crt: <value>
  tls.crt: <value>
  tls.key: <value>

For example, if you have files named ca.crt, hippo.key, and hippo.crt stored on your local machine, you could run the following command:

kubectl create secret generic -n postgres-operator hippo.tls \
  --from-file=ca.crt=ca.crt \
  --from-file=tls.key=hippo.key \
  --from-file=tls.crt=hippo.crt

You can specify the custom TLS Secret in the spec.customTLSSecret.name field in your postgrescluster.postgres-operator.crunchydata.com custom resource, e.g.:

spec:
  customTLSSecret:
    name: hippo.tls

If you’re unable to control the key-value pairs in the Secret, you can create a mapping that looks similar to this:

spec:
  customTLSSecret:
    name: hippo.tls
    items:
      - key: <tls.crt key>
        path: tls.crt
      - key: <tls.key key>
        path: tls.key
      - key: <ca.crt key>
        path: ca.crt

If spec.customTLSSecret is provided you must also provide spec.customReplicationTLSSecret and both must contain the same ca.crt.

As with the other changes, you can roll out the TLS customizations with kubectl apply.


There are several ways to add your own custom Kubernetes Labels to your Postgres cluster.

    Cluster: You can apply labels to any PGO managed object in a cluster by editing the spec.metadata.labels section of the custom resource.
    Postgres: You can apply labels to a Postgres instance set and its objects by editing spec.instances.metadata.labels.
    pgBackRest: You can apply labels to pgBackRest and its objects by editing postgresclusters.spec.backups.pgbackrest.metadata.labels.
    PgBouncer: You can apply labels to PgBouncer connection pooling instances by editing spec.proxy.pgBouncer.metadata.labels.


There are several ways to add your own custom Kubernetes Annotations to your Postgres cluster.

    Cluster: You can apply annotations to any PGO managed object in a cluster by editing the spec.metadata.annotations section of the custom resource.
    Postgres: You can apply annotations to a Postgres instance set and its objects by editing spec.instances.metadata.annotations.
    pgBackRest: You can apply annotations to pgBackRest and its objects by editing spec.backups.pgbackrest.metadata.annotations.
    PgBouncer: You can apply annotations to PgBouncer connection pooling instances by editing spec.proxy.pgBouncer.metadata.annotations.



PGO allows for pod priority classes to indicate the relative importance of a pod by setting a priorityClassName field on your Postgres cluster. This can be done as follows:

    Instances: Priority is defined per instance set and is applied to all Pods in that instance set by editing the spec.instances.priorityClassName section of the custom resource.
    Dedicated Repo Host: Priority defined under the repoHost section of the spec is applied to the dedicated repo host by editing the spec.backups.pgbackrest.repoHost.priorityClassName section of the custom resource.
    PgBouncer: Priority is defined under the pgBouncer section of the spec and will apply to all PgBouncer Pods by editing the spec.proxy.pgBouncer.priorityClassName section of the custom resource.
    Backup (manual and scheduled): Priority is defined under the spec.backups.pgbackrest.jobs.priorityClassName section and applies that priority to all pgBackRest backup Jobs (manual and scheduled).
    Restore (data source or in-place): Priority is defined for either a “data source” restore or an in-place restore by editing the spec.dataSource.postgresCluster.priorityClassName section of the custom resource.
    Data Migration: The priority defined for the first instance set in the spec (array position 0) is used for the PGDATA and WAL migration Jobs. The pgBackRest repo migration Job will use the priority class applied to the repoHost.


PostgreSQL commits transactions by storing changes in its Write-Ahead Log (WAL). Because the way WAL files are accessed and utilized often differs from that of data files, and in high-performance situations, it can desirable to put WAL files on separate storage volume. With PGO, this can be done by adding the walVolumeClaimSpec block to your desired instance in your PostgresCluster spec, either when your cluster is created or anytime thereafter:

spec:
  instances:
    - name: instance
      walVolumeClaimSpec:
        accessModes:
        - "ReadWriteOnce"
        resources:
          requests:
            storage: 1Gi

This volume can be removed later by removing the walVolumeClaimSpec section from the instance. Note that when changing the WAL directory, care is taken so as not to lose any WAL files. PGO only deletes the PVC once there are no longer any WAL files on the previously configured volume.



PGO allows you to configure custom sidecar Containers for your PostgreSQL instance and pgBouncer Pods.

To use the custom sidecar features, currently in Alpha, you will need to enable them via the PGO feature gate.

PGO feature gates are enabled by setting the PGO_FEATURE_GATES environment variable on the PGO Deployment. For a feature named ‘FeatureName’, that would look like

PGO_FEATURE_GATES="FeatureName=true"

Please note that it is possible to enable more than one feature at a time as this variable accepts a comma delimited list, for example:

PGO_FEATURE_GATES="FeatureName=true,FeatureName2=true,FeatureName3=true..."


To configure custom sidecar Containers for any of your PostgreSQL instance Pods you will need to enable that feature via the PGO feature gate.

As mentioned above, PGO feature gates are enabled by setting the PGO_FEATURE_GATES environment variable on the PGO Deployment. For the PostgreSQL instance sidecar container feature, that will be

PGO_FEATURE_GATES="InstanceSidecars=true"

Once this feature is enabled, you can add your custom Containers as an array to spec.instances.containers. See the custom sidecar example below for more information.

Similar to your PostgreSQL instance Pods, to configure custom sidecar Containers for your pgBouncer Pods you will need to enable it via the PGO feature gate.

As mentioned above, PGO feature gates are enabled by setting the PGO_FEATURE_GATES environment variable on the PGO Deployment. For the pgBouncer custom sidecar container feature, that will be

PGO_FEATURE_GATES="PGBouncerSidecars=true"

Once this feature is enabled, you can add your custom Containers as an array to spec.proxy.pgBouncer.containers. See the custom sidecar example below for more information.




Database Initialization SQL

PGO can run SQL for you as part of the cluster creation and initialization process. PGO runs the SQL using the psql client so you can use meta-commands to connect to different databases, change error handling, or set and use variables. Its capabilities are described in the psql documentation.
Initialization SQL ConfigMap

The Postgres cluster spec accepts a reference to a ConfigMap containing your init SQL file. Update your cluster spec to include the ConfigMap name, spec.databaseInitSQL.name, and the data key, spec.databaseInitSQL.key, for your SQL file. For example, if you create your ConfigMap with the following command:

kubectl -n postgres-operator create configmap hippo-init-sql --from-file=init.sql=/path/to/init.sql

Users would add the following section to their Postgrescluster spec:

spec:
  databaseInitSQL:
    key: init.sql
    name: hippo-init-sql


The ConfigMap must exist in the same namespace as your Postgres cluster.

After you add the ConfigMap reference to your spec, apply the change with kubectl apply -k kustomize/postgres. PGO will create your hippo cluster and run your initialization SQL once the cluster has started. You can verify that your SQL has been run by checking the databaseInitSQL status on your Postgres cluster. While the status is set, your init SQL will not be run again. You can check cluster status with the kubectl describe command:

kubectl -n postgres-operator describe postgresclusters.postgres-operator.crunchydata.com hippo


In some cases, due to the way Kubernetes treats PostgresCluster status, PGO may run your SQL commands more than once. Please ensure that the commands defined in your init SQL are idempotent.

Now that databaseInitSQL is defined in your cluster status, verify database objects have been created as expected. After verifying, we recommend removing the spec.databaseInitSQL field from your spec. Removing the field from the spec will also remove databaseInitSQL from the cluster status.

PGO uses the psql interactive terminal to execute SQL statements in your database. Statements are passed in using standard input and the filename flag (e.g. psql -f -).

SQL statements are executed as superuser in the default maintenance database. This means you have full control to create database objects, extensions, or run any SQL statements that you might need.


If you are creating users or databases, please see the User/Database Management documentation. Databases created through the user management section of the spec can be referenced in your initialization sql. For example, if a database zoo is defined:

spec:
  users:
    - name: hippo
      databases:
       - "zoo"


Users can connect to zoo by adding the following psql meta-command to your SQL:

\c zoo
create table t_zoo as select s, md5(random()::text) from generate_Series(1,5) s;


By default, psql commits each SQL command as it completes. To combine multiple commands into a single transaction, use the BEGIN and COMMIT commands.

BEGIN;
create table t_random as select s, md5(random()::text) from generate_Series(1,5) s;
COMMIT;

PSQL Exit Code and Database Init SQL Status

The exit code from psql will determine when the databaseInitSQL status is set. When psql returns 0 the status will be set and SQL will not be run again. When psql returns with an error exit code the status will not be set. PGO will continue attempting to execute the SQL as part of its reconcile loop until psql returns normally. If psql exits with a failure, you will need to edit the file in your ConfigMap to ensure your SQL statements will lead to a successful psql return. The easiest way to make live changes to your ConfigMap is to use the following kubectl edit command:

kubectl -n <cluster-namespace> edit configmap hippo-init-sql

Be sure to transfer any changes back over to your local file. Another option is to make changes in your local file and use kubectl --dry-run to create a template and pipe the output into kubectl apply:


kubectl create configmap hippo-init-sql --from-file=init.sql=/path/to/init.sql --dry-run=client -o yaml | kubectl apply -f -


If you edit your ConfigMap and your changes aren’t showing up, you may be waiting for PGO to reconcile your cluster. After some time, PGO will automatically reconcile the cluster or you can trigger reconciliation by applying any change to your cluster (e.g. with kubectl apply -k kustomize/postgres).

To ensure that psql returns a failure exit code when your SQL commands fails.
