<template>
  <div>
    <cropper
      ref="cropper"
      class="twitter-cropper"
      background-class="twitter-cropper__background"
      foreground-class="twitter-cropper__foreground"
      image-restriction="stencil"
      :stencil-size="stencilSize"
      :stencil-props="{
        lines: {},
        handlers: {},
        movable: false,
        scalable: false,
        aspectRatio: 1,
        previewClass: 'twitter-cropper__stencil',
      }"
      :transitions="false"
      :debounce="false"
      :default-size="defaultSize"
      :min-width="150"
      :min-height="150"
      :src="src"
      @change="onChange"
    />
    <cropper-zoom :zoom="zoom" @change="onZoom" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { StringKeyObject } from '../../../../server/types/custom';
import CropperZoom from './CropperZoom.vue';

export default Vue.extend({
  name: 'ExtendedCropper',
  components: { Cropper, CropperZoom },
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      zoom: 0,
    };
  },
  computed: {},
  mounted() {
    return;
  },
  methods: {
    defaultSize({ imageSize }: { imageSize: { height: number; width: number } }) {
      return {
        width: Math.min(imageSize.height, imageSize.width),
        height: Math.min(imageSize.height, imageSize.width),
      };
    },
    stencilSize({ boundaries }: { boundaries: { height: number; width: number } }) {
      return {
        width: Math.min(boundaries.height, boundaries.width) - 48,
        height: Math.min(boundaries.height, boundaries.width) - 48,
      };
    },
    onChange(result: StringKeyObject): void {
      const cropper = (this as any).$refs.cropper;
      if (cropper) {
        const { coordinates, imageSize } = cropper;
        if (imageSize.width / imageSize.height > coordinates.width / coordinates.height) {
          this.zoom =
            (cropper.imageSize.height - cropper.coordinates.height) /
            (cropper.imageSize.height - cropper.sizeRestrictions.minHeight);
        } else {
          this.zoom =
            (cropper.imageSize.width - cropper.coordinates.width) /
            (cropper.imageSize.width - cropper.sizeRestrictions.minWidth);
        }
      }
      this.$emit('change', result);
    },
    onZoom(value: number) {
      const cropper = (this as any).$refs.cropper;
      if (cropper) {
        if (cropper.imageSize.height < cropper.imageSize.width) {
          const minHeight = cropper.sizeRestrictions.minHeight;
          const imageHeight = cropper.imageSize.height;
          cropper.zoom(
            (imageHeight - this.zoom * (imageHeight - minHeight)) /
              (imageHeight - value * (imageHeight - minHeight))
          );
        } else {
          const minWidth = cropper.sizeRestrictions.minWidth;
          const imageWidth = cropper.imageSize.width;
          cropper.zoom(
            (imageWidth - this.zoom * (imageWidth - minWidth)) /
              (imageWidth - value * (imageWidth - minWidth))
          );
        }
      }
    },
  },
});
</script>

<style lang="scss">
.twitter-cropper {
  height: 521px;
  &__background {
    background-color: #edf2f4;
  }
  &__foreground {
    background-color: #edf2f4;
  }
  &__stencil {
    border: solid 5px #364f6b;
  }
}
</style>
