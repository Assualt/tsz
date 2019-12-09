<template>
		<div>
				<TSZHeader :universities="universities"></TSZHeader>
				<TSZIndexBody></TSZIndexBody>
				<TSZFooter></TSZFooter>
				<TSZOverlay></TSZOverlay>
		</div>
</template>

<script>
//Common
import TSZHeader from '../BodyComponents/Header'
import TSZFooter from '../BodyComponents/Footer'
import TSZOverlay from '../components/Overlay'

//body
import TSZIndexBody from '../BodyComponents/IndexBody'

export default {
  name: 'Index',
  components: {TSZHeader, TSZFooter,TSZOverlay,TSZIndexBody},
	props:['universities'],

}
</script>

<style scoped>

</style>
