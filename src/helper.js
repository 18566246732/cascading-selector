export default {
  deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }
};
