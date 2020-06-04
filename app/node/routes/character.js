axios = require('axios');

const crwalCharacterCode = async function(nickname) {
  try {
    const resp = await axios.get("https://maplestory.nexon.com/Ranking/World/Total?c=" + encodeURI(nickname));

    const regex = new RegExp(`<dt><a href=\\"\\/Common\\/Character\\/Detail\\/[^\\?]+?\\?p=(.+?)\\"\\s+target=.+?\\/>${nickname}<\\/a><\\/dt>`);
    const regexResult = regex.exec(resp.data);

    if (!regexResult)
      return false;

    return regexResult[1];
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  getCharacter: async function(req, res) {
    if (!req.query.nickname) {
      res.status(204).send();
      return;
    }

    const nickname = req.query.nickname;
    const characterCode = await crwalCharacterCode(req.query.nickname);

    if (!characterCode) {
      res.status(404).send();
      return;
    }

    console.log(characterCode);
    res.send({ text: characterCode });
  }
};