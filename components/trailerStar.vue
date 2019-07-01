<template name="trailerStar">
	<view class="movie-score-wapper">
		<image 
		  v-if="yellowNum"
		  v-for="(item, index) in yellowNum" 
			:key="index + '11'"
			src="../static/icos/star-yellow.png" 
			class="star-icon">
		</image>
	  <image 
		  v-if="greyNum"
			v-for="(item, index) in greyNum" 
			:key="index"
			src="../static/icos/star-gray.png" 
			class="star-icon">
		</image>
		<view class="movie-score" v-if="isShowInnerScore">{{innerScore}}</view>
	</view>
</template>

<script>
	export default {
		name: "trailerStar",
		props: {
			innerScore: {
				type: Number,
				default: 0
			},
			isShowInnerScore: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				yellowNum: null,
				greyNum: null
			}
		},
		created () {
			if (this.innerScore !== null && this.innerScore !== undefined && this.innerScore !== '') {
				this.yellowNum = parseInt(this.innerScore / 2)
				this.greyNum = 5 - this.yellowNum 
			}
		}
	}
</script>

<style>
.movie-score-wapper{
	display: flex;
	flex-direction: row;
}
.star-icon{
	margin-top: 6upx;
	width: 20upx;
	height: 20upx;
}
.movie-score{
	margin-left: 8upx;
	font-size: 12px;
	color: grey;
}

</style>
