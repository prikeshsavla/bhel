import { createApp } from "https://unpkg.com/petite-vue?module";

// The wake lock sentinel.
// // Request a screen wake lock…
try {
  navigator.wakeLock.request();
  screen.keepAwake = true
} catch (err) {
  console.error(`${err.name}, ${err.message}`);
}

var interval;
var msg = new SpeechSynthesisUtterance();
msg.volume = 1;
var lastTotalTimeSpent = parseInt(
  window.localStorage.getItem("bhel-total-time-spent")
);
var audioPlayer = document.getElementById("exercise-audio");
function durationString(timer) {
  var minutes = parseInt(timer / 60, 10);
  var seconds = parseInt(timer % 60, 10);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
}

function speak(text, rate) {
  audioPlayer.volume = 0.1;
  msg.rate = rate ?? 1;
  msg.text = text;
  window.speechSynthesis.speak(msg);
  setTimeout(() => {
    audioPlayer.volume = 0.4;
  }, 1000);
}
createApp({
  // exposed to all expressions
  name: "My Exercise",
  time: 15,
  gap: 2,
  activeTimer: { time: 0, name: "Tap Start to Exercise" },
  totalTimeSpent:
    lastTotalTimeSpent && lastTotalTimeSpent != NaN ? lastTotalTimeSpent : 0,
  defaultTimers: [
    {
      name: "Forward Shoulder Rotation",
      time: 15,
    },
    {
      name: "Reverse Shoulder Rotation",
      time: 15,
    },
    {
      name: "Jumping Jacks",
      time: 45,
    },
    {
      name: "Butt Kicks",
      time: 45,
    },
    {
      name: "Break",
      time: 15,
    },
    {
      name: "Leg Raise",
      time: 30,
    },
    {
      name: "Break",
      time: 15,
    },
    {
      name: "Leg Scissors",
      time: 30,
    },
    {
      name: "Break",
      time: 10,
    },
    {
      name: "Knee High Crunches",
      time: 30,
    },
    {
      name: "Break",
      time: 10,
    },
    {
      name: "Wall Pushup Bicep",
      time: 30,
    },
    {
      name: "Break",
      time: 10,
    },
    {
      name: "Wall Pushup Tricep",
      time: 30,
    },
    {
      name: "Break",
      time: 10,
    },
  ],
  timers: JSON.parse(window.localStorage.getItem("bhel-routine")) ?? [],
  timeouts: [],
  music: true,
  // getters
  get activeTimeString() {
    return durationString(this.activeTimer.time);
  },
  get totalRoutineTime() {
    return durationString(
      this.timers.reduce((prev, next) => prev + next.time + this.gap, 0)
    );
  },
  get readableTotalTimeSpent() {
    return durationString(this.totalTimeSpent);
  },
  setRoutine(routine) {
    this.timers = routine;
    window.localStorage.setItem("bhel-routine", JSON.stringify(this.timers));
  },
  incrementTotalTime() {
    this.totalTimeSpent += 1;
    window.localStorage.setItem("bhel-total-time-spent", this.totalTimeSpent);
  },
  addTimer() {
    var timers = Object.values(this.timers);
    timers.push({ name: this.name, time: this.time });
    this.setRoutine(timers);
  },
  removeIndexFromTimer(index) {
    var timers = Object.values(this.timers);
    timers.splice(index, 1);
    this.setRoutine(timers);
  },
  startTimer(timer) {
    clearInterval(interval);
    this.activeTimer = timer;
    var duration = this.activeTimer.time;
    msg.lang = navigator.language;
    speak(timer.name + " " + `${this.activeTimer.time} seconds`);
    interval = setInterval(() => {
      this.incrementTotalTime();
      this.activeTimer.time = duration;
      if (duration > 0 && duration < 6) {
        // loud();
        speak(duration, 2);
      }
      if (--duration < 0) {
        // flat();
        msg.text = "And Done";
        speak("And Done", 2);
        clearInterval(interval);
      }
    }, 1000);
  },
  startSingleTimerWithMusic(timer) {
    this.audioPlayer("load");
    this.audioPlayer("play");
    this.startTimer({ ...timer });
    this.fadeOutAudio(timer.time );
  },
  startRoutine() {
    var lastTimeout = 0;
    this.timers.forEach((timer) => {
      this.timeouts.push(
        setTimeout(() => this.startTimer({ ...timer }), lastTimeout * 1000)
      );
      lastTimeout += timer.time + this.gap;
    });
    this.fadeOutAudio(lastTimeout);
    this.audioPlayer('play');
  },
  clearTimeouts() {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts = [];
  },
  fadeOutAudio(lastTimeout){
    this.timeouts.push(
      setTimeout(
        () => (audioPlayer.volume = audioPlayer.volume / 2),
        lastTimeout * 1000
      )
    );
    this.timeouts.push(
      setTimeout(
        () => (audioPlayer.volume = audioPlayer.volume / 2),
        (lastTimeout + this.gap / 2) * 1000
      )
    );
    this.timeouts.push(
      setTimeout(() => {
        this.audioPlayer('pause');
        this.clearTimeouts();
      }, (lastTimeout + this.gap) * 1000)
    );
  },
  stop() {
    clearInterval(interval);
    this.activeTimer = {
      time: 0,
      name: "Tap Start to Exercise",
    };

    this.audioPlayer('pause');
    window.speechSynthesis.cancel();
    this.clearTimeouts();
  },
  audioPlayer(command) {
    if (this.music) {
      switch (command) {
        case "load":
          audioPlayer.load();
          break;
        case "play":
          audioPlayer.play();
          break;
        case "pause":
          audioPlayer.pause();
      }
    } else if (command === "pause") {
      audioPlayer.pause();
    }
  },
  handleAudio() {
    if (this.music && this.timeouts.length) {
      this.audioPlayer("play");
    } else {
      this.audioPlayer("pause");
    }
  },
}).mount("#app");

if (window.location.host != "localhost") {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/bhel/sw.js")
        .then((res) => console.log("service worker registered"))
        .catch((err) => console.log("service worker not registered", err));
    });
  }
}
