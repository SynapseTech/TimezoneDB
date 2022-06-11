<script setup lang='ts'>
import Page from '../../components/Page.vue';
import pdbLicense from '../../assets/pdbLicense.txt?raw';
</script>

<template>
  <Page>
    <div class='container bg-white flex-grow p-4 mx-auto lg:max-w-[45vw] text-center'>
      <h1 class='pageHeading'>Attribution</h1>
      <p class='mb-4'>
        This project would not have happened had it not been for inspiration from
        <a href='https://pronoundb.org' target='_blank'>PronounDB</a>. A lot of
        code from that project was found useful for this project and is licensed
        under the BSD 3-Clause license seen below:
      </p>

      <pre class='bg-gray-200 rounded leading-none p-2 overflow-x-auto'>{{ pdbLicense }}</pre>
    </div>
  </Page>
</template>

<style scoped lang='scss'>
@import '../../styles/text.scss';
</style>