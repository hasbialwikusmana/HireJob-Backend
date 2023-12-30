const Pool = require("../config/db");

const selectAllRecruiter = (filter, searchQuery, sortBy, sort, limit, offset) => {
  return Pool.query(
    `SELECT users.id, users.name, users.email, users.company_name, users.jobdesk, users.nohp, users.company_field, users.workplace, users.description, users.instagram, users.linkedin, users.image, users.banner_image FROM users WHERE users.role='recruiters' AND users.name ILIKE '%${searchQuery}%' ORDER BY ${filter} ${sort} LIMIT ${limit} OFFSET ${offset}`
  );
};

const selectProfileRecruiter = (id) => {
  return new Promise((resolve, reject) => {
    Pool.query(
      `SELECT users.name, users.email, users.company_name, users.jobdesk, users.nohp, users.company_field, users.workplace, users.description, users.instagram, users.linkedin, users.image, users.banner_image FROM users WHERE users.id='${id}'`,
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

const updateRecruiter = (data) => {
  const { id, name, email, nohp, company_name, jobdesk, company_field, workplace, description, instagram, linkedin } = data;
  return new Promise((resolve, reject) => {
    Pool.query(
      `UPDATE users SET name='${name}', email='${email}', nohp='${nohp}', company_name='${company_name}', jobdesk='${jobdesk}', company_field='${company_field}', workplace='${workplace}', description='${description}', instagram='${instagram}', linkedin='${linkedin}' WHERE id='${id}'`,
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

const updateImageRecruiter = (data) => {
  const { id, image } = data;
  return Pool.query(`UPDATE users SET image='${image}' WHERE id='${id}'`);
};

const updateBannerRecruiter = (data) => {
  const { id, image, banner_image } = data;
  return Pool.query(`UPDATE users SET image='${image}', banner_image='${banner_image}' WHERE id='${id}'`);
};

module.exports = {
  selectAllRecruiter,
  selectProfileRecruiter,
  updateRecruiter,
  updateImageRecruiter,
  updateBannerRecruiter,
};
