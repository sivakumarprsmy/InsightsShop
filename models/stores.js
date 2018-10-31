const mongoose = require('mongoose');

const StoreSchema = mongoose.Schema({
	store_id:{
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
    },
    phone:{
		type: String,
		required: true
    },
    location: {
        type: [Number], 
        required: true
    }
});

// Indexes this schema in geoJSON format
StoreSchema.index({location: '2dsphere'});

// Exports this schema
const Store = module.exports = mongoose.model('Store', StoreSchema);