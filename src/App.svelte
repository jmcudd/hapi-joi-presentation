<script>
  import marked from 'marked';
  import slides from './slides';
  import hljs from 'highlight.js';
  import {onMount} from "svelte";

  marked.setOptions({
    highlight: function(code, lang, callback) {
      const results=hljs.highlight(lang, code)
      return results.value.toString();
    }
  });

  let currentSlide=Number(localStorage.getItem('currentSlide')) || 0;

  function previousSlide(){
    if(currentSlide-1>=0){
      currentSlide-=1;
      localStorage.setItem('currentSlide', currentSlide);
    }
  }
  function nextSlide(){
    if(currentSlide+1<slides.length){
      currentSlide+=1;
      localStorage.setItem('currentSlide', currentSlide);
    }
  }
  function handleArrows(e){
    console.log('e', e.key)

  }

  onMount(()=>{
    document.addEventListener("keyup", function(e){
      if(e.key==="ArrowRight"){
        nextSlide();
      }
      if(e.key==="ArrowLeft"){
        previousSlide();
      }
    });
  })

</script>

<style>
  .presentation {
    height:100vh;
    display:flex;
    flex-direction:column;
  }
  .slide {
    flex:1;
    margin: 30px;
  }
  .controls {
    text-align: right;
  }
  .footer {
    display:flex;
    justify-content:space-between;
    margin: 0 10px;
  }
  .slide-count {
    padding:5px;
  }


</style>
<svelte:head>
  <title>Hapi & Joi</title>
  <link rel="shortcut icon" type="image/ico" href="/favicon.ico"/>
</svelte:head>

<div class="presentation">
  <div class="slide">
    {@html marked(slides[currentSlide])}
  </div>
  <div class="footer">
    <div class="slide-count">
      {`Slide ${currentSlide+1} of ${slides.length}`}
    </div>
    <div class="controls">
      <button on:click={previousSlide}>Previous</button>
      <button on:click={nextSlide}>Next</button>
    </div>
  </div>
</div>
