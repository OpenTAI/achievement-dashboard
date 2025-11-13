function toggleDropdown() {
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.toggle("show");
}

function logout() {
  alert("退出登录成功");
  const dropdown = document.getElementById("dropdownMenu");
  dropdown.classList.remove("show");
}

// Close dropdown whenetworkMethodDropdownn clicking outside
document.addEventListener("click", function (event) {
  const userSection = document.querySelector(".user-section");
  const dropdown = document.getElementById("dropdownMenu");

  if (userSection && !userSection.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

// QR Code click handler
function openLink(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
  updateImageGrid();
  // Remove automatic chart update on load
});

const datasets = ["default"];
const defaultAttackMethodMap = {
  "attack-tab": "FGSM",
  "backdoor-tab": "BadNets",
  "network-tab": "Fuzzers",
};
let currentDatasetIndex = 0;
let currentTab = "attack-tab";
let currentAttackMethod = defaultAttackMethodMap[currentTab];

const datasetImages = {
  default: [
    "topic4/achievement3/dataset/image1.png",
    "topic4/achievement3/dataset/image2.png",
    "topic4/achievement3/dataset/image3.png",
    "topic4/achievement3/dataset/image4.png",
    "topic4/achievement3/dataset/image5.png",
    "topic4/achievement3/dataset/image6.png",
    "topic4/achievement3/dataset/image7.png",
    "topic4/achievement3/dataset/image8.png",
    "topic4/achievement3/dataset/image9.png",
  ],
};

// Update chart data for network attacks
const networkChartData = {
  Fuzzers: [null, null, 96.89],
  Analysis: [null, null, 96.89],
  Backdoors: [null, null, 96.89],
  DoS: [null, null, 96.89],
};

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

function selectGridImage(index, imagePath, imageElement) {
  // Remove previous selection
  const previousSelected = document.querySelectorAll(".grid-image-item.selected");
  previousSelected.forEach(element => {
    element.classList.remove("selected");
  });

  // Add selection to current image
  imageElement.classList.add("selected");
  selectedImageIndex = index;

  // Update the selected image in the processing visualization
  const selectedImageElement = document.getElementById("selectedImage");
  const selectedImageBackdoorElement = document.getElementById("selectedImageBackdoor");
  if (selectedImageElement) {
    selectedImageElement.src = "images/" + imagePath;
  }
  if (selectedImageBackdoorElement) {
    selectedImageBackdoorElement.src = "images/" + imagePath;
  }

  // Show loading animation for attack result
  const loadingOverlay = document.getElementById("resultLoadingOverlay");
  const attackResultImageElement = document.getElementById("attackResultImage");

  if (loadingOverlay && attackResultImageElement) {
    // Show loading overlay
    loadingOverlay.classList.add("show");

    // Hide loading and update image after 0.5 seconds
    setTimeout(() => {
      loadingOverlay.classList.remove("show");
      attackResultImageElement.src = "images/" + imagePath;
    }, 500);
  }
}

// Bootstrap dropdown selection handlers
function selectAttackMethod(method) {
  currentAttackMethod = method;

  let button;
  if (currentTab === "attack-tab") {
    button = document.getElementById("attackMethodDropdown");
  } else if (currentTab === "backdoor-tab") {
    button = document.getElementById("backdoorMethodDropdown");
  } else if (currentTab === "network-tab") {
    button = document.getElementById("networkMethodDropdown");
  }

  if (button) {
    button.textContent = method;
    button.setAttribute("data-value", method);
  }
}

function selectDefenseMethod(method) {
  const button = document.getElementById("defenseMethodDropdown");
  button.textContent = method;

  // Store the selected value for later use
  button.setAttribute("data-value", method);
}

let chartInstance = null;
const defenseChartData = {
  FGSM: [75.82, 62.57, 92.7, 63.27, 94.49, 100, 97.58],
  BIM: [77.82, 55.88, 85.1, 97.85, 91.6, 100, 97.23],
  PGD: [79.14, 56.89, 86.62, 98.18, 92.85, 100, 97.18],
  CW: [94, 49.57, 58.44, 45.04, 61.62, 100, 96.96],
  DeepFool: [96.68, 50.11, 52.75, 43.82, 52.09, 100, 96.77],
  "Spatial Transformation Attack": [75.71, 91.65, 94.45, 24.08, 90.2, 100, 99.96],
  "Square attack": [97.94, 92.77, 26.09, 32.56, 99.9, 100, 99.66],
  "Adversarial Patch": [66.32, 72.38, 96.72, 51.76, 99.02, 100, 99.97],
};
const backdoorChartData = {
  BadNets: [85.64, 77.57, 92.32, 97.89, 62.89, 94.03, 88.89],
  Blend: [88.17, 76.23, 80.67, 84.55, 51.63, 93.47, 92.3],
  CL: [90.86, 70.06, 98.85, 97.27, 40.78, 98.75, 93.48],
  DFST: [89.1, 80.45, 87.62, 58.08, 56.34, 88.96, 82.54],
  Dynamic: [87.97, 77.83, 97.82, 91.49, 66.49, 97.97, 94.89],
  FC: [86.61, 83.99, 98.65, 79.84, 63.62, 99.17, 94.46],
  SIG: [97.42, 84.4, 62.95, 81.68, 58.9, 96.91, 96.09],
  Smooth: [79.53, 82.11, 51.32, 58.52, 70.24, 91.09, 82.05],
  Nashville: [76.12, 89.26, 70.53, 51.62, 80.48, 98.1, 95.28],
  Trojan: [85.96, 69.59, 93.82, 91.85, 59.18, 96.91, 91.16],
  WaNet: [56.66, 70.96, 96.31, 84.98, 71.59, 95.69, 86.6],
  ISSBA: [96.99, 100, 0, 70.37, 42.22, 100, 99.97],
  平均: [83.61, 82.6, 84.62, 78.61, 63.83, 96.45, 92.66],
};

async function updateChart() {
  if (chartInstance) {
    chartInstance.dispose();
  }

  const chartContainer = document.getElementById("defenseChart");
  chartInstance = echarts.init(chartContainer);

  const seriesColors = [
    "#4e79a7",
    "#f28e2c",
    "#59a14f",
    "#e15759",
    "#76b7b2",
    "#edc949",
    "#af7aa1",
  ];

  const baseOption = {
    tooltip: {
      trigger: "axis",
      formatter: function (params) {
        return params[0].value === null ? "" : params[0].value.toFixed(2) + "%";
      },
    },
    xAxis: {
      type: "category",
      nameLocation: "middle",
      splitLine: {
        show: false,
      },
      axisLabel: {
        fontSize: 10,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      name: "防御成功率",
      min: 0,
      max: 100,
      nameLocation: "middle",
      splitLine: {
        show: true,
      },
      axisLabel: {
        fontSize: 12,
        formatter: function (value) {
          return `${value.toFixed(0)}%`;
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

  let option;
  if (currentTab === "attack-tab") {
    option = {
      ...baseOption,
      xAxis: {
        ...baseOption.xAxis,
        data: ["KDE", "LID", "NSS", "FS", "magNet", "NIC", "MultiLID"],
      },
      series: [
        {
          type: "bar",
          data: defenseChartData[currentAttackMethod].map(value => ({
            value,
            itemStyle: {
              color: "#f28e2c",
            },
          })),
        },
      ],
    };
  } else if (currentTab === "backdoor-tab") {
    option = {
      ...baseOption,
      xAxis: {
        ...baseOption.xAxis,
        data: ["ABL", "AC", "Frequency", "STRIP", "SS", "CD-L", "CD-F"],
      },
      series: [
        {
          type: "bar",
          data: backdoorChartData[currentAttackMethod].map(value => ({
            value,
            itemStyle: {
              color: "#f28e2c",
            },
          })),
        },
      ],
    };
  } else if (currentTab === "network-tab") {
    option = {
      ...baseOption,
      xAxis: {
        ...baseOption.xAxis,
        data: ["", "", "防御策略", "", ""],
      },
      series: [
        {
          type: "bar",
          data: networkChartData[currentAttackMethod].map(value => ({
            value,
            itemStyle: {
              color: "#f28e2c",
            },
          })),
        },
      ],
    };
  }

  chartInstance && chartInstance.setOption(option, true);
}

// New function to handle attack button click with loading animation
function performAttack() {
  let attackButton;
  if (currentTab === "attack-tab") {
    attackButton = document.getElementById("attackButton");
  } else if (currentTab === "backdoor-tab") {
    attackButton = document.getElementById("backdoorButton");
  } else if (currentTab === "network-tab") {
    attackButton = document.getElementById("networkButton");
  }

  const chartLoadingOverlay = document.getElementById("chartLoadingOverlay");
  const defenseChartSection = document.getElementById("defenseChartSection");

  if (attackButton && chartLoadingOverlay && defenseChartSection) {
    // Disable button during loading
    attackButton.disabled = true;
    const originalText = attackButton.textContent;
    attackButton.textContent = "攻击中...";

    // Expand the chart section first
    defenseChartSection.classList.remove("collapsed");

    // Show chart loading overlay after expansion animation
    setTimeout(() => {
      chartLoadingOverlay.classList.add("show");

      // Update chart after loading animation
      setTimeout(() => {
        updateChart();

        // Hide loading and re-enable button
        chartLoadingOverlay.classList.remove("show");
        attackButton.disabled = false;
        attackButton.textContent = originalText;
      }, 500);
    }, 200);
  }
}

// Tab switching function
function switchTab(tabId) {
  if (currentTab !== tabId) {
    currentTab = tabId;
    selectAttackMethod(defaultAttackMethodMap[tabId]);
  }

  // Remove active class from all tab headers
  const headers = document.querySelectorAll(".tab-header");
  headers.forEach(header => header.classList.remove("active"));

  // Remove active class from all tab panes
  const panes = document.querySelectorAll(".tab-pane");
  panes.forEach(pane => pane.classList.remove("active"));

  // Add active class to clicked header
  event.target.classList.add("active");

  // Show corresponding tab pane
  const targetPane = document.getElementById(tabId);
  if (targetPane) {
    targetPane.classList.add("active");
  }

  // Handle image display in first column
  const imageGrid = document.getElementById("imageGrid");
  const singleImageContainer = document.getElementById("singleImageContainer");

  if (tabId === "network-tab") {
    // Show single image for network attack tab
    if (imageGrid) imageGrid.style.display = "none";
    if (singleImageContainer) singleImageContainer.style.display = "flex";

    // Update the network image in processing section
    const selectedImageNetwork = document.getElementById("selectedImageNetwork");
    if (selectedImageNetwork) {
      selectedImageNetwork.src = "images/topic4/achievement3/network/network-data.png";
    }
  } else {
    // Show image grid for other tabs
    if (imageGrid) imageGrid.style.display = "grid";
    if (singleImageContainer) singleImageContainer.style.display = "none";
  }

  const resultImageSection = document.getElementById("result-image-section");
  if (currentTab === "attack-tab") {
    resultImageSection.classList.remove("d-none");
  } else if (currentTab === "backdoor-tab") {
    resultImageSection.classList.remove("d-none");
  } else if (currentTab === "network-tab") {
    resultImageSection.classList.add("d-none");
  }

  const defenseChartSection = document.getElementById("defenseChartSection");
  defenseChartSection.classList.add("collapsed");

  const imageNetDatasetIntro = document.getElementById("imagenet-dataset-intro");
  const networkDatasetIntro = document.getElementById("network-dataset-intro");

  if (currentTab === "network-tab") {
    networkDatasetIntro.classList.remove("d-none");
    imageNetDatasetIntro.classList.add("d-none");
  } else {
    networkDatasetIntro.classList.add("d-none");
    imageNetDatasetIntro.classList.remove("d-none");
  }
}
