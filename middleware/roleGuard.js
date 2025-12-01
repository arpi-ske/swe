const ROLES = {
  ADMIN: 1,
  USER: 10
};

const ROLE_NAMES = {
  1: "Админ",
  10: "Хэрэглэгч"
};

const PERMISSIONS = {
  VIEW_OWN_PROFILE: [ROLES.ADMIN, ROLES.USER],
  UPDATE_OWN_PROFILE: [ROLES.ADMIN, ROLES.USER],
  VIEW_ALL_USERS: [ROLES.ADMIN],
  MANAGE_USERS: [ROLES.ADMIN],
  MANAGE_PRODUCTS: [ROLES.ADMIN],
};

function hasPermission(userRole, permission) {
  const allowedRoles = PERMISSIONS[permission];
  return allowedRoles && allowedRoles.includes(userRole);
}

function requirePermission(permission) {
  return function(req, res, next) {
    if (!req.user) return res.status(401).json({ success:false, message:"Нэвтрэх шаардлагатай" });
    if (!hasPermission(req.user.role, permission)) {
      return res.status(403).json({ success:false, message:"Та энэ үйлдлийг хийх эрхгүй байна" });
    }
    next();
  };
}

function requireRoles(...allowed) {
  return function(req, res, next) {
    if (!req.user) return res.status(401).json({ success:false, message:"Нэвтрэх шаардлагатай" });
    if (!allowed.includes(+(req.user?.role ?? 10))) {
      return res.status(403).json({ success:false, message:"Эрх хүрэлцэхгүй байна" });
    }
    next();
  };
}

module.exports = {
  ROLES,
  ROLE_NAMES,
  PERMISSIONS,
  hasPermission,
  requirePermission,
  requireRoles
};

