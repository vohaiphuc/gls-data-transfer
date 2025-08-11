const endPoint = "https://script.google.com/macros/s/AKfycbyb9SekeyWPi_FXLYbcVvyVVHj8twpWttrhvBwGa6kRbdIRSgk8J7mzsSH8OU_vn82PVQ/exec"

const API_KE_TOAN = {
  refreshDocKeToanHoaDon: () => fetch.get("refresh-doc-ke-toan-hoa-don"),
  refreshHoaDon: () => fetch.get("refresh-hoa-don"),
}

const endPointPath = endPoint + "?path="
const fetch = {
  get: (path) => apiGet(endPointPath + path),
  post: (path, payload) => apiPost(endPointPath + path, payload)
}

function apiGet(url) {
  const fetching = UrlFetchApp.fetch(url)
  console.log("GET:", url)
  const res = fetching.getContentText()
  console.log(res)
  // const ui = SpreadsheetApp.getUi()
  try {
    const data = JSON.parse(res)
    const { code, message } = data
    if (code === '404' || code === 404) { // Không có kết quả. Query trả về rỗng
      console.warn(message)
      return undefined
    }
    else if (code !== '200' && code !== 200) {
      // ui.alert("Thông báo", "Có lỗi xảy ra. Vui lòng kiểm tra lại", ui.ButtonSet.OK)
      console.error(fetching)
      return undefined
    } else {
      return data
    }
  } catch (e) {
    console.error(e)
    // ui.alert("Thông báo", "Có lỗi xảy ra. Vui lòng kiểm tra lại hoặc báo với quản trị viên.", ui.ButtonSet.OK)
  }
}

function apiPost(url, payload) {
  let options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  };
  console.log("POST:", url)
  console.log("OPTIONS:", options)
  const fetching = UrlFetchApp.fetch(url, options)
  const res = fetching.getContentText()
  console.log(res)
  // const ui = SpreadsheetApp.getUi()
  try {
    const data = JSON.parse(fetching)
    const { code, message } = data
    if (code === '404' || code === 404) { // Không có kết quả. Query trả về rỗng
      console.warn(message)
      return undefined
    }
    else if (code !== '200' && code !== 200) {
      // ui.alert("Thông báo", "Có lỗi xảy ra. Vui lòng kiểm tra lại", ui.ButtonSet.OK)
      console.error(fetching)
      return undefined
    } else {
      return data
    }
  } catch (e) {
    console.error(e)
    // ui.alert("Thông báo", "Có lỗi xảy ra. Vui lòng kiểm tra lại hoặc báo với quản trị viên.", ui.ButtonSet.OK)
  }
}
