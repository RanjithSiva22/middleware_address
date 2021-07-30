const mongoose = require('mongoose');
const { Schema } = mongoose;

const addrSchema = new Schema({
  fullName: { type: String, required: true },
  email:{ type: String, required: true },
  phoneNumber:{ type: String, required: true },
  addressLine: { type: String, required: true },
  state:{ type: String, required: true },
  city:{ type: String, required: true },
  postcode:{ type: String, required: true },
  country:{ type: String, required: true },

});

const Addr = mongoose.model('address', addrSchema);

module.exports = Addr;