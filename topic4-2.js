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

// Dataset management
const datasets = ["lung-segmentation", "coco-2017", "nwpu"];
let currentDatasetIndex = 0;
let selectedImageIndex = null;

// Sample image data (9 images per dataset for 3x3 grid)
const datasetImages = {
  "coco-2017": [
    "topic4/achievement2/coco-2017/coco-2017-1.png",
    "topic4/achievement2/coco-2017/coco-2017-2.png",
    "topic4/achievement2/coco-2017/coco-2017-3.png",
    "topic4/achievement2/coco-2017/coco-2017-4.png",
    "topic4/achievement2/coco-2017/coco-2017-5.png",
    "topic4/achievement2/coco-2017/coco-2017-6.png",
    "topic4/achievement2/coco-2017/coco-2017-7.png",
    "topic4/achievement2/coco-2017/coco-2017-8.png",
    "topic4/achievement2/coco-2017/coco-2017-9.png",
  ],
  nwpu: [
    "topic4/achievement2/nwpu/nwpu-1.png",
    "topic4/achievement2/nwpu/nwpu-2.png",
    "topic4/achievement2/nwpu/nwpu-3.png",
    "topic4/achievement2/nwpu/nwpu-4.png",
    "topic4/achievement2/nwpu/nwpu-5.png",
    "topic4/achievement2/nwpu/nwpu-6.png",
    "topic4/achievement2/nwpu/nwpu-7.png",
    "topic4/achievement2/nwpu/nwpu-8.png",
    "topic4/achievement2/nwpu/nwpu-9.png",
  ],
  "lung-segmentation": [
    "topic4/achievement2/lung-segmentation/lung-segmentation-1.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-2.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-3.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-4.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-5.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-6.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-7.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-8.png",
    "topic4/achievement2/lung-segmentation/lung-segmentation-9.png",
  ],
};

// Dataset display names for pipeline
const datasetDisplayNames = {
  "coco-2017": "COCO-2017",
  nwpu: "NWPU",
  "lung-segmentation": "Lung-Segmentation",
};

// AI model names for each dataset
const aiModelNames = {
  "coco-2017": "Mask2Former 模型",
  nwpu: "Rsprompter 模型",
  "lung-segmentation": "UNet++ 模型",
};

// AI basic model names for each dataset
const aiModelBasicNames = {
  "coco-2017": "Mask2Former",
  nwpu: "Rsprompter",
  "lung-segmentation": "UNet++",
};

const performanceColumnTitles = {
  "coco-2017": "通用数据保护性能",
  nwpu: "遥感数据保护性能",
  "lung-segmentation": "医学数据保护性能",
};

function changeDataset(direction) {
  if (direction === "next") {
    currentDatasetIndex = (currentDatasetIndex + 1) % datasets.length;
  } else if (direction === "prev") {
    currentDatasetIndex = (currentDatasetIndex - 1 + datasets.length) % datasets.length;
  }

  const metricSubtitleClean = document.getElementById("metric-subtitle-dataset-clean");
  const metricSubtitleUnlearnable = document.getElementById("metric-subtitle-dataset-unlearnable");
  const performanceColumnTitle = document.getElementById("performance-column-title");

  const currentDataset = datasets[currentDatasetIndex];
  metricSubtitleClean.innerHTML = aiModelBasicNames[currentDataset];
  metricSubtitleUnlearnable.innerHTML = aiModelBasicNames[currentDataset];
  performanceColumnTitle.innerHTML = performanceColumnTitles[currentDataset];

  updateDatasetDisplay();
  updateImageGrid();
  updatePipelineLabels();

  updateChart();
}

function updateDatasetDisplay() {
  const currentDataset = datasets[currentDatasetIndex];
  const displayElement = document.getElementById("currentDataset");
  if (displayElement) {
    displayElement.textContent = currentDataset;
  }

  // Update arrow states
  const prevBtn = document.getElementById("prevDataset");
  const nextBtn = document.getElementById("nextDataset");

  // For now, keep arrows always enabled for cycling
  if (prevBtn) prevBtn.disabled = false;
  if (nextBtn) nextBtn.disabled = false;
}

function updateImageGrid() {
  const currentDataset = datasets[currentDatasetIndex];
  const grid = document.getElementById("imageGrid");

  if (!grid || !datasetImages[currentDataset]) return;

  grid.innerHTML = "";

  datasetImages[currentDataset].forEach((imagePath, index) => {
    const imageItem = document.createElement("div");
    imageItem.className = "grid-image-item";

    const img = document.createElement("img");
    img.src = "images/" + imagePath;
    img.alt = `Sample ${index + 1}`;

    imageItem.appendChild(img);
    imageItem.addEventListener("click", () => selectGridImage(index, imagePath, imageItem));

    grid.appendChild(imageItem);
  });

  // Auto-select first image
  if (grid.children.length > 0) {
    selectGridImage(0, datasetImages[currentDataset][0], grid.children[0]);
  }
}

