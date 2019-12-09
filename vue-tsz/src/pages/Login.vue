<template>
	<div id="login">
			<TSZHeader :universities="universities"></TSZHeader>
			<TSZLoginBody :universities="universities" :allcities="allcities"></TSZLoginBody>
			<TSZFooter></TSZFooter>
			<TSZOverlay></TSZOverlay>
	</div>
</template>

<script>
import TSZHeader from '../BodyComponents/Header'
import TSZFooter from '../BodyComponents/Footer'
import TSZOverlay from '../components/Overlay'
import TSZLoginBody from '../BodyComponents/LoginBody'
export default {
  name: 'Login',
	components:{
    TSZHeader,TSZFooter,TSZOverlay,TSZLoginBody
	},
	props:[
	  'universities','allcities'
	],
}
</script>

<style scoped>

</style>
