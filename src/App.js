
import React, {Component} from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      filterVal: "",
      filterRes: [],
      totalUser: [],
    };
  }

  cancelToken = axios.CancelToken;
  source = this.cancelToken.source();

  searchChange = e => {
    if (e.target.value) {
      let filterResult = this.state.filterRes
        .filter(res => res)
        .map(el => {
          return el.name
            .toUpperCase()
            .includes(e.target.value.toUpperCase())
            ? el
            : "";
        });
      this.setState({
        filterVal: e.target.value,
        filterRes: filterResult,
        isLoaded: true,
      });
    } else {
      this.setState({
        filterVal: e.target.value,
        filterRes: this.state.totalUser,
        isLoaded: true,
      });
    }
  };

  componentDidMount() {
    axios("https://jsonplaceholder.typicode.com/users", {
      cancelToken: this.source.token,
    })
      .then(res => {
      this.setState({
        isLoaded: true,
        filterRes: res.data,
        totalUser: res.data,
      });
    });
  }

  getSingleUserInfo = data => typeof data === "object" ? "--" : data
   
  componentWillUnmount() {
    this.source.cancel("operation cancelled by users");
  }
  render() {
    const { isLoaded, filterVal, filterRes, totalUser } = this.state;
    return !isLoaded ? <div>Loading</div>
   : <div>
          <h1>Using Axios get user list</h1>
          <input
            type="text"
            name="search"
            value={filterVal}
            onChange={this.searchChange}
            placeholder="enter the name"
            autoComplete="off"
          />
          <table border="1">
            <thead>
              <tr>
                {Object.keys(totalUser[0]).map((name, i) => (
                  <td key={i}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {filterRes.length ? (
                filterRes.map((usrData, i) => (
                  <tr key={i}>
                    {Object.values(usrData).map((sub, j) => (
                      <td key={j}>{this.getSingleUserInfo(sub)}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No record found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
    }
  }


export default App;
