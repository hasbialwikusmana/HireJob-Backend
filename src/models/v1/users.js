const Pool = require("../../config/db");

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM users WHERE email='${email}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const findId = (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT * FROM users WHERE id='${id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const createUser = (data) => {
  const { id, name, email, nohp, password, role } = data;
  return Pool.query(`INSERT INTO users VALUES('${id}', '${name}','${email}', '${nohp}', '${password}','${role}')`);
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM users`);
};

const deleteUsersAccount = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`DELETE FROM users WHERE email='${email}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

module.exports = {
  findEmail,
  createUser,
  findId,
  countData,
  deleteUsersAccount,
};
