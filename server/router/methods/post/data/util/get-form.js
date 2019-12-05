module.exports = getForm;

function getForm(formString) {
  if (/tablet/i.test(formString)) {
    return /(^|[^a-zA-Z])ER($|[^a-zA-Z])/.test(formString) ? 'ER Tablet' : 'Tablet';
  }
  if (/(^|[^a-zA-Z])IR($|[^a-zA-Z])|oxycodone.*acetaminophen/i.test(formString)) {
    return 'Tablet';
  }
  if (/capsule/i.test(formString)) {
    return 'Capsule';
  }
  if (/cup|syrup|solution|liquid/i.test(formString)) {
    return 'Cup';
  }
  if (/vial/i.test(formString)) {
    return 'Vial';
  }
  if (/injectable/i.test(formString)) {
    return 'Injectable';
  }
  if (/ampule/i.test(formString)) {
    return 'Ampule';
  }
  if (/patch/i.test(formString)) {
    return 'Patch';
  }
  if (/bag|infusion|ivbp/i.test(formString)) {
    return 'Bag';
  }
  if (/syringe|syrng|tubex|pca/i.test(formString)) {
    return 'Syringe';
  }
  if (/concentrate/i.test(formString)) {
    return 'Concentrate';
  }
  return null;
}
