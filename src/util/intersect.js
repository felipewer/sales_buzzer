/** Returns true if the two arrays intersect.
 *  Returns false otherwise
 * 
 * @param {Array} first 
 * @param {Array} second 
 */

exports.intersect = (first, second) => {
  const combined = new Set(first);
  for (let i of second) {
    if (combined.has(i)) {
      return true;
    } else {
      combined.add(i);
    }
  }
  return false;
}