<script setup lang="ts">
import { ref, watch } from 'vue'
import Button from 'primevue/button';
import ConfettiGenerator from "confetti-js";
import { onMounted } from 'vue';

const threshold = ref(30); // Threshold value for blow detection
const isBlowing = ref(false);
const isMicError = ref(false);
const step = ref(0);
const confetti = ref<any>(null);
const videoContainer = ref<HTMLVideoElement>();

watch(step, () => {
  if (step.value == 1) {
    setTimeout(() => step.value = 2, 2000)
  }
  if (step.value == 3) {
    setTimeout(() => step.value = 4, 1000)
    setTimeout(() => step.value = 5, 2000)
  }
  if (step.value == 8) {
    setTimeout(() => step.value = 9, 3000)
    setTimeout(() => {
      step.value = 10

    }, 6000)
  }
  if (step.value == 11) {
    setTimeout(() => step.value = 12, 2000)
  }
})

async function startListening() {
  try {
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    step.value = 1;
    console.log('to ', step.value)
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const analyzeMicInput = () => {
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      let sum = dataArray.reduce((a, b) => a + b, 0);
      let average = sum / dataArray.length;

      if (average > threshold.value && step.value == 5 && !isBlowing.value) {
        console.log('Blow detected');
        isBlowing.value = true;
        step.value = 6;
        confetti.value?.render();
        setTimeout(() => {
          step.value = 7
        }, 8000)
        setTimeout(() => {
          step.value = 8
        }, 16500)
        // Trigger any action here
      } else if (average <= threshold.value && isBlowing) {
        // isBlowing.value = false;
      }

      requestAnimationFrame(analyzeMicInput);
    };

    analyzeMicInput();
  } catch (err) {
    console.error('Error accessing the microphone:', err);
    isMicError.value = true;
    setTimeout(() => location.reload(), 3000)
  }
}

const handleNextStep = (isNext: boolean = true) => {
  if (isNext)
    step.value++
}

onMounted(() => {
  let confettiSettings = { "target": "confetti-holder", "max": "80", "size": "1", "animate": true, "props": ["circle", "square", "triangle", "line", { "type": "svg", "src": "site/hat.svg", "size": 25, "weight": 0.2 }], "colors": [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]], "clock": "25", "rotate": false, "width": "1536", "height": "695", "start_from_edge": false, "respawn": true };
  confetti.value = new ConfettiGenerator(confettiSettings);
})


</script>

<template>
  <main class="main-container">
    <div v-if="step <= 1" class="child-container">
      <h3 v-if="step == 0">Hape kamu perlu mengaktifkan mikrofon untuk memulai acara ini!</h3>
      <h3 v-if="step == 1">Oke mikrofonmu berhasil ditangkap!</h3>
      <p v-if="isMicError">Hmm... Sepertinya mikrofonnya masih belum aktif. Coba refresh atau tunggu 3 detik untuk
        refresh
        otomatis.</p>
      <Button v-if="step == 0" @click="startListening">Oke!</Button>
    </div>
    <Transition>
      <div v-if="step >= 2 && step <= 3" class="child-container">
        <h3>Sepertinya kita perlu menyalakan lampu ini</h3>
        <img :class="{ 'lamp': true, 'off': step == 2, 'on': step == 3 }" src="/assets/lamp.png"
          @click="handleNextStep(step != 3)" />
      </div>

    </Transition>
    <Transition>
      <div v-if="step >= 3 && step <= 4" class="flash">

      </div>
    </Transition>

    <div v-if="step >= 5" class="child-container living-container">
      <Transition>
        <div v-if="step >= 5 && step <= 6" class="cake-container">
          <img class="cake" src="/assets/cake.png">
          <img class="candle" src="/assets/candle.png">
          <img class="fire" :class="{ 'off': step == 6 }" src="/assets/fire.gif">
        </div>
      </Transition>
      <div>
        <h2 v-if="step == 5">Tiup Lilinnya agar pesta bisa dimulai!</h2>
        <audio v-if="step == 5" src="/assets/piano_hbd.ogg" autoplay></audio>
        <audio v-if="step >= 6" src="/assets/band_hbd.ogg" autoplay></audio>
        <h2 v-if="step == 8">Selamat Ulang Tahun Bapakku</h2>
        <h2 v-if="step == 9">Ada beberapa kata-kata dari saya.</h2>
        <Transition>
          <div v-if="step == 10" class="child-container">
            <video class="video-container" ref="videoContainer" src="/assets/ando.mp4" autoplay @ended="step++"></video>
          </div>
        </Transition>
        <Transition>
          <div v-if="step == 12" class="child-container">
            <img class="party" src="/assets/party.jpg">
            <h2>Terimakasih sudah melihat website ini!</h2>
          </div>
        </Transition>
        <!-- <h2 v-if="step == 5">Tiup Lilinnya agar pesta bisa dimulai!</h2> -->
      </div>
    </div>
    <img v-if="step >= 5" class="living-room" src="/assets/livingroom.jpg" />
    <canvas style="z-index: 100; position: fixed; width: 100vw; height: 100vh; top: 0; left: 0; pointer-events: none;"
      id="confetti-holder"></canvas>


  </main>
</template>

<style scoped>
.main-container {
  width: 100%;
}

.child-container.living-container {
  color: #fff;
  /* font-weight: 500; */
}

.party {
  width: 110%;
  border: 10px solid #46372e;
}

.video-container {
  width: 100%;
}


.cake-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 50%;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
}

.cake {
  width: 300px;
  position: absolute;
  /* top: 20%; */
  /* left: 12%; */
  height: auto;
}

.fire {
  transition: all 1s ease;
  width: 100px;
  position: absolute;
  top: -60px;
  /* left: 45%; */
  height: auto;
  opacity: 1;
}

.fire.off {
  opacity: 0;
}

.candle {
  position: absolute;
  top: 30px;
  /* left: 52%; */
  width: 25px;
}

.flash {
  position: fixed;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  z-index: 100;
  top: 0;
  left: 0;
}

.child-container {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1em;
  width: 100%;
  height: 100vh;
  z-index: 1;
}

.living-room {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  filter: brightness(0.6);
  object-fit: cover;
}

.lamp {
  width: 40%;
  height: auto;
  transition: all 0.3s ease-in-out;
}


.lamp.off {
  filter: grayscale(1) contrast(0.4) brightness(0.5);
}

.lamp.on {
  filter: none;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media (min-width: 1024px) {}
</style>
