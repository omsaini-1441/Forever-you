import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role || "user";
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.json({ success: false, message: "Admin access required" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { authUser, authAdmin };
