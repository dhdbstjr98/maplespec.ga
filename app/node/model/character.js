axios = require('axios');

const crwalCharacterCode = async function(nickname, isReboot = false) {
  try {
    const resp = await axios.get("https://maplestory.nexon.com/Ranking/World/Total?c=" + encodeURI(nickname) + "&w=" + (isReboot ? "0" : "254"));

    const regex = new RegExp(`<dt><a href=\\"\\/Common\\/Character\\/Detail\\/[^\\?]+?\\?p=(.+?)\\"\\s+target=.+?\\/>${nickname}<\\/a><\\/dt>`);
    const regexResult = regex.exec(resp.data);

    if (!regexResult) {
      if (isReboot)
        return -2;
      else
        return await crwalCharacterCode(nickname, true);
    }

    return regexResult[1];
  } catch (error) {
    console.log(error);
    return -1;
  }
};

const getCharacterInfo = async function(nickname, characterCode) {
  try {
    const resp = await axios.get("https://maplestory.nexon.com/Common/Character/Detail/" + encodeURI(nickname) + "?p=" + characterCode);

    if (resp.data.indexOf("공개하지 않은 정보입니다.") >= 0) {
      throw new Error("private_character");
    }

    if (resp.data.indexOf("메이플스토리 게임 점검 중에는 이용하실 수 없습니다.") >= 0) {
      throw new Error("game_checking");
    }

    const character = {
      nickname: nickname,
      characterCode: characterCode,
      job: null,
      level: null,
      avatar: null,
      server: {
        icon: null,
        name: null
      },
      majorName: null,
      attackPowerName: null
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

    const jobModel = require('./job');
    const statModel = require('./stat');

    character.job = $(".tab01_con_wrap .table_style01:eq(0) tbody tr:eq(0) td:eq(1) span").text();
    character.level = parseInt($(".char_info dl:eq(0) dd").text().substring(3));
    character.avatar = $(".char_img img").attr("src");
    character.server = {
      name: $(".char_info dl:eq(2) dd").text(),
      icon: $(".char_info dl:eq(2) dd img").attr("src")
    };
    character.majorName = jobModel[character.job].major;
    character.attackPowerName = character.majorName == "INT" ? "마력" : "공격력";

    const $statInfo = $(".tab01_con_wrap .table_style01:eq(1)");
    $("tbody tr", $statInfo).each(function() {
      if ($("th", this).length == 1) {
        if ($("th span", this).text() == "하이퍼스탯") {
          const values = $("td span", this).html().split("<br>");

          const regexMajor = new RegExp(`${statModel[character.majorName].korean} (\\d+) 증가`);
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
            case character.majorName:
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
    if (error.message == "private_character")
      return -1;
    else if (error.message == "game_checking")
      return -2;
    else
      return -999;
  }
}

const analyzeEquipment = async function(nickname, characterCode, job) {
  try {
    const resp = await axios.get("https://maplestory.nexon.com/Common/Character/Detail/" + encodeURI(nickname) + "/Equipment?p=" + characterCode);

    if (resp.data.indexOf("공개하지 않은 정보입니다.") >= 0) {
      throw new Error("private_character");
    }

    if (resp.data.indexOf("메이플스토리 게임 점검 중에는 이용하실 수 없습니다.") >= 0) {
      throw new Error("game_checking");
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
    const jobModel = require('./job');

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
    if (error.message == "private_character")
      return -1;
    else if (error.message == "game_checking")
      return -2;
    else
      return -999;
  }
}

module.exports = {
  crwalCharacterCode: crwalCharacterCode,
  getCharacterInfo: getCharacterInfo,
  analyzeEquipment: analyzeEquipment,
}