
'use strict';

// npx babel --watch client\react --out-dir client --presets react-app/prod

class App extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      query: '',
      movie: {},
      actors: [],
      error: '',
      connecting: false,
      successfullSearch: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBackBtn = this.handleBackBtn.bind(this);
  }

  handleChange(v){
    this.setState({query: v});
  }

  handleBackBtn(){
    this.setState({successfullSearch: false});
  }

  handleSubmit(e){
    
    /*var result = {"movie":{"name":"WAR OF THE WORLDS","year":"2004","poster":"https://m.media-amazon.com/images/M/MV5BMTk5MzU1MDMwMF5BMl5BanBnXkFtZTcwNjczODMzMw@@._V1_QL75_UY400_CR0,0,270,400_.jpg"},"actors":[{"name":"Brad Pitt","img":"https://m.media-amazon.com/images/M/MV5BMjA1MjE2MTQ2MV5BMl5BanBnXkFtZTcwMjE5MDY0Nw@@._V1_QL75_UX200_CR0,12,200,200_.jpg","bYear":"1963","age":41},{"name":"Eric Bana","img":"https://m.media-amazon.com/images/M/MV5BNzM4MjY5YjctMWQzNy00MjczLTg1MGMtOTIxZWU4NGVmMWQyXkEyXkFqcGdeQXVyNzAxOTAyMDc@._V1_QL75_UX200_CR0,12,200,200_.jpg","bYear":"1968","age":36},{"name":"Orlando Bloom","img":"https://m.media-amazon.com/images/M/MV5BMjE1MDkxMjQ3NV5BMl5BanBnXkFtZTcwMzQ3Mjc4MQ@@._V1_QL75_UX200_CR0,3,200,200_.jpg","bYear":"1977","age":27},{"name":"Julian Glover","img":"https://m.media-amazon.com/images/M/MV5BMjA4MDg3MjA2NV5BMl5BanBnXkFtZTcwNjAxNzczNA@@._V1_QL75_UX200_CR0,0,200,200_.jpg","bYear":"1935","age":69},{"name":"Brian Cox","img":"https://m.media-amazon.com/images/M/MV5BMTcyNzg4MzIwNl5BMl5BanBnXkFtZTcwNTI1NjYyMQ@@._V1_QL75_UX200_CR0,5,200,200_.jpg","bYear":"1946","age":58},{"name":"Nathan Jones The Third Big Dude","img":"https://m.media-amazon.com/images/M/MV5BNWNkOGY2NTMtMDUzMi00NmQ1LTk3ZjItMTljYWY1NWJlNTJiXkEyXkFqcGdeQXVyMTAwNTEwNTE4._V1_QL75_UX200_CR0,0,200,200_.jpg","bYear":"1969","age":35}]}
    this.setState({
      movie: result.movie,
      actors: result.actors,
      error: '',
      query: '',
      successfullSearch: true
    });*/
    
    this.setState({connecting: true});

    var data = {movie: this.state.query};
    axios({
        method: 'post',
        url: '/search',
        data: data
      })
      .then(
        (result) => {
          this.setState({
            movie: result.data.movie,
            actors: result.data.actors,
            error: '',
            query: '',
            connecting: false,
            successfullSearch: true
          });
        },
        (error) => {
          this.setState({
            error: error.response.data,
            connecting: false
          });
        }
      )
  }



  render(){
    return(
      <div id="wrapper">
        <div id="search" className={this.state.successfullSearch ? "hide" : "show"}>
          <div id="searchBox" className={this.state.successfullSearch ? "hide" : "show"}>
            <h1><span id="how">HOW</span><span id="old">OLD</span></h1>
            <div id="error">{this.state.error}</div>
            <Search connecting={this.state.connecting} value={this.state.query} onChange={this.handleChange} onClick={this.handleSubmit} />
          </div>
        </div>
        <SearchResult onBackBtnClick={this.handleBackBtn} successfullSearch={this.state.successfullSearch} disabled={this.state.connecting} movie={this.state.movie} actors={this.state.actors} />
      </div>
    );
  }
}

class Search extends React.Component{

  constructor(props){
    super(props);

    this.state ={
      hasFocus: false
    }
    
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleChange(e){
    this.props.onChange(e.target.value);
  }

  handleSubmit(e){
    this.props.onClick(e);
    e.preventDefault();
  }

  handleFocus(focusState){
    this.setState({hasFocus: focusState })
  }

  render(){
    return(
      <div id="searchForm">
        <form onSubmit={this.handleSubmit}>
          <label className={this.state.hasFocus? "show": ""}>Movie title</label>
          <input type="text" placeholder={this.state.hasFocus? "" : "Type the title of the movie here"} value={this.props.value} onFocus={() => this.handleFocus(true)} onBlur={() => this.handleFocus(false)} onChange={this.handleChange} />&nbsp;
          <input type="submit" />
          <div className={this.props.value.length > 0 ? "show": ""} id="msg">{this.props.connecting? "Please wait ..." : "enter the title and hit enter key"}</div>
        </form>
      </div>
    );
  }
}

class SearchResult extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    /*if(!this.props.successfullSearch){
      return null;
    }*/

    return(
      <div id="searchResult" className={this.props.successfullSearch ? "show" : "hide"}>
        <div id="searchBg" className={this.props.successfullSearch ? "show" : "hide"} style={{backgroundImage : "url(" + this.props.movie.poster + ")"}}></div>
        <div id="back" onClick={this.props.onBackBtnClick} className={this.props.successfullSearch ? "show" : "hide"}>&nbsp;</div>
        <div id="results"  className={this.props.successfullSearch ? "show" : "hide"}>
          <MovieInfo movie={this.props.movie} />
          <ActorsInfo actors={this.props.actors} />
        </div>
      </div>
    );
  }
}

class MovieInfo extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    const movie = this.props.movie;
    return(      
      <div id="movieInfo">
        <h2 id="movieTitle">{movie.name + " (" + movie.year + ")"}</h2>
        <div id="moviePoster"><img src={movie.poster} /></div>
      </div>
    );
  }
}

class ActorsInfo extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div id="actors">
        {this.props.actors.map((actor) => 
          <ActorInfo key={actor.name} actor={actor} />
        )}
      </div>
    );
  }
}

class ActorInfo extends React.Component{
  
  constructor(props){
    super(props);
    this.states = {
      nameHeight: 36
    };
  }

  handleHover(e, status){
    var nameElm = e.target.closest(".actor").getElementsByClassName("name")[0];
    var ageElm = e.target.closest(".actor").getElementsByClassName("age")[0];
    if(status === "in"){
      ageElm.style.top = -(nameElm.getBoundingClientRect().height + 33);
      nameElm.style.top = -(nameElm.getBoundingClientRect().height + 23);
    }
    if(status === "out"){
      ageElm.style.top = -33;
      nameElm.style.top = -23;
    }
  }

  render(){
    const actor = this.props.actor;
    return (
      <div className="actor" onMouseOver={(e) => this.handleHover(e, "in")} onMouseOut={(e) => this.handleHover(e, "out")}>
        <div className="avatar">
          <img src={actor.img} />
        </div>
        <div className="age">{actor.age}</div>
        <div className="name">{actor.name + " (" + actor.bYear + ")"}</div>
      </div>
    );
  }
}

const domContainer = document.querySelector('#content');
ReactDOM.render(<App />, domContainer);