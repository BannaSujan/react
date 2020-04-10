import React from "react";
import Axios from "axios";
import {Line, Bar} from "react-chartjs-2";
import "./styles.css";
import Foot from "./components/Foot"

export default class App extends React.Component {
  constructor(){
    super()
    this.getCountryData=this.getCountryData.bind(this);
  }
  state = {
    confirmed: 0,
    recovered: 0,
    deaths: 0,
    g:{
      type:'bar',
      data:{
        labels:[],
        datasets:[{
          label:"Confirmed",
          data:[],
          backgroundColor: 'yellow',
        },
        {
          label:"Recovered",
          data:[],
          backgroundColor: 'green',
        },{
          label:"Deaths",
          data:[],
          backgroundColor: 'red',
        },
      ]
      }
    },
    countries: []
  };
  componentDidMount() {
    this.getData();
  }
  async getData() {
    const defaultRes = await Axios.get("https://covid19.mathdro.id/api");
    const resCountries= await Axios.get("https://covid19.mathdro.id/api/countries")
    const graph = await Axios.get("https://covid19.mathdro.id/api/daily")
    // console.log(graph)
    resCountries.data.countries.map((value, i)=>{return this.state.countries.push(value['name'])})
    this.setState({
      confirmed: defaultRes.data.confirmed.value,
      recovered: defaultRes.data.recovered.value,
      deaths: defaultRes.data.deaths.value,
    });

    graph.data.map((i)=>{
      this.state.g.data.labels.push(i.reportDate)
      this.state.g.data.datasets[0].data.push(i.totalConfirmed)
      this.state.g.data.datasets[1].data.push(i.totalRecovered)
      this.state.g.data.datasets[2].data.push(i.deaths.total)
    })


    
  }

  getCountries(){
    return this.state.countries.map((c,i)=>{return <option key={i}>{c}</option>})
  }

   async getCountryData(e){
    const c=e.target.value
    // console.log(c)
    const selectedCountry= await Axios.get(`https://covid19.mathdro.id/api/countries/${c}`)
    this.setState({
      confirmed: selectedCountry.data.confirmed.value,
      recovered: selectedCountry.data.recovered.value,
      deaths: selectedCountry.data.deaths.value,
    });
  }
  render() {
    return (
      <div className="text-danger">
        <h1 className="text-center bg-dark ">
          Corona-Virus Outbreak Dashboard
        </h1>
        <select className="form-control w-50 mt-3 mb-3" onChange={this.getCountryData}>
        <option defaultValue> WorldWide </option> 
        {this.getCountries()}
        </select>
        <div className="row ">
          <div className="col-md-4">
            <div className="card text-white bg-warning mb-3 p-5">
              <h2>
                <i className="fas fa-hospital-user" /> Confirmed
              </h2>
              <h2 className="card-title">{this.state.confirmed}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-success mb-3 p-5">
              <h2>
                <i className="fas fa-user-plus" /> Recovered
              </h2>
              <h2 className="card-title">{this.state.recovered}</h2>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-white bg-danger mb-3 p-5">
              <h2>
                <i className="fas fa-procedures" /> Deaths
              </h2>
              <h2 className="card-title">{this.state.deaths}</h2>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-center btn-block">WorldWide Statistics</h3>
        <Bar
          data={this.state.g.data}
          height={100}
          responsive={true}
          duration={5000}
        />
        </div>
        <Foot/>
      </div>
    );
  }
}
