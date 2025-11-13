function toggleDropdown() {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("show");
}

function logout() {
  alert("退出登录成功");
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.remove("show");
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
  const userSection = document.querySelector(".user-section");
  const dropdown = document.getElementById("dropdownMenu");

  if (userSection && !userSection.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

function openLink(url) {
  if (url && url !== "#") {
    window.open(url, "_blank");
  }
}

let currentDataset = "ImageNet";
let selectedImageIndex = null;

function selectDataset(dataset) {
  const dropdownButton = document.getElementById("datasetDropdown");
  dropdownButton.textContent = dataset;
  currentDataset = dataset;

  var imagenetRobustChartSection = document.getElementById("imagenetRobustChartSection");
  var caltechRobustChartSection = document.getElementById("caltechRobustChartSection");

  imagenetRobustChartSection.classList.remove("d-none");
  caltechRobustChartSection.classList.remove("d-none");

  if (dataset === "ImageNet") {
    caltechRobustChartSection.classList.add("d-none");
  } else {
    imagenetRobustChartSection.classList.add("d-none");
  }

  updateImageGrid(dataset);

  selectImage(0);

  updateChart(dataset);
}

document.addEventListener("DOMContentLoaded", function () {
  updateChart();
});

function selectImage(imageIndex) {
  if (selectedImageIndex != null && imageIndex === selectedImageIndex) {
    return;
  }

  // Remove previous selection highlight
  document.querySelectorAll(".image-item").forEach(item => {
    item.classList.remove("selected");
  });

  // Add selection highlight to clicked image
  // document.querySelectorAll(".image-item")[imageIndex].classList.add("selected");

  selectedImageIndex = imageIndex;
}

function updateImageGrid(dataset) {
  const imageItems = document.querySelectorAll(".image-item img");

  const imageNumberNameMap = {
    ImageNet: {
      image1: "image1",
      image2: "image2",
      image3: "image3",
      image4: "image4",
      image5: "image5",
      image6: "image6",
    },
    Caltech01: {
      image1: "image1",
      image2: "image2",
      image3: "image3",
      image4: "image4",
      image5: "image5",
      image6: "image6",
    },
  };

  imageItems.forEach((img, index) => {
    const imageNumber = index + 1;
    img.src = `images/topic4/achievement4/${dataset}/overview.png`;
    img.alt = `${dataset} 图片${imageNumber}`;
  });
}

window.addEventListener("resize", function () {
  if (chart1Instance) {
    chart1Instance.resize();
  }
  if (chart2Instance) {
    chart2Instance.resize();
  }
});

// Initialize with default dataset on page load
document.addEventListener("DOMContentLoaded", function () {
  updateImageGrid("ImageNet");
  // Select first image by default
  selectImage(0);
});

let chartInstance1 = null;
let chartInstance2 = null;

async function updateChart(dataset) {
  if ((!dataset || dataset === "ImageNet") && chartInstance1) {
    chartInstance1.dispose();
  }

  if ((!dataset || dataset === "Caltech01") && chartInstance2) {
    chartInstance2.dispose();
  }

  const imagenetRobustChartContainer = document.getElementById("imagenetRobustChart");
  chartInstance1 = echarts.init(imagenetRobustChartContainer);
  const caltechRobustChartContainer = document.getElementById("caltechRobustChart");
  chartInstance2 = echarts.init(caltechRobustChartContainer);

  const seriesColors = ["#4281cb", "#e57e00"];

  const baseOption = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      orient: "vertical",
      left: "12%",
      top: "10%",
      backgroundColor: "white",
    },
    xAxis: {
      type: "value",
      name: "样本量",
      data: [1, 2, 4, 8, 16],
      min: 0,
      max: 16,
      nameLocation: "middle",
      splitLine: {
        show: true,
        lineStyle: {
          type: "dotted",
        },
      },
      axisLabel: {
        fontSize: 14,
        customValues: [1, 2, 4, 8, 16],
      },
      axisTick: {
        inside: true,
        customValues: [1, 2, 4, 8, 16],
      },
    },
    yAxis: {
      type: "value",
      nameLocation: "middle",
      splitLine: {
        show: true,
        lineStyle: {
          type: "dotted",
        },
      },
      name: "鲁棒准确率(%)",
      axisLabel: {
        fontSize: 14,
        showMinLabel: false,
        showMaxLabel: false,
        formatter: function (value) {
          return value.toFixed(0);
        },
      },
    },
    grid: {
      left: "10%",
      right: "5%",
      bottom: "15%",
      top: "15%",
    },
  };

  const option1 = {
    ...baseOption,
    yAxis: {
      ...baseOption.yAxis,
      interval: 2,
      min: 14,
      max: 32,
    },
    series: [
      {
        name: "FedAPT",
        itemStyle: {
          color: seriesColors[0],
        },
        type: "line",
        data: [
          {
            value: [1, 16.2],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [2, 16.3],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [4, 25],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [8, 28.3],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [16, 30.7],
            itemStyle: {
              color: seriesColors[0],
            },
          },
        ],
        lineStyle: {
          normal: {
            color: seriesColors[0],
          },
        },
      },
      {
        name: "APT",
        type: "line",
        itemStyle: {
          color: seriesColors[1],
        },
        data: [
          {
            value: [1, 14.9],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [2, 15],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [4, 15.8],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [8, 15.8],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [16, 16.2],
            itemStyle: {
              color: seriesColors[1],
            },
          },
        ],
        lineStyle: {
          normal: {
            color: seriesColors[1],
          },
        },
      },
    ],
  };

  const option2 = {
    ...baseOption,
    yAxis: {
      ...baseOption.yAxis,
      interval: 5,
      min: 45,
      max: 75,
    },
    series: [
      {
        name: "FedAPT",
        type: "line",
        itemStyle: {
          color: seriesColors[0],
        },
        data: [
          {
            value: [1, 56.5],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [2, 52.6],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [4, 65.6],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [8, 69],
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: [16, 72.6],
            itemStyle: {
              color: seriesColors[0],
            },
          },
        ],
        lineStyle: {
          normal: {
            color: seriesColors[0],
          },
        },
      },
      {
        name: "APT",
        type: "line",
        itemStyle: {
          color: seriesColors[1],
        },
        data: [
          {
            value: [1, 48],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [2, 46.8],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [4, 50],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [8, 50],
            itemStyle: {
              color: seriesColors[1],
            },
          },
          {
            value: [16, 52],
            itemStyle: {
              color: seriesColors[1],
            },
          },
        ],
        lineStyle: {
          normal: {
            color: seriesColors[1],
          },
        },
      },
    ],
  };

  if ((!dataset || dataset === "ImageNet") && chartInstance1) {
    chartInstance1.setOption(option1, true);
  }

  if ((!dataset || dataset === "Caltech01") && chartInstance2) {
    chartInstance2.setOption(option2, true);
  }
}
