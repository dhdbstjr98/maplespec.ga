const characterModel = require('../model/character');
const analysisModel = require('../model/analysis');

module.exports = {
  getCharacter: async function(req, res) {
    if (!req.query.nickname) {
      res.status(204).send();
      return;
    }

    const nickname = req.query.nickname;
    const characterCode = await characterModel.crwalCharacterCode(req.query.nickname);

    if (characterCode == -1) {
      res.status(500).send();
      return;
    } else if (characterCode == -2) {
      res.status(404).send();
      return;
    }

    const characterInfo = await characterModel.getCharacterInfo(nickname, characterCode);
    if (characterInfo == -1) {
      // 접근 권한 설정 필요
      res.status(403).send();
      return;
    } else if (characterInfo == -2) {
      // 점검중
      res.status(503).send();
      return;
    } else if (characterInfo < 0) {
      res.status(400).send();
      return;
    }

    const analysisEquipment = await characterModel.analyzeEquipment(nickname, characterCode, characterInfo.character.job);
    if (analysisEquipment == -1) {
      // 접근 권한 설정 필요
      res.status(403).send();
      return;
    } else if (analysisEquipment == -2) {
      // 점검중
      res.status(503).send();
      return;
    } else if (analysisEquipment < 0) {
      res.status(400).send();
      return;
    }

    const stats = analysisModel.analyzeStats(characterInfo, analysisEquipment);
    const buffStats = analysisModel.getBuffStats(stats, characterInfo.character.job);

    const result = {
      info: characterInfo.character,
      analysis: {
        default: {
          stats: stats,
          efficiency: analysisModel.calculateEfficiency(stats, characterInfo.character.job, analysisEquipment.weapon)
        },
        buff: {
          stats: buffStats,
          efficiency: analysisModel.calculateEfficiency(buffStats, characterInfo.character.job, analysisEquipment.weapon)
        }
      }
    };

    console.log(JSON.stringify(result));
    res.send(result);
  }
};