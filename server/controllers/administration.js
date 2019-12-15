module.exports = ({ models: { Administration } }) => {
  return {
    get(req, res) {
      res.status(200).send();
    },
  };
};
