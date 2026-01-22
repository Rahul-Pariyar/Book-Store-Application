import React, { useState, useEffect } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../services/api';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
    isbn: '',
    image: null, // <- image added
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data);
    } catch (err) {
      setError('Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // File handler
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData
    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    data.append('category', formData.category);
    data.append('isbn', formData.isbn);

    // Append image if exists
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingId) {
        await updateBook(editingId, data);
        alert('Book updated successfully');
      } else {
        await createBook(data);
        alert('Book created successfully');
      }

      setFormData({
        title: '',
        author: '',
        description: '',
        price: '',
        quantity: '',
        category: '',
        isbn: '',
        image: null,
      });

      setShowForm(false);
      setEditingId(null);
      fetchBooks();

    } catch (err) {
      alert(err.response?.data?.message || 'Error saving book');
    }
  };

  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      quantity: book.quantity,
      category: book.category,
      isbn: book.isbn,
      image: null,
    });

    setEditingId(book._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        alert('Book deleted successfully');
        fetchBooks();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting book');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📚 Manage Books</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              title: '',
              author: '',
              description: '',
              price: '',
              quantity: '',
              category: '',
              isbn: '',
              image: null,
            });
          }}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {showForm ? 'Cancel' : 'Add Book'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? 'Edit Book' : 'Add New Book'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="title" placeholder="Title" value={formData.title}
              onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />

            <input type="text" name="author" placeholder="Author" value={formData.author}
              onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />

            <input type="number" name="price" placeholder="Price" value={formData.price}
              onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />

            <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity}
              onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />

            <input type="text" name="category" placeholder="Category" value={formData.category}
              onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />

            <input type="text" name="isbn" placeholder="ISBN" value={formData.isbn}
              onChange={handleInputChange} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <textarea name="description" placeholder="Description" value={formData.description}
            onChange={handleInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
            rows="4" required />

          {/* Image Upload */}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="mt-4"
            accept="image/*"
          />

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-4">
            {editingId ? 'Update Book' : 'Create Book'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Author</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Price</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3">{book.title}</td>
                <td className="px-6 py-3">{book.author}</td>
                <td className="px-6 py-3">{book.category}</td>
                <td className="px-6 py-3">₹{book.price}</td>
                <td className="px-6 py-3">{book.quantity}</td>
                <td className="px-6 py-3 text-center">
                  <button onClick={() => handleEdit(book)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm mr-2 hover:bg-blue-700">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(book._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
