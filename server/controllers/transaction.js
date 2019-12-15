module.exports = ({ models: { Transaction } }) => {
  return {
    get(req, res) {
      res.status(200).send();
    },
  };
};
