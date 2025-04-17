# Metabase
Metabase is an open source business intelligence tool that lets you create charts and dashboards using data 
from a variety of databases and data sources. In the context of our application we use it to generate a variety of visualizations 
based on the data on the portal as well as other data consumed into our database.


## Table of contents
- [Deployment](#deployment)
- [Official documentation](https://www.metabase.com/docs/latest/)
- [Queries and questions](https://www.metabase.com/learn/questions/searching-tables)


## Deployment
Our Metabase is deployed using Helm, it consists of a Docker image as well as a CrunchyDB (Postgres). 
The Metabase repo can be found [here.](https://github.com/bcgov/conn-metabase)