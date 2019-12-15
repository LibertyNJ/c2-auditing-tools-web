module.exports = ({ models: { Provider } }) => {
  return {
    get(req, res) {
      res.status(200).send();
    },
    put(req, res) {
      res.status(200).send();
    },
  };
};
