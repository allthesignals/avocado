#!/bin/bash
psql -U docker -h localhost -d docker -p 5433 << EOSQL 
CREATE USER public_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO public_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES to public_user;

CREATE TABLE IF NOT EXISTS test_data AS(
select 1 as id,ST_SETSRID(ST_POINT(-73.935242, 40.730610),4326) as geom
);
EOSQL
