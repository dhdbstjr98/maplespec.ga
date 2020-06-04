<script>
  export let params = {};

  import {push} from 'svelte-spa-router';
  import axios from 'axios';

  let character = {};

  function init() {
    let nickname;

    if(!params.character) {
      M.toast({html:"캐릭터명을 입력해주세요."});
      push("/");
    }

    nickname = decodeURI(params.character);

    axios.get('/api/character', {
      params:{
        nickname:nickname
      }
    }).then(function(response) {
      console.log(response);
    }).catch(function(error) {
      console.log(error);
    });
  }

  init();
</script>

<svelte:head>
  
</svelte:head>