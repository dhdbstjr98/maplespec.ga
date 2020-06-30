<script>
  export let params = {};

  import {push} from 'svelte-spa-router';
  import axios from 'axios';
  import Loading from  '../components/Loading.svelte';

  let callCount = 0;
  let isBuff = false;
  let isCharacterLoading = false;
  let stats;

  let character = {
    info:{
      avatar:'',
      nickname:'',
      characterCode:'',
      job:'',
      majorName:'',
      attackPowerName:'',
      server:{
        name:'',
        icon:''
      },
      level:237
    },
    analysis:{
      default:{
        stats:{
          major:{
            pure:0,
            percent:0,
            added:0,
          },
          minor:0,
          damage:{
            all:0,
            boss:0
          },
          finalDamage:0,
          criticalDamage:0,
          attackPower:{
            pure:0,
            percent:0,
          },
          ignoreGuard:0
        },
        efficiency:{
          major:{
            pure:1,
            percent:1
          },
          attackPower:{
            pure:1,
            percent:1
          },
          damage:1,
          criticalDamage:1,
          ignoreGuard:1
        }
      }
    },
    buff:{
      stats:{
        major:{
          pure:0,
          percent:0,
          added:0,
        },
        minor:0,
        damage:{
          all:0,
          boss:0
        },
        finalDamage:0,
        criticalDamage:0,
        attackPower:{
          pure:0,
          percent:0,
        },
        ignoreGuard:0
      },
      efficiency:{
        major:{
          pure:1,
          percent:1
        },
        attackPower:{
          pure:1,
          percent:1
        },
        damage:1,
        criticalDamage:1,
        ignoreGuard:1
      }
    }
  }

  function init() {
    let nickname;

    if(!params.character) {
      M.toast({html:"캐릭터명을 입력해주세요."});
      push("/");
    }

    nickname = decodeURI(params.character);

    callCount++;
    axios.get('/api/character', {
      params:{
        nickname:nickname
      }
    }).then(function(response) {
      character = response.data;
      if(character.analysis.default.stats.major.pure == null) {
        M.toast({html:"메이플스토리로부터 데이터를 받아오지 못했습니다.<br><br>잠시 후에 시도해주세요."});
        push('/');
      }
      isCharacterLoading = true;
    }).catch(function(error) {
      switch(error.response.status) {
        case 404:
          M.toast({html:"존재하지 않는 캐릭터입니다."});
          break;
        case 403:
          M.toast({html:"캐릭터 정보 공개설정이 필요합니다."});
          setTimeout(function() {
            window.open("https://maplestory.nexon.com/MyMaple/Account/Character/Visibility");
          }, 2000);
          break;
        case 502:
          M.toast({html:"메이플스토리로부터 데이터를 받아오지 못했습니다.<br><br>잠시 후에 시도해주세요."});
          break;
        case 503:
          M.toast({html:"메이플스토리가 점검중입니다."});
          break;
        default:
          M.toast({html:"서버와의 통신이 원활하지 않습니다.<br><br>잠시 후에 시도해주세요."});
          break;
      }
      push('/');
    }).finally(function() {
      callCount--;
    });
  }

  function showValue(value) {
    return parseFloat(value).toFixed(2);
  }

  function goBack() {
    push('/');
  }

  $:
    if(isCharacterLoading && isBuff) {
      stats = character.analysis.buff;
    } else {
      stats = character.analysis.default;
    }

  init();
</script>

<svelte:head>
  
</svelte:head>

