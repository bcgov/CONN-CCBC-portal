#!/bin/bash
PGPASSWORD=mysecretpassword
export DB_PORT="${TEST_DB_PORT:-5432}"
echo "Running unit tests on port $DB_PORT"

docker build -t postgres-pgtap .

docker pull itheory/pg_prove:latest
curl -L https://git.io/JUdgg -o pg_prove && chmod +x pg_prove
cp pg_prove ../../pg_prove
docker pull sqitch/sqitch:latest
curl -L https://git.io/JJKCn -o sqitch && chmod +x sqitch
cp sqitch ../../sqitch
docker run --rm --name ccbc-pgtap -p $DB_PORT:5432 -d postgres-pgtap
sleep 2
(cd ../.. && make create_test_db PSQL="docker exec -i ccbc-pgtap psql -h localhost -U postgres")
(cd ../.. && make deploy_test_db_migrations PSQL="docker exec -i ccbc-pgtap psql -h localhost -U postgres" SQITCH="./sqitch -u postgres --db-port $DB_PORT")
(cd ../../ && ./pg_prove -h localhost -p $DB_PORT -U postgres --failures -d ccbc_test db/test/unit/**/*_test.sql)
(cd ../../ && ./pg_prove -h localhost -p $DB_PORT -U postgres --failures -d ccbc_test mocks_schema/test/**/*_test.sql)
docker stop ccbc-pgtap
rm pg_prove
rm ../../pg_prove
rm sqitch
rm ../../sqitch
echo 'Done.'