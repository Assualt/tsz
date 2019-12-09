<template>
		<div class="alert alert-dismissible toolTip" :class="[toolTipData.display? 'display_show' : 'display_hide', toolTipData.class]" role="alert">
				<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<strong>{{toolTipData.strongtext}}</strong>{{toolTipData.text}}
		</div>
</template>

<script>
  export default {
    name: 'ToolTip',
	  data(){
      return{}
	  },
	  props:[
	    'toolTipData'
	  ]
  }
</script>

<style scoped>
		.toolTip{
				position:absolute;
				right:10px;
				top:10px;
				width:450px;
				height:50px;
		}
</style>
