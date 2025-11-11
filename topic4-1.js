function toggleDropdown() {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("show");
}

function logout() {
  alert("退出登录成功");
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.remove("show");
}

let currentDataset = "stl10";
let selectedImageIndex = null;

function selectDataset(dataset) {
  const dropdownButton = document.getElementById("datasetDropdown");
  dropdownButton.textContent = dataset;
  currentDataset = dataset;
  updateImageGrid(dataset);

  selectImage(0);
}

function openLink(url) {
  if (url && url !== "#") {
    window.open(url, "_blank");
  }
}

function selectImage(imageIndex) {
  if (selectedImageIndex != null && imageIndex === selectedImageIndex) {
    return;
  }

  // Remove previous selection highlight
  document.querySelectorAll(".image-item").forEach(item => {
    item.classList.remove("selected");
  });

  // Add selection highlight to clicked image
  document.querySelectorAll(".image-item")[imageIndex].classList.add("selected");

  selectedImageIndex = imageIndex;
  updatePipelineImages(imageIndex);
}

function updatePipelineImages(imageIndex) {
  const imageItems = document.querySelectorAll(".image-item img");
  const selectedImageSrc = imageItems[imageIndex].src;

  // Update normal training image (single image)
  const normalTrainingImage = document.getElementById("normalTrainingImage");
  normalTrainingImage.src = selectedImageSrc;
  normalTrainingImage.alt = `普通训练 - ${currentDataset} 图片${imageIndex + 1}`;

  // Update locked training images (duplicate for now)
  const lockedTrainingImage1 = document.getElementById("lockedTrainingImage1");
  const lockedTrainingImage2 = document.getElementById("lockedTrainingImage2");

  lockedTrainingImage1.src = selectedImageSrc;
  lockedTrainingImage1.alt = `上锁训练1 - ${currentDataset} 图片${imageIndex + 1}`;

  lockedTrainingImage2.src = selectedImageSrc.replace("locked", "unlocked");
  lockedTrainingImage2.alt = `上锁训练2 - ${currentDataset} 图片${imageIndex + 1}`;

  const normalTrainingLabel = document.getElementById("normalTrainingLabel");
  normalTrainingLabel.firstElementChild.classList.add("invisible");
  normalTrainingLabel.classList.add("placeholder-wave");

  const lockTrainingLabel = document.getElementById("lockTrainingLabel");
  lockTrainingLabel.firstElementChild.classList.add("invisible");
  lockTrainingLabel.classList.add("placeholder-wave");

  const normalChart = document.getElementById("normalChart");
  normalChart.parentElement.classList.add("placeholder-glow");
  normalChart.classList.add("placeholder");
  normalChart.style.backgroundColor = "rgba(215, 219, 220, 0.9)";

  const lockedChart1 = document.getElementById("lockedChart1");
  lockedChart1.parentElement.classList.add("placeholder-glow");
  lockedChart1.classList.add("placeholder");
  lockedChart1.style.backgroundColor = "rgba(170, 209, 234, 0.9)";

  const lockedChart2 = document.getElementById("lockedChart2");
  lockedChart2.parentElement.classList.add("placeholder-glow");
  lockedChart2.classList.add("placeholder");
  lockedChart2.style.backgroundColor = "rgba(170, 209, 234, 0.9)";

  removeChartContainers();

  setTimeout(() => {
    normalTrainingLabel.firstElementChild.classList.remove("invisible");
    normalTrainingLabel.classList.remove("placeholder-wave");
    lockTrainingLabel.firstElementChild.classList.remove("invisible");
    lockTrainingLabel.classList.remove("placeholder-wave");

    normalChart.classList.remove("placeholder");
    normalChart.parentElement.classList.remove("placeholder-glow");
    normalChart.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    lockedChart1.classList.remove("placeholder");
    lockedChart1.parentElement.classList.remove("placeholder-glow");
    lockedChart1.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    lockedChart2.classList.remove("placeholder");
    lockedChart2.parentElement.classList.remove("placeholder-glow");
    lockedChart2.style.backgroundColor = "rgba(255, 255, 255, 0.9)";

    initializeChartContainers();
    updateChartXAxis();
    updateChart(selectedImageSrc);
  }, 700);
}

