const Pool = require("../config/db");

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

const createUser = (data) => {
  const { id, email, password, name, phone, company, position, description, photo, role } = data;
  return new Promise((resolve, reject) =>
    Pool.query(
      `INSERT INTO users(id,email,password,name,phone,company,position,description,photo,role) VALUES('${id}','${email}','${password}','${name}','${phone}','${company}','${position}','${description}','${photo}','${role}')`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    )
  );
};

const updateUser = (data) => {
  const { id, name, phone, description } = data;
  return Pool.query(`UPDATE users SET name='${name}',phone='${phone}',description='${description}' WHERE id='${id}'`);
};

const updatePhotoUser = (data) => {
  const { id, photo } = data;
  return Pool.query(`UPDATE users SET photo='${photo}' WHERE id='${id}'`);
};

const updaterecruiter = (data) => {
  const { id, name, phone, description, company, position } = data;
  return Pool.query(`UPDATE users SET name='${name}',phone='${phone}',description='${description}',company='${company}',position='${position}' WHERE id='${id}'`);
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id FROM users WHERE id='${id}'`, (error, result) => {
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
  updatePhotoUser,
  updateUser,
  findId,
  updaterecruiter,
};
