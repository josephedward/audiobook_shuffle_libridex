const axios = require("axios");
const _ = require("lodash");
const cheerio = require("cheerio");
const chalk = require("chalk");
const router = require("express").Router();
const { parse, stringify } = require("flatted");
// const CSVToJSON = require('csvtojson');

let book = {};

// const csvFilePath = "./rec_obj_dedup_test.csv";
// const csvFilePath ="https://drive.google.com/file/d/1-0R8X1xsxmrR3Io0UVe28T4y7M3Hd2t6/view?usp=sharing"
const csvFilePath = "./denormalized_scrape_match_v3-3.csv";
// "https://docs.google.com/spreadsheets/d/e/2PACX-1vQzeX2vl5mzdEQd-M47lPLzloDpIHRiNsnp11ekJXwzkjkQdIIx05HnExOx9ST0J-DSGG6fZRRHULkD/pub?gid=1343365081&single=true&output=csv"
const csv = require("csvtojson");

async function findBookRecs(bookTitle) {
  let recommendations = await csv().fromFile(csvFilePath);
  console.log(chalk.bgGreen("searching recommendations for : ", bookTitle));
  try {
    rec_list = [];
    let data = JSON.parse(JSON.stringify(recommendations));
    for (var x of data) {
      tempObj = JSON.parse(x[0]);
      console.log(tempObj[0].title);
      if (
        bookTitle.includes(tempObj[0].title) ||
        tempObj[0].title.includes(bookTitle) ||
        tempObj[0].title == bookTitle
      ) {
        console.log("found it:");
        // console.log(tempObj[0].description)
        console.log(tempObj[0].img_url);
        console.log("recommendations: ");
        console.log(JSON.parse(tempObj[0].Rec_Info_Arr))
        tempRecArr = JSON.parse(tempObj[0].Rec_Info_Arr);
        tempRecArr = await locateImgs(tempRecArr);
        return tempRecArr;
      }
    }

    // console.log(data)
    // tempObj=JSON.parse(data[0][0])
    // console.log(tempObj[0].title)

    // console.log(chalk.red("data :"), JSON.parse(data[2][0]))
    //     for (var i = 0; i < keys.length; i++) {

    //       // console.log(recommendations[keys[i]].title);
    //       if (bookTitle.includes(recommendations[keys[i]].title) || recommendations[keys[i]].title.includes(bookTitle)) {
    //         console.log(
    //           "found: ",
    //            recommendations[keys[i]].rec_objects
    //         );

    //         // var apostropheRegex = """(?<=[a-zA-Z])'(?=[a-zA-Z])""";
    // // "john's carpet is 5' x 8'".replaceAll(apostropheRegex, "XXX"

    //         // str.replace(/'/g, "''");
    //         // temp_split = recommendations[keys[i]].rec_objects.split(" ")
    //         //  console.log(temp_split)
    //         // for(var x of temp_split){
    //         //   x=x.replace(/^\w/,"")
    //         // }
    //         // console.log(temp_split)
    //         recs_temp_js_obj = recommendations[keys[i]].rec_objects.replace(/([\w]+['][\w]+)/g, "")
    //         console.log(recs_temp_js_obj)

    //         recs_temp_js_obj = recommendations[keys[i]].rec_objects.replace(/'/g, "\"")
    //         console.log(recs_temp_js_obj)

    // recs_temp_js_obj = JSON.parse(recs_temp_js_obj)
    //   console.log(recs_temp_js_obj[0])
    //     rec_list = recommendations[keys[i]].book_recommendation_urls;
    //     rec_list = rec_list.replace("[", "");
    //     rec_list = rec_list.replace("]", "");

    //     // rec_list = rec_list.replace("/", "");
    //     rec_list = rec_list.split(",");

    //     console.log(chalk.magenta(rec_list));
    //     let tempList = [];

    //     for (var x of rec_list) {
    //       // const matches = string.match(/\bhttp?::\/\/\S+/gi);
    //       console.log("rec_list ->", x.toString());
    //       try {
    //         tempList.push(await buildRecObj(x))
    //       } catch (error) {
    //         console.log(error.message)
    //       }
    //     }
    //     console.log("tempList: ", chalk.red(tempList));

    //     return rec_list;
    // }
    // }
  } catch (err) {
    console.log(chalk.bgRed("couldnt find"));
    console.log(chalk.bgRed(err.message));
  }
}

