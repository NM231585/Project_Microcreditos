export default (sequelize, DataTypes) => {
  const Cronograma = sequelize.define('Cronograma', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    solicitud_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'solicitudes',
        key: 'id'
      }
    },
    tasa_interes: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 12.00,
      comment: 'Tasa de interés anual en porcentaje'
    },
    monto_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    plazo_meses: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'cronogramas',
    timestamps: true
  });

  Cronograma.associate = (models) => {
    Cronograma.belongsTo(models.Solicitud, {
      foreignKey: 'solicitud_id',
      as: 'solicitud'
    });

    Cronograma.hasMany(models.Cuota, {
      foreignKey: 'cronograma_id',
      as: 'cuotas'
    });
  };

  return Cronograma;
};
