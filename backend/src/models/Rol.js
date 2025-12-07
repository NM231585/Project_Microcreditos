export default (sequelize, DataTypes) => {
  const Rol = sequelize.define('Rol', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.ENUM('emprendedor', 'evaluador', 'admin'),
      allowNull: false,
      unique: true
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'roles',
    timestamps: true
  });

  Rol.associate = (models) => {
    Rol.hasMany(models.Usuario, {
      foreignKey: 'rol_id',
      as: 'usuarios'
    });
  };

  return Rol;
};
