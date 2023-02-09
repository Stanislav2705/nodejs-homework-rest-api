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
const { validateBody, auth } = require("../../middlewares");
const {
  contactsSchema,
  contactStatusSchema,
} = require("../../schema/contactSchema");

router.get("/",auth, tryCatchWrapper(getContacts));

router.get("/:contactId",auth, tryCatchWrapper(getContactsById));

router.post("/",auth, validateBody(contactsSchema), tryCatchWrapper(postContact));

router.delete("/:contactId",auth, tryCatchWrapper(deleteContact));

router.put(
  "/:contactId",
  auth,
  validateBody(contactsSchema),
  tryCatchWrapper(putContact)
);

router.patch(
  "/:contactId/favorite",
  auth,
  validateBody(contactStatusSchema),
  tryCatchWrapper(patchContact)
);

module.exports = router;
