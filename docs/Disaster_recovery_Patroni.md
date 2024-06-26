# CCBC Disaster Recovery Testing with Patroni

### Recommendations: 

From the Patroni Commands Reference below it is highly recommended that you 
run any ONE of the following commands in order to test disaster recovery on crunchy cluster.
Note the Dev Team testing was restricted to performing #8 below.

[3](#3-patronictl-switchover). `patronictl switchover`

[7](#7-patronictl-restart). `patronictl restart`

[8](#8-patronictl-reinit). `patronictl reinit`



## Patroni Commands Reference

### What is Patroni used for?

Patroni is an open source solution that provides for PostgreSQL High Availability.
Users may setup production Postgres clusters with High Availability & Disaster Recovery.
Patroni is a cluster manager tool used for customizing and 
automating deployment and maintenance of high availability PostgreSQL clusters.
Patroni comes with a CLI utility named 'patronictl'. 
Users can perform any admin operation related to Postgres databases
or clusters using this command line utility.

Below are some commands often used by Postgres administrator using Patroni:



#### 1. `patronictl edit-config`

To edit postgres configuration parameters users can use the edit-config command.
It will open configuration file in editor and will validate all parameters 
before saving it.

When to use:

When users want to change postgres configuration you can use edit-config command.

How to use:

Assuming you have: /etc/patroni/patroni.yaml as the configuration file for patroni

`patronictl -c /etc/patroni/patroni.yaml edit-config`



#### 2. `patronictl reload`

This command will reload parameters from configuration file and 
takes required action such as restart on cluster nodes.

When to use:

If you have changed parameters in configuration file using edit-config 
you can use reload command for parameters to take effect

How to use:

Assuming you have: patroni_cluster as name of your cluster

`patronictl -c /etc/patroni/patroni.yaml reload patroni_cluster`



#### 3. `patronictl switchover`

It will make selected replica as master node basically will switch 
all traffic to new selected node.
We can have planned switchover at particular time as well.

When to use:

If you have maintenance for master node you can switchover master to 
another node in the cluster

How to use:

switchover will ask for node to switchover and also time for switchover

`patronictl -c /etc/patroni/patroni.yaml switchover`



#### 4. `patronictl pause`

Patroni will stop managing postgres cluster and will turn on the maintenance mode.
If you want to do some manual activities for maintenance you 
must stop patroni from auto managing the cluster.

When to use:

If you want to put cluster in maintenance mode, you can use pause command

How to use:

`patronictl -c /etc/patroni/patroni.yaml pause`



#### 5. `patronictl resume`

It will start the paused cluster management and remove the cluster from 
maintenance mode

When to use:

If you want to turn off maintenance mode, you can use resume command 
and patroni will start managing the cluster

How to use:

`patronictl -c /etc/patroni/patroni.yaml resume`



#### 6. `patronictl list`

List all nodes and it's role, status. You can use it for checking status of all nodes,
which is the master and which all are slaves/replicas.

When to use:

To check list and status of all nodes in the cluster

How to use:

`patronictl -c /etc/patroni/patroni.yaml list`



#### 7. `patronictl restart`

It will restart single node in the postgres cluster or all nodes(complete cluster).
Patroni will do the rolling restart for postgres on all nodes.

When to use:
Sometimes you need to restart all nodes in the cluster without downtime,
you can use this to avoid downtime

How to use:

- Restart particular node in cluster

`patronictl -c /etc/patroni/patroni.yaml restart <CLUSTER_NAME> <NODE_NAME>`

- Restart whole cluster(all nodes in cluster)

`patronictl -c /etc/patroni/patroni.yaml restart <CLUSTER_NAME>`



#### 8. `patronictl reinit`

It will reinitialize node in the cluster.
If you want to reinitialize particular replica or slave node
you can reinitialize node using reinit command.

When to use: 

If some cluster node fails to get up or gets unknown status in the 
cluster you can reinitialize particular node with reinit command

How to use:

`patronictl -c /etc/patroni/patroni.yaml reinit <CLUSTER_NAME> <NODE_NAME>`
