let enableTags = true; // mặc định

// Lấy trạng thái ban đầu từ storage
chrome.storage.local.get(['enableTags'], (res) => {
  enableTags = !!res.enableTags;
  addTagsToResults();
});

// Lắng nghe khi toggle thay đổi từ popup
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enableTags) {
    enableTags = changes.enableTags.newValue;
    addTagsToResults();
  }
});

function addTagsToResults() {
  const results = document.querySelectorAll('div.MjjYud');

  results.forEach((result) => {
    // Xoá tag cũ
    const oldTag = result.querySelector(".my-warning-tag");
    if (oldTag) oldTag.remove();

    // Nếu đang tắt → không gắn tag mới
    if (!enableTags) return;

    const link = result.querySelector("a[href]");
    result.style.position = "relative";

    const tag = document.createElement("div");
    tag.className = "my-warning-tag";
    tag.innerText = "Cảnh báo";
    tag.style.position = "absolute";
    tag.style.top = "8px";
    tag.style.right = "8px";
    tag.style.background = "red";
    tag.style.color = "white";
    tag.style.fontSize = "12px";
    tag.style.padding = "2px 6px";
    tag.style.borderRadius = "4px";
    tag.style.zIndex = "999";

    // Phân loại theo domain
    if (link) {
      const url = link.href;
      if (url.includes("wikipedia.org")) {
        tag.innerText = "Tin cậy";
        tag.style.background = "green";
      } else if (url.includes("thegioididong.com")) {
        tag.innerText = "Đối tác";
        tag.style.background = "blue";
      }
    }

    result.appendChild(tag);
  });
}

// Theo dõi khi Google search load thêm kết quả
const observer = new MutationObserver(() => addTagsToResults());
observer.observe(document.body, { childList: true, subtree: true });
