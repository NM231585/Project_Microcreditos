export default (sequelize, DataTypes) => {
  const Solicitud = sequelize.define('Solicitud', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    emprendedor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    estado: {
      type: DataTypes.ENUM('borrador', 'enviado', 'en_evaluacion', 'aprobado', 'rechazado', 'devuelto'),
      allowNull: false,
      defaultValue: 'borrador'
    },
    datos_personales: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON con: nombre, cedula, telefono, direccion, departamento, municipio'
    },
    datos_negocio: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON con: tipo, descripcion, ingresoMensual, produccion'
    },
    datos_solicitud: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'JSON con: monto, plazoMeses, motivo'
    },
    documentos: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array de URLs de documentos'
    },
    score_automatico: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    cronograma_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cronogramas',
        key: 'id'
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'solicitudes',
    timestamps: true
  });

  Solicitud.associate = (models) => {
    Solicitud.belongsTo(models.Usuario, {
      foreignKey: 'emprendedor_id',
      as: 'emprendedor'
    });

    Solicitud.hasOne(models.Cronograma, {
      foreignKey: 'solicitud_id',
      as: 'cronograma'
    });
  };

  return Solicitud;
};
