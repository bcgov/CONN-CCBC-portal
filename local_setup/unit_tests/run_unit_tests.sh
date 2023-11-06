#!/bin/bash
docker build -t postgres-pgtap .
PGPASSWORD=mysecretpassword
docker pull itheory/pg_prove:latest
curl -L https://git.io/JUdgg -o pg_prove && chmod +x pg_prove
cp pg_prove ../../pg_prove
docker pull sqitch/sqitch:latest
curl -L https://git.io/JJKCn -o sqitch && chmod +x sqitch
cp sqitch ../../sqitch
docker run --rm --name ccbc-pgtap -p 5432:5432 -d postgres-pgtap
sleep 2
(cd ../.. && make create_test_db PSQL="docker exec -i ccbc-pgtap psql -h localhost -U postgres")
(cd ../.. && make deploy_test_db_migrations PSQL="docker exec -i ccbc-pgtap psql -h localhost -U postgres" SQITCH="./sqitch -u postgres")
(cd ../../ && ./pg_prove -h localhost -U postgres --failures -d ccbc_test db/test/unit/**/*_test.sql)
(cd ../../ && ./pg_prove -h localhost -U postgres --failures -d ccbc_test mocks_schema/test/**/*_test.sql)
docker stop ccbc-pgtap
rm pg_prove
rm ../../pg_prove
rm sqitch
rm ../../sqitch
