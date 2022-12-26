const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('filesystem',
    'root',
    'root',
    {
        host: 'localhost',
        dialect: 'mysql'
    });

const File = sequelize.define('File', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    filename: {
        type: DataTypes.STRING,
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    // Other model options go here
});

const Folder = sequelize.define('Folder', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
}, {
    // Other model options go here
});


Folder.hasMany(File)
File.belongsTo(Folder)

Folder.sync()
File.sync()

module.exports = {
    File,
    Folder
}
