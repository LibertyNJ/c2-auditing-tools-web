const BetterSqlite3Database = require('better-sqlite3');

const SQL = require('./SQL');

const adcTransactionTypeNames = require('./config/adc-transaction-type-names');
const medicationNames = require('./config/medication-names');
const schema = require('./config/schema');
const views = require('./config/views');

const { isArray } = require('./utilities');

module.exports = {
  open,
  initialize,
  setStatus,
  getStatus,
  create,
  read,
  update,
};

const IS_DEV_MODE = /[\\/]electron/.test(process.execPath);

let sqlite;
let status;

function open(databasePath) {
  sqlite = IS_DEV_MODE
    ? new BetterSqlite3Database(databasePath, { verbose: console.log })
    : new BetterSqlite3Database(databasePath);
}

function setStatus(newStatus) {
  status = newStatus;
}

function getStatus() {
  return status;
}

function initialize() {
  createTables();
  createViews();
  createMedications();
  createAdcTransactionTypes();
  createOverrideMedicationOrder();
}

function createTables() {
  schema.forEach(createTable);
}

function createTable(tableDefinition) {
  const sql = SQL.formulateCreateTableStatement(tableDefinition);
  const statement = sqlite.prepare(sql);
  statement.run();
}

function createViews() {
  views.forEach(createView);
}

function createView(viewDefinition) {
  const sql = SQL.formulateCreateViewStatement(viewDefinition);
  const statement = sqlite.prepare(sql);
  statement.run();
}

function createMedications() {
  const medications = medicationNames.map(name => ({
    data: { name },
    onConflict: 'IGNORE',
    table: 'medication',
  }));

  medications.forEach(create);
}

function createAdcTransactionTypes() {
  const adcTransactionTypes = adcTransactionTypeNames.map(name => ({
    data: { name },
    onConflict: 'IGNORE',
    table: 'adcTransactionType',
  }));

  adcTransactionTypes.forEach(create);
}

function createOverrideMedicationOrder() {
  create({ data: { id: 'OVERRIDE' }, onConflict: 'IGNORE', table: 'medicationOrder' });
}

function create({ data, onConflict = null, table }) {
  const columns = Object.keys(data);
  const sql = SQL.formulateInsertStatement({ columns, onConflict, table });
  const statement = sqlite.prepare(sql);
  const values = Object.values(data);
  statement.run(...values);
}

function read({ columns = null, predicates = null, table }) {
  const sql = SQL.formulateSelectStatement({ columns, predicates, table });
  const statement = sqlite.prepare(sql);
  const values = predicates ? predicates.reduce(reduceToValues, []) : [];

  if (predicates && isQueryingByUniqueId(predicates)) {
    return statement.get(...values);
  }

  return statement.all(...values);
}

function update({ data, predicates = null, table }) {
  const sql = SQL.formulateUpdateStatement({ data, predicates, table });
  const statement = sqlite.prepare(sql);
  const setValues = Object.values(data);
  const whereValues = predicates ? predicates.reduce(reduceToValues, []) : [];
  statement.run(...setValues, ...whereValues);
}

function isQueryingByUniqueId(predicates) {
  return predicates.reduce(reduceToIsUniqueId, false);
}

function reduceToIsUniqueId(previousResult, { column, value }) {
  return previousResult || (isId(column) && !isNull(value));
}

function isId(column) {
  return column === 'id';
}

function isNull(value) {
  return value === null;
}

function reduceToValues(previousArray, { value }) {
  if (isArray(value)) {
    return [...previousArray, ...value];
  }

  return [...previousArray, value];
}
