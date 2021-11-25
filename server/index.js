const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const app = express();
const ImageModel = require('./db/Image');
const cors = require('cors');
const router = require('./routes/router');
const config = require('./config');

//db
mongoose
  .connect(config.DATABASE_CLIENT_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB is connected');
  });

//upload
const storage = multer.diskStorage({
  destination: './public',
  filename(req, file, cb) {
    cb(null, 'google-form-content-questions-' + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

//middleware
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

//routes
app.get('/', async (req, res) => {
  try {
    var result = await ImageModel.find().lean();
    res.send(result);
  } catch (e) {
    res.send(e);
  }
});

app.post('/', upload.single('myfile'), async (req, res) => {
  var data = {
    image: req.file.filename,
  };
  var newImage = new ImageModel(data);
  await newImage.save().then((docs) => {
    console.log(docs);
    res.json({ image: docs.image, host: req.protocol + '://' + req.get('host') });
  });
});

app.use('/api', router);

app.listen(process.env.PORT || 3000, () => {
  console.log('\u{1F525}\u{1F680} app listen on port', 5000, '\u{1F525}\u{1F680}');
});
