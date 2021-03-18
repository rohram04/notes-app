PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
CREATE TABLE Users (
userID INTEGER PRIMARY KEY AUTOINCREMENT,
Email VARCHAR(400)
);
CREATE TABLE Notes (
noteID INTEGER PRIMARY KEY AUTOINCREMENT,
userID INTEGER,
title VARCHAR(255),
subheader varchar(255),
body TEXT,
starred INTEGER DEFAULT 0 CHECK (starred = 0 OR starred = 1),
lastSavedDate VARCHAR(50),
FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);
CREATE TABLE DeletedNotes (
noteID INTEGER PRIMARY KEY AUTOINCREMENT,
userID INTEGER,
title VARCHAR(255),
subheader varchar(255),
body TEXT,
starred INTEGER DEFAULT 0 CHECK (starred = 0 OR starred = 1),
DeletedDate VARCHAR(50),
FOREIGN KEY (userID) REFERENCES Users(userID) ON DELETE CASCADE
);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('Users',2);
COMMIT;