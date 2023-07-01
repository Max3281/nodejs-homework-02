const express = require("express");

const {
  getAllContacts,
  getContactById,
  addNewContact,
  updateContactById,
  updateFavoriteById,
  deleteContactById,
} = require("../../controllers/contacts");

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", getContactById);

router.post("/", addNewContact);

router.put("/:contactId", updateContactById);

router.patch("/:contactId/favorite", updateFavoriteById);

router.delete("/:contactId", deleteContactById);

module.exports = router;
