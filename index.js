const express = require('express'),
  // morgan = require('morgan'),
  // fs = require('fs'),
  // path = require('path'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  mongoose = require('mongoose'),
  Models = require('./models');

const app = express();
const Movies = Models.Movie;
const Users = Models.User;

// Local DB
// mongoose.connect('mongodb://127.0.0.1:27017/myFlixDB');

// Atlas online DB
mongoose.connect('mongodb+srv://myFlixDBadmin:Vg07xp2XHR4FnGW3@cluster0.o2ncran.mongodb.net/Cluster0?retryWrites=true&w=majority');
// mongoose.connect(process.env.CONNECTION_URI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('./auth')(app);
const passport = require('passport');
require('./passport');

// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })

// app.use(morgan(':method :url :date[web]', { stream: accessLogStream }))

// let users = [
//   {
//     id: 1,
//     name: "Cezary",
//     email: "cezarszl@gmail.com",
//     favouriteMovies: ["Forrest Gump"]
//   },
//   {
//     id: 2,
//     name: "Stefan",
//     email: "stefan1337@gmail.com",
//     favouriteMovies: []
//   }
// ];

// let movies = [
//   {
//     title: "The Departed",
//     description: "South Boston cop Billy Costigan (Leonardo DiCaprio) goes under cover to infiltrate the organization of gangland chief Frank Costello (Jack Nicholson). As Billy gains the mobster's trust, a career criminal named Colin Sullivan (Matt Damon) infiltrates the police department and reports on its activities to his syndicate bosses. When both organizations learn they have a mole in their midst, Billy and Colin must figure out each other's identities to save their own lives.",
//     genre: {
//       genreName: "Crime",
//       genreDescription: "Crime film is a genre that revolves around the action of a criminal mastermind."
//     },
//     director: {
//       directorName: "Martin Scorsese",
//       bio: "Arguably one of the greatest directors of all time, Martin Scorsese made some of the most daring films in cinema history. His impressive body of work is a meditation on the visceral nature of violence and male relationships that often reflected his own personal angst growing up in the violent streets of Manhattan's Lower East Side. Starting with \"Mean Streets\" (1973), a gritty look at life in Little Italy, Scorsese made his mark on Hollywood while simultaneously discarding many of its conventions. With his seminal films \"Taxi Driver\" (1976) and \"Raging Bull\" (1980), Scorsese firmly established himself as a top director of his generation. Though he hit a brief creative lull in the 1980s, films like \"After Hours\" (1985), \"The Color of Money\" (1986) and \"The Last Temptation of Christ\" (1988) would have been welcome additions on any director's résumé. He returned to top form with the hyperkinetic mob tale, \"Goodfellas\" (1990), widely considered by fans to be among his best films. With each passing film - \"Casino\" (1995), \"Gangs of New York\" (2002), \"The Aviator\" (2004) - Scorsese cemented his legendary status, but failed to win the recognition of his peers. Five times nominated for Best Director at the Academy Awards, he finally won in 2007 for his exceptional Irish gangster thriller, \"The Departed\" (2006), which gave him the recognition he had long deserved.",
//       birth: 1942
//     },
//     imageUrl: "https://resizing.flixster.com/SRR1Y1vmMEDjfTaWUbad4ue3WT8=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p162564_p_v8_ag.jpg",
//     featured: true
//   },
//   {
//     title: "One Flew Over the Cuckoo\'s Nest",
//     description: "When Randle Patrick McMurphy (Jack Nicholson) gets transferred for evaluation from a prison farm to a mental institution, he assumes it will be a less restrictive environment. But the martinet Nurse Ratched (Louise Fletcher) runs the psychiatric ward with an iron fist, keeping her patients cowed through abuse, medication and sessions of electroconvulsive therapy. The battle of wills between the rebellious McMurphy and the inflexible Ratched soon affects all the ward's patients.",
//     genre: {
//       genreName: "Drama",
//       genreDescription: "Drama is defined as a form of performance that involves conflicts, emotions, and the portrayal of human experiences through dialogue and action. It typically presents a story or situation that engages the audience's emotions, evoking intense feelings such as tension, excitement, or empathy."
//     },
//     director: {
//       directorName: "Milos Forman",
//       bio: "Perhaps the most famous and acclaimed filmmaker to hail from Czechoslovakia, Milos Forman first found success in his native country before doing likewise in Hollywood. Forman earned international acclaim with films like \"Black Peter\" (1964), \"Loves of a Blonde\" (1965) and \"The Fireman's Ball\" (1967), all of which marked a distinct thematic and stylistic break with the prior generation of Czechoslovakian filmmaking that played a major role in shaping that country\'s cinematic New Wave of the 1960s.After leaving Soviet- occupied Czechoslovakia following the Prague Spring in 1968, Forman embarked on a successful career in Hollywood that saw him make some of cinema's most acclaimed and decorated films of all time. In 1975, he directed the subversive, anti-establishment drama, \"One Flew Over the Cuckoo's Nest, \" which became only the second film ever to win Oscars in all five major categories. In the next decade, he directed the lush and vibrant \"Amadeus\" (1984), which many considered to be one of the best films of the 1980s. Later films included \"The People vs.Larry Flynt\" (1996) and \"Man on the Moon\" (1999), and with everything he did, Forman made the case for being one of the most accomplished foreign directors to have made considerable contributions to American cinema. His death on April 13, 2018, was cause for mourning for film fans everywhere, and he was lauded by numerous tributes from fans and fellow film professionals alike.",
//       birth: 1932
//     },
//     imageUrl: "https://resizing.flixster.com/pTRnTq0p0aqkYusMmQLfY3Ac8RQ=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p7289_p_v8_aa.jpg",
//     featured: true
//   },
//   {
//     title: "Forrest Gump",
//     description: "Slow-witted Forrest Gump (Tom Hanks) has never thought of himself as disadvantaged, and thanks to his supportive mother (Sally Field), he leads anything but a restricted life. Whether dominating on the gridiron as a college football star, fighting in Vietnam or captaining a shrimp boat, Forrest inspires people with his childlike optimism. But one person Forrest cares about most may be the most difficult to save -- his childhood love, the sweet but troubled Jenny (Robin Wright).",
//     genre: {
//       genreName: "Comedy",
//       genreDescription: "Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium."
//     },
//     director: {
//       directorName: "Robert Zemeckis",
//       bio: "Filmmaker Robert Zemeckis created popular fare, frequently using the latest technology, that left an indelible mark on the entertainment industry. A native of Chicago, he attended the famed film program at the University of Southern California. He teamed with fellow USC alum Bob Gale for the script for his feature directorial debut, the Beatlesmania comedy, \"I Wanna Hold Your Hand\" (1978). His work in college had brought him to the attention of director Steven Spielberg, who took Zemeckis under his wing. Working with Gale again, who would become his frequent partner, he provided the script for Spielberg's World War II comedy, \"1941\" (1979). He directed another comedy, the Kurt Russell vehicle \"Used Cars\" (1980), before finding significant commercial success with \"Romancing the Stone\" (1984), starring Michael Douglas and Kathleen Turner. His next effort, \"Back to the Future\" (1985), moved Zemeckis into the blockbuster territory. The story of a time-traveling teenager played by Michael J. Fox became a phenomenon and spawned a pair of sequels. He blended live action and animation, he created another cultural touchstone with \"Who Framed Roger Rabbit\" (1988), a film that brought together the characters from both the vaunted Warner Bros. and Disney cartoon canon. After a decade dominated by the \"Back to the Future\" franchise, Zemeckis managed to hit upon a film that was technologically innovative and had critically appeal. \"Forrest Gump\" (1994), starring Tom Hanks, went on to claim Oscars for both its director and star. While largely working in film, the director did make occasional forays into television, most notably directing multiple episodes of the popular horror anthology, \"Tales From the Crypt\" (HBO, 1989-96). He continued to work with some of Hollywood\s biggest names, directing Jodie Foster in \"Contact\" (1997) and Harrison Ford in \"What Lies Beneath\" (2000). He circled back to reteam with Hanks on \"Cast Away\" (2000), in addition to the motion-capture holiday film \"The Polar Express\" (2004). That particular technology became an obsession for the director as he formed the production company ImageMovers and struck a deal with Disney. He used it exclusively for his next two features, \"Beowulf\" (2007) and \"A Christmas Carol\" (2009). He moved back into the live action world, albeit with some showy special effects, for \"Flight\"(2012) starring Denzel Washington. He never stopped going for stunning visuals, which continued with \"The Walk\" (2015), about Phillipe Petit's high-wire cross of the World Trade Center, and \"Allied\" (2016) with Brad Pitt. Zemeckis returned to motion-capture, this time mixing it with live action, when he directed Steve Carell in \"Welcome to Marwen\" (2018), about the victim of a brutal attack who uses a fantasy world to deal with his PTSD.",
//       birth: 1952
//     },
//     imageUrl: "https://resizing.flixster.com/zZCVxTj9dWokzMMyqzV63YcNDHk=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/NowShowing/3509/3509_aa.jpg",
//     featured: true
//   },
//   {
//     title: "As Good as It Gets",
//     description: "SMelvin Udall (Jack Nicholson) is an obsessive-compulsive writer of romantic fiction who's rude to everyone he meets, including his gay neighbor Simon (Greg Kinnear), but when he has to look after Simon's dog, he begins to soften and, if still not completely over his problems, finds he can conduct a relationship with the only waitress (Helen Hunt) at the local diner who'll serve him.",
//     genre: {
//       genreName: "Romance",
//       genreDescription: "Romance films involve romantic love stories recorded in visual media for broadcast in theatres or on television that focus on passion, emotion, and the affectionate romantic involvement of the main characters. Typically their journey through dating, courtship or marriage is featured."
//     },
//     director: {
//       directorName: "James L. Brooks",
//       bio: "Since the late 1960s, writer-director-producer James L. Brooks was a powerful comedic force on both the big screen and on television, creating multi-awarding winning fare that also proved to be smashing popular hits. After getting his start as a writer on shows like \"The Andy Griffith Show\" (CBS, 1960-68) and \"My Three Sons\" (ABC/CBS, 1960-1972), Brooks created \"The Mary Tyler Moore Show\" (CBS, 1970-77), a groundbreaking sitcom centered around a single, independent woman that earned several Emmy Awards and became one of the most revered programs of all time. Brooks continued his television success with \"Taxi\" (ABC/NBC, 1978-1983) before experiencing Academy Award triumph with his sentimental, but not maudlin tragic-comedy, \"Terms of Endearment\" (1983). He followed up with \Broadcast News\" (1987), a hilariously honest look at the complicated lives of people in the television news business, before creating with animator Matt Groening \"The Simpsons\" (Fox, 1990- ), an animated sitcom that became a cultural phenomenon and later a hugely successful movie in 2007. He had more critical and awards success with the heartwarming romantic comedy, \"As Good As It Gets\" (1997), which only confirmed his unique ability to create popular fare in all mediums that was also lauded by critics.",
//       "Birth": 1940
//     },
//     imageUrl: "https://resizing.flixster.com/DvSnGbybz5rKMrtn_MIDzHI2L-U=/206x305/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p20351_p_v13_aq.jpg",
//     featured: true
//   },
//   {
//     title: "Saving Private Ryan",
//     description: "Captain John Miller (Tom Hanks) takes his men behind enemy lines to find Private James Ryan, whose three brothers have been killed in combat. Surrounded by the brutal realties of war, while searching for Ryan, each man embarks upon a personal journey and discovers their own strength to triumph over an uncertain future with honor, decency and courage.",
//     genre: {
//       genreName: "War",
//       genreDescription: "War film is a film genre concerned with warfare, typically about naval, air, or land battles, with combat scenes central to the drama."
//     },
//     director: {
//       directorName: "Steven Spielberg",
//       bio: "American filmmaker Steven Spielberg has been wholeheartedly embraced by both mainstream audiences and critics throughout his long and prolific career. Having made a number of modern classics, going all the way back to 1975's \"Jaws\" Spielberg is universally regarded by both his peers and film historians as one of the greatest American filmmakers in the history of the medium. Born in Cincinnati and raised primarily in Phoenix, Arizona, Spielberg began making super 8 short films when he was still in his teens. At 16 he made his first feature length film, the science fiction adventure film \"Firelight\" (1963). His 1971 made-for-TV road thriller \"Duel\" proved to be the break he needed to make the leap into movies. After the success of \"Duel\" Spielberg directed the critically acclaimed crime drama \"Sugarland Express\" (1974), which starred Goldie Hawn. It was his next film about a renegade great white shark off the coast of a New England resort town that would make the phrase \"blockbuster\" practically identical with Spielberg's name. Released in the summer of 1975, \"Jaws\" which was made for $9 million dollars, grossed over $470 million at the box office, making it one of the most financially successful films ever, up until that point. The film was also nominated for Best Picture and took home three Academy Awards. For Spielberg, the success of \"Jaws\" would prove to be just the start of one of the most charmed filmmaking careers in Hollywood history. Over the next several decades he directed a wide array of universally beloved films that are now considered modern classics. These films include, but are not limited to: \"Close Encounters of the Third Kind\" (1977), \"Raiders of the Lost Ark\" (1981), \"ET the Extra-Terrestrial\" (1982), \"Schindler's List\" (1993), \"Jurassic Park\" (1993) \"Lincoln\" (2012). In addition to directing, Spielberg was also a prolific producer. Throughout his six decades in show business, Spielberg produced over 150 film and television projects. Furthermore, he's also taken home three Academy Awards, and has received scores of other nominations for his film and television work. In 2018 Spielberg directed his 32nd feature length film, \"Ready Player One\". The film was an adaptation of a popular 2011 science fiction novel by Ernest Cline, and was well-received by both critics and audiences. Spielberg's films remain benchmarks in terms of special, visual and sound effects, as well as in the public reaction they arouse.",
//       birth: 1946
//     },
//     imageUrl: "https://resizing.flixster.com/w3n4-6BPPmegOYfBinbTgvms7Uk=/206x305/v2/https://resizing.flixster.com/e4XDrbw7Fd7VYePV7cxB8sQV3eA=/ems.cHJkLWVtcy1hc3NldHMvbW92aWVzLzc1MDczNGJlLWNjN2EtNGIxMS1iOWM5LWJjYTUwODk4MzA5Yy53ZWJw",
//     featured: true
//   }
// ];

