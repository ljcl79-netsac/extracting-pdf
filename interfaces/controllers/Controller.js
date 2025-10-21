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
      // const upload = multer({ dest: 'uploads/' });
      // file_add = upload.single('file_add');
      console.log("body");
      console.log(req.body);
      console.log("file");
      console.log(req.file);
      const result = await UseCase.mergePages(req.body.url, req.file, req.body.afterPage);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="generated.pdf"');
      res.send(Buffer.from(result));
      // res.sendFile(result);
      // res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  },


};
