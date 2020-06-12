<script>
    import {LottiePlayer} from '@lottiefiles/svelte-lottie-player';
    
    export let count = 0;
</script>

<div id="loading" class:show={count > 0}> 
	<LottiePlayer
		src="https://assets5.lottiefiles.com/packages/lf20_kblbXu.json"  background="transparent"  speed="1"  width={300} height={300} controls={false} controlsLayout={null} loop autoplay>
	</LottiePlayer>
</div>

<style>
#loading { position:fixed; width:100%; height:100%; z-index:9999; background-color:rgba(0,0,0,0.3); align-items:center; justify-content:center; display:none; }
#loading.show { display:flex; }
</style>