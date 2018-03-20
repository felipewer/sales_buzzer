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

exports.onFsError = (response) => (err) => {
  switch(err.code){
    case 'ENOENT':
      response.status(404).send();
      break;
    case 'EEXIST':
      response.status(409).send();
      break;
    default:
      console.error(JSON.stringify(err));
      response.status(500).send();
  }
}
