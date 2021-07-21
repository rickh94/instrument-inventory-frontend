<template>
  <div id="interactive" class="viewport">
    <video />
    <canvas class="drawingBuffer" id="scan-location"></canvas>
  </div>
</template>

<script>
import Quagga from "@ericblade/quagga2";

export default {
  name: "VQuaggaWrapper",
  props: {
    onDetected: {
      type: Function,
      default(result) {
        console.log("detected", result);
      },
    },
    onProcessed: {
      type: Function,
      default(result) {
        if (result) {
          let drawingCtx = Quagga.canvas.ctx.overlay;
          let drawingCanvas = Quagga.canvas.dom.overlay;

          if (result.boxes) {
            drawingCtx.clearRect(
              0,
              0,
              parseInt(drawingCanvas.getAttribute("width")),
              parseInt(drawingCanvas.getAttribute("height")),
            );
            result.boxes
              .filter(function(box) {
                return box !== result.box;
              })
              .forEach(function(box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                  color: "red",
                  lineWidth: 2,
                });
              });
          }
          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
              color: "#00F",
              lineWidth: 2,
            });
          }
          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(
              result.line,
              { x: "x", y: "y" },
              drawingCtx,
              { color: "red", lineWidth: 3 },
            );
          }
        }
      },
    },
    readerTypes: {
      type: Array,
      default: () => ["code_128_reader"],
    },
  },
  data() {
    return {
      quaggaState: {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#interactive.viewport"),
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: "environment",
          },
        },
        decoder: {
          readers: this.readerTypes,
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        locate: true,
        multiple: false,
        frequency: 100,
      },
    };
  },
  watch: {
    onDetected(oldValue, newValue) {
      if (oldValue) Quagga.offDetected(oldValue);
      if (newValue) Quagga.onDetected(newValue);
    },
    onProcessed(oldValue, newValue) {
      if (oldValue) Quagga.offProcessed(oldValue);
      if (newValue) Quagga.onProcessed(newValue);
    },
  },
  mounted() {
    Quagga.init(this.quaggaState, function(err) {
      if (err) {
        console.error(err);
      }
      Quagga.start();
    });
    Quagga.onDetected(this.onDetected);
    Quagga.onProcessed(this.onProcessed);
  },
  destroyed() {
    if (this.onDetected) Quagga.offDetected(this.onDetected);
    if (this.onProcessed) Quagga.offProcessed(this.onProcessed);

    Quagga.stop();
  },
};
</script>

<style scoped>
.viewport {
  position: relative
}

.viewport canvas,
.viewport video {
  position: absolute;
  left: 0;
  top: 0;
}

.wrapper {
  position: relative
}

</style>
