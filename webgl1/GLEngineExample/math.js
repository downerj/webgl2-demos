const RADIANS = Math.PI / 180;
const DEGREES = 180 / Math.PI;

function randomInteger(minimum, maximum) {
  return Math.floor(Math.random() * (maximum - minimum) + minimum);
}

function timestampToHHMMSS(timestamp) {
  const hours = Math.floor(timestamp / (1000 * 3600))
    .toString().padStart(2, '0');
  const minutes = Math.floor((timestamp / (1000 * 60)) % 60)
    .toString().padStart(2, '0');
  const seconds = Math.floor((timestamp / 1000) % 60)
    .toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

