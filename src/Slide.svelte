<style>
  .slide {
    height:100%;
    width:100%;
  }
</style>
<script>
  export let title="Blank Slide"
</script>
<div class="slide">
  <h1>{title}</h1>
 <slot>
  Blank Slide Body
  </slot>
</div>
