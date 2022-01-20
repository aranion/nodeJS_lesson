const listItems = document.querySelector("#list_items");
const fullPath = document.querySelector("#full_path");
const textFile = document.querySelector("#text_file");
const searchText = document.querySelector("#search_text");

function getFetchRestart(name) {
  switch (name) {
    case "fullPathName":
      return fetch("http://localhost:8080/fullPath", {
        mode: "no-cors",
        method: "GET",
      });
    case "listItemsName":
      return fetch("http://localhost:8080/listItemsName", {
        mode: "no-cors",
        method: "GET",
      });
    default:
      break;
  }
}
// const fullPathName = fetch('http://localhost:8080/fullPath', {
//   mode: 'no-cors',
//   method: "GET"
// });
// const listItemsName = fetch('http://localhost:8080/listItemsName', {
//   mode: 'no-cors',
//   method: "GET"
// });

async function run() {
  getFetchRestart("listItemsName")
    .then((res) => res.clone().json())
    .then((data) => {
      listItems.innerHTML = data
        .sort((a, b) => {
          if (a.typeFolder) return -1;
        })
        .map(
          (el) =>
            `<li class='item ${el.typeFolder ? "folder" : ""}'> ${
              el.fileName || el
            } </li>`
        )
        .join("");
    })
    .catch((err) => console.log(err));
  getFetchRestart("fullPathName")
    .then((res) => res.clone().json())
    .then((data) => {
      fullPath.innerText = data;
    })
    .catch((err) => console.log(err));
}

listItems.addEventListener("click", (e) => {
  fetch("http://localhost:8080/targetName", {
    mode: "no-cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(e.target.innerText),
  })
    .then((res) => res.text())
    .then((data) => {
      textFile.innerText = data;
      run();
    })
    .catch((err) => console.log(err));
});

run();
