<script lang="ts">
	import { Spinner } from "sveltestrap";
</script>


<div class="processing-screen">
  <Spinner color="dark" type="grow"/>
  <span class="process-message">Processing...</span>
</div>


<style>
  .processing-screen {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: white;
    top: 0px;
    left: 0px;
    opacity: .65;
  }

  .process-message {
    position: relative;
    left: 7px;
    margin-top: 20px;
  }
</style>