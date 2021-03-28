// const fs = require("fs");
// const Database = require("better-sqlite3");

// const db = new Database("", { verbose: console.log });

// const schema = fs.readFileSync("./server/notes_structure.sql", "utf8");
// db.exec(schema);

const { Client } = require("pg");
const client = new Client();
await client.connect();

exports.create = async (userID, { title, subheader, body, lastSaved }) => {
  try {
    const createNoteSql = db
      .prepare(
        `INSERT INTO Notes (userID, title, subheader, body, lastSavedDate) VALUES ($userID, $title, $subheader, $body, $lastSaved)`
      )
      .run({ userID, title, subheader, body, lastSaved });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};

exports.delete = async (noteID, deletedDate) => {
  try {
    const moveNoteSql = db
      .prepare(
        `INSERT INTO DeletedNotes SELECT noteID, userId, title, subheader, body, starred, $deletedDate FROM Notes WHERE noteID = $noteID`
      )
      .run({ noteID, deletedDate });
    const deleteNoteSql = db
      .prepare(`DELETE FROM Notes WHERE noteID = $noteID`)
      .run({ noteID });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};

exports.update = async ({
  noteID,
  title,
  subheader,
  body,
  starred = false,
  lastSaved = null,
}) => {
  try {
    const updateNoteSql = db
      .prepare(
        `UPDATE NOTES SET title = $title, subheader = $subheader, body = $body WHERE noteID = $noteID`
      )
      .run({ title, subheader, body, noteID });
    return { success: true };
  } catch (err) {
    console.error(err.message);
    return { success: false, message: err.message };
  }
};

exports.fetch = async (userID, offset = 0, noteID = null) => {
  try {
    const args = { userID, offset };
    let query = `SELECT noteID, title, subheader, body FROM Notes WHERE userID = $userID`;
    if (noteID !== null) {
      query += ` AND noteID = $noteID`;
      args["noteID"] = noteID;
    }
    query += ` LIMIT 20 OFFSET $offset`;
    const notes = db.prepare(query).all(args);
    console.log(notes);
    return { success: true, notes };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};

const newUser = async (userEmail) => {
  try {
    db.prepare(`INSERT INTO Users(Email) VALUES ($userEmail)`).run({
      userEmail,
    });
    const user = db
      .prepare(`SELECT * FROM Users WHERE Email = $userEmail`)
      .get({ userEmail });
    console.log("NEWUSER", user);
    return { success: true, user };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};

// exports.newDemoUser = async (demoID) => {
//   try {
//     db.prepare(`INSERT INTO Users(Email) VALUES($demoID)`).run({
//       demoID,
//     });
//     return { success: true };
//   } catch (err) {
//     console.error(err);
//     return { success: false, message: err.message };
//   }
// };

exports.clearDemoUser = async (userID) => {
  try {
    db.prepare(`DELETE FROM Users WHERE userID=$userID`).run({ userID });
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  }
};

exports.getUser = async (userEmail) => {
  const user = db
    .prepare(`SELECT * FROM Users WHERE Email = $userEmail`)
    .get({ userEmail });
  if (user !== undefined) return { success: true, user };
  return await newUser(userEmail);
};

exports.newUser = newUser;
