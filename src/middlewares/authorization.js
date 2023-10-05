export const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access unauthorized' });
    }
};
  
 
export const isUser = (req, res, next) => {
    if (req.user.role === 'user') {
      return next();
    } else {
      return res.status(403).json({ message: 'Access unauthorized' });
    }
};

export const isPremium = (req, res, next) => {
  const userRole = req.user.role;
  
  if (userRole === 'admin' || userRole === 'premium') {
    return next ()
  } else {
    return res.status(403).json({ message: 'Access unauthorized' })
  }
};