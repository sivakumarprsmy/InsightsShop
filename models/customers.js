const mongoose = require('mongoose');

const CustomerSchema = mongoose.Schema({
	first_name:{
		type: String,
		required: true
	},
	last_name:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	email_id:{
		type: String,
		required: true
    },
    phone:{
		type: String,
		required: true
    },
    addr_line_1:{
        type: String,
		required: true
    },
    addr_line_2:{
        type: String,
		required: true
    },
    city:{
        type: String,
		required: true
    },
    state:{
        type: String,
		required: true
    },
    zip:{
        type: String,
		required: true
    },
    country:{
        type: String,
		required: true
    }
});

const Customer = module.exports = mongoose.model('Customer', CustomerSchema);