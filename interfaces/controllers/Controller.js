const UseCase = require('../../usecases/UseCase');

module.exports = {

  async extract(req, res) {
    try {
      const result = await UseCase.extractPages(req.body.url, req.body.pages);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="generated.pdf"');
      res.send(Buffer.from(result));
      // res.sendFile(result);
      // res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  },

  async merge(req, res) {
    try {
      const result = await UseCase.mergePages(req.body.url, req.file, req.body.afterPage);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="generated.pdf"');
      res.send(Buffer.from(result));
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  },

  async remove(req, res) {
    try {
      const result = await UseCase.removePages(req.body.url, req.body.pages);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="generated.pdf"');
      res.send(Buffer.from(result));
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  },
};
