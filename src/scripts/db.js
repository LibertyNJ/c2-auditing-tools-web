const Database = require('better-sqlite3');
const path = require('path');

const isDevMode = process.execPath.match(/[\\/]electron/);

const dbPath = isDevMode
  ? path.join(__dirname, '..', '..', 'database.db')
  : path.join(__dirname, '..', '..', '..', 'database.db');

const db = isDevMode
  ? new Database(dbPath, { verbose: console.log })
  : new Database(dbPath);

db.create = (table, parameters) => {
  const onConflict = parameters.onConflict
    ? `OR ${parameters.onConflict.toUpperCase()} `
    : '';

  const columns = Object.keys(parameters.data).join(', ');
  const values = Object.values(parameters.data);
  const valuePlaceholders = values.map(() => '?').join(', ');

  db.prepare(
    `
    INSERT ${onConflict}INTO ${table} (${columns})
    VALUES (${valuePlaceholders});   
    `
  ).run(...values);
};

function getWhereValues(parameters) {
  if (parameters.wheres) {
    return parameters.wheres
      .filter(where => where)
      .reduce((flattenedWheres, where) => flattenedWheres.concat(where), [])
      .map(({ value }) => value);
  }

  return null;
}

function getWheres(parameters, whereValues) {
  if (whereValues.length > 0) {
    const whereStatements = parameters.wheres
      .filter(where => where)
      .map(where => {
        if (Array.isArray(where)) {
          const orStatement = where
            .map(({ column, operator }) => `${column} ${operator} ?`)
            .join(' OR ');

          return `(${orStatement})`;
        }

        const { column, operator } = where;

        if (/timestamp/.test(column)) {
          return `strftime('%s', ${column}) ${operator} strftime('%s', ?)`;
        }

        return `${column} ${operator} ?`;
      })
      .join(' AND ');

    return `WHERE ${whereStatements}`;
  }

  return '';
}

db.read = (table, parameters) => {
  const isDistinct = parameters.isDistinct ? 'DISTINCT ' : '';
  const columns = parameters.columns.join(', ');
  const whereValues = getWhereValues(parameters);
  const wheres = getWheres(parameters, whereValues);

  const joins = parameters.joins
    ? parameters.joins
        .map(join => `${join.type} JOIN ${join.table} ON ${join.predicate}`)
        .join(' ')
    : '';

  const orderByStatements = parameters.orderBys
    ? parameters.orderBys
        .map(({ column, direction }) => `${column} ${direction}`)
        .join(', ')
    : null;

  const orderBys = orderByStatements ? `ORDER BY ${orderByStatements}` : '';
  const limit = parameters.limit ? `LIMIT ${parameters.limit}` : '';

  const stmt = db.prepare(
    `
    SELECT ${isDistinct}${columns}
    FROM ${table}
    ${joins}
    ${wheres}
    ${orderBys}
    ${limit};
    `
  );

  if (parameters.columns.length === 1 && /id\b/i.test(parameters.columns[0])) {
    const record = stmt.get(...whereValues);
    return record ? record.id : null;
  }

  return stmt.all(...whereValues) || null;
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
  const wheres = getWheres(parameters, whereValues);

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
  const wheres = getWheres(parameters, whereValues);

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
    header: { type: 'status' },
    body: db.status,
  });
};

module.exports = db;
