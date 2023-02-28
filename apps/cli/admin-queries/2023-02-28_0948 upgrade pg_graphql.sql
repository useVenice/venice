-- Check current version, looks like pg_graphql 1.0.2 or 1.1.0, upgrading to 1.2.0
SELECT oid, extname, extversion FROM pg_extension;


drop extension pg_graphql;
create extension pg_graphql;

