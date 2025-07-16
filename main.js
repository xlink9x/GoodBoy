window.fetchObject = function (url, options, onFulfil, onReject) {
  fetch(url, options)
    .then((r) => r.json())
    .then((json) => onFulfil(json))
    .catch(onReject);
};

const dogs = [
  {
    frame: document.querySelector("#dog1 .frame"),
    image: document.querySelector("#dog1 img"),
    video: document.querySelector("#dog1 video"),
    loader: document.querySelector("#dog1 .loader"),
    chosen: document.querySelector("#dog1 .chosen"),
  },
  {
    frame: document.querySelector("#dog2 .frame"),
    image: document.querySelector("#dog2 img"),
    video: document.querySelector("#dog2 video"),
    loader: document.querySelector("#dog2 .loader"),
    chosen: document.querySelector("#dog2 .chosen"),
  },
];

function fetchDog(callback) {
  fetchObject("https://random.dog/woof.json", {}, callback);
}

function updateDog(index, callback) {
  dogs[index].image.style.display = "none";
  dogs[index].video.style.display = "none";
  dogs[index].loader.style.display = "block";

  fetchDog((data) => {
    if (data.url.toLowerCase().endsWith(".mp4")) {
      dogs[index].video.addEventListener(
        "loadeddata",
        () => {
          dogs[index].loader.style.display = "none";
          dogs[index].video.style.display = "block";
          callback();
        },
        { once: true },
      );
      dogs[index].video.src = data.url;
    } else {
      dogs[index].image.addEventListener(
        "load",
        () => {
          dogs[index].loader.style.display = "none";
          dogs[index].image.style.display = "block";
          callback();
        },
        { once: true },
      );
      dogs[index].image.src = data.url;
    }
  });
}

function chooseDog(index) {
  // mark this as chosen
  dogs[index].chosen.style.display = "grid";

  // reload the other dog
  const otherDogIndex = index === 0 ? 1 : 0;
  updateDog(otherDogIndex, () => {
    dogs[index].chosen.style.display = "none";
  });
}

// click listeners
dogs[0].frame.addEventListener("click", () => chooseDog(0));
dogs[1].frame.addEventListener("click", () => chooseDog(1));

// initial load
updateDog(0, () => {});
updateDog(1, () => {});
