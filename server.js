var bodyParser = require('body-parser');
var urllib = require('urllib');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static('client'));
app.use(bodyParser.json());


const domOptions = {
    locator: {},
    errorHandler: { warning: function (w) { }, 
    error: function (e) { }, 
    fatalError: function (e) { console.error(e) } }
};

async function getTheSearchPage(res, movieName){

    try{
        var result = await urllib.request('https://www.imdb.com/find?q=' + movieName + '&s=tt&ttype=ft&exact=true&ref_=fn_tt_ex');
    }
    catch{
        res.status(500).send("An error occured while connecting to database. Please try again later")
        return;
    }
    
    var pageContent = result.data.toString();
    pageContent = pageContent.substring(pageContent.indexOf('<table class="findList">'));
    pageContent = pageContent.substring(0, pageContent.indexOf('</table>')) + "</table>";

    try{
        var doc = new dom(domOptions).parseFromString(pageContent);
    }
    catch{
        res.status(500).send("An error occured while retreiving data from database. Please try again later")
        return;
    }
    
    var matches = xpath.select("//*[@class='result_text']/a", doc);

    if(matches.length == 0){
        res.status(404).send("Couldn't find the movie. Please check the name.")
        return;
    }

    var movieUrl = matches[0].getAttribute("href");
    movieUrl = movieUrl.substring(0, movieUrl.indexOf("?ref"));

    getMoviePage(res, movieName, movieUrl);    
}


async function getMoviePage(res, movieName, movieUrl){

    try{
        var result = await urllib.request('https://www.imdb.com' + movieUrl);
    }
    catch{
        res.status(500).send("An error occured while connecting to database. Please try again later")
        return;
    }

    var pageContent = result.data.toString();
    var modern = true;

    if(pageContent.indexOf('<main') > 0){
        pageContent = pageContent.substring(pageContent.indexOf('<main '));
        pageContent = pageContent.substring(0, pageContent.indexOf('</main>')) + "</main>";
    }else{
        modern = false;
        pageContent = pageContent.substring(pageContent.indexOf('<div id="pagecontent" class="pagecontent">'));
        pageContent = pageContent.substring(0, pageContent.indexOf('<div id="rvi-div">'));
    }

    pageContent = removeNonTags(pageContent);

    try{
        var doc = new dom(domOptions).parseFromString(pageContent);
    }
    catch{
        res.status(500).send("An error occured while retreiving data from database. Please try again later")
        return;
    }

    var movieYears;
    var moviePosters;
    var actorsUrls;
    var actorsImgs;

    if(!modern){
        movieYears = xpath.select("//span[@id='titleYear']/a", doc);
        moviePosters = xpath.select("//div[@class='slate_wrapper']//div[@class='poster']//img", doc);
        actorsUrls = xpath.select("//table[@class='cast_list']//td[@class='primary_photo']/a", doc);
        actorsImgs = xpath.select("//table[@class='cast_list']//td[@class='primary_photo']//img", doc);
    }
    else{
        movieYears = xpath.select("//a[contains(@href, 'releaseinfo?ref')]", doc);
        moviePosters = xpath.select("//div[@data-testid='hero-media__poster']//img", doc);
        actorsUrls = xpath.select("//a[@data-testid='title-cast-item__actor']", doc);
        actorsImgs = xpath.select("//div[@data-testid='title-cast-item__avatar']//img", doc);
    }

    var movieYear = "N/A";
    if(movieYears.length > 0) movieYear =  movieYears[0].firstChild.data;
    var moviePoster = "N/A";
    if(moviePosters.length > 0) moviePoster =  moviePosters[0].getAttribute("src").replaceAll("190", "270").replaceAll("281", "400").replaceAll("182", "270").replaceAll("268", "400");

    
    var topActors = [];
    var topActorsUrls = [];
    var topActorsImgs = [];
    var topActorsBYears =[];
    
    
    if(actorsUrls.length > 0){

        var numberOfActors = actorsUrls.length > 6 ? 6 : actorsUrls.length;
        for(i = 0; i < numberOfActors; i++){
            topActors[i]= actorsImgs[i].getAttribute("alt");
            var actorUrl = actorsUrls[i].getAttribute("href");
            topActorsUrls[i] = actorUrl.substring(0, actorUrl.indexOf("?ref"));
            topActorsImgs[i] = modern ? actorsImgs[i].getAttribute("src").replaceAll("140", "200") : actorsImgs[i].getAttribute("loadlate").replaceAll("32", "200").replaceAll("44", "200");
        }       
    

        try{
            var s1 = getActorBirthDate(topActorsUrls[0]);  
            var s2 = getActorBirthDate(topActorsUrls[1]);  
            var s3 = getActorBirthDate(topActorsUrls[2]);  
            var s4 = getActorBirthDate(topActorsUrls[3]);  
            var s5 = getActorBirthDate(topActorsUrls[4]);
            var s6 = getActorBirthDate(topActorsUrls[5]);
            topActorsBYears = await Promise.all([s1, s2, s3, s4, s5, s6]);
        }
        catch{
            topActorsBYears = ["N/A","N/A","N/A","N/A","N/A","N/A"]
        }
        
        
    } 

    var output = GenerateOutput(movieName, movieYear, moviePoster, topActors, topActorsImgs, topActorsBYears);
    res.send(output);
}

