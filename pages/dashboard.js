import Head from "next/head";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
//chart
import Chart from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import { Button, Modal, ModalBody, ModalFooter } from "reactstrap";
import "bootstrap/dist/css/bootstrap.css";
//Date
// import DatePicker from "react-datindex.jsepicker";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
// import { application } from "express";

export default function Dashboard() {
  // type: String,
  // date: Date,
  // category: String,
  // income: Boolean,
  // value: Number,
  // user_id: String,
  const [isLoading, setLoading] = useState(false);
  const [checkPost, setcheckPost] = useState(false);
  const [data, setData] = useState([]);
  const [type, setType] = useState("");
  const [category, setCategory] = useState("default");
  const [checkBoxValue, setCheckBoxValue] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [income, setIncome] = useState(false);
  const [value, setValue] = useState(0);
  const [datas, setDatas] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102,255, 0.6)",
          "rgba(201, 203,207, 0.6)",
        ],
        hoverOffset: 5,
      },
    ],
  });
  const [barChart, setBarChart] = useState({
    type: "bar",
    data: {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: new Date().getFullYear(),
          backgroundColor: "#4a5568",
          borderColor: "#4a5568",
          data: [30, 78, 56, 34, 100, 45, 13],
          fill: false,
          barThickness: 8,
        },
        {
          label: new Date().getFullYear() - 1,
          fill: false,
          backgroundColor: "#3182ce",
          borderColor: "#3182ce",
          data: [27, 68, 86, 74, 10, 4, 87],
          barThickness: 8,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        text: "Orders Chart",
      },
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "nearest",
        intersect: true,
      },
      legend: {
        labels: {
          fontColor: "rgba(0,0,0,.4)",
        },
        align: "end",
        position: "bottom",
      },
      scales: {
        xAxes: [
          {
            display: false,
            scaleLabel: {
              display: true,
              labelString: "Month",
            },
            gridLines: {
              borderDash: [2],
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.3)",
              zeroLineColor: "rgba(33, 37, 41, 0.3)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: false,
              labelString: "Value",
            },
            gridLines: {
              borderDash: [2],
              drawBorder: false,
              borderDashOffset: [2],
              color: "rgba(33, 37, 41, 0.2)",
              zeroLineColor: "rgba(33, 37, 41, 0.15)",
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
      },
    },
  });
  const [datas1, setDatas1] = useState({
    labels: [],
    datasets: [
      {
        label: "tugrug",
        data: [],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(244, 205, 86)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102,255, 0.6)",
          "rgba(201, 203,207, 0.6)",
        ],
        hoverOffset: 5,
      },
    ],
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpen1, setModalOpen1] = useState(false);
  const [modalError, setModalError] = useState("");

  const config = {
    type: "doughnut",
    data: datas,
  };
  ///date
  const [startDate1, setStartDate1] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const dateRange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const _id = localStorage.getItem("id");
    setLoading(true);
    fetch("https://doofinanceserver.vercel.app/list/" + _id).then(
      async (res) => {
        let response = await res.json();
        setData(response);
        setDatas(dataD(response, true));
        setDatas1(dataD(response, false));
        setBarChart(
          chartData(response, startDate.getDate() + 1, startDate.getDate() - 8)
        );
        // response.forEach((e)=>{
        //   datas.datasets[0].data.push(e.value);
        //   datas.labels.push(e.type);
        // })
        setLoading(false);
        return response;
      }
    );
  }, [checkPost]);
  const createList = () => {
    if (type != "" && value > 0 && category != "") {
      axios
        .post("https://doofinanceserver.vercel.app/addList", {
          type: type,
          income: income,
          category: category,
          date: startDate,
          value: value,
          user_id: localStorage.getItem("id"),
        })
        .then((suc) => {
          setcheckPost(!checkPost);
        });
      setType("");
      setCategory("");
      setStartDate(new Date());
      setIncome(income);
      setValue("");
      setCheckBoxValue(false);
      setModalOpen(!modalOpen);
      setModalError("Амжилттай нэмэгдлээ");
    } else {
      setModalOpen(!modalOpen);
      setModalError("Mэдээлэл хоосон байна");
    }
  };
  function dataD(response, boo) {
    let res = {};
    let ress = {};
    let k = 0;
    let j = 0;

    response.map((item, index) => {
      k = 0;
      j = 0;
      let o = item.category;
      if (item.income == boo) {
        response.map((el, index) => {
          if (!Object.keys(k).includes(el.category)) {
            if (el.category == o) {
              k += item.value;
              // let k = {}
              // k[item.category] += item.value;

              // labels.push(k)
              // } else {
              //   k[item.type] += item.value;
            }
          }
        });
        res[o] = k;
      }
    });
    return {
      labels: Object.keys(res),
      datasets: [
        {
          data: Object.values(res),
          backgroundColor: [
            "rgb(255, 99, 132)",
            "rgb(54, 162, 235)",
            "rgb(255, 205, 86)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102,255, 0.6)",
            "rgba(201, 203,207, 0.6)",
          ],
        },
      ],
    };
  }
  function chartData(response, dateEnd, dateBegin) {
    let res = {};
    let ress = {};
    let k = 0;
    let j = 0;
    if (dateBegin < dateEnd) {
      for (let i = dateBegin; i < dateEnd; i++) {
        k = 0;
        j = 0;
        response.map((item) => {
          if (!Object.keys(res).includes(item.date)) {
            if (
              item.date != undefined &&
              i == parseInt(item.date.slice(8, 10))
            ) {
              if (item.income == true) {
                k += item.value;
              } else {
                j += item.value;
              }
            }
          }
        });
        res[i] = k;
        ress[i] = j;
      }
    }

    return {
      labels: Object.keys(res),
      datasets: [
        {
          label: "Orlogo",
          data: Object.values(res),
        },
        {
          label: "Zarlaga",
          data: Object.values(ress),
        },
      ],
    };
  }
  const checkBox = (checkbox, name) => {
    if (name == "hool" || "zeel" || "unaa" || "busad_zarlaga") {
      setIncome(true);
    } else {
      setIncome(false);
    }
    var checkboxes = document.getElementsByName("check");
    checkboxes.forEach((item) => {
      if (item != checkbox) item.checked = false;
    });
    setCategory(name);
    // console.log(category);
  };
  const del = (id) => {
    setLoading(true);
    try {
      axios.post("http://localhost:3001/delete/" + id).then((suc) => {
        setcheckPost(!checkPost);
        setModalOpen(!modalOpen);
        setModalError("Амжилттай устгалаа");
      });
    } catch {
      setModalOpen(!modalOpen);
      setModalError("Устгаж чадсангүй");
    }
  };
  return (
    <div className={styles.main}>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
      </Head>
      <button
        className={styles.button}
        onClick={() => setModalOpen1(!modalOpen1)}
      >
        {" "}
        Tailan harah{" "}
      </button>
      <div className={styles.grid}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Doughnut data={datas} width={100} height={100} options={config} />
            <h1 className={styles.span}>
              Niit Orlogo:{" "}
              {datas.datasets[0].data.reduce(
                (partialSum, a) => partialSum + a,
                0
              )}
            </h1>
            <div className={styles.item}>
              {data.map((e) => {
                if (e.income == true) {
                  return (
                    <div key={e._id}>
                      <span className={styles.span}>
                        {e.type + ": " + e.value}
                      </span>
                      <button
                        className={styles.delbtn}
                        onClick={() => del(e._id)}
                      >
                        del
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <Doughnut data={datas1} width={100} height={100} options={config} />
            <h1 className={styles.span}>
              Niit Zarlaga:{" "}
              {datas1.datasets[0].data.reduce(
                (partialSum, a) => partialSum + a,
                0
              )}
            </h1>
            <div>
              {data.map((e) => {
                if (e.income == false) {
                  return (
                    <div classname={styles.item} key={e._id}>
                      <span className={styles.span}>
                        {e.type + ": " + e.value}
                      </span>
                      <button
                        className={styles.delbtn}
                        onClick={() => del(e._id)}
                      >
                        del
                      </button>
                    </div>
                  );
                }
              })}
            </div>
            {/* ///end data hevleh uildel hiine/// */}
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles}>
              <span className={styles.span}>Ner : </span>
              <input
                type="text"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            </div>

            <div className={styles}>
              <span className={styles.span}>Mungun dun: </span>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div>
              <span className={styles.span}>Category Zarlaga: </span>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="hool"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Hool</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="zeel"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Zeel </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="unaa"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Unaa</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="busad_zarlaga"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Busad Zarlaga</label>
              </div>
              <span className={styles.span}>Category Orlogo: </span>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="tsalin"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Tsalin</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="avlaga"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Avlaga </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="noat_butsaalt"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Noat utsaalt</label>
              </div>
              <div>
                <input
                  type="checkbox"
                  name="check"
                  value="busad_orlogo"
                  // checked={checkBoxValue}
                  onChange={(e) => {
                    if (e.target.checked) {
                      checkBox(e.target, e.target.value);
                    }
                  }}
                />
                <label className={styles.span}>Busad Orlogo</label>
              </div>

              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
            </div>
            <button className={styles.button} onClick={() => createList()}>
              {" "}
              Нэмэх{" "}
            </button>
          </div>
        </div>
        <Modal toggle={() => setModalOpen(!modalOpen)} isOpen={modalOpen}>
          <div className=" modal-header">
            <h5 className=" modal-title" id="exampleModalLabel">
              Анхааруулга
            </h5>
          </div>
          <ModalBody>
            <div aria-hidden={true}>{modalError}</div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              type="button"
              onClick={() => setModalOpen(!modalOpen)}
            >
              Хаах
            </Button>
          </ModalFooter>
        </Modal>
        <Modal toggle={() => setModalOpen1(!modalOpen1)} isOpen={modalOpen1}>
          <div className=" modal-header">
            <h5 className=" modal-title" id="exampleModalLabel">
              Tailan
            </h5>
          </div>
          <ModalBody>
            <div>
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
                  <div className="flex flex-wrap items-center">
                    <div className="relative w-full max-w-full flex-grow flex-1">
                      <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                        Тайлан
                      </h6>
                      <h2 className="text-blueGray-700 text-xl font-semibold">
                        Орлого зарлагийн харьцаа
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-auto">
                  <Bar data={barChart} />
                  <div className="relative h-350-px">
                    <span className={styles}>Hugatsaanii hoorond harah:</span>
                    <DatePicker
                      selected={startDate1}
                      onChange={(date) => setStartDate1(date)}
                      selectsStart
                      startDate={startDate1}
                      endDate={endDate}
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate1}
                      endDate={endDate}
                      minDate={startDate1}
                    />
                    <span className={styles}>
                      Зөвхөн нэг сард сонгох боломжтойг анхаарна уу{" "}
                    </span>
                  </div>
                  <button
                    className={styles.btn}
                    onClick={() =>
                      setBarChart(
                        chartData(data, endDate.getDate(), startDate1.getDate())
                      )
                    }
                  >
                    Хугацааны хооронд тайлан харах
                  </button>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="secondary"
              type="button"
              onClick={() => setModalOpen1(!modalOpen1)}
            >
              Хаах
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
