import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getBooks } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const { isAuthenticated, isBuyer } = useAuth();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books');
        toast.error('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleAddToCart = (book) => {
    addToCart(book);
    toast.success(`"${book.title}" added to cart!`, {
      position: 'bottom-right',
      autoClose: 2000,
    });
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(books.map((b) => b.category))];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-fadeInUp">
          <div className="h-12 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-80 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="animate-fadeInUp">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📚 Discover Our Collection
          </h1>
          <p className="text-gray-600">Explore thousands of books across all categories</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          {filteredBooks.length !== books.length && (
            <p className="text-sm text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
            </p>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 animate-slideInLeft">
            ❌ {error}
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <div
              key={book._id}
              className="card animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-5xl">📖</span>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-1 truncate">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">by {book.author}</p>

                <p className="text-gray-700 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
                  {book.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-bold text-blue-600">₹{book.price}</span>
                  <span className={`badge ${book.quantity > 5 ? 'badge-success' : book.quantity > 0 ? 'badge-warning' : 'badge-danger'}`}>
                    {book.quantity > 0 ? `${book.quantity} in stock` : 'Out of Stock'}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-4">Category: {book.category}</p>
              </div>

              {book.quantity > 0 ? (
                <div className="flex gap-2">
                  {isAuthenticated && isBuyer ? (
                    <button
                      onClick={() => handleAddToCart(book)}
                      className="flex-1 btn-primary text-center"
                    >
                      🛒 Add to Cart
                    </button>
                  ) : (
                    <p className="text-sm text-gray-500 italic w-full text-center py-2">
                      Login to add to cart
                    </p>
                  )}
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-2 bg-gray-300 text-gray-600 rounded-lg font-medium cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 mb-2">📭 No books found</p>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

