const pool = require("../config/db");

const selectAllHires = () => {
  return pool.query(`SELECT * FROM hire`);
};

const selectWorkerHires = (id_worker) => {
  return new Promise((resolve, reject) => pool.query(`SELECT  hire.* from users inner join hire on users.id = hire.id_recruiter WHERE hire.id_worker='${id_worker}'`, (error, result) => (!error ? resolve(result) : reject(error))));
};

const selectRecruiterHires = (id_recruiter) => {
  return new Promise((resolve, reject) =>
    pool.query(`SELECT users.name as worker_name, users.email as worker_email, hire.* FROM hire inner join users on hire.id_worker = users.id WHERE hire.id_recruiter='${id_recruiter}'`, (error, result) =>
      !error ? resolve(result) : reject(error)
    )
  );
};

const selectHire = (id) => {
  return new Promise((resolve, reject) => pool.query(`SELECT * FROM hire WHERE id='${id}'`, (error, result) => (!error ? resolve(result) : reject(error))));
};

const insertHire = (data) => {
  const { id, id_worker, id_recruiter, reason, name, email, nohp, description } = data;
  return pool.query(`INSERT INTO hire (id, id_worker, id_recruiter, reason, name, email, nohp, description) VALUES ('${id}', '${id_worker}', '${id_recruiter}', '${reason}', '${name}', '${email}', '${nohp}', '${description}')`);
};

const deleteHire = (id) => {
  return pool.query(`DELETE FROM hire WHERE id='${id}'`);
};

const countData = () => {
  return new Promise((resolve, reject) => pool.query(`SELECT COUNT(id) FROM hire`, (error, result) => (!error ? resolve(result) : reject(error))));
};

module.exports = {
  selectAllHires,
  selectWorkerHires,
  selectRecruiterHires,
  selectHire,
  insertHire,
  deleteHire,
  countData,
};
