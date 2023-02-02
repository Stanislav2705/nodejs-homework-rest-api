const express = require("express");
const router = express.Router();

const {
  getContacts,
  getContactsById,
  postContact,
  deleteContact,
  putContact,
  patchContact,
} = require("../../controllers/contactController");
const { tryCatchWrapper } = require("../../helpers");
const { validateBody } = require("../../middlewares");
const {
  contactsSchema,
  contactStatusSchema,
} = require("../../schema/contactSchema");

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContactsById));

router.post("/", validateBody(contactsSchema), tryCatchWrapper(postContact));

router.delete("/:contactId", tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  validateBody(contactsSchema),
  tryCatchWrapper(putContact)
);

router.patch(
  "/:contactId/favorite",
  validateBody(contactStatusSchema),
  tryCatchWrapper(patchContact)
);

module.exports = router;
