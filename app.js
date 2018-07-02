var pageBtns = document.querySelector(".page-btns");
var current = document.getElementsByClassName("active");
var total = document.querySelector("#total");
var url = "https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97&limit=268";
var str;
var showStr;
var showInformation = document.querySelector("#showInformation");
var selectorLocation = document.getElementById("selectorLocation");
var showDetail = document.getElementById("showDetail");
var free = document.getElementById("free");
var allDay = document.getElementById("allDay");
var arrA = [];
var arrB = [];

function render() {
    showInformation.innerHTML = "";
    str = "";
    arrB = arrA.filter(filterItem);
    for (var i = 0; i < 10; i++) {
        if (arrB[i] == undefined) {
            continue;
        }
        str += `<div onclick="show(${i})" class="result">
                    <img src="${arrB[i].Picture1}" alt="">
                    <div class="content">
                        <h3>${arrB[i].Name}</h3>
                        <span>${ticketinfo(arrB[i].Ticketinfo)}</span>
                        <p>${arrB[i].Description}</p>
                        <h4>位置</h4>
                        <span>${arrB[i].Zone}</span>
                        <img onclick="initMap(${arrB[i].Py},${arrB[i].Px})" id="mapBtn" src="https://goo.gl/w8NN6B">
                        <div class="information">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${arrB[i].Add}</span>
                            <i class="far fa-calendar-alt"></i>
                            <span>${arrB[i].Opentime}</span>
                        </div>
                    </div>
                </div>`;
    }
    showInformation.innerHTML = str;

    var pageNumbers = Math.ceil(arrB.length / 10);
    var pstr = "";
    for (var j = 0; j < pageNumbers; j++) {
        pstr +=
            `<li data-num="${j}" class="page">${j+1}</li>`;
        document.querySelector(".page-btns").innerHTML =
            `<li><i class="fas fa-chevron-left"></i></li>` +
            pstr +
            `<li><i class="fas fa-chevron-right"></i></li>`;
    }
    document.querySelector("li[data-num='0']").classList.add("active");

    total.innerHTML = arrB.length;
}

function filterItem(arr) {
    if (selectorLocation.options[selectorLocation.selectedIndex].text === "Kaohsiung City") {
        if (free.checked) {
            if (allDay.checked) {
                return (arr.Ticketinfo === free.value) && (arr.Opentime === allDay.value);
            } else {
                return (arr.Ticketinfo === free.value);
            }
        } else {
            if (allDay.checked) {
                return arr.Opentime === allDay.value;
            } else {
                return arr;
            }
        }
    } else {
        if (free.checked) {
            if (allDay.checked) {
                return arr.Zone === selectorLocation.options[selectorLocation.selectedIndex].text && arr.Ticketinfo === free.value && arr.Opentime === allDay.value;
            } else {
                return arr.Zone === selectorLocation.options[selectorLocation.selectedIndex].text && arr.Ticketinfo === free.value;
            }
        } else {
            if (allDay.checked) {
                return arr.Zone === selectorLocation.options[selectorLocation.selectedIndex].text && arr.Opentime === allDay.value;
            } else {
                return arr.Zone === selectorLocation.options[selectorLocation.selectedIndex].text;
            }
        }
    }
}

function init() {
    document.getElementById("loading").style.display = "block";
    const xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.send(null);
    xhr.onload = xhrListener;
    xhr.onerror = xhrError;
}

