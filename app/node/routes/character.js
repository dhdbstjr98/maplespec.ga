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
      'nickname': nickname,
      'characterCode': characterCode
    };
    const stats = {};

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
          const regex = new RegExp(`${statModel[jobModel[character.job].major].korean} (\\d+) 증가`);
          for (let i = 0; i < values.length; i++) {
            const regexResult = regex.exec(values[i]);

            if (!regexResult)
              continue;

            stats['majorHyper'] = parseInt(regexResult[1]);
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

      $equipment(".stet_info ul li").each(function() {
        const regexMajor1 = new RegExp(`${jobModel[job].major} : \\+(\\d)%`);
        const regexMajor2 = new RegExp(`올스탯 : \\+(\\d)%`);
        const regexAttackPower = (jobModel[job].major == "INT") ?
          new RegExp(`마력 : \\+(\\d)%`) :
          new RegExp(`공격력 : \\+(\\d)%`);
        const regexDamage = new RegExp(`데미지 : \\+(\\d)%`);

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
      damagePercent: damagePercent
    };
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
    console.log(analysisEquipment);

    res.send(characterInfo);
  }
};