import express from "express";
import ejs from "ejs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url))
const port = 2000;

const app = express();
app.set("views", path.join(__dirname, "views"));

let entriesDir = path.join(__dirname, "public", "entries");

export function setEntriesDir(dir) {
    entriesDir = dir;
}

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0');
const day = String(date.getDate()).padStart(2, '0');

var dateString = `${year}-${month}-${day}`;

var visit_entry = dateString;

app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    var entries = listFiles(entriesDir);
    var wordsWritten = calculateWordsWritten(entries);
    res.render("index.ejs", {entries: entries, wordsWritten: wordsWritten});
})

app.get("/writ", (req, res) => {
    console.log(dateString);
    var entries = listFiles(entriesDir);
    res.render("writ.ejs", {date: dateString, entries: entries});
});

app.post("/writ/submit", (req, res) => {
  console.log(req.body);
  fs.writeFile(path.join(entriesDir, `entry_${req.body["date"]}`), JSON.stringify(req.body), err => {
    if (err) {
    console.error(err);
    } else {
    console.log('File written successfully');
    }
  });
  res.redirect("/");
})

app.post("/edit/submit", (req, res) => {
  console.log(req.body);
  console.log(req.body["entry"]);
  req.body["entry"] = req.body["entry"] + `\n \n   [edited on ${dateString}]`
  fs.writeFile(path.join(entriesDir, `entry_${req.body["date"]}`), JSON.stringify(req.body), err => {
    if (err) {
    console.error(err);
    } else {
    console.log('File written successfully');
    }
  });
  res.redirect("/");
})

app.get("/read/post/:date", (req, res) => {
    const { date } = req.params;
    var entries = listFiles(entriesDir);
    entries.forEach(element => {
        var index = entries.indexOf(element);
        var first = false;
        var last = false;
        if (element.date === date ) {
            if (index == 0) {
                first = true;
                var self = element;
                console.log(first);
                res.render("read-post.ejs", {post: element, entries: entries,
                prev: self, next: entries[index+1], 
                first: first, last: last});
            }
            else if (index == (entries.length - 1)) {
                var self = element;
                last = true;
                console.log(last);
                res.render("read-post.ejs", {post: element, entries: entries, 
                prev: entries[index-1], next: self, 
                first: first, last: last});
            }
            else {
                res.render("read-post.ejs", {post: element, entries: entries, 
                prev: entries[index-1], next: entries[index+1], 
                first: first, last: last}); 
            }
        }
    });
})


app.get("/read", (req, res) => {
    console.log(dateString);
    var entries = listFiles(entriesDir);
    res.render("read.ejs", {date: dateString, entries: entries});
});

app.get("/edit", (req, res) => {
    console.log(dateString);
    var entries = listFiles(entriesDir);
    res.render("edit.ejs", {date: dateString, entries: entries});
});

app.get("/edit/:date", (req, res) => {
    const { date } = req.params;
    var entries = listFiles(entriesDir);
    entries.forEach(element => {
        var index = entries.indexOf(element);
        var first = false;
        var last = false;
        if (element.date === date ) {
            if (index == 0) {
                first = true;
                var self = element;
                console.log(first);
                res.render("edit-post.ejs", {entry: element, entries: entries,
                prev: self, next: entries[index+1], 
                first: first, last: last});
            }
            else if (index == (entries.length - 1)) {
                var self = element;
                last = true;
                console.log(last);
                res.render("edit-post.ejs", {entry: element, entries: entries, 
                prev: entries[index-1], next: self, 
                first: first, last: last});
            }
            else {
                res.render("edit-post.ejs", {entry: element, entries: entries, 
                prev: entries[index-1], next: entries[index+1], 
                first: first, last: last}); 
            }
        }
    });
})

app.get("/edit/delete/:date", (req, res) => {
    const { date } = req.params;
    deleteFileFromPublic("entry_" + date);
    res.redirect("/");
})

function listFiles(dirPath) {
    try {
        // Read directory contents
        const files = fs.readdirSync(dirPath);

        var entryList = []

        files.forEach(file => {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat.isFile()) {
                entryList.push(JSON.parse(fs.readFileSync(fullPath, 'utf8')));
            }
        });
    } catch (err) {
        console.error(`Error reading directory: ${err.message}`);
    }

    return entryList;
}


function deleteFileFromPublic(fileName) {
    try {
        // Resolve the file path securely
        const filePath = path.join(entriesDir, fileName);

        // Check if file exists before deleting
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Synchronous delete
            console.log(`✅ File "${fileName}" deleted successfully.`);
        } else {
            console.log(`⚠️ File "${fileName}" does not exist.`);
        }
    } catch (err) {
        console.error(`❌ Error deleting file: ${err.message}`);
    }
}


function calculateWordsWritten(entries, ) {
    var sum = 0;
    function countWords(str) {
        return str.trim().split(/\s+/).length;
    }
    entries.forEach(element => {
        sum = sum + countWords(element.entry);    
    });

    return sum;
}

export function startServer() {
    return new Promise((resolve) => {
        app.listen(port, () => {
            console.log(`Server on ${port}`);
            resolve(port);
        });
    });
}