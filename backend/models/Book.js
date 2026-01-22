import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      
    },
    image:{
      url:{
        type:String,
        required:true
      },
      publicId:{
        type:String,
        required:true
      }
    }
  },
  { timestamps: true }
);

export default mongoose.model('Book', bookSchema);
