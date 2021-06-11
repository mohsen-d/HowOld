
'use strict';

// npx babel --watch client\react --out-dir client --presets react-app/prod

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.state = {
      query: '',
      movie: {},
      actors: [],
      error: '',
      connecting: false,
      successfullSearch: false
    };
    _this.handleSubmit = _this.handleSubmit.bind(_this);
    _this.handleChange = _this.handleChange.bind(_this);
    _this.handleBackBtn = _this.handleBackBtn.bind(_this);
    return _this;
  }

  _createClass(App, [{
    key: 'handleChange',
    value: function handleChange(v) {
      this.setState({ query: v });
    }
  }, {
    key: 'handleBackBtn',
    value: function handleBackBtn() {
      this.setState({ successfullSearch: false });
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      var _this2 = this;

      /*var result = {"movie":{"name":"WAR OF THE WORLDS","year":"2004","poster":"https://m.media-amazon.com/images/M/MV5BMTk5MzU1MDMwMF5BMl5BanBnXkFtZTcwNjczODMzMw@@._V1_QL75_UY400_CR0,0,270,400_.jpg"},"actors":[{"name":"Brad Pitt","img":"https://m.media-amazon.com/images/M/MV5BMjA1MjE2MTQ2MV5BMl5BanBnXkFtZTcwMjE5MDY0Nw@@._V1_QL75_UX200_CR0,12,200,200_.jpg","bYear":"1963","age":41},{"name":"Eric Bana","img":"https://m.media-amazon.com/images/M/MV5BNzM4MjY5YjctMWQzNy00MjczLTg1MGMtOTIxZWU4NGVmMWQyXkEyXkFqcGdeQXVyNzAxOTAyMDc@._V1_QL75_UX200_CR0,12,200,200_.jpg","bYear":"1968","age":36},{"name":"Orlando Bloom","img":"https://m.media-amazon.com/images/M/MV5BMjE1MDkxMjQ3NV5BMl5BanBnXkFtZTcwMzQ3Mjc4MQ@@._V1_QL75_UX200_CR0,3,200,200_.jpg","bYear":"1977","age":27},{"name":"Julian Glover","img":"https://m.media-amazon.com/images/M/MV5BMjA4MDg3MjA2NV5BMl5BanBnXkFtZTcwNjAxNzczNA@@._V1_QL75_UX200_CR0,0,200,200_.jpg","bYear":"1935","age":69},{"name":"Brian Cox","img":"https://m.media-amazon.com/images/M/MV5BMTcyNzg4MzIwNl5BMl5BanBnXkFtZTcwNTI1NjYyMQ@@._V1_QL75_UX200_CR0,5,200,200_.jpg","bYear":"1946","age":58},{"name":"Nathan Jones The Third Big Dude","img":"https://m.media-amazon.com/images/M/MV5BNWNkOGY2NTMtMDUzMi00NmQ1LTk3ZjItMTljYWY1NWJlNTJiXkEyXkFqcGdeQXVyMTAwNTEwNTE4._V1_QL75_UX200_CR0,0,200,200_.jpg","bYear":"1969","age":35}]}
      this.setState({
        movie: result.movie,
        actors: result.actors,
        error: '',
        query: '',
        successfullSearch: true
      });*/

      this.setState({ connecting: true });

      var data = { movie: this.state.query };
      axios({
        method: 'post',
        url: '/search',
        data: data
      }).then(function (result) {
        _this2.setState({
          movie: result.data.movie,
          actors: result.data.actors,
          error: '',
          query: '',
          connecting: false,
          successfullSearch: true
        });
      }, function (error) {
        _this2.setState({
          error: error.response.data,
          connecting: false
        });
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'wrapper' },
        React.createElement(
          'div',
          { id: 'search', className: this.state.successfullSearch ? "hide" : "show" },
          React.createElement(
            'div',
            { id: 'searchBox', className: this.state.successfullSearch ? "hide" : "show" },
            React.createElement(
              'h1',
              null,
              React.createElement(
                'span',
                { id: 'how' },
                'HOW'
              ),
              React.createElement(
                'span',
                { id: 'old' },
                'OLD'
              )
            ),
            React.createElement(
              'div',
              { id: 'error' },
              this.state.error
            ),
            React.createElement(Search, { connecting: this.state.connecting, value: this.state.query, onChange: this.handleChange, onClick: this.handleSubmit })
          )
        ),
        React.createElement(SearchResult, { onBackBtnClick: this.handleBackBtn, successfullSearch: this.state.successfullSearch, movie: this.state.movie, actors: this.state.actors }),
        React.createElement(
          'div',
          { id: 'footer', className: this.state.successfullSearch ? "light" : "dark" },
          '2021 \xA9 ',
          React.createElement(
            'a',
            { href: 'https://github.com/mohsen-d' },
            'Mohsen Dorparasti'
          )
        )
      );
    }
  }]);

  return App;
}(React.Component);

