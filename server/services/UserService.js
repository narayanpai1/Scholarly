const UserModel = require('../db/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_KEY } = require('../config');

module.exports = {
  /***
   * Handles ogin request with email and password
   */
  login: async (req, res) => {
    console.log('heel');
    console.log(req.body.email);

    UserModel.find({
      email: req.body.email,
    }).then((user) => {
      console.log(user);
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed 1',
        });
      }

      console.log(req.body.password, user[0].password);
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        console.log(err);
        if (err) {
          return res.status(401).json({
            message: 'Auth failed 2',
          });
        }
        if (result) {
          console.log(JWT_KEY);
          const token = jwt.sign(user[0].toJSON(), JWT_KEY, {
            expiresIn: '24h',
          });
          return res.status(200).json({
            message: 'Auth successful',
            accessToken: token,
          });
        }
        res.status(401).json({
          message: 'Auth failed 3',
        });
      });
    });
  },

  /***
   * Handles login request from Google-OAuth
   */
  loginFromGoogle: async (req, res) => {
    try {
      var result = await UserModel.findOne({ email: req.body.email }).lean();
      console.log(req.body);
      if (!result) {
        if (req.body.isStudent === undefined) {
          return res.status(200).json(req.body);
        }
        var gData = {
          name: req.body.name,
          email: req.body.email,
          image: req.body.image,
          isStudent: req.body.isStudent,
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

  /***
   * Handles new account creation request
   */
  signup: (req, res) => {
    console.log(req.body);
    bcrypt.hash(req.body.password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: 'Internal Server Error',
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

            if (req.body.isStudent !== undefined) {
              newUser.isStudent = req.body.isStudent;
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
            error: 'Internal Server Error',
          });
        }
      }
    });
  },

  /***
   * Gets the details of the user who sends the request
   */
  getUser: async (req, res) => {
    try {
      var result = await UserModel.findOne({ _id: req.user._id }).lean();
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send(err);
    }
  },

  /***
   * Edits the details of the user who sends the request
   */
  editUser: async (req, res) => {
    try {
      var result = await UserModel.findByIdAndUpdate(req.user._id, req.body, { new: true });
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).send(err);
    }
  },
};
