<template>
	<view class="black">
		<image 
		  class="img"
			:src="cover" 
			mode="widthFix"
			@longpress="handleOperate"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cover: ''
			}
		},
		onLoad (params) {
			// 通过api设置导航栏的 属性
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000000"
			});
			
			let cover = params.cover
			this.cover = cover
		},
		methods: {
			// 弹出底菜单
			handleOperate () {
				uni.showActionSheet({
					itemList: ['保存图片'],
					success: (res) => {
						console.log(res.tapIndex)
						if (res.tapIndex === 0) {
							uni.showLoading({
								title: "图片保存中..."
							})
							uni.downloadFile({ // 下载
								url: this.cover,
								success: (res) => {
									let tempFilePath = res.tempFilePath
									// 保存
									uni.saveImageToPhotosAlbum({
										filePath: tempFilePath,
										success: () => {
											uni.showToast({
												title: "保存成功",
												duration: 2000
											})
										},
										complete: () => {
											uni.hideLoading()
										}
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
@import url("./cover.css");
</style>
