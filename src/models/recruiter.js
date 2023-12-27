const Pool = require("../config/db");

const findEmail = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT * FROM recruiters WHERE email='${email}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const selectAllRecruiters = () => {
  return Pool.query(`SELECT * FROM recruiters`);
};
const selectWorker = (id) => {
  return new Promise((resolve, reject) => Pool.query(`SELECT * FROM workers WHERE id='${id}'`, (error, result) => (!error ? resolve(result) : reject(error))));
};

const createUser = (data) => {
  const { id, name, email, company_name, jobdesk, nohp, password, role } = data;
  return Pool.query(`INSERT INTO recruiters (id, name, email, company_name,jobdesk,nohp,password,role) VALUES ('${id}', '${name}', '${email}', '${company_name}','${jobdesk}','${nohp}','${password}','${role}')`);
};

const updaterecruiter = (data) => {
  const { id, name, company_name, jobdesk, nohp, company_field, workplace, description, instagram, linkedin } = data;
  return Pool.query(
    `UPDATE recruiters SET name='${name}', company_name='${company_name}', jobdesk='${jobdesk}', nohp='${nohp}', company_field='${company_field}', workplace='${workplace}', description='${description}', instagram='${instagram}', linkedin='${linkedin}' WHERE id='${id}'`
  );
};

const updatePhotoUser = (data) => {
  const { id, image } = data;
  return Pool.query(`UPDATE recruiters SET image='${image}' WHERE id='${id}'`);
};

const updateBanner = (data) => {
  const { id, banner_image } = data;
  return Pool.query(`UPDATE recruiters SET banner_image='${banner_image}' WHERE id='${id}'`);
};

const countData = () => {
  return Pool.query(`SELECT COUNT(*) FROM recruiters`);
};

const findId = (id) => {
  return new Promise((resolve, reject) =>
    Pool.query(`SELECT id FROM recruiters WHERE id='${id}'`, (error, result) => {
      if (!error) {
        resolve(result);
      } else {
        reject(error);
      }
    })
  );
};

const deleteRecruiter = (email) => {
  return new Promise((resolve, reject) =>
    Pool.query(`DELETE FROM recruiters WHERE email='${email}'`, (error, result) => {
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
  selectAllRecruiters,
  createUser,
  updatePhotoUser,
  updaterecruiter,
  findId,
  countData,
  selectWorker,
  updateBanner,
  deleteRecruiter,
};
