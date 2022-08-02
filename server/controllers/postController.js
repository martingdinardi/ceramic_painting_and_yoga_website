require("../models/database");
const Post = require("../models/Post");
const fs = require('fs');
const path = require('path');

/*GET*/
/*Home*/

exports.home = async (req, res) => {

  const errorMessage = req.flash("error");

  try {
    const limitNumber = 3;
    const latestPosts = await Post.find({})
      .sort({ _id: -1 })
      .limit(limitNumber);

    const posts = { latestPosts };

    res.render("index", {
      title: "Talleres de Céramica, Pintura y Yoga - DELLA PIETRA ESPACIO MULTIARTE",
      posts,
      errorMessage
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

exports.refreshDatabase = async (req, res) => { 
  try {

    const allPosts = await Post.find({})
    for (const post of allPosts) {
      const id = post.id
      await Post.findByIdAndDelete(id)
    }

    
    await fs.readdir(`${__dirname}, ../../../public/uploads`, (err, files) => {
      if (err) throw err;
    


      for (const file of files) {
        console.log(file)
        fs.unlink(path.join(`${__dirname}, ../../../public/uploads/${file}`), err => {
          if (err) throw err;
        });
      }
    });

      await Post.insertMany([
        {
          title: "El mejor momento del día para practicar yoga",
          description: `Todos los practicantes de yoga se han preguntado en alguna ocasión, cuál es el mejor momento del día para practicar.

          En mi opinión, no existe una regla establecida. El yoga es beneficioso a cualquier hora del día. Ahora bien, la práctica de yoga por la mañana ofrece beneficios diferentes a los de la tarde.
          
          Lo importante es adaptar la sesión de yoga a cada persona, y no al contrario.
          
          Tu hora de práctica dependerá de tu disponibilidad, tu ritmo biológico o tus momentos de tranquilidad.
          
          Practicar yoga por la mañana
          
          Muchos estilos de yoga recomiendan hacer yoga por las mañanas, concretamente al amanecer. Pero, seamos honestos, ¿quién puede hacer eso con una jornada de trabajo y con cargas familiares? Eso sería para un mundo ideal, sin responsabilidades, ni horarios laborales.
          
          La gran mayoría de las personas tiene muchas dificultades para establecer un hábito y en muchas ocasiones sienten que hacen «malabares» para dedicar un tiempo al yoga.
          
          -Si dispones de poco tiempo, haz una práctica breve, de 20 ó 30 minutos. Pequeños movimientos, aunque sean durante 10 minutos te permitirán desentumecer el cuerpo y comenzar el día con otra energía.
          
          -En el caso de que no estés muy inspirado por las mañanas, cíñete a unos saludos al sol y una breve meditación en la que plantees una intención para el día.
          
          Hacer yoga por la tarde
          
          La práctica de la tarde ofrece otros beneficios. Si lo haces a primera hora de la tarde, te cargará de energía para el resto del día. Sin embargo, la práctica de última hora de la tarde te ayudará a liberar el estrés, la carga muscular del día y a conciliar el sueño.
          
          Si haces yoga a primera hora de la tarde, considera estas recomendaciones:
          
          -Deja dos horas tras la comida para realizar adecuadamente la digestión.
          
          -No olvides incluir la relajación tras la práctica.
          
          Si por el contrario, practicas yoga a última hora de la tarde, recuerda:
          
          –No hagas prácticas demasiado dinámicas con muchas posturas de pie y de extensión, pues activarán mucho tu energía y te dificultarán conciliar el sueño.
          
          –Si te sientes agotado por los compromisos del día, haz una práctica más suave o de tipo restaurativo.
          
          En cualquier caso, tanto si te decides a hacer yoga por la mañana o por la tarde, obtendrás múltiples beneficios. Y recuerda, que el yoga se adapta siempre a ti y no al contrario.`,
          image: "/default-post-images/article1.jpg",
        },
        {
          title: "Chakras, los 7 centros energéticos principales",
          description: `Seguro que has escuchado hablar alguna vez de los chakras, pero quizás no tengas muy claro qué son exactamente. En este artículo te voy a explicar qué son y me voy a centrar en los 7 más conocidos. Quédate hasta el final porque te voy a ir proponiendo diferentes clases y talleres de para practicarlos y estimularlos.

          ¿Qué es un chakra?
          Chakra, en sánscrito, significa círculo o rueda. Los chakras son vórtices energéticos de nuestro cuerpo a través de los cuales fluye nuestra energía vital. Cada uno de los siete chakras está relacionado con un aspecto de nuestro ser e influyen tanto en el plano físico, como el mental y el emocional. Por eso, es importante que estén en perfecto equilibrio.
          
          Cuando los chakras están equilibrados disfrutamos de una sensación de bienestar general y nos sentimos más en harmonía y en sintonía con todo aquello que nos rodea. En cambio, si uno o varios chakras están bloqueados los otros chakras también pueden empezar a funcionar mal y perdemos nuestro equilibrio interior. Por eso, para mantener una vida saludable es importante cuidar de nuestros chakras y mantenerlos en equilibrio.
          
          El concepto de los chakras nace de la tradición hindú y se encuentra dentro de los textos de los Vedas. Principalmente, en los conocidos como “Upanishads”, redactados alrededor del s.VII a.c.
          
          ¿Qué significan los 7 chakras?
          
          Cada chakra es una zona de confluencia de las energías ubicadas a lo largo de nuestro canal central o Sushumna nadi, situado en la columna vertebral. Cada tradición asocia un número de chakras que pueden ser de cuatro a once. Aunque, en occidente, se han incorporado 7 chakras, que también se pueden encontrar en culturas como en el Tíbet o incluso los Mayas.
          
          Así mismo, cada chakra tiene una frecuencia única que percibimos como uno de los siete colores del arco iris.`,
          image: "/default-post-images/article2.jpg",
        },
        {
          title: "5 beneficios de pintar para nuestra salud",
          description: `Además de favorecer nuestra concentración, la pintura nos ayuda a distraernos de problemas. Asimismo, puede ser muy beneficiosa para trabajar la motricidad fina, tanto en niños como en personas mayores.

          Pintar nos ayuda en nuestro ámbito comunicativo, ya que nos permite expresar de forma diferente lo que sentimos, lo que queremos, o incluso nuestra visión sobre algo.
          
          A través de las formas, el color e incluso el tipo de trazo se pueden manifestar múltiples sentimientos, emociones y pensamientos. Esta forma de comunicación es especialmente relevante en personas con discapacidades que tienen déficits en la comunicación. También podría tener efectos positivos en personas tímidas o que no son capaces de comunicarse verbalmente de forma fluida y natural.
          
          El uso de diferentes utensilios necesarios para pintar, como lápices, carboncillos o pinceles, ayuda a desarrollar la motricidad fina, especialmente cuando somos niños.
          
          El manejo y agarre con las manos se va perfeccionando a medida que se trabaja esta capacidad. En los adultos, la motricidad fina se ve reforzada.
          
          Nuestro cerebro interviene activamente en la actividad de pintar.
          
          El hemisferio izquierdo de nuestro cerebro, responsable de las tareas lógicas, está presente, así como el hemisferio derecho, responsable de la creatividad y la imaginación. Por tanto, cuando pintamos, estamos trabajando con el cerebro, y desarrollamos su capacidad.
          
          Nuestra salud mental se ve claramente beneficiada con la pintura. Por una parte, la pintura favorece la concentración, y nos ayuda a adquirirla.
          
          Cuando pintamos debemos estar centrados en lo que queremos transmitir, y no en otras cosas. Además, nos ayuda a distraernos de problemas o situaciones difíciles que podamos estar viviendo, mientras hacemos algo que es relajado y que nos permite ir a nuestro ritmo y realizar composiciones libres.`,
          image: "/default-post-images/article3.jpg",
        },
        {
          title: "Diferencias entre el barro y la arcilla",
          description: `Con mucha frecuencia los diferentes terminos llevan a confusión a la gente, y suele ocurrir que se empleen de forma indistinta al referirnos a cualquier pieza de cerámica. Así es habitual oír «una vasija de barro», cuando en realidad nos estamos refiriendo a «una vasija de cerámica». Tampoco es correcto acudir a una tienda de arte o una papelería y pedir un «paquete de cerámica», para una tarea extraescolar de nuestros hijos.

          La arcilla es el material que se obtiene de la descomposición y la erosión posterior de ciertas rocas con alto contenido en feldespato. Cuando se mezcla con agua, se vuelve plástica y moldeable, y al calentarla en un horno de alfarero a temperaturas superiores a los 600 °C, adquiere dureza.
          
          El barro es la simple mezcla de tierra de cualquier tipo mezclada con agua. El resultado es una masa que puede contener competentes diferentes según lo que aporte la tierra. A menudo se utiliza el término barro para referirnos a la pasta de arcilla, principalmente por su aspecto y su color.
          
          La cerámica es el material que se obtiene después de cocer la arcilla en un horno a más de 600 °C. Con el calor se produce un proceso químico que transforma la materia, cambiando su textura y su resistencia. Gracias a unas temperaturas tan elevadas, la misma adquiere dureza y se convierte en cerámica (platos, vasijas…). Es decir que sin la acción del fuego no es posible la cerámica, la pieza se queda en un simple barro.
          
          Sabiendo cuáles son las diferencias entre barro, arcilla o cerámica, podemos clasificar varios grupos.
          
          Arcillas de baja temperatura. Deben cocerse para adquirir la resistencia y la dureza de la cerámica a temperaturas de entre 900 °C y 1050 °C. Son las más indicadas para proyectos domésticos, ya sean piezas decorativas, elementos para algún uso práctico o pequeñas esculturas, porque se pueden cocer en un horno casero. En Díez Ceramic, hemos desarrollado porcelanas de baja temperatura que son las arcillas de la mejor calidad posible.
          Arcillas de alta temperatura. Por los tipos de materiales que contienen (además del mencionado feldespato), tienen que alcanzar temperaturas más elevadas para conseguir la consistencia de cerámica. Generalmente se tienen que cocer como mínimo a 1200 °C y son las más utilizadas para piezas de gres y objetos para usos industriales o de construcción.
          Como vemos, cerámica y barros no tienen nada que ver, y la diferencia entre arcilla y cerámica es que la segunda ha experimentado un proceso químico. Ahora, cuando quieras comprar material para moldear a mano o en un torno, sabrás lo que tienes que pedir, y cuando te dispongas a pintar o esmaltar tu pieza ya seca y cocida, estarás decorando cerámica.`,
          image: "/default-post-images/article4.jpg",
        },
        {
          title: "Kintsugi, el arte japonés de reparar las cicatrices con oro",
          description: `La técnica kintsugi es el arte japonés de reparar con oro la cerámica rota. Pero es mucho más que una forma de restauración de objetos dañados: es una filosofía de vida que pone en valor la resiliencia humana y capacidad de sobrellevar con orgullo las cicatrices que nos provocan las adversidades de la vida a lo largo de los años.

          El término «kintsugi» significa «oro» y «arreglo», y su traducción literal podría ser algo así como «parche dorado» o «fijación con oro».
          
          Según algunos vestigios arqueológicos, las primeras técnicas rudimentarias de reparación cerámica datan de la época Jomon, 10 000 a. C., aunque el origen de la técnica kintsugi se sitúa en el siglo XV.
          
          Dice la leyenda que el Shogun Ashikaga Yoshimasa rompió sin querer su taza de té preferida y pidió a los artesanos que la reparasen para poder seguir utilizándola. Así pues, los artistas de palacio mezclaron polvo de oro con laca y restauraron la pieza dándole una apariencia hermosa y única.
          
          Con el paso de los siglos, las piezas de cerámica japonesa reparada con oro mediante el arte del kintsugi se han convertido en algo de gran valor. Las piezas con marcas de kintsugi son muy apreciadas, ya que cada una es única en el mundo, al fin y al cabo es imposible romper dos objetos de la misma forma.
          
          Es un proceso que se realiza con mucho mimo y cuidado. A nivel más doméstico, también se puede aplicar este arte milenario, incluso existen kits con todos los elementos necesarios, como pegamento especial para reconstruir la pieza rota, y pintura dorada para colorear las grietas y darles protagonismo.
          
          Lo más valioso de esta técnica es que se trata de una filosofía que se puede aplicar a la vida. Nuestra fragilidad y nuestras cicatrices nos hacen humanos, reales, valiosos y únicos, y por lo tanto podemos mostrarlas con orgullo.`,
          image: "/default-post-images/article5.jpg",
        },
        {
          title: "Kundalini Yoga, el yoga de la conciencia",
          description: `Kundalini es un estilo de yoga que se conoce como el yoga de la conciencia, ya que es considerado como una de las prácticas más antiguas y poderosas de yoga.

          Se considera uno de los estilos más espirituales, ya que su práctica es muy meditativa, e incluye mudras, pranayama o ejercicios de respiración y mantras, además de la práctica física dinámica enfocada a movilizar la energía.
          
          ¿Qué es la energía kundalini?
          La energía kundalini no sólo se trabaja con el yoga kundalini, sino que el despertar de esta energía es el objetivo de todas las formas de yoga. Se dice que mediante las prácticas de yoga, meditación y pranayama, se estimula esta energía que sube por el canal central (nadis) hasta llegar a la parte superior del cráneo, activando la secreción de la glándula pineal. Esta pequeñísima glándula y su función han sido un misterio para la ciencia occidental, lo increíble es que los yoguis conocen su importancia desde hace miles de años.
          
          Nuestro cuerpo y mente se controlan a través de la secreción de químicos en el cerebro. Cuando elevamos directamente la kundalini, se activan estos químicos y se experimenta un cambio en la conciencia, sutil y gradual.
          
          La energía kundalini es la energía creativa, el impulso vital que todos tenemos, que existe en todo ser humano y que podemos usar para elevar nuestra conciencia.`,
          image: "/default-post-images/article6.jpg",
        },
        {
          title: "Encuentran un autorretrato de Van Gogh oculto detrás de otro cuadro",
          description: `Un autorretrato inédito de Vincent van Gogh fue descubierto detrás de uno de sus cuadros, estuvo cubierto por capas de pegamento y cartón durante más de un siglo.

          La imagen fue encontrada cuando los conservadores de arte tomaron una radiografía del cuadro de Van Gogh conocido como "Head of a Peasant Woman" de 1885 antes de una próxima exposición. Descubrieron la imagen oculta en la parte posterior de su lienzo, escondida por una hoja de cartón, según un comunicado de prensa de las Galerías Nacionales de Escocia (NGS, por sus siglas en inglés).
          
          El maestro neerlandés solía reutilizar los lienzos para ahorrar dinero, dándoles la vuelta para trabajar en el reverso, según el NGS.
          
          Se cree que el autorretrato fue realizado probablemente durante un momento clave en la carrera de Van Gogh, cuando estuvo expuesto a la obra de los impresionistas franceses tras mudarse a París.`,
          image: "/default-post-images/article7.jpg",
        }
      ]);
      await res.redirect(`/`);
    } catch (error) {
      res.status(500).send({ message: error.message || "An error occured" });
    }

}

