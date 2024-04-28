const pool = require("../config/db");
const register = ({ id, user_id, name, company, position, phone }) => {
  return pool.query("INSERT INTO recruiters(id, user_id, name, company, position, phone)VALUES($1, $2, $3, $4, $5, $6)", [id, user_id, name, company, position, phone]);
};

const update = ({ company, position, city, description, instagram, linkedin, phone, photo }, user_id) => {
  return pool.query("UPDATE recruiters SET company = $1, position = $2, city = $3, description = $4, instagram = $5, linkedin = $6, phone = $7, photo = $8 WHERE user_id = $9", [
    company,
    position,
    city,
    description,
    instagram,
    linkedin,
    phone,
    photo,
    user_id,
  ]);
};

const updateImage = ({ photo }, user_id) => {
  return pool.query("UPDATE recruiters SET  photo = $1 WHERE user_id = $2", [photo, user_id]);
};

module.exports = {
  register,
  update,
  updateImage,
};