// Get all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a Movie by Title
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie);
      } else {
        res.status(400).send('There is no such a movie')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get Genre by its Name
app.get('/movies/genres/:genreName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Genre.Name": req.params.genreName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Genre);
      } else {
        res.status(400).send('There is no such a genre')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get Director by Name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', { session: false }), async (req, res) => {
  await Movies.findOne({ "Director.Name": req.params.directorName })
    .then((movie) => {
      if (movie) {
        res.status(200).json(movie.Director);
      } else {
        res.status(400).send('There is no such a director')
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Post New User
app.post('/users', async (req, res) => {
  await Users.findOne({ "Username": req.body.Username })
    .then((user) => {
      if (user) {
        res.status(400).send(req.body.Username + ' already exist!')
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
          .then((user) => { res.status(201).json(user) })
          .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Update Users Name
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ "Username": req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(400).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Post a movie to the list of favourites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ "Username": req.params.Username },
    {
      $push: { FavouriteMovies: req.params.MovieID }
    }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        Movies.findById(req.params.MovieID)
          .then((movie) => {
            res.status(200).send(movie.Title + " has been added to " + updatedUser.Username + "\'s favourites films.");
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('There is no such a movie (wrong ID)');
          });
      } else {
        res.status(400).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    })
});

// Delete a movie from the list of favourites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndUpdate({ "Username": req.params.Username },
    {
      $pull: { FavouriteMovies: req.params.MovieID }
    }, { new: true })
    .then((updatedUser) => {
      if (updatedUser) {
        Movies.findById(req.params.MovieID)
          .then((movie) => {
            res.status(200).send(movie.Title + " has been removed from " + updatedUser.Username + "\'s favourites films.");
          })
          .catch((err) => {
            console.error(err);
            res.status(500).send('There is no such a movie (wrong ID)');
          });
      } else {
        res.status(500).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('There is no such a movie (wrong ID)');
    })
});

// Delete an user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if (req.user.Username !== req.params.Username) {
    return res.status(400).send('Permission denied');
  }
  await Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (user) {
        res.status(200).send(req.params.Username + ' has been deleted.');
      } else {
        res.status(400).send('There is no such an user');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use(express.static('public'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something is broken');
});

const port = process.env.PORT || 8080;
const host = '0.0.0.0';
app.listen(port, host, () => {
  console.log('Your app is listening on port ' + port + '.');
});