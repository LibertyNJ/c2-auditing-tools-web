import path from 'path';

import database from '../database';
import getAdministrations from './administrations';

const databasePath = path.join(__dirname, '..', '..', '..', 'database.db');
database.open(databasePath);
database.initialize();

describe('getAdministrations(database, {parameters})', () => {
  const datetimeEnd = '2019-08-20T07:30:00';
  const datetimeStart = '2019-08-20T07:00:00';
  const medication = 'Fentanyl';
  const medicationOrderId = 'ABCD12345';
  const provider = 'Clifford, Caroline C';

  test('returns records within given timeframe', () => {
    expect(getAdministrations(database, { datetimeEnd, datetimeStart })).toEqual(
      expect.arrayContaining([expect.objectContaining({ timestamp: '2019-08-20T07:10:00' })]),
    );
  });

  test('does not return records outside of given timeframe', () => {
    expect(getAdministrations(database, { datetimeEnd, datetimeStart })).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({ timestamp: '2019-08-20T06:05:00' }),
        expect.objectContaining({ timestamp: '2019-08-20T07:50:00' }),
      ]),
    );
  });

  test('returns records matching given medication', () => {
    expect(getAdministrations(database, { medication })).toEqual(
      expect.arrayContaining([expect.objectContaining({ medication: 'Fentanyl' })]),
    );
  });

  test('does not return records not matching given medication', () => {
    expect(getAdministrations(database, { medication })).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ medication: 'Hydromorphone' })]),
    );
  });

  test('returns records matching given medication order ID', () => {
    expect(getAdministrations(database, { medicationOrderId })).toEqual(
      expect.arrayContaining([expect.objectContaining({ medicationOrderId: 'ABCD12345' })]),
    );
  });

  test('does not return records not matching given medication order ID', () => {
    expect(getAdministrations(database, { medicationOrderId })).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ medicationOrderId: 'DEFG45678' })]),
    );
  });

  test('returns records matching given provider', () => {
    expect(getAdministrations(database, { provider })).toEqual(
      expect.arrayContaining([expect.objectContaining({ provider: 'Clifford, Caroline C' })]),
    );
  });

  test('does not return records not matching given provider', () => {
    expect(getAdministrations(database, { provider })).toEqual(
      expect.not.arrayContaining([expect.objectContaining({ provider: 'Park, Eldred' })]),
    );
  });
});
