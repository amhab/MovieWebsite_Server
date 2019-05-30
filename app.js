import connection from './index.js' ;
import { isInteger, callStack } from 'good/node_modules/hoek';
const MySQL = require('mysql');
function createConnection(){
  const connection = MySQL.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ceitMovie'
});
  connection.connect() ;
  return connection ;
}

let getLatestMovies = (req, res) => {
  console.log("getLatestMovies module")

  var moviesNumber=req.query.number
  console.log(moviesNumber)
  moviesNumber=parseInt(moviesNumber)

  if(isNaN(moviesNumber)){
    console.log ("may be sql injection") ;
    var data = {
     error : 'not valid input...may be SQL injection !!'
    }
    return data ;
  }

  return new Promise(function(resolve,reject){
  let connection = createConnection();
  let myQuery = 'SELECT * FROM Movies ORDER BY id DESC LIMIT ? ;'
  connection.query( myQuery , moviesNumber, function (error, results, fields ){
  if (error){ throw error; return error ; reject(err) ;}
  var xdata = []
  results.forEach(function(item) {
          var element={} ;
          element['id'] = item.id ;
          element['title'] = item.title ;
          element['original_title'] = item.original_title ;
          element['year'] = item.year;
          xdata.push(element);
    });
      // returnVal(xdata) ;
      resolve(xdata);
      return xdata ;
     
  }
);
  })
}

let getMovieDetails = (req, res) => {
  console.log('getMovieDetails ') ;

  var movieId=encodeURIComponent(req.params.id)
   movieId = parseInt(movieId) 

   return new Promise(function(resolve,reject){
  let connection=createConnection() ;
  connection.query("SELECT * FROM Movies WHERE id= ?",movieId ,
   function (error, results, fields) {
  if (error){console.log(error) ; throw error; return error ; reject(error)}
  var data=[]
  results.forEach(function(item) {
          var element={} ;
          element['id'] =item.id ;
          element['title'] =item.title ;
          element['original_title'] =item.original_title ;
          element['year'] =item.year ; 
          element['created_at'] =item.created_at ;
          element['rate'] =item.rate ;
          element['length'] =item.length ;
          element['language'] =item.language ;
          element['country'] =item.country ;
          element['description'] =item.description ;
          element['director'] =item.director ;
          
          data.push(element)
          resolve(data) ;
          connection.query("SELECT * FROM Comments WHERE movie_id= ?",movieId ,
          function (error, results, fields) {
            if(error){console.log(error) ; throw error; return error ;}
            var x=0 ;
            var m ;
            results.forEach(function(item) {
              x=x+item.rate ;
          });  
            m=x/results.length ;
          }) ; 
    }); 

  });
}) ;
};

let getMovieComments = (req, res) => {
  console.log('getMovieComments ') ;

  var movieId=encodeURIComponent(req.params.id)
  movieId = parseInt(movieId) ;
  console.log(movieId)
  return new Promise(function(resolve,reject){
  let connection=createConnection() ;
  connection.query("SELECT * FROM Comments WHERE movie_id= ? ORDER BY id DESC ",movieId ,
    function (error, results, fields,callback) {
      if(error){console.log(error) ; throw error; return error ;}
      var x=[] ;
      results.forEach(function(item) {
        x.push(item) ;
    });
      resolve(x) ;
    }) ;
  }) ;
}

let sendMovieComment = (req, res) => {
  console.log('sendMovieComment ') ;
  var payload = req.payload ;
  var movieId=encodeURIComponent(req.params.id)
  movieId = parseInt(movieId) ;

  var movie_id =payload.movie_id ;
  var created_at= new Date().toISOString().slice(0, 19).replace('T', ' ');
  var author = payload.author ; 
  var comment = payload.comment ;
  var rate = payload.rate ;
  var rate2 = payload.rate ;
  var rate3 = payload.rate ;
  var is_suggested = payload.is_suggested ;
  var likes = payload.likes ;
  var dislikes = payload.dislikes ;

  //store in DB
  return new Promise(function(resolve,reject){
  let connection=createConnection() ;
  connection.query("INSERT INTO Comments(movie_id,created_at,author,comment,rate,rate2,rate3,is_suggested,likes,dislikes) VALUES (?,?,?,?,?,?,?,?,?,?);",[movie_id,created_at,author,comment,rate,rate2,rate3,is_suggested,likes,dislikes] ,
    function (error, results, fields,callback) {
      if(error){console.log(error) ; throw error; return error ;reject(error);}
      console.log(results) ;
      resolve(results)
    }) ;
  });
}

let searchMovie = (req, res) => {
  console.log('searchMovie ') ;

  var searchQuery = req.query.q ;
  console.log(searchQuery)
  var mySearchQuery="%"+searchQuery+"%" ;

  var id = "";
  var title ="" ; 
  var cover = "" ;
  //search in Movies table in ceitMovie DB
  return new Promise(function(resolve,reject){
  let connection=createConnection() ;
  connection.query('SELECT id,title FROM Movies WHERE ( title LIKE ? or description LIKE ? ) ;',[mySearchQuery,mySearchQuery ] ,
    function (error, results, fields) {
      if(error){console.log("error: " , error) ; throw error; return error ;reject(error)}
      console.log(results) ;
      var searchResults=[]
      results.forEach(function(item) {
        searchResults.push(item) ;
    });
      resolve(searchResults)
    }) ;
  }) ;
}

let submitMovie = (req, res) => {

  console.log('submitMovie ') ;
  var payload = req.payload ;

  var created_at= new Date().toISOString().slice(0, 19).replace('T', ' ');
  var title =payload.title ;
  var original_title =payload.title ; 
  var rate = payload.rate ;
  var year =payload.year ;
  var length =payload.length ;
  var language =payload.language ;
  var country =payload.country ;
  var description =payload.description ;
  var director =payload.director ;
  var authors =payload.authors ;
  var stars =payload.stars ;
  var genres =payload.genres ;

  //store image in images directory
  var coverImage =payload.coverImage ;
  //store trailer in trailers directory
  var trailerVideo =payload.trailerVideo ;

  return new Promise(function(resolve,reject){
  let connection=createConnection() ;
  connection.query("INSERT INTO Movies(created_at,title,original_title,rate,year,length,language,country,description,director,authors,stars,genres) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",[created_at,title,original_title,rate,year,length,language,country,description,director,authors,stars,genres] ,
    function (error, results, fields) {
      if(error){console.log(error) ; throw error; return error ;reject(error);}
      else{
        console.log("success") ;
        resolve("success") ;
      }
    }) ;
  });
};





export {getLatestMovies,getMovieDetails,getMovieComments,sendMovieComment,searchMovie,submitMovie} ;