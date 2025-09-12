const Favorite = require('../models/Favorite');

const favoriteController = {
  addFavorite: (req, res) => {
    const userId = req.userId;
    const favoriteData = req.body;
    
    Favorite.addFavorite(userId, favoriteData, (err, newFavorite) => {
      if (err) {
        return res.status(500).json({ message: 'Error adding favorite' });
      }
      res.status(201).json({
        message: 'Added to favorites',
        favorite: newFavorite
      });
    });
  },

  removeFavorite: (req, res) => {
    const userId = req.userId;
    const favoriteId = req.params.id;
    
    Favorite.removeFavorite(userId, favoriteId, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error removing favorite' });
      }
      res.json({ message: 'Removed from favorites' });
    });
  },

  getFavorites: (req, res) => {
    const userId = req.userId;
    
    Favorite.getUserFavorites(userId, (err, favorites) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json(favorites);
    });
  },

  checkFavorite: (req, res) => {
    const userId = req.userId;
    const { itemId, type } = req.params;
    
    Favorite.checkFavorite(userId, itemId, type, (err, favorite) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      res.json({ isFavorite: !!favorite, favoriteId: favorite ? favorite.id : null });
    });
  }
};

module.exports = favoriteController;