var Search = function (_React$Component2) {
  _inherits(Search, _React$Component2);

  function Search(props) {
    _classCallCheck(this, Search);

    var _this3 = _possibleConstructorReturn(this, (Search.__proto__ || Object.getPrototypeOf(Search)).call(this, props));

    _this3.state = {
      hasFocus: false
    };

    _this3.handleSubmit = _this3.handleSubmit.bind(_this3);
    _this3.handleChange = _this3.handleChange.bind(_this3);
    _this3.handleFocus = _this3.handleFocus.bind(_this3);
    return _this3;
  }

  _createClass(Search, [{
    key: 'handleChange',
    value: function handleChange(e) {
      this.props.onChange(e.target.value);
    }
  }, {
    key: 'handleSubmit',
    value: function handleSubmit(e) {
      this.props.onClick(e);
      e.preventDefault();
    }
  }, {
    key: 'handleFocus',
    value: function handleFocus(focusState) {
      this.setState({ hasFocus: focusState });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      return React.createElement(
        'div',
        { id: 'searchForm' },
        React.createElement(
          'form',
          { onSubmit: this.handleSubmit },
          React.createElement(
            'label',
            { className: this.state.hasFocus ? "show" : "" },
            'Movie title'
          ),
          React.createElement('input', { type: 'text', disabled: this.props.connecting ? "disabled" : "", placeholder: this.state.hasFocus ? "" : "Type the title of the movie here", value: this.props.value, onFocus: function onFocus() {
              return _this4.handleFocus(true);
            }, onBlur: function onBlur() {
              return _this4.handleFocus(false);
            }, onChange: this.handleChange }),
          '\xA0',
          React.createElement('input', { type: 'submit' }),
          React.createElement(
            'div',
            { className: this.props.value.length > 0 ? "show" : "", id: 'msg' },
            this.props.connecting ? React.createElement('img', { src: '/loader.gif', alt: 'please wait ...' }) : "enter the title and hit enter key"
          )
        )
      );
    }
  }]);

  return Search;
}(React.Component);

var SearchResult = function (_React$Component3) {
  _inherits(SearchResult, _React$Component3);

  function SearchResult(props) {
    _classCallCheck(this, SearchResult);

    return _possibleConstructorReturn(this, (SearchResult.__proto__ || Object.getPrototypeOf(SearchResult)).call(this, props));
  }

  _createClass(SearchResult, [{
    key: 'render',
    value: function render() {
      /*if(!this.props.successfullSearch){
        return null;
      }*/

      return React.createElement(
        'div',
        { id: 'searchResult', className: this.props.successfullSearch ? "show" : "hide" },
        React.createElement('div', { id: 'searchBg', className: this.props.successfullSearch ? "show" : "hide", style: { backgroundImage: "url(" + this.props.movie.poster + ")" } }),
        React.createElement(
          'div',
          { id: 'back', onClick: this.props.onBackBtnClick, className: this.props.successfullSearch ? "show" : "hide" },
          '\xA0'
        ),
        React.createElement(
          'div',
          { id: 'results', className: this.props.successfullSearch ? "show" : "hide" },
          React.createElement(MovieInfo, { movie: this.props.movie }),
          React.createElement(ActorsInfo, { actors: this.props.actors })
        )
      );
    }
  }]);

  return SearchResult;
}(React.Component);

var MovieInfo = function (_React$Component4) {
  _inherits(MovieInfo, _React$Component4);

  function MovieInfo(props) {
    _classCallCheck(this, MovieInfo);

    return _possibleConstructorReturn(this, (MovieInfo.__proto__ || Object.getPrototypeOf(MovieInfo)).call(this, props));
  }

  _createClass(MovieInfo, [{
    key: 'render',
    value: function render() {
      var movie = this.props.movie;
      return React.createElement(
        'div',
        { id: 'movieInfo' },
        React.createElement(
          'h2',
          { id: 'movieTitle' },
          movie.name + " (" + movie.year + ")"
        ),
        React.createElement(
          'div',
          { id: 'moviePoster' },
          React.createElement('img', { src: movie.poster })
        )
      );
    }
  }]);

  return MovieInfo;
}(React.Component);

var ActorsInfo = function (_React$Component5) {
  _inherits(ActorsInfo, _React$Component5);

  function ActorsInfo(props) {
    _classCallCheck(this, ActorsInfo);

    return _possibleConstructorReturn(this, (ActorsInfo.__proto__ || Object.getPrototypeOf(ActorsInfo)).call(this, props));
  }

  _createClass(ActorsInfo, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        { id: 'actors' },
        this.props.actors.map(function (actor) {
          return React.createElement(ActorInfo, { key: actor.name, actor: actor });
        })
      );
    }
  }]);

  return ActorsInfo;
}(React.Component);

var ActorInfo = function (_React$Component6) {
  _inherits(ActorInfo, _React$Component6);

  function ActorInfo(props) {
    _classCallCheck(this, ActorInfo);

    var _this8 = _possibleConstructorReturn(this, (ActorInfo.__proto__ || Object.getPrototypeOf(ActorInfo)).call(this, props));

    _this8.states = {
      nameHeight: 36
    };
    return _this8;
  }

  _createClass(ActorInfo, [{
    key: 'handleHover',
    value: function handleHover(e, status) {
      var nameElm = e.target.closest(".actor").getElementsByClassName("name")[0];
      var ageElm = e.target.closest(".actor").getElementsByClassName("age")[0];
      if (status === "in") {
        ageElm.style.top = -(nameElm.getBoundingClientRect().height + 33);
        nameElm.style.top = -(nameElm.getBoundingClientRect().height + 23);
      }
      if (status === "out") {
        ageElm.style.top = -33;
        nameElm.style.top = -23;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this9 = this;

      var actor = this.props.actor;
      return React.createElement(
        'div',
        { className: 'actor', onMouseOver: function onMouseOver(e) {
            return _this9.handleHover(e, "in");
          }, onMouseOut: function onMouseOut(e) {
            return _this9.handleHover(e, "out");
          } },
        React.createElement(
          'div',
          { className: 'avatar' },
          React.createElement('img', { src: actor.img })
        ),
        React.createElement(
          'div',
          { className: 'age' },
          actor.age
        ),
        React.createElement(
          'div',
          { className: 'name' },
          actor.name + " (" + actor.bYear + ")"
        )
      );
    }
  }]);

  return ActorInfo;
}(React.Component);

var domContainer = document.querySelector('#content');
ReactDOM.render(React.createElement(App, null), domContainer);