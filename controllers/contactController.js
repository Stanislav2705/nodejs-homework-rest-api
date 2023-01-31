const { HttpError } = require("../helpers");
const {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateContact,
} = require("../models/contacts");

const getContacts = async (req, res) => {
  const contacts = await listContacts();
  return res.json(contacts);
};

const getContactsById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    return next(HttpError(404, "Not found"));
  }

  return res.json(contact);
};

const postContact = async (req, res) => {
  const { body } = req.body;
  const newContact = await addContact(body);

  res.status(201).json(newContact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (!contact) {
    return next(HttpError(404, "Not found"));
  }

  await removeContact(contactId);
  res.status(200).json({ message: "contact deleted" });
};

const putContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await updateContact(contactId, req.body);

  if (!updatedContact) {
    return next(HttpError(404, "Not found"));
  }

  res.status(200).json(updatedContact);
};

module.exports = {
  getContacts,
  getContactsById,
  postContact,
  deleteContact,
  putContact,
};
