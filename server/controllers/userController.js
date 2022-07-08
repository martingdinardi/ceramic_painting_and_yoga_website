require("../models/database");
const Post = require("../models/Post");
const Contact = require("../models/Contact");

exports.who_we_are = (req, res) => {
  res.render("who_we_are", { layout: "layouts/main", title: "Quienes Somos" });
};

exports.testimonials = (req, res) => {
  res.render("testimonials", { layout: false, title: "Testimonios" });
};

exports.our_blog = async (req, res) => {
  try {
    const limitNumber = 6;
    let page = req.params.page || 1;
    const latestPosts = await Post.find({})
      .sort({ _id: -1 })
      .skip(limitNumber * page - limitNumber)
      .limit(limitNumber);

    const counterPosts = await Post.count({});
    /* console.log(counterPosts); */

    const posts = { latestPosts };
    res.render("our_blog", {
      layout: "layouts/main",
      title: "Nuestro Blog",
      posts,
      current: page,
      pages: Math.ceil(counterPosts / limitNumber),
    });
  } catch (error) {
    res.status(500).send("an error ocurred, please try again");
  }
};

exports.free_course = async (req, res) => {
  try {
    res.render("ceramic_course", {
      layout: "layouts/main",
      title: "Curso de cerámica y alfarería, cerámica para todos",
    });
  } catch (err) {
    res.status(500).send("an error ocurred, please try again");
  }
};

exports.advanced_course = async (req, res) => {
  try {
    res.render("yoga_course", {
      layout: "layouts/main",
      title: "Curso de yoga para principiantes",
    });
  } catch (err) {
    res.status(500).send("an error ocurred, please try again");
  }
};

exports.cripto_course = async (req, res) => {
  try {
    res.render("painting_course", {
      layout: "layouts/main",
      title: "Curso de arte y pintura",
    });
  } catch (err) {
    res.status(500).send("an error ocurred, please try again");
  }
};

exports.user_contact = async (req, res) => {
  try {
    const newContact = new Contact({
      name: req.body.name,
      country: req.body.country,
      email: req.body.email,
      phone: req.body.phone,
    });

    await newContact.save();
    res.render("success_contact", {
      layout: false,
    });
  } catch (error) {
    res.status(500).send("test send message");
  }
};
