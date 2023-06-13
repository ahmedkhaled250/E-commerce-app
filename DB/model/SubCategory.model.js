import { Schema,Types ,model } from "mongoose";


const subCategorySchema = new Schema({

    name: {
        type: String,
        unique: [true, 'name must be unique value'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 20 char'],
        lowercase : true
    },
    slug:String,
    image: {
        type: String,
        required: [true, 'Image is required'],
    },
    imagePublicId:String,
    createdBy: {
        type: Types.ObjectId,
        ref:'User',
        required: [true, 'can not category without owner'],
    },
    categoryId: {
        type: Types.ObjectId,
        ref:'Category',
        required: [true, 'can not category without category'],
    },
}, {
    timestamps: true,
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
})
subCategorySchema.virtual('Product',{
    ref:'Product',
    localField:'_id',
    foreignField:'productId'
})
const subCategoryModel = model('SubCategory', subCategorySchema)
export default subCategoryModel