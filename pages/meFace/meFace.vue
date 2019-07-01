<template>
	<view class="page page-fill">
		
		<view class="pending-wapper">
			<image id="face" :src="tempFace" class="pending-face" mode="scaleToFill"></image>
		</view>
		
		<view class="notice">
			<view class="notice-words">
				* 请从相册中选择等比宽高的图片噢~
			</view>
		</view>
		
		<view class="footer-opertor">
			<view class="opertor-words" @click="changePendingFace">
				重新选择
			</view>
			<view class="opertor-words" @click="upload">
				确认上传
			</view>
		</view>
		
	</view>
</template>

<script>
	import { serverUrl } from "../../common/common.js"
	export default {
		data() {
			return {
				tempFace: ''
			}
		},
		onLoad(params) {
			var tempFilePath = params.tempFilePath 
			this.tempFace = tempFilePath
		},
		methods: {
			changePendingFace () {
				var _this = this
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					sourceType: ["album"],
					success (res) {
						var tempFilePath = res.tempFilePaths[0]
						_this.tempFace = tempFilePath
					}
				})
			},
			upload () {
				var _this = this
				var globalUser = this.globalUser('globalUser')
				
				uni.showLoading({
					mask: true,
					title: "上传中，请稍后"
				})
				
				uni.uploadFile({
					url: serverUrl('user/uploadFace', ["userId=" + globalUser.id]),
					filePath: _this.tempFace,
					name: "file",
					header: {
						"headerUserId": globalUser.id,
						"headerUserToken": globalUser.userUniqueToken
					},
					success (res) {
						var resData = JSON.parse(res.data)
						if (resData.status === 200) {
							// 获得最新得 用户数据
							var userInfo = resData.data
							uni.setStorageSync('globalUser', userInfo)
							uni.navigateBack({
								delta: 1
							})
						} else if (resData.status === 500 || resData.status === 502) {
							uni.showToast({
								title: res.data.msg,
								image: "../../static/icos/error.png",
								duration: 2000
							})
						}
					},
					complete () {
						uni.hideLoading()
					}
				})
			}
		}
	}
</script>

<style>
/* 页面铺满屏幕 */
.page-fill {
	width:100%;
	height: 100%;
	position: absolute;
	background: black;
}

.pending-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	margin-top: 40upx;
}
.pending-face {
	width: 600upx;
	height: 600upx;
}

.notice {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.notice-words {
	color: gray;
	font-size: 13px;
	margin-top: 30upx;
	width: 600upx;
}

/* 底部操作 start */
.footer-opertor {
	position: fixed;
	bottom: 0;
	
	border-top: #515050 solid 1px;
	width: 100%;
	
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	
	padding: 30upx;
}
.opertor-words {
	color: #e8e5e5;
	font-size: 16px;
	width: 200upx;
}
/* 底部操作 end */
</style>

