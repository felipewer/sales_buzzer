const intersect = (first, second) => {
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

module.exports = { intersect };