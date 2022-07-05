const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 3000;

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(expressLayouts);

app.use(cookieParser("forexBlogSecure"));
app.use(
  session({
    secret: "forexForexforex",
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(fileUpload());

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

/* app.set("layout login", false); */

const routes = require("./server/routes/forexRoutes.js");
const { use } = require("express/lib/application");
app.use("/", routes);

app.all("*", (req, res) => {
  try {
    res.render("page_not_found", {
      layout: false,
      title: "Página no encontrada",
    });
  } catch (error) {
    res.status(500).send("an error ocurred, please try again");
  }
});

app.listen(port, () => console.log(`listening to port ${port}`));