<Loading count={callCount} />
<section>
  {#if isCharacterLoading}
  <article class="info-box">
    <div class="row">
      <div class="col s12 m10 l8 offset-m1 offset-l2">
        <div class="row">
          <div class="col s12 m4 l3">
            <div class="card character-card">
              <div class="card-stacked">
                <div class="card-content">
                  <div class="character-img">
                    <img src={character.info.avatar} class="responsive-img" alt="캐릭터">
                  </div>
                  <h6 class="pink-text text-accent-3">
                    <img src={character.info.server.icon} alt={character.info.server.name}>
                    {character.info.nickname}
                  </h6>
                  <div class="job grey-text text-darken-2">
                    {character.info.job}
                  </div>
                  <div class="level grey-text text-darken-2">
                    Lv.{character.info.level}
                  </div>
                </div>
              </div>
            </div>
            <div class="back-button-box">
              <button class="btn waves-light btn red accent-2" on:click={goBack}>
                <i class="material-icons">arrow_back</i>
                <span>뒤로가기</span>
              </button>
            </div>
          </div>
          <div class="col s12 m8 l9">
            <div class="card character-card">
              <div class="card-stacked">
                <div class="card-content">
                  <div class="buff-switch">
                    <div class="switch">
                      <label>
                        노버프
                        <input type="checkbox" bind:checked={isBuff}>
                        <span class="lever"></span>
                        버프(자벞,링크,노블,영메)
                      </label>
                    </div>
                  </div>
                  <table class="table-efficiency">
                    <thead>
                      <tr>
                        <th>스탯</th>
                        <th>효율</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th rowspan="2">{character.info.majorName} 1%</th>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.major.percent)}</td>
                        {/if}
                      </tr>
                      <tr>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.attackPowerName} {showValue(stats.efficiency.major.percent / stats.efficiency.attackPower.pure)}</td>
                        {/if}
                      </tr>
                      <tr>
                        <th>{character.info.attackPowerName} 1</th>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.attackPower.pure)}</td>
                        {/if}
                      </tr>
                      <tr>
                        <th rowspan="5">{character.info.attackPowerName} 1%</th>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.attackPower.percent)}</td>
                        {/if}
                      </tr>
                      <tr>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.attackPower.percent / stats.efficiency.major.percent)}%</td>
                        {/if}
                      </tr>
                      <tr>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.attackPowerName} {showValue(stats.efficiency.attackPower.percent / stats.efficiency.attackPower.pure)}</td>
                        {/if}
                      </tr>
                      <tr>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>데미지(보공) {showValue(stats.efficiency.attackPower.percent / stats.efficiency.damage)}%</td>
                        {/if}
                      </tr>
                      <tr>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>방무 {showValue(stats.efficiency.attackPower.percent / stats.efficiency.ignoreGuard)}%</td>
                        {/if}
                      </tr>
                      <tr>
                        <th rowspan="2">데미지(보공) 1%</th>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.damage)}</td>
                        {/if}
                      </tr>
                      <tr>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>방무 {showValue(stats.efficiency.damage / stats.efficiency.ignoreGuard)}%</td>
                        {/if}
                      </tr>
                      <tr>
                        <th rowspan="2">크뎀 1%</th>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.criticalDamage)}</td>
                        {/if}
                      </tr>
                      <tr>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.criticalDamage / stats.efficiency.major.percent)}%</td>
                        {/if}
                      </tr>
                      <tr>
                        <th>방무 1%</th>
                        {#if !stats.efficiency.major.percent}
                        <td>방무가 부족해 산출 불가</td>
                        {:else}
                        <td>{character.info.majorName} {showValue(stats.efficiency.ignoreGuard)}</td>
                        {/if}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
  {/if}
</section>

<style>
section { width:100%; height:100%; display:flex; flex-direction:column; padding:20px 0; }
.info-box { margin:auto 0; }
.info-box > .row > .col > .row > .col { margin-bottom:.5rem; }
.character-card .card-content { text-align:center; }
.character-card .card-content .job { font-size:0.8em }
.character-card .card-content .level { font-size:0.8em }
.character-card .card-content h6 img { width:14px; height:14px; }
.character-card .card-content h6 { font-weight:bold; }
.table-efficiency td, .table-efficiency th { text-align:left; }
.back-button-box button { width:100%; display:block; height:48px; line-height:48px; }
.back-button-box button i.material-icons { vertical-align:middle; }
.back-button-box button span { vertical-align:middle; }
.buff-switch .switch label input[type=checkbox]:checked+.lever:after { background-color:#e57373; }
.buff-switch .switch label input[type=checkbox]:not(:checked)+.lever { background-color:#ffcdd2; }
.buff-switch .switch label input[type=checkbox]:checked+.lever { background-color:#ef9a9a ; }
</style>