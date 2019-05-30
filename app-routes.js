import {getLatestMovies,getMovieDetails,getMovieComments,sendMovieComment,searchMovie,submitMovie} from './app.js';

const payloadConfig = {
  output: 'data',
  parse:true
};

const routes = [
{
    path: '/movies/recent/{number?}',
    method: 'GET',
    handler: getLatestMovies
} ,
{
    path: '/movies/details/{id?}',
    method: 'GET',
    handler: getMovieDetails
}  ,
{
  path: '/movies/comments/{id?}',
  method: 'GET',
  handler: getMovieComments ,
  config : {
    cors: {
      origin: ['*'],
      additionalHeaders: ['Access-Control-Allow-Origin' , '*']
  }
  }
}  ,
{
  path: '/movies/comments/{id?}',
  method: 'POST',
  config: {
    handler: sendMovieComment,
    payload: payloadConfig
  } 
}  ,
{
  path: '/search',
  method: 'GET',
  handler: searchMovie
}  ,
{
  path: '/submit',
  method: 'POST',
  config: {
    handler: submitMovie,
    payload: payloadConfig
  } 
}  ,
] ;
export default routes ; 