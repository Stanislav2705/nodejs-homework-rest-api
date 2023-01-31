const express = require("express");
const {
  getContacts,
  getContactsById,
  postContact,
  deleteContact,
  putContact,
} = require("../../controllers/contactController");
const { tryCatchWrapper } = require("../../helpers");
const { validateBody } = require("../../middlewares");
const { contactsSchema } = require("../../schema/contactSchema");

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContactsById));

router.post("/", validateBody(contactsSchema), tryCatchWrapper(postContact));

router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  validateBody(contactsSchema),
  tryCatchWrapper(putContact)
);

module.exports = router;
