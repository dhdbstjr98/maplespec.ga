module.exports = {
  default: {
    jobConst: 1,
    stats: {
      passive: { // 데몬슬레이어, 키네시스 링크는 스탯창에 반영되었으므로 제외
        major: {
          percent: 5 // 제논
        },
        damage: {
          all: 10 // 데몬어벤져
        }
      },
      active: {
        attackPower: {
          pure: 115, // 시그너스, 전설의영웅비약, 길드의더큰축복, 익스트림
          percent: 4 // 영웅의메아리
        },
        damage: {
          all: 137, // 아크, 일리움, 모험가마법사, 모험가도적, 카데나, 엔젤릭버스터, 길드노블레스
          boss: 42 // 고급보스킬러의비약, 길드노블레스
        },
        ignoreGuard: 9, // 모험가마법사
        criticalDamage: 30 // 길드노블레스
      }
    }
  },
  '전사/히어로': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1.0746,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 10
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 50,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 20
        },
        ignoreGuard: 15,
        criticalDamage: 28
      }
    }
  },
  '전사/팔라딘': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 72
      },
      active: {
        major: {
          pure: 0,
          percent: 16
        },
        attackPower: {
          pure: 100,
          percent: 0
        },
        damage: {
          all: 35,
          boss: 0
        },
        ignoreGuard: 57.5,
        criticalDamage: 8
      }
    }
  },
  '전사/다크나이트': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 5
        },
        finalDamage: 95
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 70,
          percent: 0
        },
        damage: {
          all: 0,
          boss: 10
        },
        ignoreGuard: 10,
        criticalDamage: 8
      }
    }
  },
  '마법사/비숍': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1.2,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 40 // 벤전스 오브 엔젤 off
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 80,
          percent: 0
        },
        damage: {
          all: 10, // 벤전스 오브 엔젤 on -40
          boss: 10
        },
        ignoreGuard: 64,
        criticalDamage: 8
      }
    }
  },
  '마법사/아크메이지(불,독)': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1.2,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 50
        },
        finalDamage: 40
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 30,
          percent: 0
        },
        damage: {
          all: 50,
          boss: 0
        },
        ignoreGuard: 20,
        criticalDamage: 8
      }
    }
  },
  '마법사/아크메이지(썬,콜)': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1.2,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 50
        },
        finalDamage: 50
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 30,
          percent: 0
        },
        damage: {
          all: 50,
          boss: 0
        },
        ignoreGuard: 32, // 프로즌 브레이크 무시
        criticalDamage: 8
      }
    }
  },
  '궁수/신궁': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 15
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 40,
          percent: 15
        },
        attackPower: {
          pure: 30,
          percent: 0
        },
        damage: {
          all: 30,
          boss: 0
        },
        ignoreGuard: 60,
        criticalDamage: 25
      }
    }
  },
  '궁수/보우마스터': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 25
        },
        damage: {
          all: 0
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 80,
          percent: 15
        },
        attackPower: {
          pure: 120,
          percent: 20
        },
        damage: {
          all: 40,
          boss: 20
        },
        ignoreGuard: 0,
        criticalDamage: 15
      }
    }
  },
  '궁수/패스파인더': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 20
        },
        damage: {
          all: 10
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 0,
          boss: 0
        },
        ignoreGuard: 0,
        criticalDamage: 15
      }
    }
  },
  '도적/섀도어': {
    major: 'LUK',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 25
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 70,
          percent: 0
        },
        damage: {
          all: 35,
          boss: 0
        },
        ignoreGuard: 0,
        criticalDamage: 28
      }
    }
  },
  '도적/나이트로드': {
    major: 'LUK',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 25
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 60,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 0
        },
        ignoreGuard: 30,
        criticalDamage: 8
      }
    }
  },
  '도적/듀얼블레이더': {
    major: 'LUK',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 20
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 20,
          boss: 0
        },
        ignoreGuard: 0,
        criticalDamage: 8
      }
    }
  },
  '해적/바이퍼': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15 // 파이렛 플래그 무시
        },
        attackPower: {
          pure: 50,
          percent: 30 // 오버드라이브 무시
        },
        damage: {
          all: 50,
          boss: 0
        },
        ignoreGuard: 55, // 가드 크러쉬 40 적용
        criticalDamage: 48
      }
    }
  },
  '해적/캡틴': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 20
      },
      active: {
        major: {
          pure: 0,
          percent: 15 // 파이렛 플래그 무시
        },
        attackPower: {
          pure: 45,
          percent: 20 // 오버드라이브 무시
        },
        damage: {
          all: 45,
          boss: 0
        },
        ignoreGuard: 25,
        criticalDamage: 13
      }
    }
  },
  '해적/캐논마스터': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 43
      },
      active: {
        major: {
          pure: 60,
          percent: 15 // 파이렛 플래그 무시
        },
        attackPower: {
          pure: 0,
          percent: 0 // 오버드라이브 무시
        },
        damage: {
          all: 70,
          boss: 0
        },
        ignoreGuard: 25,
        criticalDamage: 18
      }
    }
  },
  '기사단/미하일': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 60
        },
        finalDamage: 26
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 75,
          percent: 0
        },
        damage: {
          all: 30,
          boss: 0
        },
        ignoreGuard: 15,
        criticalDamage: 16
      }
    }
  },
  '기사단/소울마스터': {
    major: 'STR',

    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 0
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 50,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 0
        },
        ignoreGuard: 32,
        criticalDamage: 8
      }
    }
  },
  '기사단/플레임위자드': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1.2,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 0
        },
        finalDamage: 95
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 60,
          percent: 0
        },
        damage: {
          all: 70,
          boss: 0
        },
        ignoreGuard: 30,
        criticalDamage: 8
      }
    }
  },
  '기사단/윈드브레이커': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 15
        },
        attackPower: {
          percent: 20
        },
        damage: {
          all: 0
        },
        finalDamage: 25
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 85,
          percent: 0
        },
        damage: {
          all: 45,
          boss: 0
        },
        ignoreGuard: 15,
        criticalDamage: 15
      }
    }
  },
  '기사단/나이트워커': {
    major: 'LUK',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 30
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 0
        },
        ignoreGuard: 35,
        criticalDamage: 8
      }
    }
  },
  '기사단/스트라이커': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 5
        },
        finalDamage: 20
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0 // 오버드라이브 무시
        },
        damage: {
          all: 65,
          boss: 0
        },
        ignoreGuard: 45,
        criticalDamage: 8
      }
    }
  },
  '아란/아란': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 5
        },
        damage: {
          all: 20
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 70,
          percent: 35
        },
        damage: {
          all: 40,
          boss: 0
        },
        ignoreGuard: 15,
        criticalDamage: 8
      }
    }
  },
  '에반/에반': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 35
        },
        damage: {
          all: 0
        },
        finalDamage: 50
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 80,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 0
        },
        ignoreGuard: 0,
        criticalDamage: 8
      }
    }
  },
  '루미너스/루미너스': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 82
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 70,
          percent: 0
        },
        damage: {
          all: 40,
          boss: 0
        },
        ignoreGuard: 0,
        criticalDamage: 8
      }
    }
  },
  '메르세데스/메르세데스': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 50
        },
        finalDamage: 38
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 80,
          percent: 30
        },
        damage: {
          all: 40,
          boss: 0
        },
        ignoreGuard: 50,
        criticalDamage: 8
      }
    }
  },
  '팬텀/팬텀': {
    major: 'LUK',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 63
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 30, // 분노
          percent: 0
        },
        damage: {
          all: 40,
          boss: 0
        },
        ignoreGuard: 44,
        criticalDamage: 8
      }
    }
  },
  '은월/은월': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 20
        },
        finalDamage: 26
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0 // 오버드라이브 무시
        },
        damage: {
          all: 65,
          boss: 20
        },
        ignoreGuard: 20,
        criticalDamage: 8
      }
    }
  },
  '레지스탕스/블래스터': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 15
        },
        damage: {
          all: 20
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 0
        },
        ignoreGuard: 15,
        criticalDamage: 8
      }
    }
  },
  '레지스탕스/데몬슬레이어': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 25
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 45,
          boss: 0
        },
        ignoreGuard: 27,
        criticalDamage: 8
      }
    }
  },
  '레지스탕스/배틀메이지': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 40
        },
        damage: {
          all: 10
        },
        finalDamage: 15
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 60,
          percent: 0
        },
        damage: {
          all: 50,
          boss: 0
        },
        ignoreGuard: 20,
        criticalDamage: 16
      }
    }
  },
  '레지스탕스/와일드헌터': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 10
        },
        finalDamage: 20
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 35,
          percent: 20
        },
        damage: {
          all: 10,
          boss: 10
        },
        ignoreGuard: 0,
        criticalDamage: 23
      }
    }
  },
  '레지스탕스/메카닉': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 10
        },
        finalDamage: 20
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 55,
          percent: 0 // 오버드라이브 무시
        },
        damage: {
          all: 60,
          boss: 0
        },
        ignoreGuard: 10,
        criticalDamage: 8
      }
    }
  },
  '카이저/카이저': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 30
        },
        damage: {
          all: 0
        },
        finalDamage: 20
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 95,
          percent: 0
        },
        damage: {
          all: 9,
          boss: 0
        },
        ignoreGuard: 15,
        criticalDamage: 8
      }
    }
  },
  '카데나/카데나': {
    major: 'LUK',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 0
        },
        ignoreGuard: 30,
        criticalDamage: 58
      }
    }
  },
  '엔젤릭버스터/엔젤릭버스터': {
    major: 'DEX',
    minor: 'STR',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 20
        },
        finalDamage: 0
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 50,
          percent: 0
        },
        damage: {
          all: 85, // 소울 컨트랙트 추가치, 어피니티4 1스택
          boss: 20
        },
        ignoreGuard: 30,
        criticalDamage: 53
      }
    }
  },
  '아크/아크': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 32
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 90,
          percent: 0 // 오버드라이브 제외
        },
        damage: {
          all: 70,
          boss: 60
        },
        ignoreGuard: 36,
        criticalDamage: 8
      }
    }
  },
  '일리움/일리움': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 20
        },
        finalDamage: 35
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 46,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 60
        },
        ignoreGuard: 20,
        criticalDamage: 8
      }
    }
  },
  '아델/아델': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 50
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 105,
          boss: 0
        },
        ignoreGuard: 35,
        criticalDamage: 8
      }
    }
  },
  '제로/제로': {
    major: 'STR',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 0
        },
        damage: {
          all: 0
        },
        finalDamage: 25
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 45,
          boss: 0
        },
        ignoreGuard: 50,
        criticalDamage: 8
      }
    }
  },
  '키네시스/키네시스': {
    major: 'INT',
    minor: 'LUK',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 40
        },
        finalDamage: 25
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 10,
          boss: 0
        },
        ignoreGuard: 20,
        criticalDamage: 28
      }
    }
  },
  '호영/호영': {
    major: 'LUK',
    minor: 'DEX',
    jobConst: 1,
    stats: {
      passive: {
        major: {
          percent: 0
        },
        attackPower: {
          percent: 10
        },
        damage: {
          all: 10
        },
        finalDamage: 63
      },
      active: {
        major: {
          pure: 0,
          percent: 15
        },
        attackPower: {
          pure: 0,
          percent: 0
        },
        damage: {
          all: 70,
          boss: 0
        },
        ignoreGuard: 20,
        criticalDamage: 8
      }
    }
  },
}