function xhrListener() {
    document.getElementById("loading").style.display = "none";
    const callbackData = JSON.parse(this.responseText);
    str = "";
    for (var i = 0; i < callbackData.result.records.length; i++) {
        arrA[i] = callbackData.result.records[i];
    }

    for (var count = 0; count < 10; count++) {
        str +=
            `<div onclick="show(${count})" class="result">
                <img src="${arrA[count].Picture1}" alt="">
                <div class="content">
                    <h3>${arrA[count].Name}</h3>
                    <span>${ticketinfo(arrA[count].Ticketinfo)}</span>
                    <p>${arrA[count].Description}</p>
                    <h4>位置</h4>
                    <span>${arrA[count].Zone}</span>
                    <img onclick="initMap(${arrA[count].Py},${arrA[count].Px})" id="mapBtn" src="https://goo.gl/w8NN6B">
                    <div class="information">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${arrA[count].Add}</span>
                        <i class="far fa-calendar-alt"></i>
                        <span>${arrA[count].Opentime}</span>
                    </div>
                </div>
            </div>`;
        showInformation.innerHTML = str;
    }

    var pageNumbers = Math.ceil(callbackData.result.total / 10);
    var pstr = "";
    for (var j = 0; j < pageNumbers; j++) {
        pstr +=
            `<li data-num="${j}" class="page">${j+1}</li>`;
        document.querySelector(".page-btns").innerHTML =
            `<li><i class="fas fa-chevron-left"></i></li>` +
            pstr +
            `<li><i class="fas fa-chevron-right"></i></li>`;
    }
    document.querySelector("li[data-num='0']").classList.add("active");

    total.innerHTML = callbackData.result.total;
}

function xhrError(err) {
    console.log('Fetch Error :-S', err);
}

selectorLocation.addEventListener('change', function () {
    document.querySelector("#areaTag>h5").innerText = this.value;
    render();
}, false);

free.addEventListener('click', function () {
    if (this.checked) {
        document.querySelector("#freeTag").classList.remove("hidden");
    } else {
        document.querySelector("#freeTag").classList.add("hidden");
    }
    render();
}, false);

allDay.addEventListener('click', function () {
    if (this.checked) {
        document.querySelector("#allDayTag").classList.remove("hidden");
    } else {
        document.querySelector("#allDayTag").classList.add("hidden");
    }
    render();
}, false);

init();

$(".page-btns").on("click", ".page", function (e) {
    if (e.target.nodeName == "LI") {
        $(".active").removeClass("active");
        $(e.target).addClass("active");
        changePage();
    }
});

window.addEventListener("load", function () {
    free.addEventListener("click", function () {
        if (freeLabel.classList == "checked") {
            document.getElementById("freeLabel").classList.remove("checked");
        } else {
            document.getElementById("freeLabel").classList.add("checked");
        }
    });
    allDay.addEventListener("click", function () {
        if (allDayLabel.classList == "checked") {
            document.getElementById("allDayLabel").classList.remove("checked");
        } else {
            document.getElementById("allDayLabel").classList.add("checked");
        }
    });
    document.querySelector("#areaTag").addEventListener("click", function (e) {
        if (e.target.nodeName == "I") {
            this.children[0].innerText = "Kaohsiung City";
            selectorLocation.value = "Kaohsiung City";
            render();
        }
    });
    document.querySelector("#freeTag").addEventListener("click", function (e) {
        if (e.target.nodeName == "I") {
            free.checked = false;
            document.querySelector("#freeTag").classList.add("hidden");
            document.querySelector("#freeLabel").classList.remove("checked");
            render();
        }
    });
    document.querySelector("#allDayTag").addEventListener("click", function (e) {
        if (e.target.nodeName == "I") {
            allDay.checked = false;
            document.querySelector("#allDayTag").classList.add("hidden");
            document.querySelector("#allDayLabel").classList.remove("checked");
            render();
        }
    });
});

function ticketinfo(x) {
    if (x == "") {
        return "請查詢官網是否收費";
    } else {
        return "免費參觀";
    }
}

