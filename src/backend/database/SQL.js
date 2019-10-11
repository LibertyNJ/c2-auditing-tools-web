'use-strict';

const { isArray } = require('./utilities');

module.exports = {
  formulateCreateTableStatement,
  formulateCreateViewStatement,
  formulateInsertStatement,
  formulateSelectStatement,
  formulateUpdateStatement,
};

function formulateCreateTableStatement({ name, columns, constraints = null }) {
  const columnDefinitions = formulateColumnDefinitions(columns);
  const tableConstraints = constraints ? formulateTableConstraints(constraints) : '';
  return `
    CREATE TABLE IF NOT EXISTS ${name}
    (${columnDefinitions}${tableConstraints});
  `;
}

function formulateColumnDefinitions(columns) {
  return columns.map(formulateColumnDefinition).join(', ');
}

function formulateColumnDefinition({ name, type, constraint = '' }) {
  return `${name} ${type} ${constraint}`;
}

function formulateTableConstraints(constraints) {
  return constraints.map(formulateTableConstraint).join('');
}

function formulateTableConstraint({ type, columns, onConflict }) {
  const indexedColumns = columns.join(', ');
  const conflictClause = `ON CONFLICT ${onConflict}`;
  return `, ${type} (${indexedColumns}) ${conflictClause}`;
}

function formulateCreateViewStatement({ name, statement }) {
  return `
    CREATE VIEW IF NOT EXISTS ${name}
    AS ${statement}
  `;
}

function formulateInsertStatement({ columns, onConflict = null, table }) {
  const onConflictClause = onConflict ? `OR ${onConflict} ` : '';
  const columnNames = columns.join(', ');
  const parameters = columns.map(() => '?').join(', ');
  return `
    INSERT ${onConflictClause}INTO ${table} (${columnNames})
    VALUES (${parameters});
  `;
}

function formulateSelectStatement({ columns = null, predicates = null, table }) {
  const resultColumns = columns ? columns.join(', ') : '*';
  const whereClause = predicates.length ? formulateWhereClause(predicates) : '';
  return `
    SELECT ${resultColumns}
    FROM ${table}
    ${whereClause};
  `;
}

function formulateUpdateStatement({ data, predicates = null, table }) {
  const assignmentColumns = Object.keys(data);
  const assignments = formulateAssignments(assignmentColumns);
  const whereClause = predicates ? formulateWhereClause(predicates) : '';
  return `
    UPDATE ${table}
    SET ${assignments}
    ${whereClause};
  `;
}

function formulateAssignments(assignmentColumns) {
  return assignmentColumns.map(formulateAssignment).join(', ');
}

function formulateAssignment(assignmentColumn) {
  return `${assignmentColumn} = ?`;
}

function formulateWhereClause(predicates) {
  const predicateExpressions = formulatePredicateExpressions(predicates);
  return `WHERE ${predicateExpressions}`;
}

function formulatePredicateExpressions(predicates) {
  return predicates.map(formulatePredicateExpression).join(' AND ');
}

function formulatePredicateExpression({ column, operator, value }) {
  if (isArray(value)) {
    const placeholders = value.map(() => '?').join(', ');
    return `${column} ${operator} (${placeholders})`;
  }

  return `${column} ${operator} ?`;
}
