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

    res.send(characterInfo);
  }
};