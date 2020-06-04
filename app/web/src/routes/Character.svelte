<script>
  export let params = {};

  import {push} from 'svelte-spa-router';

  function init() {
    if(!params.character) {
      M.toast({html:"캐릭터명을 입력해주세요."});
      push("/");
    }
  }

  init();
</script>

<svelte:head>
  
</svelte:head>