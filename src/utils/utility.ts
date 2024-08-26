/* Converts miliseconds to format hh:mm:ss
 * @param {number} ms
 * @returns {string}
 */
export function msToTime(ms: number) {
  const seconds = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((ms / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}
