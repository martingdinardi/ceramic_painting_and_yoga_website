require("../models/database");
const Post = require("../models/Post");

/*GET*/
/*Home*/

exports.home = async (req, res) => {
  try {
    const limitNumber = 3;
    const latestPosts = await Post.find({})
      .sort({ _id: -1 })
      .limit(limitNumber);

    const posts = { latestPosts };

    res.render("index", {
      title: "Talleres de Céramica, Pintura y Yoga - DELLA PIETRA ESPACIO MULTIARTE",
      posts,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }
};

/*
GET /post/:id
Post
*/

exports.postPage = async (req, res) => {
  try {
    const limitNumber = 3;
    const id = req.params.id;
    const post = await Post.findById(id);
    const latestPosts = await Post.find({})
      .sort({ _id: -1 })
      .limit(limitNumber);
    const posts = { latestPosts };

    const toUpdate = await Post.findByIdAndUpdate(id, {
      $inc: { visit_counter: 1 },
    });

    const date = new Date();

    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();

    const today = `${month}/${day}/${year}`;

    const created = new Date(post.created);
    const day_created = created.getUTCDate();
    const month_created = created.getUTCMonth() + 1;
    const year_created = created.getUTCFullYear();

    const post_created_at = `${month_created}/${day_created}/${year_created}`;

    const day1 = new Date(post_created_at);
    const day2 = new Date(today);

    const difference = Math.abs(day2 - day1);
    const days = difference / (1000 * 3600 * 24);

    res.render("post", {
      layout: "layouts/main",
      title: post.title,
      post,
      posts,
      days,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "An error occured" });
  }
};

/* async function insertPostData() {
  try {
    await Post.insertMany([
      {
        title: "Las mejores inversiones para obtener ingresos pasivos",
        description: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Amet dignissimos, tenetur eius quas labore harum sequi? Magnam laboriosam at velit est non corrupti qui expedita perspiciatis facilis.

Quae dolor fuga non? Similique, rerum maiores? Laboriosam harum id magni, atque a, culpa obcaecati omnis molestiae eligendi, labore asperiores corporis iusto saepe ipsa iure nesciunt eveniet voluptate? Tempore autem, dicta repudiandae totam ducimus sunt, consequatur non eveniet ab veniam, illum quisquam voluptate consectetur.

Accusamus, aperiam, dolores nihil sed perspiciatis quasi repudiandae ex eum quos exercitationem esse sunt ab nostrum architecto ut deserunt facilis animi, quaerat nisi ratione excepturi quam! Doloremque, atque. Eligendi.`,
        image: "/img/article4.jpg",
      },
      {
        title: "Inversores pagan millones por tierra virtual",
        description: `Numquam nostrum magni ratione. Tenetur officia ut voluptatem similique excepturi consectetur ipsam illum quam nostrum, repellat quod voluptatibus exercitationem optio culpa temporibus cumque provident rem accusamus inventore. Vel fugiat labore saepe voluptas enim, pariatur tempore fugit asperiores incidunt molestiae odio, sequi a!Lorem ipsum dolor sit amet consectetur adipisicing elit.

Quasi repudiandae repellendus itaque exercitationem, omnis odit. Ullam velit quisquam perspiciatis, nulla unde illum dignissimos ut architecto facilis, sit doloremque fuga porro laboriosam nesciunt facere atque dolor suscipit. Distinctio sed quae expedita possimus earum, necessitatibus quisquam iste recusandae nam suscipit quia eos?`,
        image: "/img/article5.jpg",
      },
      {
        title: "Cosas que los traders exitosos tienen en común",
        description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.

Numquam nostrum magni ratione. Tenetur officia ut voluptatem similique excepturi consectetur ipsam illum quam nostrum, repellat quod voluptatibus exercitationem optio culpa temporibus cumque provident rem accusamus inventore. Vel fugiat labore saepe voluptas enim, pariatur tempore fugit asperiores incidunt molestiae odio, sequi a!

Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi repudiandae repellendus itaque exercitationem, omnis odit. Ullam velit quisquam perspiciatis, nulla unde illum dignissimos ut architecto facilis, sit doloremque fuga porro laboriosam nesciunt facere atque dolor suscipit. Distinctio sed quae expedita possimus earum, necessitatibus quisquam iste recusandae nam suscipit quia eos?`,
        image: "/img/article6.jpg",
      },
    ]);
  } catch (error) {
    console.log("err", +error);
  }
}

insertPostData(); */
