const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");

// Google OAuth Strategy
passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID:
        "498752447104-3dud6h4ncc9jqieshj7fcbb4orj8nokn.apps.googleusercontent.com",
      clientSecret: "rQSKa8NCA_wU996Y8z7gkrvk",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      console.log("profile", profile);
    }
  )
);
