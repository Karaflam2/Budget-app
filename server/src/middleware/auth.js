const jwt = require('jsonwebtoken');

/**
 * Middleware pour vérifier le JWT token
 * Ajoute l'userId au req.user
 */
const verifyToken = (req, res, next) => {
  try {
    // ✅ Récupérer le token du header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant'
      });
    }

    // ✅ Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();

  } catch (error) {
    // ✅ Token expiré ou invalide
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré',
        code: 'TOKEN_EXPIRED'
      });
    }

    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};

/**
 * Middleware pour les routes protégées
 * Vérifie que l'utilisateur est authentifié
 */
const authRequired = [verifyToken]; // À utiliser dans les routes

module.exports = { verifyToken, authRequired };