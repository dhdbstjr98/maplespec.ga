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

const getCharacterInfo = async function(nickname, characterCode) {
  try {
    const resp = await axios.get("https://maplestory.nexon.com/Common/Character/Detail/" + encodeURI(nickname) + "?p=" + characterCode);

    if (resp.data.indexOf("공개하지 않은 정보입니다.") > 0) {
      throw new Error("private_character");
    }

    const character = {
      nickname: nickname,
      characterCode: characterCode
    };
    const stats = {
      major: 0,
      minor: 0,
      majorHyper: 0,
      damageHyper: 0,
      criticalDamage: 0,
      bossAttackDamage: 0,
      ignoreGuard: 0,
      statAttackPower: 0
    };

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(resp.data);
    const $ = (require('jquery'))(dom.window);

    const jobModel = require('../model/job');
    const statModel = require('../model/stat');

    character.job = $(".tab01_con_wrap .table_style01:eq(0) tbody tr:eq(0) td:eq(1) span").text();
    character.level = parseInt($(".char_info dl:eq(0) dd").text().substring(3));

    const $statInfo = $(".tab01_con_wrap .table_style01:eq(1)");
    $("tbody tr", $statInfo).each(function() {
      if ($("th", this).length == 1) {
        if ($("th span", this).text() == "하이퍼스탯") {
          const values = $("td span", this).html().split("<br>");

          const regexMajor = new RegExp(`${statModel[jobModel[character.job].major].korean} (\\d+) 증가`);
          const regexDamage = new RegExp(`^데미지 (\\d+)% 증가`);

          let regexResult;
          for (let i = 0; i < values.length; i++) {
            if (regexResult = regexMajor.exec(values[i]))
              stats['majorHyper'] = parseInt(regexResult[1]);
            else if (regexResult = regexDamage.exec(values[i]))
              stats['damageHyper'] = parseInt(regexResult[1]);
          }
        }
      } else {
        for (let i = 0; i < 2; i++) {
          const statName = $(`th:eq(${i}) span`, this).text();
          const value = $(`td:eq(${i}) span`, this).text().replace(/\,/g, "");

          switch (statName) {
            case jobModel[character.job].major:
              stats['major'] = parseInt(value);
              break;
            case jobModel[character.job].minor:
              stats['minor'] = parseInt(value);
              break;
            case "크리티컬 데미지":
              stats['criticalDamage'] = parseInt(value);
              break;
            case "보스공격력":
              stats['bossAttackDamage'] = parseInt(value);
              break;
            case "방어율무시":
              stats['ignoreGuard'] = parseInt(value);
              break;
            case "스탯공격력":
              stats['statAttackPower'] = parseInt(value.split(' ~ ')[1]);
          }
        }
      }
    });

    return {
      character: character,
      stats: stats
    };
  } catch (error) {
    console.log(error);
    return false;
  }
}