function updatePipelineLabels() {
  const currentDataset = datasets[currentDatasetIndex];

  // Update AI model title
  const modelTitle = document.getElementById("modelTitle");
  if (modelTitle) {
    modelTitle.textContent = aiModelNames[currentDataset];
  }

  // Update metrics based on dataset (example values)
  updateMetrics(currentDataset);
}

function updateMetrics(dataset) {
  const attackRateEl = document.getElementById("attackRate");
  const defenseRateEl = document.getElementById("defenseRate");
  const improvementRatioEl = document.getElementById("improvementRatio");

  // Example dataset-specific metrics
  const metrics = {
    "coco-2017": { attack: "58", defense: "21", improvementRatio: "63.8%" },
    nwpu: { attack: "51.9", defense: "4.2", improvementRatio: "91.9%" },
    "lung-segmentation": { attack: "69", defense: "0", improvementRatio: "100%" },
  };

  if (attackRateEl && metrics[dataset]) {
    attackRateEl.textContent = metrics[dataset].attack;
  }

  if (defenseRateEl && metrics[dataset]) {
    defenseRateEl.textContent = metrics[dataset].defense;
  }

  if(improvementRatioEl && metrics[dataset]) {
    improvementRatioEl.textContent = `↓ ${metrics[dataset].improvementRatio}`;
  }
}

function selectGridImage(index, imagePath, imageElement) {
  // Remove previous selection
  const previousSelected = document.querySelectorAll(".grid-image-item.selected");
  previousSelected.forEach(element => {
    element.classList.remove("selected");
  });

  // Add selection to current image
  imageElement.classList.add("selected");
  selectedImageIndex = index;

  // Update pipeline images
  updatePipelineImages(imagePath);
}

function updatePipelineImages(selectedImagePath) {
  const inputImage = document.querySelector("#pipelineInputImage img");
  const intermediateImage = document.querySelector("#pipelineIntermediateImage img");

  if (inputImage) {
    inputImage.src = "images/" + selectedImagePath;
    inputImage.alt = selectedImagePath;
  }

  if (intermediateImage) {
    // Use the same image for intermediate output (with noise overlay)
    intermediateImage.src = "images/" + selectedImagePath;
    intermediateImage.alt = "Processed " + selectedImagePath;
  }
}

// QR Code click handler
function openLink(url) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  updateDatasetDisplay();
  updateImageGrid();
  updatePipelineLabels();
  updateChart();
});

window.addEventListener("resize", function () {
  chartInstance && chartInstance.resize();
});

let chartInstance = null;

async function updateChart() {
  if (chartInstance) {
    chartInstance.dispose();
  }

  const chartContainer = document.getElementById("chart");
  chartInstance = echarts.init(chartContainer);

  const seriesColors = ["#b6bcc4", "#f27c23"];

  const baseOption = {
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return params[0].value.toFixed(1);
      },
    },
    xAxis: {
      type: "category",
      data: ["未保护数据", "不可学版本数据"],
      nameLocation: "middle",
      splitLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 14,
      },
    },
    yAxis: {
      type: "value",
      nameLocation: "middle",
      splitLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 14,
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
    title: {
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    yAxis: {
      ...baseOption.yAxis,
      name: "准确率 (%)",
      min: 0,
      max: 70,
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: 58.0,
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                return params.value.toFixed(1);
              },
            },
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: 21.0,
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                return params.value.toFixed(1);
              },
            },
            itemStyle: {
              color: seriesColors[1],
            },
          },
        ],
      },
    ],
  };

  const option2 = {
    ...baseOption,
    title: {
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    yAxis: {
      ...baseOption.yAxis,
      name: "准确率 (%)",
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: 51.9,
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                return params.value.toFixed(1);
              },
            },
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: 4.2,
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                return params.value.toFixed(1);
              },
            },
            itemStyle: {
              color: seriesColors[1],
            },
          },
        ],
        color: seriesColors,
      },
    ],
  };

  const option3 = {
    ...baseOption,
    title: {
      left: "center",
      textStyle: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    yAxis: {
      ...baseOption.yAxis,
      name: "准确率 (%)",
      min: 0,
      max: 80,
    },
    series: [
      {
        type: "bar",
        data: [
          {
            value: 69.0,
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                return params.value.toFixed(1);
              },
            },
            itemStyle: {
              color: seriesColors[0],
            },
          },
          {
            value: 0.0,
            label: {
              show: true,
              position: "top",
              formatter: function (params) {
                return params.value.toFixed(1);
              },
            },
            itemStyle: {
              color: seriesColors[1],
            },
          },
        ],
        color: seriesColors,
      },
    ],
  };

  if (chartInstance) {
    let option = null;
    switch (datasets[currentDatasetIndex]) {
      case "coco-2017":
        option = option1;
        break;
      case "nwpu":
        option = option2;
        break;
      case "lung-segmentation":
        option = option3;
        break;
    }

    chartInstance.setOption(option, true);
  }
}
