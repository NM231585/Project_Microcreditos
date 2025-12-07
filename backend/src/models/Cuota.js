export default (sequelize, DataTypes) => {
  const Cuota = sequelize.define('Cuota', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cronograma_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cronogramas',
        key: 'id'
      }
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: 'Número de cuota (1, 2, 3, ...)'
    },
    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    capital: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Monto de capital a pagar'
    },
    interes: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Monto de interés a pagar'
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Total de la cuota (capital + interés)'
    },
    saldo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: 'Saldo pendiente después de esta cuota'
    },
    pagado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    fecha_pago: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Fecha en que se realizó el pago'
    }
  }, {
    tableName: 'cuotas',
    timestamps: true
  });

  Cuota.associate = (models) => {
    Cuota.belongsTo(models.Cronograma, {
      foreignKey: 'cronograma_id',
      as: 'cronograma'
    });
  };

  return Cuota;
};