const analyzeEquipment = async function(nickname, characterCode, job) {
  try {
    const resp = await axios.get("https://maplestory.nexon.com/Common/Character/Detail/" + encodeURI(nickname) + "/Equipment?p=" + characterCode);

    if (resp.data.indexOf("공개하지 않은 정보입니다.") > 0) {
      throw new Error("private_character");
    }

    const { JSDOM } = require('jsdom');
    const dom = new JSDOM(resp.data);
    const $ = (require('jquery'))(dom.window);

    // 아케인심볼 분석
    let majorArcane = 0;
    const arcaneURLs = [];
    $(".tab03_con_wrap .arcane_weapon_wrap .item_pot li span a").each(async function() {
      if (!!$(this).attr("href"))
        arcaneURLs.push("https://maplestory.nexon.com" + $(this).attr("href"));
    });

    for (let i = 0; i < arcaneURLs.length; i++) {
      const equipmentResp = await axios.get(arcaneURLs[i], {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const equipmentDom = new JSDOM(equipmentResp.data.view);
      const $equipment = (require('jquery'))(equipmentDom.window);

      majorArcane += parseInt($equipment(".stet_info ul li:eq(2) .point_td font:eq(0)").text().substring(1));
    }

    // 장비 분석
    const jobModel = require('../model/job');

    let damagePercent = 0;
    let majorPercent = 0;
    let attackPowerPercent = 0;
    let weapon = undefined;
    const equipmentURLs = [];
    $(".tab01_con_wrap .weapon_wrap .item_pot li span a").each(async function() {
      equipmentURLs.push("https://maplestory.nexon.com" + $(this).attr("href"));
    });

    for (let i = 0; i < equipmentURLs.length; i++) {
      const equipmentResp = await axios.get(equipmentURLs[i], {
        headers: {
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      const equipmentDom = new JSDOM(equipmentResp.data.view);
      const $equipment = (require('jquery'))(equipmentDom.window);

      const equipmentType = $equipment(".item_ability .ablilty02:eq(1) .job_name em").text();
      if (equipmentType.indexOf("손무기") >= 0 && equipmentType.indexOf("블레이드") < 0 && equipmentType.indexOf("대검") < 0) {
        weapon = equipmentType.split(" (")[0];
      }

      $equipment(".stet_info ul li").each(function() {
        const regexMajor1 = new RegExp(`${jobModel[job].major} : \\+(\\d+)%`);
        const regexMajor2 = new RegExp(`올스탯 : \\+(\\d+)%`);
        const regexAttackPower = (jobModel[job].major == "INT") ?
          new RegExp(`마력 : \\+(\\d+)%`) :
          new RegExp(`공격력 : \\+(\\d+)%`);
        const regexDamage = new RegExp(`^데미지 : \\+(\\d+)%`);

        if ($(this).find(".stet_th span").text() == "올스탯") {
          majorPercent += parseInt($(this).find(".point_td font:eq(0)").text().substring(1));
        } else if ($(this).find(".stet_th span").text().indexOf("잠재옵션") >= 0) {
          const values = $(this).find(".point_td").html().split("<br>");
          for (let j = 0; j < values.length; j++) {
            const value = values[j].trim();
            let regexResult;

            if (regexResult = (regexMajor1.exec(value) || regexMajor2.exec(value))) {
              majorPercent += parseInt(regexResult[1]);
            } else if (regexResult = regexAttackPower.exec(value)) {
              attackPowerPercent += parseInt(regexResult[1]);
            } else if (regexResult = regexDamage.exec(value)) {
              damagePercent += parseInt(regexResult[1]);
            }
          }
        }
      })
    }

    return {
      majorArcane: majorArcane,
      majorPercent: majorPercent,
      attackPowerPercent: attackPowerPercent,
      damagePercent: damagePercent,
      weapon: weapon
    };
  } catch (error) {
    console.log(error);
    return false;
  }
}

const analyzeStats = function(characterInfo, analysisEquipment) {
  const jobModel = require('../model/job');
  const job = jobModel[characterInfo.character.job];
  const jobDefault = jobModel.default;
  const weaponConst = require('../model/weapon')[analysisEquipment.weapon] || 1;
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
        jobDefault.stats.passive.damage.all,
      boss: characterInfo.stats.bossAttackDamage
    },
    finalDamage: job.stats.passive.finalDamage,
    criticalDamage: characterInfo.stats.criticalDamage,
    attackPower: {
      pure: 0,
      percent: analysisEquipment.attackPowerPercent +
        job.stats.passive.attackPower.percent
    },
    ignoreGuard: characterInfo.stats.ignoreGuard
  };

  stats.major.added = characterInfo.stats.majorHyper +
    analysisEquipment.majorArcane;
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
    (1.2 + stats.criticalDamage / 100) *
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
    const characterCode = await crwalCharacterCode(req.query.nickname);

    if (!characterCode) {
      res.status(404).send();
      return;
    }

    const characterInfo = await getCharacterInfo(nickname, characterCode);
    if (!characterInfo) {
      res.status(403).send();
      return;
    }

    const analysisEquipment = await analyzeEquipment(nickname, characterCode, characterInfo.character.job);
    if (!analysisEquipment) {
      res.status(403).send();
      return;
    }

    const stats = analyzeStats(characterInfo, analysisEquipment);
    const buffStats = getBuffStats(stats, characterInfo.character.job);
    const efficiency = calculateEfficiency(stats, characterInfo.character.job, analysisEquipment.weapon);
    const buffEfficiency = calculateEfficiency(buffStats, characterInfo.character.job, analysisEquipment.weapon);

    res.send({
      default: {
        stats: stats,
        efficiency: efficiency
      },
      buff: {
        stats: buffStats,
        efficiency: buffEfficiency
      }
    });
  }
};