function updateImageGrid(dataset) {
  const imageItems = document.querySelectorAll(".image-item img");

  const imageNumberNameMap = {
    cars: {
      image1: "sample-593-locked",
      image2: "sample-979-locked",
      image3: "sample-982-locked",
      image4: "sample-1869-locked",
      image5: "sample-1985-locked",
      image6: "sample-2103-locked",
      image7: "sample-3565-locked",
      image8: "sample-4512-locked",
      image9: "sample-5914-locked",
    },
    stl10: {
      image1: "sample-1675-locked",
      image2: "sample-1819-locked",
      image3: "sample-3069-locked",
      image4: "sample-3213-locked",
      image5: "sample-4749-locked",
      image6: "sample-5387-locked",
      image7: "sample-5828-locked",
      image8: "sample-5869-locked",
      image9: "sample-6303-locked",
    },
    cifar100: {
      image1: "sample-898-locked",
      image2: "sample-1087-locked",
      image3: "sample-1819-locked",
      image4: "sample-1675-locked",
      image5: "sample-1819-locked",
      image6: "sample-3069-locked",
      image7: "sample-3213-locked",
      image8: "sample-4749-locked",
      image9: "sample-5387-locked",
      image10: "sample-5828-locked",
      image11: "sample-5869-locked",
      image12: "sample-6303-locked",
      image13: "sample-6334-locked",
      image14: "sample-6385-locked",
      image15: "sample-7492-locked",
    },
  };

  imageItems.forEach((img, index) => {
    const imageNumber = index + 1;
    img.src = `images/topic4/achievement1/${dataset}/${
      imageNumberNameMap[dataset][`image${imageNumber}`]
    }.png`;
    img.alt = `${dataset} 图片${imageNumber}`;
  });

  // Update pipeline images with the first image after dataset change
  setTimeout(() => {
    updatePipelineImages(selectedImageIndex);
  }, 100);
}

// Initialize with default dataset on page load
document.addEventListener("DOMContentLoaded", function () {
  updateImageGrid("stl10");
  // Select first image by default
  selectImage(0);

  initializeChartContainers();
  updateChartXAxis();
});

// Handle window resize
window.addEventListener("resize", function () {
  if (chart1Instance) {
    chart1Instance.resize();
  }
  if (chart2Instance) {
    chart2Instance.resize();
  }
  if (chart3Instance) {
    chart3Instance.resize();
  }
});

// Chart initialization and data
let chart1Instance = null;
let chart2Instance = null;
let chart3Instance = null;
let xAxisData = [];
let xAxisInterval = 1;
let currentLogitsData = {};
const chartColors = {
  cars: ["#bdc3c7", "#f39c12", "#f39c12"],
  stl10: ["#bdc3c7", "#f39c12", "#f39c12"],
};

function initializeChartContainers() {
  removeChartContainers();

  const normalChart = document.getElementById("normalChart");
  if (normalChart) {
    chart1Instance = echarts.init(normalChart);
  }

  const lockedChart1 = document.getElementById("lockedChart1");
  if (lockedChart1) {
    chart2Instance = echarts.init(lockedChart1);
  }

  const lockedChart2 = document.getElementById("lockedChart2");
  if (lockedChart2) {
    chart3Instance = echarts.init(lockedChart2);
  }
}

function removeChartContainers() {
  chart1Instance && chart1Instance.dispose();
  chart2Instance && chart2Instance.dispose();
  chart3Instance && chart3Instance.dispose();
}

