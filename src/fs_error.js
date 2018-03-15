const onError = (response) => (err) => {
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

module.exports = onError;

