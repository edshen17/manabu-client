<template>
	<cropper
                class="cropper"
                stencil-component="circle-stencil"
                minWidth="40"
                maxWidth="100"
                :stencil-props="{
                  handlers: {},
                  movable: false,
                  scalable: false,
                  aspectRatio: 1,
                }"
                image-restriction="stencil"
                :src="img"
                @change="change"
              />
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

export default {
	components: {
		Cropper,
	},
	data() {
		return {
			img: 'https://images.pexels.com/photos/4323307/pexels-photo-4323307.jpeg',
		};
	},
	methods: {
		change({ coordinates, canvas }) {
			console.log(coordinates, canvas);
		},
	},
};
</script>

<style lang="css">
.cropper {
  height: 500px;
	background: #DDD;
}
</style>
