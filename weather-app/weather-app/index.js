window.input = null;


class WeatherCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  renderCard() {
    const data = this.props.data;
    data.main.temp = Math.round(data.main.temp);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];
    let fullDate = data.dt_txt.substring(0, 10);
    let m = fullDate.substring(5, 7);
    let d = fullDate.substring(8, 10);
    let y = fullDate.substr(0, 4);
    let revDate = m + "/" + d + "/" + y;
    let month = monthNames[m - 1];
    let day = parseInt(data.dt_txt.substring(8, 10));
    let currentDate = new Date(revDate);
    let date = month + " " + day.toString();
    let dayStr = days[currentDate.getDay()];
    let temp = data.main.temp + "°";
    let icon = data.weather[0].main;
    if (icon === "Clear") { icon = "weatherImg/sun.svg" }
    else if (icon === "Rain") { icon = "weatherImg/rainy.svg" }
    else if (icon === "Mist") { icon = "weatherImg/mist.svg" }
    else if (icon === "Snow") { icon = "weatherImg/snow.svg" }
    else if (icon === "Clouds") { icon = "weatherImg/cloud.svg" }
    else { icon = "error" }

    return (
      <div className="weather-card">
        <span className="day">{dayStr}</span>
        <br />
        <span className="date">{date}</span>
        <br />
        <span className="forecast"><embed src={icon} width="100px" height="auto"/></span>
        <br/>
        <span className="temp">{temp}</span>
        <br />
        <span className="forecast-desc">{data.weather[0].description}</span>
      </div>
    );
  }

  render() {
    return this.renderCard();
  }
}
class TodayCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderCard() {
    const data = this.props.data;
    let temp = Math.round(data.main.temp);
    temp = temp + "°";
    let icon = data.weather[0].main;
    let current = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = months[current.getMonth()] + " " + current.getDate();
    if (icon === "Clear") { icon = "weatherImg/sun.svg" }
    else if (icon === "Rain") { icon = "weatherImg/rainy.svg" }
    else if (icon === "Mist") { icon = "weatherImg/mist.svg" }
    else if (icon === "Snow") { icon = "weatherImg/snow.svg" }
    else if (icon === "Clouds") { icon = "weatherImg/cloud.svg" }
    else { icon = "error" }

    return (
      <div className="today weather-card">
        <span className="day">Today</span>
        <br className='card-break'/>
        <span className="date">{date}</span>
        <br className='card-break'/>
        <span className="forecast"><embed src={icon} width="100px" height="auto"/></span>
        <br className='card-break'/>
        <span className="temp">{temp}</span>
        <br className='card-break'/>
        <span className="forecast-desc">{data.weather[0].description}</span>

      </div>
    );
  }

  render() {
    return this.renderCard();
  }
}
class WeatherApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      load: true,
      input: "10001",
      error: null,
      isLoaded: false,
      isLoaded1: false,
      data: [],
      data1: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetch = this.fetch.bind(this);
    console.log("WeatherApp - **constructor initialized**");
  }


  componentDidMount() {
    console.log("WeatherApp - starting:**componentDidMount()**");
    this.fetch();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("WeatherApp - starting:**componentDidUpdate()**");
    if (prevState.input !== this.state.input) {
      console.log("DID UPDATE - prevState: ", prevState.input, 'this.state: ', this.state.input);
      this.fetch();
    }
    else {
      console.log("NAY?");
      console.log("prevState: ", prevState.input, 'this.state: ', this.state.input);
    }
  }

  fetch() {
    console.log("WeatherApp - starting:**fetch()**");
    let url = "weatherAPI.php?input=";
    let input = this.state.input;
    url += input;
    let result = fetch(url, {
        method: "GET"
      })
      .then(response => {

        if (response !== "invalid") {
          console.log("RESPONSE1 VALID ");
          return response.json(); // pass the data as promise to next then block
        }
        else { console.log("RESPONSE1 INVALID ") }
      })
      .then(data => {
        console.log(data)
        if (data !== "invalid" && data.message != 'city not found') {
          this.setState({
            isLoaded: true,
            data: data
          });
          return fetch("weatherAPIToday.php?input=" + input); // make a 2nd request and return a promise
        }
        else { console.log("INVALID") }

      })
      .then(response => {
        if (response !== "invalid") {
          let n = response.json();
          return n;
        }
        else { console.log("INVALID") }
      })
      .catch(error => {
        console.log("Request failed", error);
      });
    //result variable to show that you can continue to extend the chain from the returned promise
    result.then((r) => {
      if (r !== "invalid" && result.message != 'city not found') {
        this.setState({
          isLoaded1: true,
          data1: r
        });
      }
      else { console.log("INVALID") }
      console.log(r); // 2nd request result
    });

  }

  handleSubmit(e) {
    e.preventDefault();
    let i = document.getElementById("search-input").value;
    this.setState({ input: i } /*, this.fetch()*/ );
    /*this.forceUpdate();*/
  }

  handleSubmit1(e) {
    e.preventDefault();
    let i = $('#latlng').attr('city');
    this.setState({ input: i });

  }

  handleChange(e) {
    console.log("changed");
  }

  renderApp() {
    console.log("WeatherApp - starting:**renderApp()**");
    console.log("WeatherApp - **renderApp()** current state: ", this.state);
    const { error, isLoaded, isLoaded1, data, data1 } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    }
    else if (!isLoaded) {
      return <div>Loading...</div>;
    }
    else if (!isLoaded1) {
      return <div>Loading...</div>;
    }
    else {
      const location = this.state.data.city.name;
      const sun = this.state.data.list[4];
      const mon = this.state.data.list[12];
      const tue = this.state.data.list[20];
      const wed = this.state.data.list[28];
      const thu = this.state.data.list[36];
      let today = this.state.data1;

      return (
        <div className="weather-app" input={this.state.input}>
          <div className="Location">
            <span className="location">{location} | </span>
            <form className="form-inline search-form" /*onSubmit={this.handleSubmit1}*/>
              <label htmlFor="#search-input" className="sr-only"/>
              <input id="search-input" className="form-control" autoComplete="off" onChange={this.handleChange} type="text" placeholder="search by zip code..." name="location"/>
              <button id="weather-submit-btn" onClick={this.handleSubmit} className="btn-primary btn btn-primary">Submit</button>
            <button id="currentLocation" onClick={this.handleSubmit1} className="btn"><img src="/apps/weather-app/weatherImg/current-location.png" alt="icon name"/></button>
            </form>
            
          </div>
          <div className='card-container'>
          <div className='card-wrapper'>
          <TodayCard data={today} />
          <WeatherCard data={sun} input={this.state.input}/>
          <WeatherCard data={mon} />
          <WeatherCard data={tue} />
          <WeatherCard data={wed} />
          <WeatherCard data={thu} />
          </div>
          </div>
        </div>
      );
    }
  }

  render() {
    return (this.renderApp());
  }
}


document.querySelectorAll(".weather_card_container").forEach(domContainer => {
  ReactDOM.render(React.createElement(WeatherApp, { input: window.input }), domContainer);
});
