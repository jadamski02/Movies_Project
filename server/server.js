const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const bcrypt = require ('bcrypt');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const PORT = 5000;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const LOCAL_DB = process.env.LOCAL_DB;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(LOCAL_DB);

db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, data TEXT)');
  });

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) {
        return res.sendStatus(401);
    }

    jwt.verify(token, ACCESS_TOKEN, (err, data) => {
        if(err) {
            return res.sendStatus(403);
        }
        req.user = data;
        next();
    });
}

app.get('/', function(req, res) {
    res.send("Welcome");
});

app.get('/admin', authMiddleware, (req, res) => {
    res.send('Panel admina');
});

app.get('/movies', (req, res) => {
    const sql = 'SELECT * FROM movies';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.get('/users', authMiddleware, (req, res) => {
    const sql = 'SELECT * FROM users u JOIN roles r on u.role_id = r.id';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post('/new-movie', (req, res) => {
    const { title, length, year } = req.body;
    const sql = 'INSERT INTO movies (title, length, year) VALUES (?, ?, ?)';
    db.run(sql, [title, length, year], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Record created successfully' });
    });
});

app.post("/signUp", async (req, res) => {
        const {username, password, firstName, lastName, age} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (login, password, first_name, last_name, age, role_id) VALUES (?, ?, ?, ?, ?, 1)';
        db.run(sql, [username, hashedPassword, firstName, lastName, age], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            const payload = {
                username
            };
            const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: '24m'});
            res.json({
                "firstName": firstName, 
                "lastName": lastName,
                "username": username,
                "age": age,
                "token": token,
                "role_id": 1}
            );
        });
});

async function getUser(db, login) {
    return new Promise((resolve, reject) => {
        db.get(`SELECT u.id, u.first_name, u.last_name, u.login, u.password, u.age, u.role_id, r.role FROM users u JOIN roles r ON u.role_id = r.id WHERE login = '${login}'`,(err, row) => {
            if (err) reject(err);
            resolve(row);
        });
    });
}

app.post("/checkLoginStatus", async (req, res) => {
    const {token} = req.body;
    jwt.verify(token, ACCESS_TOKEN, (err, data) => {
        if(err) {
            return res.sendStatus(403);
        }
        return res

            .json({
                "firstName": data.first_name, 
                "lastName": data.last_name,
                "username": data.login,
                "age": data.age,
                "id": data.id,
                "role_id": data.role_id,
                "role": data.role
            })
    });
})

app.get("/getUser", async (req, res) => {
    const username = req.query.username;
    user = await getUser(db, username);
    res.json({
        "firstName": user.first_name, 
        "lastName": user.last_name,
        "username": login,
        "age": user.age,
        "id": user.id,
        "role_id": user.role_id,
        "role": user.role
    });
})

app.post("/login", async (req, res) => {
        const {username, password} = req.body 
        user = await getUser(db, username);
        if(!user || !password) return res.sendStatus(404);
        if(user.role_id === 3) {
            console.log("Użytkownik zablokowany");
            return res.sendStatus(403);
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if(passwordMatch) {
            const payload = user;
            const token = jwt.sign(payload, ACCESS_TOKEN, { expiresIn: '24m'});
             res.json({
                 "firstName": user.first_name, 
                 "lastName": user.last_name,
                 "username": username,
                 "age": user.age,
                 "token": token,
                "role_id": user.role_id
             });
        } else return res.sendStatus(401);
});

app.post('/passwordChange', async (req, res) => {
    const { login, oldPassword, newPassword} = req.body;
    user = await getUser(db, login);
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if(passwordMatch) {
        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        const sql = `UPDATE users SET password = '${newHashedPassword}' WHERE login = '${login}'`;
        db.run(sql, (err) => {
            if(err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ message: 'Password updated successfully' });
        })
    } 
});

app.post('/zwiekszUprawnienia', (req, res) => {
    const { login } = req.body;
    const sql = `UPDATE users SET role_id = 2 WHERE login = '${login}'`;
    db.run(sql, (err) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Role updated successfully' });
    })
});

app.post('/odbierzUprawnienia', (req, res) => {
    const { login } = req.body;
    const sql = `UPDATE users SET role_id = 1 WHERE login = '${login}'`;
    db.run(sql, (err) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Role updated successfully' });
    })
});

app.post('/zablokujKonto', (req, res) => {
    const { login } = req.body;
    const sql = `UPDATE users SET role_id = 3 WHERE login = '${login}'`;
    db.run(sql, (err) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Role updated successfully' });
    })
});

app.post('/odblokujKonto', (req, res) => {
    const { login } = req.body;
    const sql = `UPDATE users SET role_id = 1 WHERE login = '${login}'`;
    db.run(sql, (err) => {
        if(err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Role updated successfully' });
    })
});

app.post('/upload', upload.single('image'), (req, res) => {
    const data = req.file.buffer.toString('base64');
    const { title, length, year } = req.body;
  
    db.run('INSERT INTO movies (title, length, year, image) VALUES (?, ?, ?, ?)', [title, length, year, data], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(200).json({ message: 'Image uploaded successfully' });
    });
  });

  app.get('/image/:id', (req, res) => {
    const id = req.params.id;
  
    db.get('SELECT * FROM images WHERE movie_id = ?', [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      if (!row) {
        return res.status(404).json({ message: 'Image not found' });
      }
  
      const image = {
        id: row.id,
        name: row.name,
        data: row.data,
      };
  
      res.status(200).json(image);
    });
  });

  app.use(bodyParser.urlencoded({ 
    extended: true 
}));

  app.delete('/deleteMovies', (req, res) => {
    const moviesToDeleteIds = req.body.Source;
    const placeholders = moviesToDeleteIds.map(() => '?').join(',');
    const query = `DELETE FROM movies WHERE id IN (${placeholders})`;
    db.run(query, moviesToDeleteIds, (err) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: 'Movies deleted successfully' });
      });
    
  });


