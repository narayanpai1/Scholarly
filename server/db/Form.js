var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var FormSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },

    name: String,

    description: {
      type: String,
      default: '',
    },

    startTime: Date,

    endTime: Date,

    questions: [
      {
        open: { type: Boolean, default: false },
        questionText: String,
        questionImage: { type: String, default: '' },
        marks: { type: Number, default: 1 },
        options: [
          {
            optionText: String,
            optionImage: { type: String, default: '' },
            isCorrect: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

FormSchema.plugin(mongoosePaginate);
var Form = mongoose.model('Form', FormSchema, 'Form');

module.exports = Form;
