#!/usr/bin/env bash

set -e


pushd db
files=("$@")
files=("${files[@]/#/../}") # add ../ to each element

for filename in ${files[@]}; do
  if [[$filename == *.sql]]; then
    pg_format --inplace --keyword-case 1 --type-case 1 --function-case 1 --spaces 2 --wrap-limit 150 $filename
  fi
done