async function locateImgs(tempRecArr) {
  let recommendations = await csv().fromFile(csvFilePath);
  try {
    let data = JSON.parse(JSON.stringify(recommendations));
    tempRecArr.forEach((rec) => {
      console.log(chalk.bgMagenta("searching img URL for : ", rec.title))
      console.log(rec.title);
      for (var y of data) {
        tempYObj = JSON.parse(y[0]);
        console.log(tempYObj[0].title);
        if (
          rec.title.includes(tempYObj[0].title) ||
          tempYObj[0].title.includes(rec.title) ||
          tempObj[0].title == rec.title
        ) {
          console.log("found it:");
          console.log(chalk.bgCyan(tempYObj[0].img_url));
          console.log(rec.img_url = tempYObj[0].img_url)
          return
        }
      }
    });
  } catch (bs) {
    console.log(chalk.bgRed("some bs messed up: ", bs.message));
  }
 return tempRecArr
}

// async function buildRecObj(url) {
//   url = url.replace("[", " ");
//   url = url.replace("[", " ");

//   rec = {};
//   console.log(chalk.cyan("building book Rec obj..."));
//   console.log("build url -> ", url);
//   // try {
//   page = await axios
//     .get(url)
//     .then(async = (response) =>{
//       console.log("response :", response);
//       return response.data;
//     })
//     .catch((error) => {
//       console.log(chalk.red(error));
//     });

//   let $ = cheerio.load(page);
//   rec.bkTitle = $(".book-page-book-cover").next("h1").text();
//   rec.bkImage = $(".book-page-book-cover").children().attr("src");
//   rec.bkAuthor = $(".book-page-author").text();
//   rec.link = url;
//   console.log(rec);
//   return rec;
// }


getGenreLBVX = (genre) => {
  console.log(chalk.green("contacting librivox"));
  return axios.get(
    `https://librivox.org/api/feed/audiobooks/genre/^${genre}?format=json`
  );
};

getSpecificBookLBVX = (id) => {
  console.log(chalk.green("contacting librivox"));
  return axios.get(`https://librivox.org/api/feed/audiobooks/id/${id}`);
};

// async function getRecs(bookTitle) {
//   console.log(
//     chalk.green("getting recommendations from flask server: ", bookTitle)
//   );
//   try {
//     return await axios.get(
//       encodeURI(`http://127.0.0.1:5000/recommend_static/${bookTitle}/`)
//     );
//     // return await axios.get(encodeURI(`https://gentle-tundra-97522.herokuapp.com/recommend_static/${bookTitle}`))
//   } catch (err) {
//     console.log(err.message);
//   }
// }

//build book object
async function buildBookObj(page) {
  console.log(chalk.green("building book object"));
  let $ = cheerio.load(page.data);
  book.bkTitle = $(".book-page-book-cover").next("h1").text();
  
  try {
    book.bkRecs = await findBookRecs(book.bkTitle);
  } catch (error) {
    console.log(error);
  }

  book.bkAuthor = $(".book-page-author").text();
  book.bkDescription = $(".description").text();
  book.bkImage = $(".book-page-book-cover").children().attr("src");
  book.CHS = [];
  $(".chapter-name").each(function (i, element) {
    let chapter = {};
    chapter.chTitle = $(element).text();
    chapter.chLink = $(element).attr("href");
    book.CHS.push(chapter);
  });
  // console.log(Object.values(book));
  return book;
}

searchGenre = (genre) => {
  return getGenreLBVX(genre)
    .then((res) => {
      const books = res.data.books;
      const { url_librivox, id } = books[
        Math.floor(Math.random() * books.length)
      ];
      book.bkID = id;
      book.bkURL = url_librivox;
      return axios.get(url_librivox);
    })
    .then(buildBookObj);
};

getSpecificBook = (id) => {
  return getSpecificBookLBVX(id)
    .then((res) => {
      const books = res.data.books;
      const { url_librivox } = books[Math.floor(Math.random() * books.length)];
      return axios.get(url_librivox);
    })
    .then(buildBookObj);
};

searchGenre("");
// findBookRecs('The Colors of Space')
// buildRecObj('https://librivox.org/the-odyssey-by-homer/')
// getSpecificBook(65)

//should match to /api/audiobook
router.route("/").get(
  function (req, res) {
    res.json(book);
  }
  // book
);

router.route("/genre/:id").get(async function (req, res) {
  console.log(req.params.id);
  try {
    await searchGenre(req.params.id).then((bookData) => res.json(bookData));
  } catch (err) {
    console.log(err.message);
  }
});

router.route("/book/:id").get(async function (req, res) {
  console.log(req.params.id);
  await getSpecificBook(req.params.id).then((bookData) => res.json(bookData));
});

module.exports = router;
