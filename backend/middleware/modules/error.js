const setupError = (app) => {
  app.use((err, req, res, next) => {
    let message = err.message;
    console.log(err, 'err');
    try {
      message = JSON.parse(message);
    }
    catch (error) {
    }
    finally {
      res.status(err.status || 500).send({
        code: err.status,
        message
      })
    }
  });
}
module.exports = {
  setupError
}