const express = require("express");
const authenticate = require("../../middlewares/auth");

const upload = require("../../middlewares/upload");

const {
  getAllContacts,
  getContactById,
  addNewContact,
  updateContactById,
  updateFavoriteById,
  deleteContactById,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", authenticate, getAllContacts);

router.get("/:contactId", authenticate, getContactById);

router.post("/", upload.single("avtr"), authenticate, addNewContact);

router.put("/:contactId", authenticate, updateContactById);

router.patch("/:contactId/favorite", authenticate, updateFavoriteById);

router.delete("/:contactId", authenticate, deleteContactById);

module.exports = router;
