const { isNull, SQL } = require('../util');

module.exports = async (parameters, db) => {
  const medicationOrderIdPredicate = parameters.medicationOrderId
    ? 'medication_order_id ILIKE'
    : null;

  const medicationPredicate = parameters.medication
    ? 'medication_with_form ILIKE'
    : null;

  const providerPredicate = parameters.provider ? 'provider_name ILIKE' : null;

  const optionalPredicates = [
    medicationOrderIdPredicate,
    medicationPredicate,
    providerPredicate,
  ].filter(predicate => !isNull(predicate));

  const predicates = ['timestamp >=', 'timestamp <=', ...optionalPredicates];

  const whereClause = SQL.formulateWhereClause(predicates);

  const sql = `
    SELECT    medication_order.dose || medication_order.units AS dose_with_units,
              administration.id,
              medication.name || medication_order.form AS medication_with_form,
              medication_order_id,
              provider.last_name || ', ' || provider.first_name || COALESCE(' ' || provider.middle_initial, NULL) AS provider_name,
              timestamp
    FROM      administration
    LEFT JOIN medication_order ON medication_order_id = medication_order.id
    LEFT JOIN medication ON medication_order.medication_id = medication.id
    LEFT JOIN emar_username ON emar_username_id = emar_username.id
    LEFT JOIN provider ON emar_username.provider_id = provider.id
    ${whereClause};
  `;

  const values = Object.values(parameters);

  try {
    const administrations = await db.query(sql, values);
    return administrations;
  } catch (error) {
    console.error(error);
  }
};
