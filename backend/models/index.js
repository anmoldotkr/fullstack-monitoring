const User = require('./User');
const Task = require('./Task');

// One User has Many Tasks; Task belongs to a single User
User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Task };