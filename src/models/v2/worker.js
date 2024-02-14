const Pool = require("../../config/db");

const selectAllWorker = (filter, searchQuery, sortBy, sort, limit, offset) => {
  return Pool.query(`SELECT users.id, users.name, users.email, users.nohp,
      users.jobdesk, users.residence, users.workplace,
      users.description, users.job_type, users.instagram, users.github, users.gitlab, users.image,
      json_agg(skills.name) AS skills
    FROM users
      LEFT JOIN worker_skills ON users.id = worker_skills.id_worker
      LEFT JOIN skills ON skills.id = worker_skills.id_skill
    WHERE users.role = 'workers' AND users.${filter} ILIKE '%${searchQuery}%'
    GROUP BY users.id
    ORDER BY ${sortBy} ${sort}
    LIMIT ${limit} OFFSET ${offset}`);
};

const selectProfileWorker = (id) => {
  return Pool.query(`SELECT users.id, users.name, users.email, users.nohp,
      users.jobdesk, users.residence, users.workplace,
      users.description, users.job_type, users.instagram, users.github, users.gitlab, users.image
    FROM users
    WHERE users.role = 'workers' AND users.id = '${id}'`);
};

const updateWorker = (data) => {
  const { id, name, nohp, jobdesk, residence, workplace, description, job_type, instagram, github, gitlab } = data;
  return Pool.query(
    `UPDATE users SET name='${name}', nohp='${nohp}', jobdesk='${jobdesk}', residence='${residence}', workplace='${workplace}', description='${description}', job_type='${job_type}', instagram='${instagram}', github='${github}', gitlab='${gitlab}' WHERE id='${id}'`
  );
};

const updateImageWorker = (data) => {
  const { id, image } = data;
  return Pool.query(`UPDATE users SET image='${image}' WHERE id='${id}'`);
};

module.exports = {
  selectAllWorker,
  selectProfileWorker,
  updateWorker,
  updateImageWorker,
};
