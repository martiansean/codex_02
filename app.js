const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const crypto = require("crypto");
// const exphbs = require("express-handlebars");
const session = require("express-session");
const {ensureAuthenticated} = require('./helpers/auth');
const bodyParser = require("body-parser");
const multer = require("multer");
const passport = require("passport")
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");

const app = express();

require('./models/Unit');
const Unit = mongoose.model('units');

require('./models/File')
const File = mongoose.model('files')

require('./models/User')
const User = mongoose.model('users')

// Passport Config
require('./config/passport')(passport);

const api = require('./controllers/api')
const users = require('./controllers/users');

// Map global promise - get rid of warning
mongoose.Promise = global.Promise;
// Connect to mongoose
const MongoURI = 'mongodb://sean:sean@dataprep-shard-00-00-syum3.gcp.mongodb.net:27017,dataprep-shard-00-01-syum3.gcp.mongodb.net:27017,dataprep-shard-00-02-syum3.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Dataprep-shard-0&authSource=admin&retryWrites=true&w=majority'
const conn = mongoose.connect(
  MongoURI,
  {
    useMongoClient: true
  }
)
console.log("mongo is running")

// Express session midleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Init gfs
let gfs;

conn.once("open", () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});

// Create storage engine
const storage = new GridFsStorage({
  url: MongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        // console.log(file.originalname)
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        // console.log(fileInfo)
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

app.get('/', (req, res) => {
  res.send(index)
})

app.get('/unauthorised', (req,res) => {
  res.sendFile('public/unauth.html', {root: __dirname } )
})

app.get('/auth',ensureAuthenticated, (req,res) => {
  res.sendFile('public/auth.html', {root: __dirname } )
})

app.get('/student', (req,res) => {
  res.sendFile('public/student.html', {root: __dirname } )
})

app.get('/login', (req,res) => {
  res.sendFile('public/login.html', {root: __dirname } )
})

app.post('/upload', ensureAuthenticated, upload.single("file"), (req, res, callback) => {
  if (req.file == undefined) {
    res.send({text:'No file inserted',error: true });
  }
  else {

    const newFile = {
      fileID: req.file.id,
      filename: req.file.filename,
      file_firstname: req.file.originalname,
      unit: req.body.unit
    }
    new File(newFile).save().then(() => {
      res.send({text:'File saved',error: false })
    })
  }
})

app.get('/file/:filename', (req,res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists"
      });
    }
    else {
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    }
  })
})

app.delete('/file/:id', ensureAuthenticated,(req,res) => {
  let location = req.params.id;
  gfs.remove({ _id: location , root: 'uploads' }).then(() => {
    File.remove({fileID:req.params.id}).then(() => {
      res.send({text:"File deleted", error:false})
    })
  });
})

//use routes
app.use('/api', api);
app.use('/users', users);

// app.get('*', function(req, res) {  
//     res.redirect('https://' + req.headers.host + req.url);
// })

app.use (function (req, res, next) {
        if (req.secure) {
                // request was via https, so do no special handling
                next();
        } else {
                // request was via http, so redirect to https
                res.redirect('https://' + req.headers.host + req.url);
        }
});

app.use(function(req, res, next){
  res.status(404);
  res.sendFile('public/404.html', {root: __dirname } )
});




// const port = 1000;

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
app.listen(process.env.PORT);
