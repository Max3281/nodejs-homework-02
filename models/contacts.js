const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  const getAllContacts = await fs.readFile(`${contactPath}`, "utf-8");
  return JSON.parse(getAllContacts);
};

const getContactById = async (contactId) => {
  const getAllContacts = await listContacts();

  const result = getAllContacts.find((val) => val.id === contactId);
  return result || null;
};

const addContact = async (body) => {
  const getAllContacts = await listContacts();
  const { name, email, phone } = body;

  const addNew = {
    id: nanoid(9),
    name,
    email,
    phone,
  };

  const conMerge = [...getAllContacts, addNew];
  await fs.writeFile(contactPath, JSON.stringify(conMerge, null, 2));
  console.log(addNew);
  return conMerge;
};

const updateContact = async (contactId, body) => {
  const getAllContacts = await listContacts();

  const idx = getAllContacts.findIndex((i) => i.id === contactId);
  if (idx === -1) {
    return null;
  }
  getAllContacts[idx] = { contactId, ...body };
  await fs.writeFile(contactPath, JSON.stringify(getAllContacts, null, 2));
  console.log(getAllContacts[idx]);
  return getAllContacts[idx];
};

const removeContact = async (contactId) => {
  const getAllContacts = await listContacts();

  const filterCon = getAllContacts.filter((fil) => fil.id !== contactId);
  await fs.writeFile(contactPath, JSON.stringify(filterCon, null, 2));
  console.log(filterCon);
  return filterCon;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
