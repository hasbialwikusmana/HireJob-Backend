const pool = require("../config/db");

const create = ({ id, worker_id, application_name, link_repo, portfolio_type, image }) => {
  return pool.query("INSERT INTO portfolio(id, worker_id, application_name, link_repo, portfolio_type, image)VALUES($1, $2, $3, $4, $5, $6)", [id, worker_id, application_name, link_repo, portfolio_type, image]);
};

const drop = ({ id }) => {
  return pool.query("DELETE FROM portfolio WHERE id = $1", [id]);
};

const selectAll = ({ worker_id }) => {
  return pool.query("SELECT id,  application_name, link_repo, portfolio_type, image, created_at, updated_at FROM portfolio WHERE worker_id = $1", [worker_id]);
};

const update = ({ application_name, link_repo, portfolio_type, image, updated_at }, id) => {
  return pool.query("UPDATE portfolio SET application_name = $1, link_repo = $2, portfolio_type = $3, image= $4, updated_at = $5 WHERE id = $6", [application_name, link_repo, portfolio_type, image, updated_at, id]);
};

const findById = async (id) => {
  const query = "SELECT * FROM portfolio WHERE id = $1";
  const values = [id];

  const { rows } = await pool.query(query, values);
  return rows[0];
};

module.exports = {
  create,
  drop,
  selectAll,
  update,
  findById,
};
