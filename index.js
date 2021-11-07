// sql is hard

const fs = require("fs")
const sqlite3 = require("sqlite3"); const db = new sqlite3.Database("./sites.db", sqlite3.OPEN_READWRITE)
const fetch = require("node-fetch")
const cheerio = require("cheerio")

getTheHrefs = async (url) => {
	var hrefs = []
	var res = await fetch(`https://wikipedia.org${url}`)
	var text = await res.text()
	console.log(text)
	var $ = await cheerio.load(text)
	for (x of $("div.mw-parser-output").find("a")) {
		console.log(x.attribs.href)
		if (x.attribs.href
		&& x.attribs.href.startsWith("/wiki")) {
			await db.get(`SELECT * FROM articles WHERE url = ?`, [x.attribs.href], (err, row) => {
				console.log("got to this bit")
				if (row == undefined) {
				db.run(`INSERT INTO articles (visited, url, size, hrefs) VALUES (?, ?, ?, ?)`, [0, x.attribs.href, null, null])
				hrefs.push(x.attribs.href)
				console.log("got here")
				// console.log(`good href is: ${hrefs}`)
			}})
		}
	}
	await db.run(`UPDATE articles SET visited = ?, size = ?, hrefs = ? WHERE url = ?`, [1, 4, hrefs, url])
	console.log(`hrefs: ${hrefs}`)
	console.log(`explored ${url}`)
}

// getTheHrefs(db.run(`SELECT url FROM toVisit LIMIT 1`))
getTheHrefs("/wiki/Halo:_Combat_Evolved")