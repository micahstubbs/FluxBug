'use strict'

import fs from 'fs';
import path from 'path';
import nconf from 'nconf';
import locals from '../../locals';
import Sequelize from 'sequelize';

var sequelize = new Sequelize(nconf.get('DATABASE_URL'));
var db        = {};

fs
  .readdirSync(__dirname)
  .filter((file) => {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach((file) => {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
