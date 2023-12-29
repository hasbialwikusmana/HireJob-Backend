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
      users.jobdesk, users.residence, users.workplace,
      users.description, users.job_type, users.instagram, users.github, users.gitlab, users.image,
      json_agg(skills.name) AS skills
    FROM users
      LEFT JOIN worker_skills ON users.id = worker_skills.id_worker
      LEFT JOIN skills ON skills.id = worker_skills.id_skill
    WHERE users.${filter} ILIKE '%${searchQuery}%'
    GROUP BY users.id
    ORDER BY ${sortBy} ${sort}
    LIMIT ${limit} OFFSET ${offset}`);
};
const selectProfileDetail = (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT users.name, users.email, users.nohp,  users.jobdesk, users.residence, users.workplace, users.description, users.job_type, users.instagram, users.github, users.gitlab ,users.image FROM users WHERE id='${id}'`,
      (error, result) => {
        if (!error) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
  });
};

const selectProfileRecruiter = (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(`SELECT users.name, users.email, users.nohp, users.company_name, users.company_field, users.description, users.instagram, users.linkedin,  users.image, users.banner_image FROM users WHERE id='${id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const selectProfile = (id) => {
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

const updateUsers = (data) => {
  const { id, name, nohp, jobdesk, residence, workplace, description, job_type, instagram, github, gitlab } = data;
  return Pool.query(
    `UPDATE users SET name='${name}', nohp='${nohp}', jobdesk='${jobdesk}', residence='${residence}', workplace='${workplace}', description='${description}', job_type='${job_type}', instagram='${instagram}', github='${github}', gitlab='${gitlab}' WHERE id='${id}'`
  );
};

const updateUsersRecruiter = (data) => {
  const { id, name, nohp, company_name, company_field, description, instagram, linkedin } = data;
  return Pool.query(`UPDATE users SET name='${name}', nohp='${nohp}', company_name='${company_name}', company_field='${company_field}', description='${description}', instagram='${instagram}', linkedin='${linkedin}' WHERE id='${id}'`);
};

const updateImageUsers = (data) => {
  const { id, image } = data;
  return Pool.query(`UPDATE users SET image='${image}' WHERE id='${id}'`);
};

const updateImageBannerUsers = (data) => {
  const { id, banner_image } = data;
  return Pool.query(`UPDATE users SET banner='${banner_image}' WHERE id='${id}'`);
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
  selectAllWorker,
  selectProfileDetail,
  createUser,
  updateImageUsers,
  updateUsers,
  findId,
  countData,
  selectProfile,
  deleteUsersAccount,
  updateUsersRecruiter,
  updateImageBannerUsers,
  selectProfileRecruiter,
};
