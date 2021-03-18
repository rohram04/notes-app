// const fs = require("fs");
// const Database = require("better-sqlite3");

// const db = new Database("", { verbose: console.log });

// const schema = fs.readFileSync("./server/notes_structure.sql", "utf8");
// db.exec(schema);
const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

exports.create = async (userid, { title, subheader, body, lastSaved }) => {
  const db = await pool.connect();
  try {
    const createNoteSql = (
      await db.query(
        `INSERT INTO Notes (userid, title, subheader, body, lastSavedDate) VALUES ($1, $2, $3, $4, $5)`,
        [userid, title, subheader, body, lastSaved]
      )
    ).rows;
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.delete = async (noteid, deletedDate) => {
  const db = await pool.connect();
  try {
    const moveNoteSql = (
      await db.query(
        `INSERT INTO DeletedNotes SELECT noteid, userid, title, subheader, body, starred, $2 FROM Notes WHERE noteid = $1`,
        [noteid, deletedDate]
      )
    ).rows;
    const deleteNoteSql = (
      await db.query(`DELETE FROM Notes WHERE noteid = $1`, [noteid])
    ).rows;
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.update = async ({
  noteid,
  title,
  subheader,
  body,
  starred = false,
  lastSaved = null,
}) => {
  const db = await pool.connect();
  try {
    const updateNoteSql = (
      await db.query(
        `UPDATE NOTES SET title = $1, subheader = $2, body = $3 WHERE noteid = $4`,
        [title, subheader, body, noteid]
      )
    ).rows;
    return { success: true };
  } catch (err) {
    console.error(err.message);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.fetch = async (userid, offset = 0, noteid = null) => {
  const db = await pool.connect();
  try {
    let args = [userid, parseInt(offset)];
    let query = `SELECT noteid, title, subheader, body FROM Notes WHERE userid = $1`;
    if (noteid !== null) {
      query += ` AND noteid = $3`;
      args.push(noteid);
    }
    query += ` LIMIT 20 OFFSET $2`;
    console.log("GETTINGNOTES", args);
    const notes = (await db.query(query, args)).rows;
    console.log("GETTINGNOTES2");
    console.log(notes);
    return { success: true, notes };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

const newUser = async (userEmail) => {
  const db = await pool.connect();
  try {
    user = (
      await db.query(`INSERT INTO Users(Email) VALUES ($1) RETURNING *`, [
        userEmail,
      ])
    ).rows[0];
    // const user = db
    //   .query(`SELECT * FROM Users WHERE Email = $userEmail`)
    //   .get({ userEmail });
    console.log("NEWUSER", user);
    return { success: true, user };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

// exports.newDemoUser = async (demoID) => {
//   try {
// const db = await pool.connect();
//     db.query(`INSERT INTO Users(Email) VALUES($demoID)`).run({
//       demoID,
//     });
//     return { success: true };
//   } catch (err) {
//     console.error(err);
//     return { success: false, message: err.message };
//   }
// };

exports.clearDemoUser = async (userid) => {
  const db = await pool.connect();
  try {
    await db.query(`DELETE FROM Users WHERE userid=$1`, [userid]);
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.getUser = async (userEmail) => {
  const db = await pool.connect();
  try {
    const user = (
      await db.query(`SELECT * FROM Users WHERE Email = $1`, [userEmail])
    ).rows[0];
    console.log("USER", user);
    if (user !== undefined) return { success: true, user };
    return await newUser(userEmail);
  } catch (err) {
    console.error(err.message);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.newUser = newUser;
