const UseCase = require('../../usecases/UseCase');

module.exports = {

  async extract(req, res) {
    try {
      const result = await UseCase.extractPages(req.body.url, req.body.pages);
      // res.sendFile(filePath);

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  },


};
