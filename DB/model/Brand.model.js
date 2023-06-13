import { Schema,Types ,model } from "mongoose";


const brandSchema = new Schema({

    name: {
        type: String,
        unique: [true, 'name must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char'],
        lowercase : true
    },
    slug:String,
    imagePublicId:String,
    logo: {
        type: String,
        required: [true, 'Image is required'],
    },
    createdBy: {
        type: Types.ObjectId,
        ref:'User',
        required: [true, 'can not category without owner'],
    },
}, {
    timestamps: true,
})

const brandModel = model('Brand', brandSchema)
export default brandModel