import { Schema,Types ,model } from "mongoose";


const categorySchema = new Schema({

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
    image: {
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
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
})
categorySchema.virtual('SubCategory',{
    ref:'SubCategory',
    localField:'_id',
    foreignField:'categoryId'
})
categorySchema.virtual('Product',{
    ref:'Product',
    localField:'_id',
    foreignField:'productId'
})


const categoryModel = model('Category', categorySchema)
export default categoryModel