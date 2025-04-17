#!/bin/bash
PGPASSWORD=mysecretpassword
SHA="${SHA:-cd639ad899a48cbdc049382b0ed8558cb778f4e5}"
docker run --rm --name ccbc-e2e -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres:14
docker pull sqitch/sqitch:latest
curl -L https://git.io/JJKCn -o sqitch && chmod +x sqitch
cp sqitch ../../sqitch
(cd ../.. && make create_db PSQL="docker exec -i ccbc-e2e psql -h localhost -U postgres")
(cd ../.. && make deploy_db_migrations PSQL="docker exec -i ccbc-e2e psql -h localhost -U postgres" SQITCH="./sqitch -u postgres")
#backup original cypress command
file_path="../../app/cypress/support/commands.js"
backup_file="$file_path.bak"
cp "$file_path" "$backup_file"

#modify line to run against docker container
awk '/psql -v "ON_ERROR_STOP=1" -d ccbc<< '\''EOF'\''/ {sub(/psql -v "ON_ERROR_STOP=1" -d ccbc/, "psql -h localhost -U postgres -v \"ON_ERROR_STOP=1\" -d ccbc")} 1' "$backup_file" > "$file_path"
if [ -n "$USE_LOCAL"]; then
    if [ "$USE_LOCAL" = "Y" ]; then
    echo "Using local app"
    sleep 2
    (cd ../../app && yarn dev) &
    app_pid=$!
    echo $app_pid
    sleep 2
    (cd ../../app && yarn test:e2e:admin)
    (cd ../../app && yarn test:e2e:analyst)
    (cd ../../app && yarn test:e2e:applicant)
    else
        docker run --rm -d -e "PGUSER=postgres" -e "PGPASSWORD=mysecretpassword" -e "PGHOST=host.docker.internal" -e "ENABLE_MOCK_AUTH=true" -e "ENABLE_MOCK_COOKIES=true" -p 3000:3000 --network=bridge --platform linux/x86_64 ghcr.io/bcgov/conn-ccbc-portal/ccbc-app:sha-$SHA
        sleep 7
        (cd ../../app && yarn test:e2e:admin)
        (cd ../../app && yarn test:e2e:analyst)
        (cd ../../app && yarn test:e2e:applicant)
    fi
fi
kill -9 $app_pid
#revert changes
cp "$backup_file" "$file_path"
#cleanup
rm "$backup_file"
rm sqitch
rm ../../sqitch
docker stop ccbc-e2e
