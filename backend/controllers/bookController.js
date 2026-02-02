import Book from '../models/Book.js';
import cloudinary from "../config/cloudinaryConfig.js";

export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
};

export const createBook = async (req, res) => {
  try {
    const { title, author, description, price, quantity, category, isbn, image } = req.body;
    const file=req.file;

    if (!title || !author || !description || !price || !category) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    if(!file){
      return res.status(400).json({ message: "Image is required" });
    }

    const uploadImage=await new Promise((resolve,reject)=>{
      const stream=cloudinary.uploader.upload_stream(
        {
          folder: "properties",
          transformation: [
            { width: 800, height: 600, crop: "fill" },
            { fetch_format: "auto" }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        }
      )
      stream.end(file.buffer);
  })

    const book = await Book.create({
      title,
      author,
      description,
      price,
      quantity,
      category,
      isbn,
      image:{
        url:uploadImage.secure_url,
        publicId:uploadImage.public_id
      }
    });

    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

export const updateBook = async (req, res) => {
  try {
    // const { title, author, description, price, quantity, category, isbn, imageUrl } = req.body;
    const data = req.body;

    const book = await Book.findByIdAndUpdate(
      req.params.id,
     data,
      { new: true, runValidators: true }
    );

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const isBookOrdered = await Order.exists({ "items.book": req.params.id });

    if (isBookOrdered) {
      return res.status(400).json({
        message: "This book is already ordered and cannot be deleted"
      });
    }

    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting book', error: error.message });
  }
};
