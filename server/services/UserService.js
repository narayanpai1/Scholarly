const UserModel = require('../db/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_KEY } = require('../config');

module.exports = {
  login: async (req, res) => {
    console.log('heel');
    UserModel.find({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed',
        });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Auth failed',
          });
        }
        if (result) {
          const token = jwt.sign(user[0], JWT_KEY, {
            expiresIn: '24h',
          });
          return res.status(200).json({
            message: 'Auth successful',
            token: token,
          });
        }
        res.status(401).json({
          message: 'Auth failed',
        });
      });
    });
  },

  loginFromGoogle: async (req, res) => {
    try {
      var result = await UserModel.findOne({ email: req.body.email }).lean();
      if (!result) {
        var gData = {
          name: req.body.name,
          email: req.body.email,
          image: req.body.image,
          student: req.body.student || true,
        };

        var newUser = new UserModel(gData);
        newUser.save().then((user) => {
          console.log(user.toJSON());
          const accessToken = jwt.sign(user.toJSON(), JWT_KEY);

          res.status(200).json({
            accessToken,
          });
        });
      } else {
        const accessToken = jwt.sign(result, JWT_KEY);
        res.status(200).json({
          accessToken,
        });
      }
    } catch (error) {
      res.send(error);
    }
  },

  signup: (req, res) => {
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err,
        });
      } else {
        try {
          var user = await UserModel.findOne({
            email: req.body.email,
          });
          if (!user) {
            let newUser = {
              email: req.body.email,
              password: hash,
              name: req.body.name,
              enrolledCourses: [],
            };

            if (req.body.student) {
              newUser.student = req.body.student;
            }

            newUser = new UserModel(newUser);
            newUser.save().then(async (resUser) => {
              const accessToken = await jwt.sign(resUser.toJSON(), JWT_KEY);
              console.log(accessToken);
              res.status(200).json({
                accessToken,
              });
            });
          } else {
            res.status(409).json({
              message: 'Email already exists',
            });
          }
        } catch (err) {
          console.log('oooi', err);
          res.status(500).json({
            error: err,
          });
        }
      }
    });
  },

  getUser: async (req, res) => {
    try {
      var result = await UserModel.findOne({ _id: req.user._id }).lean();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  editUser: async (req, res) => {
    try {
      var result = await UserModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
};
