const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./sites.db")
x = "words"

db.run(`INSERT INTO articles (visited, url, size, hrefs) VALUES (?, ?, ?, ?)`, [0, x, null, null])