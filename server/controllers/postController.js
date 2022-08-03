require("../models/database");
const Post = require("../models/Post");
const fs = require('fs');
const path = require('path');

/*GET*/
/*Home*/

exports.home = async (req, res) => {

  const uploadFolder = path.join(__dirname, "../../public/uploads")
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder)
  }

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
    /* await  */
    fs.readdir(`public/uploads`, (err, files) => {
      if (err) throw err;
      if (files) {
        for (const file of files) {
          console.log(typeof file)
          fs.unlink(path.join(`public/uploads/${file}`), err => {
            if (err) throw err;
          });
        }
      }
    });

    await Post.insertMany([
        {
        title: "¡Estrenamos blog!",
        description: `¡Estamos muy felices de estrenar este espacio! 
        
        Nos hemos dado cuenta que tenemos muchas cosas para contar y por eso fundamos nuestro propio blog! Un espacio donde queremos compartir las últimas novedades, tendencias, consejos y más, del mundo que rodea a nuestro taller.
        
        ¡Te damos la bienvenida y esperamos que lo disfrutes tanto como nosotros disfrutamos de construirlo!
        `,
        image: "/default-post-images/article0.jpg",
        },
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
        },
        {
        title: "Yoga en verano",
        description: `El verano llega siempre abriendo las puertas de la libertad. Es el momento de andar descalza, de llevar menos ropa, de relajarse, de dejar que el amor y la alegría salga de dentro de ti. El sistema nervioso está más relajado, y te hace estar más receptiva al momento presente, a disfrutar de cada segundo.

        Para mí el verano es una época alegre y en la disfruto mucho. El calor no lo suelo llevar mal, pero es cierto que, en determinados momentos necesito una pausa, respirar y refrescarme. Para ello tomo algunas precauciones y practico asanas que me ayudan a calmar y refrescar el cuerpo. Te voy a contar cómo, para que lo apliques a la hora de practicar estos meses y no abandones la práctica de yoga en verano.
        
        El verano anima a practicar yoga al aire libre, en el parque, en la playa, debajo de algún árbol… en cualquiera de estos sitios, el contacto con la naturaleza te ayuda a relajar el sistema nervioso y a respirar más profundamente.

        Si no tienes la oportunidad de llevar tu esterilla a la naturaleza, puedes practicar en tu casa. En este caso te recomiendo que sea en un lugar lo más fresco posible, o con un ventilador que no te apunte directamente.`,
        image: "/default-post-images/article9.jpg",
        },
        {
        title: "La alfarería y la cerámica se adentran en las vanguardias",
        description: `Es reconfortante saber que, a pesar de sus rafces antiguas, las nuevas versiones del medio tienen formas fantasiosas y colores populares. Hay muchas vasijas que pecan en el lado minimalista, pero algunas marcas ahora, prefieren la figura humana como forma para sus vasijas.
        
        Los rostros moldeados en porcelana china, los voluptuosos torsos moldeados en terracota y los rostros de cerámica pintados con esmaltes multicolores, pueden agregar un acento fresco a los espacios contemporáneos. 
        
        Otra tendencia de la cerámica que vemos crecer es Memphis Revival, una versión del siglo XXI de un movimiento de la década de 1980 creado por Ettore Sottsass. Los divertidos tonos pastel, las formas onduladas y las curvas onduladas del movimiento se ven en piezas de cerámica de Bondi y otras marcas.
        
        En el otro extremo del espectro de la cerámica, hay creadores que aman hacer piezas que respeten las raíces del medio. La estética de las superficies crudas, los esmaltes moteados y los tonos naturales y terrosos se destacan en las grandes ollas de Red Slab Pottery y en las ingeniosas lámparas de cerámica de Joey de Castro para Ito Kish.

        Las formas orgánicas y las que provienen de la naturaleza siempre han sido las favoritas de la multitud en las ferias de diseño, y CSM nunca deja de decepcionar en ese aspecto. Sus delicados jarrones Pandanus, Pod y Pleat están inspirados en formas naturales de frutas, vainas de semillas, anémona y conchas.

        Pero independientemente de las tendencias, De Castro agrega que la cerámica como forma de arte puede avanzar si no hay discriminación entre su funcionalidad y el arte. «En nuestra comunidad, no distinguimos platos y jarrones de esculturas … para nosotros, es solo uno y Io mismo, es solo eso, es arte».`,
        image: "/default-post-images/article10.jpg",
        },
        {
        title: "Fauvismo: el movimiento del color",
        description: `El fauvismo es el movimiento artístico del color, mismo que tiene especial protagonismo en los cuadros de este estilo, sobre todo porque resalta la vivacidad de la paleta elegida por los artistas que se adhirieron a esta breve corriente a principios del siglo XX. Otro protagonista del fauvismo son los trazos, ya que destacan las pinceladas, en ocasiones grotescas, que dibujaban gruesas línea o incluso algo más parecido a los puntos, esto deja claro cómo el fauvismo rompió con los esquemas de otros movimientos de la época, al menos por un breve momento, consagrándose como una corriente más permisiva.

        El fauvismo no es especialmente mencionado o reconocido en la historia del arte contemporáneo, sin embargo, cuenta con talentosos representantes, como Henri Matisse:

        Sin duda el más conocido fauvista, Henri Matisse se caracterizó tanto por la simplicidad en el uso de los colores, como por la saturación y armonía que aplicaba a otros. A lo largo de su trayectoria, el artista recibió numerosos reconocimientos por su trabajo, cuyas temáticas se desenvolvían en torno a la naturaleza, los paisajes y el desnudo femenino, principalmente. 
        
        Lo más experimental de Matisse fueron sus papiers découpés o el arte de dibujar con tijeras, que era básicamente una especie de collages realizados con papeles de colores recortados a mano alzada.
        `,
        image: "/default-post-images/article11.jpg",
        },
        {
        title: "Yoga para seniors, cuerpo y mente te lo agradecerán",
        description: `El yoga es una fuente de rejuvenecimiento: su práctica ayuda a mantener la flexibilidad y la vitalidad propias de la juventud y, además, ayuda a abrazar la vida con más serenidad. 
        
        Pese a que parezca una actividad únicamente destinada a personas flexibles y muy en forma, el yoga ofrece muchos beneficios particularmente útiles en las personas mayores. Y no sólo se trata de ventajas a nivel físico, ya que es una práctica holística que ejercita todos los aspectos del cuerpo y la mente. Gracias a los estiramientos y los ejercicios de control de la respiración, se deshacen todas las tensiones y se induce un estado de calma y serenidad, que aporta un gran bienestar emocional.
        
        Con el paso de los años la musculatura se atrofia, los ligamentos se endurecen, las articulaciones pierden movilidad, la circulación se obstruye y pueden aparecer alteraciones del sistema nervioso y digestivo. La práctica de yoga ayuda a mantener la musculatura y hace los tendones y ligamentos más fuertes y flexibles. Por otra parte, a través de las presiones y de las inversiones se mejora y se revitaliza todo el sistema circulatorio. 
        
        Muchas de las posturas que se hacen durante una sesión ayudan a estimular los órganos internos.
        `,
        image: "/default-post-images/article12.jpg",
        },
        {
        title: "Ventajas de usar vajillas de cerámica",
        description: `Todos tenemos una mesa en casa donde todos no sentamos o reunimos a disfrutar nuestra comida y la vajilla es un componente importante de esta mesa ya que no podemos disfrutar nuestro desayuno, comida y cena sin una.
        
        Las personas han usado vajillas de cerámica desde tiempos inmemorables. También prefieren cocinar los alimentos en utensilios de cocina de cerámica. Esto se debe a que la cerámica se considera el material más saludable de todos. No es poroso y es seguro de usar.
        
        Los platos de cerámica son amigables con el calor así que puede usarse para cocinar alimentos en la estufa, microondas y horno. A diferencia del plástico, se puede calentar sin romperse o derretirse ya que tiene una distribución uniforme del calor. Pero esto no significa que todas las cerámicas son resistentes al calor, solo algunas son aptas por lo cual hay que asegurarnos de que la vajilla que deseamos adquirir es apta para el calor.

        Como sabemos el uso de la vajilla de cerámica no es nuevo entre nosotros y lleva mucho tiempo con nosotros. Más que una ventaja, es un gusto por la conexión particular que hay en los objetos trabajados artesanalmente y el vínculo con algunos procesos y ciclos de la naturaleza. 

        Esperamos que el articulo le haya ayudado a comprender el significado de la vajilla de cerámica y sus características. No olvide compartir sus comentarios y experiencias con nosotros.
        `,
        image: "/default-post-images/article13.jpg",
        },
        {
        title: "Picasso, una máquina de pintar dinero",
        description: `Cuando Picasso falleció hace 43 años dejó tras de sí más de 45.000 obras, y un inmenso dolor de cabeza: multitud de herederos y ningún testamento.

        El catálogo de su producción artística a su muerte resultó increíble. Legó 1.885 pinturas, 1.228 esculturas, 7.089 dibujos, 30.000 grabados, 3.222 obras en cerámica y 150 libros de apuntes y bocetos. Un inventario al que hay sumar tapices, libros, 4,5 millones de dólares de la época en metálico, 1,3 millones en oro y dos chateaux, entre otras viviendas. Además de una cantidad no determinada en acciones y bonos. Un patrimonio ingente. Tanto es así que para almacenarlo “hubiera hecho falta alquilar el Empire State Building”, contará Claude Picasso, hijo del genio y de Françoise Gilot, tras finalizar el recuento.
        
        Pero como con el malagueño nada es sencillo, la historia se complica más al sumarle los inmensos problemas que generan la autentificación de las obras, la gestión de sus derechos o los acuerdos de reproducción de las imágenes de las piezas. Al fin y al cabo hablamos de una herencia valorada en miles de millones de euros. Muy lejos de los parcos 250 millones de dólares con los que se quiso tasar en 1980.

        Porque trabajar con Picasso nunca fue fácil, ni cuando ya no estaba. No dejó testamento. Y el reparto de sus bienes duró seis años. Un tiempo en el que los siete herederos de entonces se enfrentaron en más de una ocasión. Quizá porque como sostiene Mafalda: "Las herencias nunca se reparten sino que se descuartizan". Aun así, el acuerdo costó 30 millones de dólares. Un precio relativamente razonable para un artista del que solo el año pasado se programaron 34 exposiciones en todo el mundo y que en 2015 fue capaz de vender por 179,4 millones de dólares un cuadro (Las mujeres de Argel, versión O) que ni por asomo representa lo mejor de su producción. Dio igual. Se convirtió en la obra más cara vendida jamás en subasta. Pura abstracción matemática; el cubismo de la aritmética del dinero.
        `,
        image: "/default-post-images/article14.jpg",
        },
        {
        title: "La escultura en cerámica",
        description: `La cerámica es un material versatil y probablemente uno de los que mejor combinan funionalidad, diseño y arte. 
        
        Hay diferencias, de concepto y elaboración técnica, entre una pieza bella, funcional o que puede considerarse obra de arte. Sin embargo , hay muchos artistas que desdibujan estos limites, creando objetos que sobrepasan la utilidad, que son arte y desbordan belleza. Objetos que pueden acompañarnos en nuestro día a día y hacer de las actividades cotidianas un momentos más que placentero.

        Ronit Baranga nació en 1973 en Israel donde , a día de hoy , sigue viviendo y trabajando. Su trabajo se ha expuesto en numerosísimas galerías de arte de todo el mundo, tanto publicas como privadas y en museos como el Triennale Desing Museum de Milán ( 2012) o en el Dismaland Bemusement Park (2015) .

        » En esta combinación y unión entre lo inmóvil y lo vivo. trato de cambiar la forma en que observamos la utilidad de la vajilla. La vajilla útil y pasiva puede ahora percibirse como un objeto activo, consciente de sí mismo y de lo le rodea. No permite que se dé por sentado su uso. Decide por sí mismo cómo comportarse en cada situación. Así es como prefiero pensar en mis platos y tazas. Metafóricamente hablando , por supuesto».`,
        image: "/default-post-images/article8.jpg",
        },
        {
        title: "Mujeres en el arte: nombres históricamente ocultos",
        description: `No es ningún secreto que los mundillos del arte, en general, siempre han sido dominados por hombres. Aunque actualmente esto ha cambiado mucho, no significa que las mujeres hayan estado históricamente ausentes. 
        
        La figura femenina dentro de la pintura, por ejemplo, siempre ha sido relegado al de musa, compañera o aprendiz, y sus obras, descubrimientos o aportes han sido atribuidos a los hombres que les hacían sombra.

        Los casos más conocidos de mujeres opacadas se han dado en la literatura, ya que muchas autoras tendían a firmar solo con su apellido o con un pseudónimo masculino. ¿Por qué? Porque nadie querría comprar la obra de una mujer. En el caso de otras disciplinas, más bien solían no darles créditos, como es el caso de Lee Miller, quien descubrió la solarización junto a Man Ray, pero que solo se le atribuía a él.

        La pintura no es la excepción. Por eso, a continuación te presentamos tres casos a lo largo de la historia en los que el punto central es el mismo: las pinturas de mujeres eran atribuidas a hombres, por alguna u otra razón.

Sofonisba Anguissola: el talento de esta artista renacentista fue reconocido por el mismo Miguel Ángel, y se desempeñó como pintora de la casa real española durante 14 años. Con la muerte de Sofonisba llegó también el olvido de su arte, y como ha pasado con muchas mujeres a lo largo de la historia, sus obras fueron atribuidas a otros; “fueron adjudicadas a Tiziano, Zurbarán, Sánchez Coello o a El Greco, entre otros” (Los ojos de Hipatia, 2015). Fue hasta hace poco que sus pinturas fueron reconocidas y debidamente atribuidas.

Judith Leyster: originaria de Haarlem, Países Bajos, fue contemporánea de Frans Hal, y se dice que también su alumna en algún momento. La carrera profesional de Leyster fue corta debido a que pasó a dedicarse a las tareas domésticas cuando se casó con Jan Miense Molenaer. A este fueron atribuidas sus pinturas —o a Frans Hal—. Con el paso del tiempo, fue descubriéndose su verdadera autoría, dando paso al tardío reconocimiento de Leyster.

Margaret Keane: de entre las mujeres cuya obra fue atribuida o firmada por hombres, el caso más reciente y quizá famoso es el de Margaret Keane, sobre todo porque Tim Burton retrató su historia en la película Big Eyes. Su obra se caracteriza por sus personajes de ojos grandes, que eran firmados por su esposo, Walter Keane. El hombre comenzó a atribuirse las pinturas. Pronto convirtió “su arte” en un imperio, hasta que un día Margaret decidió demandarlo y ganó.
        `,
        image: "/default-post-images/article16.jpg",
        }    
      ]);
      await res.redirect(`/`);
    } catch (error) {
      res.status(500).send({ message: error.message || "An error occured" });
    }

}

