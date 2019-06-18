const path = require('path');

const Database = require('better-sqlite3');

const isDevMode = process.execPath.match(/[\\/]electron/);

const dbPath = isDevMode
  ? path.join(__dirname, '..', '..', 'database.db')
  : path.join(__dirname, '..', '..', '..', 'database.db');

const db = isDevMode
  ? new Database(dbPath, { verbose: console.log })
  : new Database(dbPath);

db.create = (tableName, parameters) => {
  const onConflictClause = parameters.onConflict
    ? `OR ${parameters.onConflict.toUpperCase()} `
    : '';
  const columnNames = Object.keys(parameters.data).join(', ');
  const values = Object.values(parameters.data);
  const valueParameters = values.map(() => '?').join(', ');

  const statement = db.prepare(
    `
    INSERT ${onConflictClause}INTO ${tableName} (${columnNames})
    VALUES (${valueParameters});
    `
  );

  statement.run(...values);
};

function getWhereValues(parameters) {
  return parameters.wheres
    .filter(where => where)
    .reduce((flattenedWheres, where) => flattenedWheres.concat(where), [])
    .map(({ value }) => value);
}

function getWhereClause(parameters, whereValues) {
  const predicates = parameters.wheres
    .filter(where => where)
    .map(where => {
      if (Array.isArray(where)) {
        const orStatement = where
          .map(({ column, operator }) => `${column} ${operator} ?`)
          .join(' OR ');

        return `(${orStatement})`;
      }

      const { column, operator } = where;

      if (isTimestamp(column)) {
        return `strftime('%s', ${column}) ${operator} strftime('%s', ?)`;
      }

      return `${column} ${operator} ?`;
    })
    .join(' AND ');

  const whereClause = `WHERE ${predicates}`;

  return whereClause;
}

function areNoWhereValues(whereValues) {
  return whereValues.length === 0;
}

function isTimestamp(column) {
  return /timestamp/.test(column);
}

db.read = (tableName, parameters) => {
  const distinctClause = parameters.isDistinct ? 'DISTINCT ' : '';
  const columns = parameters.columns.join(', ');
  const whereValues = getWhereValues(parameters);
  const whereClause = getWhereClause(parameters, whereValues);
  const joinClause =
    parameters.joins
      .map(join => `${join.type} JOIN ${join.table} ON ${join.predicate}`)
      .join(' ') || '';
  const orderByStatements = parameters.orderBys
    ? parameters.orderBys
        .map(({ column, direction }) => `${column} ${direction}`)
        .join(', ')
    : null;
  const orderByClause = orderByStatements
    ? `ORDER BY ${orderByStatements}`
    : '';
  const limitClause = parameters.limit ? `LIMIT ${parameters.limit}` : '';

  const statement = db.prepare(
    `
    SELECT ${distinctClause}${columns}
    FROM ${tableName}
    ${joinClause}
    ${whereClause}
    ${orderByClause}
    ${limitClause};
    `
  );

  if (parameters.columns.length === 1 && /id\b/i.test(parameters.columns[0])) {
    const record = statement.get(...whereValues);
    return record ? record.id : null;
  }

  return statement.all(...whereValues) || null;
};

db.update = (table, parameters) => {
  const onConflict = parameters.onConflict
    ? `OR ${parameters.onConflict.toUpperCase()} `
    : '';

  const setValues = parameters.sets
    ? parameters.sets.filter(set => set).map(({ value }) => value)
    : null;

  const setStatements =
    setValues.length > 0
      ? parameters.sets
          .filter(set => set)
          .map(({ column }) => `${column} = ?`)
          .join(', ')
      : null;

  const sets = setStatements ? `SET ${setStatements}` : '';
  const whereValues = getWhereValues(parameters);
  const wheres = getWhereClause(parameters, whereValues);

  db.prepare(
    `
    UPDATE ${onConflict}${table}
    ${sets}
    ${wheres};
    `
  ).run(...setValues, ...whereValues);
};

db.delete = (table, parameters) => {
  const whereValues = getWhereValues(parameters);
  const wheres = getWhereClause(parameters, whereValues);

  db.prepare(
    `
    DELETE FROM ${table}
    ${wheres};
    `
  ).run(...whereValues);
};

db.updateStatus = status => {
  db.status = status;

  process.send({
    channel: 'status',
    message: db.status,
  });
};

module.exports = db;
