const Pool = require("../config/db");

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM workers WHERE email='${email}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const selectAllWorker = (filter, searchQuery, sortBy, sort, limit, offset) => {
  return Pool.query(`SELECT workers.id, workers.name, workers.email, workers.nohp,
      workers.image, workers.jobdesk, workers.residence, workers.workplace,
      workers.description, workers.job_type, workers.instagram, workers.github, workers.gitlab,
      json_agg(skills.name) AS skills
    FROM workers
      LEFT JOIN worker_skills ON workers.id = worker_skills.id_worker
      LEFT JOIN skills ON skills.id = worker_skills.id_skill
    WHERE workers.${filter} ILIKE '%${searchQuery}%'
    GROUP BY workers.id
    ORDER BY ${sortBy} ${sort}
    LIMIT ${limit} OFFSET ${offset}`);
};
const selectWorker = (id) => {
  return new Promise((resolve, reject) => Pool.query(`SELECT * FROM workers WHERE id='${id}'`, (error, result) => (!error ? resolve(result) : reject(error))));
};

const createUser = (data) => {
  const { id, name, email, nohp, password, role } = data;
  return Pool.query(`INSERT INTO workers VALUES('${id}', '${name}','${email}', '${nohp}', '${password}','${role}')`);
};

const updateUser = (data) => {
  const { id, name, nohp, jobdesk, residence, workplace, description, job_type, instagram, github, gitlab } = data;
  return Pool.query(
    `UPDATE workers SET name='${name}', nohp='${nohp}', jobdesk='${jobdesk}', residence='${residence}', workplace='${workplace}', description='${description}', job_type='${job_type}', instagram='${instagram}', github='${github}', gitlab='${gitlab}' WHERE id='${id}'`
  );
};

const updatePhotoUser = (data) => {
  const { id, image } = data;
  return Pool.query(`UPDATE workers SET image='${image}' WHERE id='${id}'`);
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM workers`);
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id FROM workers WHERE id='${id}'`, (error, result) => {
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
    Pool.query(`DELETE FROM workers WHERE email='${email}'`, (error, result) => {
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
