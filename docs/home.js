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

  if (!userSection.contains(event.target)) {
    dropdown.classList.remove("show");
  }
});

// Handle content card click
function onContentCardClick(type) {
  const messages = {
    federated: "联邦学习：多方协作训练模型，保护数据隐私的同时实现知识共享",
    privacy: "差分隐私：数学严格的隐私保护框架，确保个体信息安全",
    encryption: "同态加密：在加密状态下进行计算，保证数据全程加密",
    optimization: "模型优化：提升训练效率和模型性能，降低计算和通信成本",
    platform: "一体化平台：统一的管理和部署解决方案，简化复杂系统操作",
  };
  alert(messages[type] || "功能介绍");
}

// Handle pie chart segment clicks
function showPieContent(type) {
  // Hide all content details
  const allDetails = document.querySelectorAll(".content-details");
  // const defaultContent = document.getElementById("default-content");

  allDetails.forEach(detail => detail.classList.remove("active"));
  // defaultContent.style.display = "none";

  // Show selected content
  const targetContent = document.getElementById(type + "-content");
  if (targetContent) {
    targetContent.classList.add("active");
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", function () {
  console.log("Content grid initialized");
  // Show default content initially
  // document.getElementById("default-content").style.display = "block";
});

// Carousel functionality
let currentPage = 0;
const totalPages = 4;

function updateCarousel() {
  const pages = document.querySelectorAll(".carousel-page");
  const indicators = document.querySelectorAll(".carousel-indicator");

  // Update pages
  pages.forEach((page, index) => {
    page.classList.remove("active", "prev");
    if (index === currentPage) {
      page.classList.add("active");
    } else if (index < currentPage) {
      page.classList.add("prev");
    }
  });

  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentPage);
  });
}

function goToPage(pageIndex) {
  if (pageIndex >= 0 && pageIndex < totalPages) {
    currentPage = pageIndex;
    updateCarousel();
    // Reset auto-advance timer when user manually navigates
    stopAutoAdvance();
    startAutoAdvance();
  }
}

// Auto-advance carousel
let autoAdvanceInterval;

function startAutoAdvance() {
  autoAdvanceInterval = setInterval(() => {
    currentPage = (currentPage + 1) % totalPages;
    updateCarousel();
  }, 4000);
}

function stopAutoAdvance() {
  if (autoAdvanceInterval) {
    clearInterval(autoAdvanceInterval);
    autoAdvanceInterval = null;
  }
}

// Start auto-advance when page loads
document.addEventListener("DOMContentLoaded", function () {
  updateCarousel();
  startAutoAdvance();
});

// Stop auto-advance when user hovers over carousel
document.querySelector(".carousel-container").addEventListener("mouseenter", stopAutoAdvance);
document.querySelector(".carousel-container").addEventListener("mouseleave", startAutoAdvance);
