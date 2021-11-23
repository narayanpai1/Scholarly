var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var ResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Form',
    },

    // for caching name
    user: String,

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    response: [
      {
        questionId: String,
        optionId: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

ResponseSchema.plugin(mongoosePaginate);
var Response = mongoose.model('Response', ResponseSchema, 'Response');

module.exports = Response;
