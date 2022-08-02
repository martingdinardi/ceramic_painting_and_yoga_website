require("../models/database");
const Post = require("../models/Post");
const Admin = require("../models/Admin");
const Contact = require("../models/Contact");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { unlink } = require("fs").promises;
const path = require("path");

exports.login_home = async (req, res) => {
  try {
    res.render("login", { layout: "login" });
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }
};

exports.home = async (req, res) => {
  const token = req.cookies.token;
  const admin = jwt.verify(token, process.env.JWT_SEC);
  req.admin = admin;
  res.redirect(`/admin/panel/${admin.id}/1`);
};

exports.login_admin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      username: req.body.username,
    });

    if (!admin) {
      /* res.status(401).json("Wrong username!"); */
      res.redirect("/");
    } else if (admin) {
      const hashedPassword = CryptoJS.AES.decrypt(
        admin.password,
        process.env.PASS_SEC
      );

      const OriginalPassword =
        /* hashedPassword.toString(CryptoJS.enc.Utf8) */ admin.password;

      if (OriginalPassword !== req.body.password) {
        /* res.status(401).json("Wrong credentials!"); */
        res.redirect("/");
      }

      const accessToken = jwt.sign(
        {
          id: admin._id,
        },
        process.env.JWT_SEC,
        { expiresIn: "1h" }
      );

      res.cookie("token", accessToken, {
        httpOnly: true,
      });

      const { password, ...others } = admin._doc;
    }

    res.redirect(`/admin/panel/${admin._id}/1`);
  } catch (err) {
    console.log(err);
  }
};

exports.admin_panel = async (req, res) => {
  try {
    const limitNumber = 6;
    let page = req.params.page || 1;
    const latestPosts = await Post.find({})
      .sort({ _id: -1 })
      .skip(limitNumber * page - limitNumber)
      .limit(limitNumber);

    const counterPosts = await Post.count({});
    /* */
    const contacts = await Contact.find({ viewed: false }).count({});
    /* */
    /* console.log(contacts); */
    const posts = { latestPosts };

    const admin_id = req.params.id;
    const admin = await Admin.findById(admin_id).select("username");
    const admin_name = admin.username;

    /* console.log(admin_name); */
    res.render("admin_panel", {
      layout: "layouts/admin",
      posts,
      admin_name,
      current: page,
      pages: Math.ceil(counterPosts / limitNumber),
      contacts,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }
};

exports.submit_post = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No files uploaded");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      image: `/uploads/${newImageName}`,
    });
    const token = req.cookies.token;
    const admin = jwt.verify(token, process.env.JWT_SEC);
    req.admin = admin;
    await newPost.save();
    res.redirect(`/admin/panel/${req.admin.id}/1`);
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }
};

exports.delete_post = async (req, res) => {
  try {
    const id = req.params.id;
    const oldPost = await Post.findById(req.params.id);
    const oldImage = oldPost.image;
    const oldImagePath = path.join(__dirname, `../../public/${oldImage}`);

    const oldImageDefault = oldImage.split("/");
      /* console.log(oldImageDefault[1] == "uploads"); */

      if (oldImageDefault[1] == "uploads") {
        try {
          await unlink(`${oldImagePath}`);
          console.log(`successfully deleted`);
        } catch (error) {
          console.error("there was an error:");
          console.log(error);
        }
      }

/*     try {
      await unlink(`${oldImagePath}`);
      console.log(`successfully deleted`);
    } catch (error) {
      console.error("there was an error:");
      console.log(error);
    } */

    await Post.findByIdAndDelete(id);
    const token = req.cookies.token;
    const admin = jwt.verify(token, process.env.JWT_SEC);
    req.admin = admin;
    res.redirect(`/admin/panel/${admin.id}/1`);
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }
};

exports.update_page = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    const token = req.cookies.token;
    const contacts = await Contact.find({ viewed: false }).count({});
    res.render("admin_panel_edit_post", {
      layout: "layouts/edit_post",
      post,
      contacts,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.update_post = async (req, res) => {
  if (req.files) {
    try {
      const oldPost = await Post.findById(req.params.id);
      const oldImage = oldPost.image;

      const oldImagePath = path.join(__dirname, `../../public/${oldImage}`);
      const oldImageDefault = oldImage.split("/");
      /* console.log(oldImageDefault[1] == "uploads"); */

      if (oldImageDefault[1] == "uploads") {
        try {
          await unlink(`${oldImagePath}`);
          console.log(`successfully deleted`);
        } catch (error) {
          console.error("there was an error:");
          console.log(error);
        }
      }

      let imageUploadFile;
      let uploadPath;
      let newImageName;

      if (!req.files || Object.keys(req.files).length === 0) {
        console.log("No files uploaded");
      } else {
        imageUploadFile = req.files.image;
        newImageName = Date.now() + imageUploadFile.name;
        uploadPath =
          require("path").resolve("./") + "/public/uploads/" + newImageName;

        imageUploadFile.mv(uploadPath, function (err) {
          if (err) return res.status(500).send(err);
        });
      }

      const id = req.params.id;
      await Post.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        image: `/uploads/${newImageName}`,
      });
      const token = req.cookies.token;
      const admin = jwt.verify(token, process.env.JWT_SEC);
      req.admin = admin;
      res.redirect(`/admin/panel/${req.admin.id}/1`);
      /* res.redirect(`/post/${id}`); */
    } catch (err) {
      console.log(err);
    }
  } else {
    const id = req.params.id;
    await Post.findByIdAndUpdate(id, {
      title: req.body.title,
      description: req.body.description,
      /* image: `/uploads/${newImageName}`, */
    });
    const token = req.cookies.token;
    const admin = jwt.verify(token, process.env.JWT_SEC);
    req.admin = admin;
    res.redirect(`/admin/panel/${req.admin.id}/1`);
  }
};

exports.admin_page = async (req, res) => {
  try {
    const limitNumber = 6;
    const admins = await Admin.find({}).sort({ _id: -1 }).limit(limitNumber);
    const token = req.cookies.token;
    const admin = jwt.verify(token, process.env.JWT_SEC);
    req.admin = admin;
    /* console.log(admin.id); */
    const searchAdmin = await Admin.findById(admin.id).select("username");
    const admin_name = searchAdmin.username;

    const contacts = await Contact.find({ viewed: false }).count({});
    /* console.log(admin_name); */
    res.render("admin_panel_admins", {
      layout: "layouts/admins",
      admins,
      admin_name,
      contacts,
    });
  } catch (error) {
    res.send(error);
  }
};

exports.delete_admin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = await Admin.findByIdAndDelete(id);
    res.redirect(`/admin/admins`);
  } catch (error) {}
};

exports.create_admin = async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const newAdmin = new Admin({
      username,
      password,
    });

    await newAdmin.save();
    res.redirect(`/admin/admins`);
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }
};

exports.contact_page = async (req, res) => {
  try {
    const limitNumber = 6;
    const contacts = await Contact.find({}).sort({ _id: -1 });
    const viewedContacts = await Contact.updateMany(
      { viewed: false },
      { viewed: true }
    );

    res.render("admin_panel_contacts", {
      layout: "layouts/contacts",
      contacts,
    });
    /* res.send(contact); */
  } catch (error) {
    res.send(error);
  }
};

exports.delete_contact = async (req, res) => {
  try {
    const id = req.params.id;
    const contact = await Contact.findByIdAndDelete(id);
    res.redirect(`/admin/contacts`);
  } catch (error) {}
};
