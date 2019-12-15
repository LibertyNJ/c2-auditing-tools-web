module.exports = ({
  models: { Administration, PainReassessment, Transaction },
}) => {
  return {
    get(req, res) {
      res.status(200).send();
    },
  };
};
