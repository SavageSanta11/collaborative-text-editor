const { Schema, model } = require("mongoose")

const Document = new Schema({ // dictactes what's in our objects in the database
  _id: String,
  data: Object,
})

module.exports = model("Document", Document)