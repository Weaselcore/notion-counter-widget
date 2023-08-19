"use strict";

var widgetData;

const initialiseWidget = (defaultData) => {
  var defaultData = {
    count: 0,
    timerStarted: false,
    startTime: null,
    timerId: null,
    visibility: "visible",
  };
  // Initialise localstorage variables
  if (localStorage.getItem("widgetData") === null) {
    localStorage.setItem("widgetData", JSON.stringify(defaultData));
    console.log("Initialised localstorage variables");
  } else {
    console.log("LocalStorage variables already initialised");
  }
  // Initialise widget data from localstorage
  widgetData = JSON.parse(localStorage.getItem("widgetData"));

  // Initialise the count number
  const number = window.document.getElementById("number");
  number.innerHTML = widgetData.count;

  // Initialise the timer
  const timer = window.document.getElementById("timer");
  const buttonTimerVisibility = window.document.getElementById("button-timer-visibility")
  if (widgetData.timerStarted === true) {
    timer.style.visibility = "visible";
    buttonTimerVisibility.innerHTML = "hide";
    timer.innerHTML = calculateTime();
    const buttonStartTimer = window.document.getElementById("button-timer");
    buttonStartTimer.innerHTML = "stop";
    _setTimerId();
  } else {
    const buttonStartTimer = window.document.getElementById("button-timer");
    buttonTimerVisibility.innerHTML = "show";
    timer.style.visibility = "hidden";
    buttonStartTimer.innerHTML = "start";
  }

  // Add event listeners
  number.addEventListener("animationend", function () {
    number.classList.remove("bounce");
  });

  // Make number bounce on load
  number.classList.add("bounce");
};

const calculateTime = () => {
  let widgetDataFromStorage = JSON.parse(localStorage.getItem("widgetData"));
  const startTime = new Date(widgetDataFromStorage.startTime);
  const currentTime = new Date();

  let timeDiff = currentTime - startTime; //in ms

  // Calculate hours, minutes, and seconds
  const hours = Math.floor(timeDiff / 3600000); // 1 hour = 3600000 ms
  timeDiff %= 3600000;
  const minutes = Math.floor(timeDiff / 60000); // 1 minute = 60000 ms
  timeDiff %= 60000;
  const seconds = Math.floor(timeDiff / 1000); // 1 second = 1000 ms

  // Create formatted time string
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return formattedTime;
};

const _setTimerId = () => {
  let timerId = setInterval(function () {
    const timer = window.document.getElementById("timer");
    timer.innerHTML = calculateTime();
  }, 200);

  widgetData.timerId = timerId;
  localStorage.setItem("widgetData", JSON.stringify(widgetData));
};

const startTimer = () => {
  const timerStarted = widgetData.timerStarted;

  if (!timerStarted) {
    console.log("Timer Started");
    widgetData.timerStarted = true;
    widgetData.startTime = new Date();
    _setTimerId();
    localStorage.setItem("widgetData", JSON.stringify(widgetData));
  }
};

const stopTimer = () => {
  const timerStarted = widgetData.timerStarted;
  if (timerStarted) {
    widgetData.timerStarted = false;
    widgetData.startTime = null;
    // Clear timer and set timerId to null
    let timerId = widgetData.timerId;
    clearInterval(timerId);
    widgetData.timerId = null;

    localStorage.setItem("widgetData", JSON.stringify(widgetData));
    console.log("Timer Stopped");
  }
};

const onPlusPress = () => {
  const number = window.document.getElementById("number");
  let numberFromStorage = widgetData.count;
  let newNumber = ++numberFromStorage;
  widgetData.count = newNumber;
  localStorage.setItem("widgetData", JSON.stringify(widgetData));

  number.innerHTML = newNumber;
  number.classList.add("bounce");
};

const onMinusPress = () => {
  let numberFromStorage = widgetData.count;

  if (numberFromStorage > 0) {
    const number = window.document.getElementById("number");
    let newNumber = --numberFromStorage;
    number.innerHTML = newNumber;
    widgetData.count = newNumber;
    localStorage.setItem("widgetData", JSON.stringify(widgetData));
    number.classList.add("bounce");
  }
};

const onResetPress = () => {
  const number = window.document.getElementById("number");
  widgetData.count = 0;
  localStorage.setItem("widgetData", JSON.stringify(widgetData));

  number.innerHTML = 0;
  number.classList.add("bounce");

  stopTimer();
  const timer = document.getElementById("timer");
  timer.innerHTML = "00:00:00";

  const buttonStartTimer = document.getElementById("button-timer");
  buttonStartTimer.innerHTML = "start";
};

const onTimerPress = () => {
  const buttonStartTimer = document.getElementById("button-timer");
  const timer = document.getElementById("timer");

  if (buttonStartTimer.innerHTML === "stop") {
    buttonStartTimer.innerHTML = "start";
    stopTimer();
  } else {
    buttonStartTimer.innerHTML = "stop";
    timer.style.visibility = "visible";
    startTimer();
  }
};

const onVisibilityPress = () => {
  const timer = document.getElementById("timer");
  const buttonHideTimer = document.getElementById("button-timer-visibility");

  if (timer.style.visibility === "hidden") {
    widgetData.visibility = "visible";
    timer.style.visibility = "visible";
    buttonHideTimer.innerHTML = "hide";
  } else {
    widgetData.visibility = "hidden";
    timer.style.visibility = "hidden";
    buttonHideTimer.innerHTML = "show";
  }
  localStorage.setItem("widgetData", JSON.stringify(widgetData));
};

// Initialise the widget on load
window.onload = initialiseWidget(widgetData);