import { Sequelize } from 'sequelize';
import sequelize from '../config/database.js';

// Importar modelos
import Rol from './Rol.js';
import Usuario from './Usuario.js';
import Solicitud from './Solicitud.js';
import Cronograma from './Cronograma.js';
import Cuota from './Cuota.js';

// Inicializar modelos
const models = {
  Rol: Rol(sequelize, Sequelize.DataTypes),
  Usuario: Usuario(sequelize, Sequelize.DataTypes),
  Solicitud: Solicitud(sequelize, Sequelize.DataTypes),
  Cronograma: Cronograma(sequelize, Sequelize.DataTypes),
  Cuota: Cuota(sequelize, Sequelize.DataTypes)
};

// Definir asociaciones
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
