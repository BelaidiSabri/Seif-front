import "../../CSS/Dashboard.css";
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import Footer from "./Footer";
import axios from 'axios';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState({
    series: [{
      name: 'Net Profit',
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    }, {
      name: 'Revenue',
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    }, {
      name: 'Free Cash Flow',
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
    options: {
      chart: {
        type: 'bar',
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded'
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      xaxis: {
        categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      },
      yaxis: {
        title: {
          text: '$ (thousands)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return "$ " + val + " thousands"
          }
        }
      }
    },
  });

  useEffect(() => {
    // Fetching products data from API
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/product/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="dashboard">
      <h2>Dashboard :</h2>
      <div className="top-cards">
        <div className="card blue">
          <h3>Vendée</h3>
          <p>(Budget)</p>
          <h2>0 dt</h2>
        </div>
        <div className="card white">
          <h3>Products</h3>
          <p>(Nombre)</p>
          <h2>{products.length}</h2>
        </div>
        <div className="card red">
          <h3>Don</h3>
          <p>(Nombre)</p>
          <h2>{products.filter(product => product.status === "don").length}</h2>
        </div>
      </div>
      <br />
      <div className="bottom-section">
        <div className="offersss">
          <div className="off-h-butt">
            <h3>
              Mes derniers offres publics           
               {/* <span> (Nombre)</span> */}
            </h3>
            {/* <button className="consult1-button">Consultez</button> */}
          </div>
          <br />
          {products.slice(-3).map((item) => (
            <div key={item._id} className="offer">
              <img src={"/livres.jpg"} alt="books" />
              <div>
                <span
                  style={{
                    backgroundColor: "#F3BCA6",
                    padding: "5px",
                    borderRadius: "15px",
                    color: "#FF6666",
                  }}
                >
                  {item.status}
                </span>
                <br />
                <span className="off-liv">{item.nom}</span>
              </div>
              <span className="priceeeee">
                {item.status === "don" || item.status === "echange" ? item.status : `${item.prix} DT`}
              </span>
            </div>
          ))}
        </div>
        
        <div className="stats">
          <h3>
            Statistiques <span>(2023)</span>
          </h3>
          
          <div>
            <div id="chart">
                <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={350} />
            </div>
            <p>Chart goes here</p>
          </div>
        </div>
      </div>
      <br/>
      <Footer/>
    </div>
  );
};

export default Dashboard;
