<script>
  import {push} from 'svelte-spa-router';

  let character;

  function searchCharacter() {
    if(!character) {
      M.toast({html:"닉네임을 입력해주세요."});
      return false;
    }

    push('/character/' + character);
  }
</script>

<svelte:head>
  
</svelte:head>

<section>
  <article class="search-box row">
    <div class="col l4 m6 s12 offset-l4 offset-m3">
      <div class="card">
        <div class="card-stacked">
          <div class="card-content">
            <h4>내 캐릭터 분석하기</h4>
            <form class="search-form" on:submit={searchCharacter} onsubmit="return false;">
              <div class="input-field">
                <label>캐릭터명</label>
                <input type="text" bind:value={character}> 
                <button class="btn waves-effect waves-light red darken-1">확인</button>
              </div>
            </form>
          </div>
          <div class="card-action">
            <p class="teal-text text-lighten-2">
              메이플스토리 스펙 계산기를 이용하기 위해서는 캐릭터 정보 공개(기본정보, 장비, 스킬)가 필요합니다.
            </p>
            <p>
              <a href="https://maplestory.nexon.com/MyMaple/Account/Character/Visibility" target="_BLANK">공개설정하러 가기</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </article>
</section>

<style>
section { width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; }
.search-box { width:100%; }
h4 { font-size:20px; text-align:center; }
.input-field { padding-right:70px; }
.input-field button { position:absolute; right:0; top:7px; }
</style>