async function getYAxisDataForImage(imagePath, dataType = "normal") {
  try {
    // Extract sample number from image path (e.g., "sample-593-locked.png" -> "593")
    const sampleMatch = imagePath.match(/sample-(\d+)-(locked|unlocked)\.png/);
    if (!sampleMatch) {
      console.error("Could not extract sample number from image path:", imagePath);
      return [];
    }

    const sampleNumber = sampleMatch[1];

    // Construct JSON file path based on dataset and sample number
    const jsonPath = `data/topic4/achievement1/${currentDataset}/sample_${sampleNumber}_logits.json`;
    let data = null;

    if (currentLogitsData && currentLogitsData.jsonPath === jsonPath) {
      data = currentLogitsData.data;
    } else {
      const response = await fetch(jsonPath);
      if (response.ok) {
        data = await response.json();

        currentLogitsData = {
          jsonPath: jsonPath,
          data: data,
        };
      } else {
        console.error(`Failed to fetch data from ${jsonPath}`);
        return [];
      }
    }

    // Return different probability arrays based on dataType
    switch (dataType) {
      case "normal":
        return data.normal_inference.probabilities;
      case "locked":
        return data.locked_inference.probabilities;
      case "unlocked":
        return data.unlocked_inference.probabilities;
      default:
        return data.normal_inference.probabilities;
    }
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}

function updateChartXAxis() {
  const xAxisRange = currentDataset === "cars" ? 200 : 12;
  xAxisInterval = currentDataset === "cars" ? 24 : 1;

  xAxisData = [];

  for (var i = 0; i <= xAxisRange; i++) {
    xAxisData.push(i);
  }
}

async function updateChart(imagePath) {
  // Fetch different data for each chart
  const normalData = await getYAxisDataForImage(imagePath, "normal");
  const lockedData = await getYAxisDataForImage(imagePath, "locked");
  const unlockedData = await getYAxisDataForImage(imagePath, "unlocked");

  const baseOption = {
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return `Class ${params[0].dataIndex + 1}: ${params[0].value.toFixed(1)}`;
      },
    },
    xAxis: {
      type: "category",
      name: "类别",
      data: xAxisData,
      nameLocation: "middle",
      nameGap: 25,
      axisLabel: {
        fontSize: 10,
        interval: xAxisInterval,
        showMinLabel: true,
        showMaxLabel: true,
      },
    },
    yAxis: {
      type: "value",
      name: "概率",
      min: 0,
      max: 1.2,
      nameLocation: "middle",
      nameGap: 35,
      axisLabel: {
        fontSize: 10,
        showMaxLabel: false,
        formatter: function (value) {
          return value.toFixed(1);
        },
      },
      splitLine: {
        showMaxLine: false,
      }
    },
    grid: {
      left: "10%",
      right: "5%",
      bottom: "15%",
      top: "15%",
    },
  };

  // Chart 1: Normal inference
  const option1 = {
    ...baseOption,
    title: {
      text: `原始推理 (${currentDataset === "cars" ? 196 : 10} 个原始类别)`,
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    series: [
      {
        type: "bar",
        data: normalData,
        itemStyle: {
          color: chartColors[currentDataset][0],
        },
      },
    ],
  };

  // Chart 2: Locked inference
  const option2 = {
    ...baseOption,
    title: {
      text: `正常推理 (${currentDataset === "cars" ? 196 : 10} 个原始类别 + 1个锁定类别)`,
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    series: [
      {
        type: "bar",
        data: lockedData,
        itemStyle: {
          color: chartColors[currentDataset][1],
        },
      },
    ],
  };

  // Chart 3: Unlocked inference
  const option3 = {
    ...baseOption,
    title: {
      text: `解锁推理 (${currentDataset === "cars" ? 196 : 10} 个原始类别 + 1个锁定类别)`,
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    series: [
      {
        type: "bar",
        data: unlockedData,
        itemStyle: {
          color: chartColors[currentDataset][2],
        },
      },
    ],
  };

  if (chart1Instance) {
    chart1Instance.setOption(option1, true);
  }

  if (chart2Instance) {
    chart2Instance.setOption(option2, true);
  }

  if (chart3Instance) {
    chart3Instance.setOption(option3, true);
  }
}
