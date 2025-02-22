const Contact = require("../models/contact");
const {
  generalSchemaValidation,
  favoriteSchemaValidation,
} = require("../validationSchemas");
const { HttpError } = require("../helpers");

const getAllContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("owner");

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);

    if (!result) throw HttpError(404, "Not found");

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const addNewContact = async (req, res, next) => {
  try {
    const { error } = generalSchemaValidation.validate(req.body);

    if (error) {
      throw HttpError(400, "Missing valid name field");
    }

    const avatarURL = path.join("public", "avatars", originalname);
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner, avatarURL });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const { error } = generalSchemaValidation.validate(req.body);
    if (error) throw HttpError(400, "Missing required name field");

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) throw HttpError(404, "Not found");
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const updateFavoriteById = async (req, res, next) => {
  try {
    const { error } = favoriteSchemaValidation.validate(req.body);
    if (error) throw HttpError(400, "Missing field favorite");

    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (!result) throw HttpError(404, "Not found");
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) throw HttpError(404, "Not found");

    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  addNewContact,
  updateContactById,
  updateFavoriteById,
  deleteContactById,
};
