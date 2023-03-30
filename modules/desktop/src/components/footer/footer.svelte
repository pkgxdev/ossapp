<script>
  import * as pub from '$env/static/public';
</script>
<footer class="w-full border-gray flex items-center justify-between border pr-2 border-x-0 border-b-0 overflow-clip"> 
  <figure class="text-center">
    <i class="icon-tea-logo-iconasset-1 text-black"/>
  </figure>
  <div class="text-gray text-xs">v{ pub.PUBLIC_VERSION }</div>
</footer>
<style>
	footer {
    height: 27px;
		background: rgba(26,26,26,0.9);
		backdrop-filter: blur(2px);
		box-sizing: border-box;
	}
  figure {
    width: 60px;
    height: 27px;
    background-image: url('/images/gradient-bg.png');
    background-size: cover;
    padding-top: 4px;
  }
</style>