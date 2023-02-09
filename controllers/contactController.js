const { HttpError } = require("../helpers");
const { Contact } = require("../models/contacts");

const getContacts = async (req, res) => {
  const { _id } = req.user;
  const { limit = 10, page=1, favorite = [true,false] } = req.query;
  const skip = (page - 1) * limit;

  const contacts = await Contact.find({owner: _id,favorite}).skip(skip).limit(limit);
  return res.json(contacts);
};

const getContactsById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(HttpError(404, "Not found"));
  }

  return res.json(contact);
};

const postContact = async (req, res) => {
  const { _id } = req.user;
  const newContact = await Contact.create({...req.body, owner: _id});

  return res.status(201).json(newContact);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(HttpError(404, "Not found"));
  }

  await Contact.findByIdAndRemove(contactId);
  return res.status(200).json({ message: "contact deleted" });
};

const putContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    return next(HttpError(404, "Not found"));
  }

  return res.status(200).json(updatedContact);
};

const patchContact = async (req, res, next) => {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    return next(HttpError(404, "Not found"));
  }

  return res.status(200).json(updatedContact);
};

module.exports = {
  getContacts,
  getContactsById,
  postContact,
  deleteContact,
  putContact,
  patchContact,
};
