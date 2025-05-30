const input = document.querySelector("#input-img");
const btnConvert = document.querySelector("#convert");
const btnReset = document.querySelector("#reset");
const btnPrint = document.querySelector("#grays");
const btnDownscale = document.querySelector("#downscale");

const img = document.querySelector("#img");
const ouput = document.querySelector("#output");
const ogImage = img.src;
const uniqueGrays = new Set();
let asciImg = [];

const MAX_VALUE = 255;

const asciiTableSimple = `.:-=+*#%@`;
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

const newCanvas = (width, height) => {
  const image = new Image();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

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

  blackWhiteFilter(data);
  toAscii(data, width);
  renderAscii(width);

  context.putImageData(image, 0, 0);
  img.src = canvas.toDataURL("image/jpeg");
});

btnDownscale.addEventListener("click", () => {
  const { canvas, context, width, height } = imageToCanvas();
  const image = context.getImageData(0, 0, width, height);

  const newRatio = Math.ceil(width / 360);

  const nWidth = Math.round(width / newRatio);
  const nHeight = Math.round(height / newRatio);

  const { context: newContext, canvas: _canvas } = newCanvas(nWidth, nHeight);
  const newImage = newContext.getImageData(0, 0, nWidth, nHeight);

  downscale(image, newImage, newRatio, nWidth);
  toAscii(newImage.data, nWidth);
  renderAscii(nWidth);

  newContext.putImageData(newImage, 0, 0);
  img.src = _canvas.toDataURL("image/jpeg");
});

btnReset.addEventListener("click", () => {
  img.src = ogImage;
});

btnPrint.addEventListener("click", () => {
  renderAsciiArt(480, 360);
});

const downscale = (oldImage, newImage, ratio) => {
  let line = 1;
  for (let i = 0, j = 0; i < newImage.data.length; i += 4) {
    j = i * ratio + line * oldImage.width * 4;
    newImage.data[i] = oldImage.data[j];
    newImage.data[i + 1] = oldImage.data[j + 1];
    newImage.data[i + 2] = oldImage.data[j + 2];
    newImage.data[i + 3] = oldImage.data[j + 3];
    if ((i / 4) % newImage.width === 0) {
      line++;
    }
  }
};

const blackWhiteFilter = (data) => {
  for (let i = 0; i < data.length; i += 4) {
    const filter = data[i] / 3 + data[i + 1] / 3 + data[i + 2] / 3;
    data[i] = filter;
    data[i + 1] = filter;
    data[i + 2] = filter;
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
  const total = [];

  for (let i = 0, n = 0; i < asciImg.length; i++) {
    if (n === width) {
      const p = document.createElement("p");

      p.innerText = line.join("");
      line = [];
      n = 0;
      i += width;
      div.append(p);
    }

    line[n] = asciImg[i];
    total[i] = asciImg[i];
    n++;
  }

  ouput.appendChild(div);
};

const renderAsciiArt = (width, height) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = 3300;
  canvas.height = 1884;

  ctx.font = "12px monospace";
  ctx.fillStyle = "white"; // Set text color
  ctx.fillText(`0`, 0, 12);
  ctx.fillText(`9`, 468, 12);
  ctx.fillText(`9`, 468, 24);

  img.src = canvas.toDataURL("image/jpeg");
};
