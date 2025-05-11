const input = document.querySelector("#input-img");
const btnConvert = document.querySelector("#convert");
const btnReset = document.querySelector("#reset");
const btnGrays = document.querySelector("#grays");
const img = document.querySelector("#img");
const ouput = document.querySelector("#output");
const ogImage = img.src;
const uniqueGrays = new Set();
let asciImg = [];

const MAX_VALUE = 255;

const asciiTableSimple = " .:-=+*#%@";
const asciiTableSize = asciiTableSimple.length;

const imageToCanvas = () => {
  const image = document.getElementById("img");
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  canvas.width = width;
  canvas.height = height;

  context.drawImage(image, 0, 0);

  return {
    canvas,
    context,
    width,
    height,
  };
};

input.addEventListener("change", (e) => {
  const imgFile = e.target.files[0];
  const reader = new FileReader();
  img.title = imgFile.name;

  reader.onload = (event) => {
    img.src = event.target.result;
  };

  reader.readAsDataURL(imgFile);
});

btnConvert.addEventListener("click", () => {
  const { canvas, context, width, height } = imageToCanvas();
  const image = context.getImageData(0, 0, width, height);

  const data = image.data;

  console.log({ width, height });
  blackWhiteFilter(data);
  toAscii(data, width);
  renderAscii(width);

  context.putImageData(image, 0, 0);
  img.src = canvas.toDataURL("image/jpeg");
});

btnReset.addEventListener("click", () => {
  img.src = ogImage;
});

btnGrays.addEventListener("click", () => {
  console.log({ asciImg });
});

const blackWhiteFilter = (data) => {
  for (let i = 0; i < data.length; i += 4) {
    const filter = data[i] / 3 + data[i + 1] / 3 + data[i + 2] / 3;
    data[i] = 255 - filter;
    data[i + 1] = 255 - filter;
    data[i + 2] = 255 - filter;
  }
};

const toAscii = (data) => {
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    const pixelColor = data[i];
    const asciiChar = Math.round((pixelColor / MAX_VALUE) * asciiTableSize);
    asciImg[j] = asciiTableSimple.at(asciiChar);
  }
};

const renderAscii = (width) => {
  const div = document.createElement("div");

  line = [];

  for (let i = 0, n = 0; i < asciImg.length; i++) {
    if (n === width) {
      const p = document.createElement("p");
      p.innerText = line.join();
      line = [];
      n = 0;
      div.append(p);
    }

    line[n] = asciImg[i];
    n++;
  }

  ouput.appendChild(div);
};
