const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ✅ Générer un JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token valide 7 jours
  );
};

// ✅ ÉTAPE 1: Inscription
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation basique
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis'
      });
    }

    // Vérifier que l'email n'existe pas
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({ name, email, password });
    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    // Retourner la réponse
    res.status(201).json({
      success: true,
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

// ✅ ÉTAPE 2: Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur (avec password)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token
    const token = generateToken(user._id);

    // Retourner la réponse
    res.status(200).json({
      success: true,
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// ✅ ÉTAPE 3: Récupérer l'utilisateur courant
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json(user.toJSON());

  } catch (error) {
    console.error('Erreur getCurrentUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur'
    });
  }
};

// ✅ ÉTAPE 4: Rafraîchir le token (optionnel)
exports.refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    const newToken = generateToken(user._id);

    res.status(200).json({
      success: true,
      token: newToken
    });

  } catch (error) {
    console.error('Erreur refreshToken:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rafraîchissement du token'
    });
  }
};