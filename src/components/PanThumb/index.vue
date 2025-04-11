<template>
  <div :style="{ zIndex: zIndex, height: height, width: width }" class="pan-item">
    <div class="pan-info">
      <div class="pan-info-roles-container">
        <slot />
      </div>
    </div>

    <div :style="{ backgroundImage: `url(${image})` }" class="pan-thumb" />
  </div>
</template>

<script>
export default {
  name: 'PanThumb',
  props: {
    image: {
      type: String,
      required: true
    },
    zIndex: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: '150px'
    }
  }
}
</script>

<style lang="scss" scoped>
.pan-item {
  position: relative;
  display: inline-block;
  width: 200px;
  height: 200px;
  cursor: default;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgb(0 0 0 / 20%);

  .pan-info {
    position: absolute;
    width: inherit;
    height: inherit;
    overflow: hidden;
    border-radius: 50%;
    box-shadow: inset 0 0 0 5px rgb(0 0 0 / 5%);

    .pan-info-roles-container {
      padding: 20px;
      text-align: center;
    }
  }

  .pan-thumb {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-position: center center;
    background-size: cover;
    border-radius: 50%;
    transition: all .3s ease-in-out;
    transform-origin: 95% 40%;
  }

  &:hover {
    .pan-thumb {
      transform: rotate(-110deg);
    }
  }
}
</style>
