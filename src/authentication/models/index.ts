/*
import sequelize from "../../dbconnection";

import userModel from "./users";

//Init the user model

sequelize.models.users = userModel(sequelize);

//Add some records to db
(async () => {
  await sequelize.models.users.sync().then(async (nonsense) => {
    for (let user of [
      {
        username: "testuser1",
        password: "__testuser1",
      },
      {
        username: "testuser2",
        password: "__testuser2",
      },
      {
        username: "testuser3",
        password: "__testuser3",
      },
    ]) {
      await sequelize.models.users.findOrCreate({
        where: {
          username: user.username,
        },
        logging: false,
        raw: true,
        defaults: {
          password: user.password,
          username: user.username,
          saltValue: Math.floor(Math.random()*16)+1
        },
      });
    }
  });
})();

const authSeqInstance = sequelize;
//Remember to import this instance of the connection, not the one at root
export default authSeqInstance;
*/