function show(x) {
    if (event.target.id == "mapBtn") {
        return;
    }
    // console.log(arrA[x]);
    // console.log(arrB[x]);
    showStr = "";
    showInformation.classList.add("hidden");
    showDetail.classList.remove("hidden");
    document.getElementById("pages").classList.add("hidden");
    if (arrB.length === 0) {
        showStr =
            `<button class="btn btn-outline-primary" style="margin-bottom:20px;" onclick="previous()">回上一頁</button>
            <img src="${arrA[x].Picture1}" alt="">
            <div class="content">
                <h3>${arrA[x].Name}</h3>
                <span>${ticketinfo(arrA[x].Ticketinfo)}</span>
                <p>${arrA[x].Description}</p>
                <h4>位置</h4>
                <span>${arrA[x].Zone}</span>
                <div class="information">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${arrA[x].Add}</span>
                    <i class="far fa-calendar-alt"></i>
                    <span>${arrA[x].Opentime}</span>
                </div>
            </div>`;
    } else {
        showStr =
            `<button class="btn btn-outline-primary" style="margin-bottom:20px;" onclick="previous()">回上一頁</button>
            <img src="${arrB[x].Picture1}" alt="">
            <div class="content">
                <h3>${arrB[x].Name}</h3>
                <span>${ticketinfo(arrA[x].Ticketinfo)}</span>
                <p>${arrB[x].Description}</p>
                <h4>位置</h4>
                <span>${arrB[x].Zone}</span>
                <div class="information">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${arrB[x].Add}</span>
                    <i class="far fa-calendar-alt"></i>
                    <span>${arrB[x].Opentime}</span>
                </div>
            </div>`;
    }
    showDetail.innerHTML = showStr;
}

function previous() {
    showInformation.classList.remove("hidden");
    showDetail.classList.add("hidden");
    document.getElementById("pages").classList.remove("hidden");
}

function changePage() {
    var active = document.querySelector(".active");
    showInformation.innerHTML = "";
    str = "";
    for (var i = active.dataset.num * 10; i < (active.dataset.num * 10) + 10; i++) {
        if (arrA[i] == undefined) {
            continue;
        } else if (arrB.length === 0) {
            str +=
                `<div onclick="show(${i})" class="result">
                <img src="${arrA[i].Picture1}" alt="">
                <div class="content">
                    <h3>${arrA[i].Name}</h3>
                    <span>${ticketinfo(arrA[i].Ticketinfo)}</span>
                    <p>${arrA[i].Description}</p>
                    <h4>位置</h4>
                    <span>${arrA[i].Zone}</span>
                    <img onclick="initMap(${arrA[i].Py},${arrA[i].Px})" id="mapBtn" src="https://goo.gl/w8NN6B">
                    <div class="information">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${arrA[i].Add}</span>
                        <i class="far fa-calendar-alt"></i>
                        <span>${arrA[i].Opentime}</span>
                    </div>
                </div>
            </div>`;
        } else {
            if (arrB[i] == undefined) {
                continue;
            }
            str +=
                `<div onclick="show(${i})" class="result">
                <img src="${arrB[i].Picture1}" alt="">
                <div class="content">
                    <h3>${arrB[i].Name}</h3>
                    <span>${ticketinfo(arrB[i].Ticketinfo)}</span>
                    <p>${arrB[i].Description}</p>
                    <h4>位置</h4>
                    <span>${arrB[i].Zone}</span>
                    <img onclick="initMap(${arrB[i].Py},${arrB[i].Px})" id="mapBtn" src="https://goo.gl/w8NN6B">
                    <div class="information">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${arrB[i].Add}</span>
                        <i class="far fa-calendar-alt"></i>
                        <span>${arrB[i].Opentime}</span>
                    </div>
                </div>
            </div>`;
        }
    }
    showInformation.innerHTML = str;
}

$(window).ready(function () {
    $(document).on("click", ".content", function (e) {
        if (e.target.nodeName == "IMG") {
            $("#mapBg").removeClass("hidden");
        }
    });
    $("#mapBg").click(function (e) {
        if (e.target.id == "mapBg") {
            $("#mapBg").addClass("hidden");
        }
    });
});

function initMap(x, y) {
    var map;

    var mapCenter = {
        lat: x,
        lng: y
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: mapCenter,
        zoom: 16,
        //styles: mapStyle,
        draggable: true
    });
    var maker = new google.maps.Marker({
        position: mapCenter,
        map: map
        //title: "",
        //icon: "travel.png"
    });
}