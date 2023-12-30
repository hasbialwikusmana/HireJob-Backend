const { v4: uuidv4 } = require("uuid");
const commonHelper = require("../helpers/common");
const cloudinary = require("../middlewares/cloudinary");
const portfolioModel = require("../models/portfolio");

const getAllPortfolios = async (req, res) => {
  try {
    const results = await portfolioModel.selectAllPortfolios();

    if (!results.rowCount) return commonHelper.response(res, null, 404, "Portfolios not found");
    commonHelper.response(res, results.rows, 200, "Get all portfolios successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting portfolios");
  }
};

const getWorkerPortfolios = async (req, res) => {
  try {
    const id_worker = req.params.id_worker;
    const results = await portfolioModel.selectWorkerPortfolios(id_worker);
    if (!results.rowCount) return commonHelper.response(res, null, 404, "Worker portfolios not found");
    commonHelper.response(res, results.rows, 200, "Get worker portfolios successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting portfolios");
  }
};

const getDetailPortfolio = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await portfolioModel.selectPortfolio(id);
    if (!result.rowCount) return commonHelper.response(res, null, 404, "Portfolio not found");
    commonHelper.response(res, result.rows, 200, "Get detail portfolio successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed getting detail portfolio");
  }
};

const createPortfolio = async (req, res) => {
  try {
    const id_worker = req.payload.id;
    const data = req.body;
    if (req.file == undefined) return commonHelper.response(res, null, 400, "Please input image");
    data.id = uuidv4();
    data.id_worker = id_worker;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      data.image = uploadResult.secure_url;
    }
    const result = await portfolioModel.insertPortfolio(data);
    commonHelper.response(res, result.rows, 200, "Create portfolio successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed creating portfolio");
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const id = req.params.id;
    const id_worker = req.payload.id_worker;
    const newData = req.body;
    const oldDataResult = await portfolioModel.selectPortfolio(id);
    if (!oldDataResult.rowCount) return commonHelper.response(res, null, 404, "Portfolio not found");
    let oldData = oldDataResult.rows[0];
    let data = { ...oldData, ...newData };

    data.id = id;
    data.id_worker = id_worker;

    if (req.file) {
      if (oldData.image) {
        const publicId = oldData.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(publicId);

        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        data.image = uploadResult.secure_url;
      } else {
        const uploadResult = await cloudinary.uploader.upload(req.file.path);
        data.image = uploadResult.secure_url;
      }
    } else {
      data.image = oldData.image;
    }

    const result = await portfolioModel.updatePortfolio(data);

    commonHelper.response(res, result.rows, 200, "Update portfolio successful");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed updating portfolio");
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const id = req.params.id;

    const oldResult = await portfolioModel.selectPortfolio(id);
    if (!oldResult.rowCount) return commonHelper.response(res, null, 404, "Portfolio not found");

    const publicId = oldResult.rows[0].image.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    const result = portfolioModel.deletePortfolio(id);

    commonHelper.response(res, result.rows, 200, "Portfolio deleted");
  } catch (error) {
    console.log(error);
    commonHelper.response(res, null, 500, "Failed deleting portfolio");
  }
};

module.exports = {
  getAllPortfolios,
  getWorkerPortfolios,
  getDetailPortfolio,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
};
