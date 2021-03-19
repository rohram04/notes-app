const { Pool } = require("pg");

//REVIEW: Maybe environment variable as json and then parse
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
        `UPDATE NOTES SET title = $1, subheader = $2, body = $3 WHERE noteid = $4 RETURNING *`,
        [title, subheader, body, noteid]
      )
    ).rows;
    if (updateNoteSql.length === 0)
      throw { message: "resource does not exist" };
    return { success: true };
  } catch (err) {
    console.error(err.message);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.fetch = async (userid, offset = 0, noteid = null) => {
  if (noteid !== null) return await fetchSingle(userid, noteid);
  const db = await pool.connect();
  try {
    const notes = (
      await db.query(
        `SELECT noteid, title, subheader, body FROM Notes WHERE userid = $1 LIMIT 20 OFFSET $2`,
        [userid, parseInt(offset)]
      )
    ).rows;
    return { success: true, notes };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

const fetchSingle = async (userid, noteid) => {
  const db = await pool.connect();
  try {
    const note = (
      await db.query(
        "SELECT noteid, title, subheader, body FROM Notes WHERE userid=$1 AND noteid=$2",
        [userid, noteid]
      )
    ).rows;
    if (note.length === 0) throw { message: "resource not found" };
    return { success: true, notes: note };
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
    return { success: true, userid: user.userid };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.clearDemoUser = async (userid) => {
  const db = await pool.connect();
  try {
    const users = (
      await db.query(`DELETE FROM Users WHERE userid=$1 RETURNING *`, [userid])
    ).rows;
    console.log(users);
    if (users.length === 0) throw { message: "resource not found" };
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.getUserid = async (userEmail) => {
  const db = await pool.connect();
  try {
    const user = (
      await db.query(`SELECT userid FROM Users WHERE Email = $1`, [userEmail])
    ).rows[0];
    if (user !== undefined) return { success: true, userid: user.userid };
    return await newUser(userEmail);
  } catch (err) {
    console.error(err.message);
    return { success: false, message: err.message };
  } finally {
    db.release();
  }
};

exports.newUser = newUser;
