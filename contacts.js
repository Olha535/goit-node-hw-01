const fs = require("fs").promises;
const path = require("path");
const { v4 } = require("uuid");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
  try {
    const list = await fs.readFile(contactsPath);
    const contactsList = JSON.parse(list);
    console.log("Contacts:");
    console.table(contactsList);
    return contactsList;
  } catch (error) {
    throw error.message;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const result = contacts.find((item) => item.id === contactId);
    if (!result) {
      return null;
    }
    console.log(`Contact with ID ${contactId}`);
    console.table(result);
  } catch (error) {
    throw error.message;
  }
}

async function removeContact(contactId) {
  try {
    const contactsList = await listContacts();
    const idx = await contactsList.findIndex((item) => item.id === contactId);
    if (idx === -1) {
      return null;
    }
    const removeByContact = await contactsList.splice(idx, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
    console.log(`Contact with ID ${contactId} removed`);
    console.table(idx);
    return removeByContact;
  } catch (error) {
    throw error.message;
  }
}

async function addContact(name, email, phone) {
  try {
    const contactsList = await listContacts();
    const id = v4();
    const newContact = { name, email, phone, id };
    await contactsList.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contactsList, null, 2));
    console.log(`Contact ${name} added`);
    console.table(newContact);
    return newContact;
  } catch (error) {
    throw error.message;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
