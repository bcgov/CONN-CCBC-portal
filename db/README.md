# Database schema

This folder contains the SQL code defining our database schemas. We use `sqitch` to deploy changes, and `pgTap` to test the resulting schemas.

You can find the relevant team agreements and recommendations below

## Sqitch changes

To identify which changes are released in production environments and therefore are immutable, we rely on sqitch tags: changes that are above a tag (a line starting with `@`) in the `sqitch.plan` file should be considered immutable.

When adding a sqitch change to create an object, we follow the `<object_type>/<object_name>` naming convention, where `<object_type>` is one of the following:

- `schemas`: we shouldn't need to add more than the public and private schemas
- `tables`: all tables go in there
- `types`: all composite or enum types go in there.
- `functions`: for functions that would result in a [postgraphile custom query](https://www.graphile.org/postgraphile/custom-queries/)
- `computed_columns`: for functions that would result in a [postgraphile computed column](https://www.graphile.org/postgraphile/computed-columns/)
- `mutations`: for [custom mutations](https://www.graphile.org/postgraphile/custom-mutations/)
- `trigger_functions`: for any function returning a trigger
- `util_functions`: for any function used primarily to increase code reuse, either in the public or private schema
- `views`: all views go in there

### Updating after release

Once a change is released, updating the deploy script is not possible. To update the object, the following options are available:

- **If the change is idempotent**, you can use the [sqitch rework](https://sqitch.org/docs/manual/sqitch-rework/) command;
- Otherwise, you must create a new change. The naming convention should be `<name_of_original_change>_00x_<short_description_of_change>`.
