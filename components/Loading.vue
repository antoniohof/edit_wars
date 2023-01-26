<template>
  <div class="lds-ring_container">
    <div class="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
    <p class="label">{{label}}</p>
  </div>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    label: {
      type: String,
      default: () => 'loading'
    }
  }
}
</script>

<style scoped>
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  transform: scale(0.5, 0.5);
}

.lds-ring_container {
  text-align: center;
}

.label {
  color: black;
  font-size: 13px;
  font-family: Space Mono;
  text-align: center;
  font-weight: 400;
  font-size: 18px;
  text-transform: uppercase;
}

.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #000000;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #000000 transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>