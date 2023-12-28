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

const selectAllWorker = (filter, searchQuery, sortBy, sort, limit, offset) => {
  return Pool.query(`SELECT users.id, users.name, users.email, users.nohp,
      users.image, users.jobdesk, users.residence, users.workplace,
      users.description, users.job_type, users.instagram, users.github, users.gitlab,
      json_agg(skills.name) AS skills
    FROM users
      LEFT JOIN worker_skills ON users.id = worker_skills.id_worker
      LEFT JOIN skills ON skills.id = worker_skills.id_skill
    WHERE users.${filter} ILIKE '%${searchQuery}%'
    GROUP BY users.id
    ORDER BY ${sortBy} ${sort}
    LIMIT ${limit} OFFSET ${offset}`);
};
const selectWorker = (id) => {
  return new Promise((resolve, reject) => Pool.query(`SELECT * FROM users WHERE id='${id}'`, (error, result) => (!error ? resolve(result) : reject(error))));
};

const createUser = (data) => {
  const { id, name, email, nohp, password, role } = data;
  return Pool.query(`INSERT INTO users VALUES('${id}', '${name}','${email}', '${nohp}', '${password}','${role}')`);
};

const updateUser = (data) => {
  const { id, name, nohp, jobdesk, residence, workplace, description, job_type, instagram, github, gitlab } = data;
  return Pool.query(
    `UPDATE users SET name='${name}', nohp='${nohp}', jobdesk='${jobdesk}', residence='${residence}', workplace='${workplace}', description='${description}', job_type='${job_type}', instagram='${instagram}', github='${github}', gitlab='${gitlab}' WHERE id='${id}'`
  );
};

const updatePhotoUser = (data) => {
  const { id, image } = data;
  return Pool.query(`UPDATE users SET image='${image}' WHERE id='${id}'`);
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM users`);
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

const deleteWorker = (email) => {
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
  selectAllWorker,
  createUser,
  updatePhotoUser,
  updateUser,
  findId,
  countData,
  selectWorker,
  deleteWorker,
};
