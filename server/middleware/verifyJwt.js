const jwt = require("jsonwebtoken");

exports.verifyJwt = (req, res, next) => {
  console.log("Verifying JWT token...");

  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("No JWT token found in the request headers.");
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log("JWT token verification failed:", err.message);
      return res.status(403).json({ message: "Forbidden", error: err.message });
    }

    console.log("JWT token verified successfully.");

    // Extract user information from the decoded token
    const { username, roles } = decoded.UserInfo;
    req.user = username;
    req.roles = roles;

    // Call the next middleware or route handler
    next();
  });
};

exports.adminRoute = (req, res, next) => {
  console.log("Checking admin access...");
  
  if (req.user && req.roles.includes("admin")) {
    console.log("Admin access granted.");
    next();
  } else {
    console.log("Admin access denied.");
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};
