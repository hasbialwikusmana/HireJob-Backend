const pool = require("../config/db");

const register = ({ id, user_id, name, phone }) => {
  return new Promise((resolve, reject) => {
    pool.query("INSERT INTO workers(id, user_id, name, phone)VALUES($1, $2, $3, $4)", [id, user_id, name, phone], (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    });
  });
};

const update = ({ name, job_desk, domicile, workplace, description, photo }, id) => {
  return pool.query("UPDATE workers SET name = $1, job_desk = $2, domicile = $3, workplace = $4, description = $5, photo = $6 WHERE user_id = $7", [name, job_desk, domicile, workplace, description, photo, id]);
};

const updateImage = ({ photo }, user_id) => {
  return pool.query("UPDATE workers SET  photo = $1 WHERE user_id = $2", [photo, user_id]);
};

const findAll = ({ limit, offset, search, sort, sortBy }) => {
  return pool.query(`SELECT * FROM workers ${search ? `WHERE name ILIKE '%${search}%'` : ""} ORDER BY ${sort} ${sortBy} LIMIT $1 OFFSET $2`, [limit, offset]);
};

const findOne = ({ id }) => {
  return pool.query("SELECT users.email,  workers.* FROM workers JOIN users ON workers.user_id = users.id WHERE workers.id = $1", [id]);
};
const countWorkers = ({ search }) => {
  return pool.query(`SELECT COUNT(*) AS total FROM workers ${search ? `WHERE name ILIKE '%${search}%' OR job_desk ILIKE '%${search}%'` : ""}`);
};

const selectSkillWorker = ({ id }) => {
  // console.log(id);
  return pool.query({
    rowMode: "array",
    text: "SELECT skills.skill_name FROM skills WHERE worker_id = $1",
    values: [id],
  });
};

// const selectPortfolioWorker = ({ id }) => {
//   return pool.query({
//     rowMode: "array",
//     text: "SELECT portfolio.* FROM portfolio WHERE worker_id = $1",
//     values: [id],
//   });
// };

module.exports = {
  register,
  update,
  updateImage,
  findAll,
  countWorkers,
  findOne,
  selectSkillWorker,
  // selectPortfolioWorker,
};
