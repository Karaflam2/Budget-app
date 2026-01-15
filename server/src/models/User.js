const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
      maxlength: [50, 'Le nom ne doit pas dépasser 50 caractères'],
      trim: true
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Email invalide'
      ]
    },
    password: {
      type: String,
      required: [true, 'Le mot de passe est requis'],
      minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
      select: false // Ne pas retourner le password par défaut
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// ✅ Middleware: Hasher le password avant de sauvegarder
userSchema.pre('save', async function(next) {
  // Si le password n'a pas été modifié, skip
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    // Générer un salt et hasher le password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// ✅ Méthode: Comparer les passwords
userSchema.methods.comparePassword = async function(passwordToCheck) {
  return await bcrypt.compare(passwordToCheck, this.password);
};

// ✅ Méthode: Retourner l'utilisateur sans le password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);