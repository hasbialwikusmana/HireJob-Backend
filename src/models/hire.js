const pool = require("../config/db");
const create = ({ id, message_purpose, worker_id, recruiter_id, name, email, phone, description }) => {
  return pool.query("INSERT INTO hire(id, message_purpose, worker_id, recruiter_id, name, email, phone, description)VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [id, message_purpose, worker_id, recruiter_id, name, email, phone, description]);
};
const selectAll = ({ filterBy, filterValue }) => {
  return pool.query(
    `SELECT hire.id, hire.message_purpose, hire.worker_id, hire.recruiter_id, hire.name AS name_request_hire, hire.email AS email_request_hire, hire.phone AS phone_request_hire, hire.description AS description_request_hire, hire.created_at, hire.updated_at, workers.name AS worker_name, workers.phone AS worker_phone, workers.job_desk AS worker_job_desk, workers.domicile AS worker_domicile, workers.workplace AS worker_workplace, workers.photo AS worker_photo, recruiters.name AS recruiter_name, recruiters.company AS recruiter_company , recruiters.position AS recruiter_position, recruiters.photo AS recruiter_photo FROM hire join workers ON hire.worker_id = workers.id join recruiters ON hire.recruiter_id = recruiters.id  ${
      filterBy ? `WHERE ${filterBy}= $1` : ""
    } `,
    [filterValue]
  );
};

module.exports = {
  create,
  selectAll,
};
