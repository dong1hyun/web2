const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            title: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            content: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            // postNum: {
            //     type: Sequelize.STRING(100),
            //     allowNull: false,
            //     primaryKey: true
            // }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Post',
            tableName: 'posts',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Post.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
        // db.Post.hasOne(db.Comment, { foreignKey: 'postId', sourceKey: 'postNum' });
    }
};
