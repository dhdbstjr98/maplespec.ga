const characterModel = require('../model/character');

const analyzeStats = function(characterInfo, analysisEquipment) {
  const jobModel = require('../model/job');
  const job = jobModel[characterInfo.character.job];
  const jobDefault = jobModel.default;
  const weaponConst = require('../model/weapon')[analysisEquipment.weapon] || 1;

  let rebootDamage = 0;
  if (characterInfo.character.server.name.indexOf("리부트") == 0) {
    // 리부트, 리부트2 월드 반영
    rebootDamage = parseInt(characterInfo.character.level / 2);
  }

  const stats = {
    major: {
      pure: 0,
      percent: analysisEquipment.majorPercent +
        job.stats.passive.major.percent +
        jobDefault.stats.passive.major.percent,
      added: 0
    },
    minor: characterInfo.stats.minor,
    damage: {
      all: characterInfo.stats.damageHyper +
        analysisEquipment.damagePercent +
        job.stats.passive.damage.all +
        jobDefault.stats.passive.damage.all +
        rebootDamage,
      boss: characterInfo.stats.bossAttackDamage
    },
    finalDamage: job.stats.passive.finalDamage,
    criticalDamage: characterInfo.stats.criticalDamage + jobDefault.stats.passive.criticalDamage,
    attackPower: {
      pure: 0,
      percent: analysisEquipment.attackPowerPercent +
        job.stats.passive.attackPower.percent
    },
    ignoreGuard: characterInfo.stats.ignoreGuard
  };

  stats.major.added = characterInfo.stats.majorHyper +
    analysisEquipment.majorArcane +
    jobDefault.stats.passive.major.added;
  stats.major.pure = (characterInfo.stats.major - stats.major.added) / (1 + stats.major.percent / 100);

  stats.attackPower.pure = characterInfo.stats.statAttackPower * 100 / (characterInfo.stats.major * 4 + stats.minor) / job.jobConst / weaponConst / (1 + stats.attackPower.percent / 100) / (1 + stats.damage.all / 100) / (1 + stats.finalDamage / 100);

  return stats;
}

const calculateEfficiency = function(stats, job, weapon) {
  const efficiency = {
    major: {
      pure: 1,
      percent: 0
    },
    attackPower: {
      pure: 0,
      percent: 0,
    },
    damage: 0,
    criticalDamage: 0,
    ignoreGuard: 0
  };

  const defaultPower = calculatePower(stats, job, weapon);

  stats.major.pure += 1;
  const majorPure = calculatePower(stats, job, weapon) - defaultPower;
  stats.major.pure -= 1;

  if (majorPure == 0)
    return efficiency;

  stats.major.percent += 1;
  efficiency.major.percent = (calculatePower(stats, job, weapon) - defaultPower) / majorPure;
  stats.major.percent -= 1;

  stats.attackPower.pure += 1;
  efficiency.attackPower.pure = (calculatePower(stats, job, weapon) - defaultPower) / majorPure;
  stats.attackPower.pure -= 1;

  stats.attackPower.percent += 1;
  efficiency.attackPower.percent = (calculatePower(stats, job, weapon) - defaultPower) / majorPure;
  stats.attackPower.percent -= 1;

  stats.damage.all += 1;
  efficiency.damage = (calculatePower(stats, job, weapon) - defaultPower) / majorPure;
  stats.damage.all -= 1;

  stats.criticalDamage += 1;
  efficiency.criticalDamage = (calculatePower(stats, job, weapon) - defaultPower) / majorPure;
  stats.criticalDamage -= 1;

  // 곱연산
  const ignoreGuardSaved = stats.ignoreGuard;
  stats.ignoreGuard = (1 - (1 - stats.ignoreGuard / 100) * 0.99) * 100;
  efficiency.ignoreGuard = (calculatePower(stats, job, weapon) - defaultPower) / majorPure;
  stats.ignoreGuard = ignoreGuardSaved;

  return efficiency;
}

// 버프 적용 스탯 구하기
const getBuffStats = function(stats, job) {
  const jobModel = require('../model/job');
  const buff = jobModel[job].stats.active;
  const defaultBuff = jobModel.default.stats.active;

  return {
    major: {
      pure: stats.major.pure + buff.major.pure,
      percent: stats.major.percent + buff.major.percent,
      added: stats.major.added
    },
    minor: stats.minor,
    damage: {
      all: stats.damage.all + buff.damage.all + defaultBuff.damage.all,
      boss: stats.damage.boss + buff.damage.boss + defaultBuff.damage.boss
    },
    finalDamage: stats.finalDamage,
    criticalDamage: stats.criticalDamage + buff.criticalDamage + defaultBuff.criticalDamage,
    attackPower: {
      pure: stats.attackPower.pure + buff.attackPower.pure,
      percent: stats.attackPower.percent + buff.attackPower.percent + defaultBuff.attackPower.percent
    },
    ignoreGuard: (1 - (1 - (stats.ignoreGuard / 100)) * (1 - (buff.ignoreGuard / 100)) * (1 - (defaultBuff.ignoreGuard / 100))) * 100
  };
}

// 크리티컬 데미지, 보스 공격력, 방어율 무시를 반영하여 방어율 300% 몬스터 공격시 데미지 산출 값
const calculatePower = function(stats, job, weapon) {
  const jobConst = require('../model/job')[job].jobConst;
  const weaponConst = require('../model/weapon')[weapon];
  return Math.max(
    (
      (stats.major.pure * (1 + stats.major.percent / 100) + stats.major.added) * 4 +
      stats.minor
    ) *
    0.01 *
    (stats.attackPower.pure * (1 + stats.attackPower.percent / 100)) *
    jobConst *
    weaponConst *
    (1 + stats.damage.all / 100 + stats.damage.boss / 100) *
    (1 + stats.finalDamage / 100) *
    (1.35 + stats.criticalDamage / 100) *
    (1 - 3 * (1 - stats.ignoreGuard / 100)),
    1);
}

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

    const stats = analyzeStats(characterInfo, analysisEquipment);
    const buffStats = getBuffStats(stats, characterInfo.character.job);
    const efficiency = calculateEfficiency(stats, characterInfo.character.job, analysisEquipment.weapon);
    const buffEfficiency = calculateEfficiency(buffStats, characterInfo.character.job, analysisEquipment.weapon);

    const result = {
      info: characterInfo.character,
      analysis: {
        default: {
          stats: stats,
          efficiency: efficiency
        },
        buff: {
          stats: buffStats,
          efficiency: buffEfficiency
        }
      }
    };

    console.log(JSON.stringify(result));
    res.send(result);
  }
};