const Sequelize = require('sequelize');

module.exports = class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      comments: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
    }, {
      sequelize,
      timestamps: false,
      underscored: false,
      modelName: 'Comment',
      tableName: 'comments',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Comment.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    db.Comment.belongsTo(db.Post, { foreignKey: 'postId', targetKey: 'id' });
  }
};