const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");


const setupModel = async (app) => {
  const dirs =  fs.readdirSync(path.join(__dirname, "modules"));
  let schemaConfig, schema, modelName, model;
  for (let i = 0, item; item = dirs[i]; i++) {
    schemaConfig = require(path.join(__dirname, "modules", item)); 
    schema = new mongoose.Schema(schemaConfig);
    schema.set("toJSON", {getters: true});
    console.log(schema.options.toObject);
    if (!schema.options.toJSON) {
      schema.options.toObject = {};
    }
    schema.options.toJSON.transform = function (doc, ret) {
      console.log(ret._id);
      delete ret.__v;
      delete ret._id;

      if (ret.author) {
        delete ret.author.id;
      }

      return ret;
    }
    modelName = item.split(".")[0];
    model = mongoose.model(modelName, schema);
    app.locals.Model || (app.locals.Model = {});
    app.locals.Model[modelName] = model;
  }
};

module.exports = {
  setupModel
}
