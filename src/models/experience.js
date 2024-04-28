const pool = require("../config/db");

const selectAll = ({ worker_id }) => {
  return pool.query("SELECT id,  position, company, work_month, work_year, description, created_at, updated_at FROM work_experience WHERE worker_id = $1", [worker_id]);
};

const drop = ({ id }) => {
  return pool.query("DELETE FROM work_experience WHERE id = $1", [id]);
};
const create = ({ id, worker_id, position, company, work_month, work_year, description }) => {
  return pool.query("INSERT INTO work_experience(id, worker_id, position, company, work_month, work_year, description)VALUES($1, $2, $3, $4, $5, $6, $7)", [id, worker_id, position, company, work_month, work_year, description]);
};
const update = ({ position, company, work_month, work_year, description, updated_at }, id) => {
  return pool.query("UPDATE work_experience SET position = $1, company = $2, work_month = $3, work_year= $4, description = $5, updated_at = $6 WHERE id = $7", [position, company, work_month, work_year, description, updated_at, id]);
};

module.exports = {
  selectAll,
  drop,
  create,
  update,
};