async function getActorBirthDate(actorUrl){
    
    if(!actorUrl.endsWith("/")) actorUrl += "/";

    try{
        var result = await urllib.request('https://www.imdb.com' + actorUrl, {timeout: 10000})
    }
    catch(err){
        console.log(err);
        return "N/A";
    }
    
    
    var pageContent = result.data.toString();
    pageContent = pageContent.substring(pageContent.indexOf('<div id="name-born-info" class="txt-block">'));
    pageContent = pageContent.substring(0, pageContent.indexOf('</div>')) + "</div>";
    pageContent = removeNonTags(pageContent);

    try{
        var doc = new dom(domOptions).parseFromString(pageContent);
    }
    catch{
        return "N/A";
    }

    var years = xpath.select("//a[contains(@href, 'birth_year')]", doc);
    var year = years.length > 0 ? years[0].firstChild.data : "N/A";

    return year;
}

function removeNonTags(pageContent){
    let re = /(<Q[^>]*>)(.*?)(<\/Q>)/gis;
    pageContent = pageContent.replace(/<script/gi, "<Q ")
    pageContent = pageContent.replace(/<\/script/gi, "</Q")
    pageContent = pageContent.replace(/<style/gi, "<Q")
    pageContent = pageContent.replace(/<\/style/gi, "</Q")
    pageContent = pageContent.replace(/<head/gi, "<Q")
    pageContent = pageContent.replace(/<\/head/gi, "</Q")
    pageContent = pageContent.replace(/<iframe/gi, "<Q")
    pageContent = pageContent.replace(/<\/iframe/gi, "</Q")
    pageContent = pageContent.replace(/(\s){2,}/gi, " ")
    pageContent = pageContent.replace(/\&nbsp\;/gi, "")
    pageContent = pageContent.replace(/\&raquo\;/gi, "")
    pageContent = pageContent.replace(/\&ndash\;/gi, "")
    pageContent = pageContent.replace(re, '');
    return pageContent;    
}

function GenerateOutput(movieName, movieYear, moviePoster, actorsNames, actorsImgs, actorsBirthYear){

    var movie = {name: movieName, year: movieYear, poster: moviePoster};
    var actors = [];

    for(i = 0; i < actorsNames.length; i++){
        var actorAge = movieYear - actorsBirthYear[i];
        actors[i] = {name: actorsNames[i], img: actorsImgs[i], bYear: actorsBirthYear[i], age: actorAge};
    }
    return {movie: movie, actors: actors};
}


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/search', function(req, res) {

    if(req.body === undefined || req.body.movie === undefined){
     res.status(400).send("Please enter a movie name")
     return;
    }

    var movieName = req.body.movie.trim();
    
    if(movieName === "") {
        res.status(400).send("Please enter a movie name");
        return
    }

    
    getTheSearchPage(res, movieName);
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => {
  console.log(`HowOld is listening on port ${port}!`)
});
