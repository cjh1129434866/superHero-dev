<template>
	<view class="page page-fill">
		<view class="page-block info-list">
			
			<view class="item-wapper face-line-upbottom" @click="operate">
				<view class="info-words">头像</view>
				<view class="right-wapper">
					<image :src="userInfo.faceImage" class="face"></image>
					<view class="arrow-block">
						<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
				  </view>
				</view>
			</view>
			
			<view class="line-top">
				<view class="line"></view>
			</view>
			
			<!-- 昵称 -->
			<view class="item-wapper" @click="modifyNickname">
				<view class="info-words">昵称</view>
				<view class="right-wapper">
					<view class="gray-fields">{{userInfo.nickname}}</view>
					<view class="arrow-block">
						<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<!-- 生日 -->
			<view class="item-wapper" @click="modifyBirthday">
				<view class="info-words">生日</view>
				<view class="right-wapper">
					<view class="gray-fields">
						{{userInfo.birthday}}
					</view>
					<view class="arrow-block">
							<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<view class="line-top">
				<view class="line"></view>
			</view>
			
			<!-- 性别 -->
			<view class="item-wapper" @click="modifySex">
				<view class="info-words">
					性别
				</view>
				<view class="right-wapper">
					<view class="gray-fields">
						<view v-if="userInfo.sex == 1">男</view>
						<view v-else-if="userInfo.sex == 0">女</view>
						<view v-else>未选择</view>
					</view>
					<view class="arrow-block">
						<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="footer-wapper">
			<view class="footer-words" @click="clearStorage">
				清理缓存
			</view>
			<view class="footer-words" @click="loginOut" style="margin-top: 10upx;">
				退出登录
			</view>
		</view>
		
	</view>
</template>

<script>
	import { serverUrl } from "../../common/common.js"
	export default {
		data() {
			return {
				userInfo: {}
			}
		},
		onShow () {
			var _this = this
			var globalUser = _this.globalUser('globalUser')
			_this.userInfo = globalUser
		},
		methods: {
			clearStorage () {
				uni.clearStorage()
				uni.showToast({
					title: '清理缓存成功',
					mask: false,
					duration: 1500
				})
			},
			loginOut () {
				var _this = this
				var globalUser = this.globalUser('globalUser')
				uni.request({
					url: serverUrl('user/logout', ['userId=' + globalUser.id]),
					method: "POST",
					success: (res) => {
						if (res.data.status === 200) {
							uni.removeStorageSync('globalUser')
							uni.switchTab({
								url: '../me/me'
							})
						}
					}
				})
			},
			operate () {
				var _this = this
				var globalUser = this.globalUser('globalUser')
				uni.showActionSheet({
					itemList: ["查看用户头像", "从相册选择上传"],
					success (res) {
						var index = res.tapIndex
						if (index === 0) {
							// 预览头像
							var faceArr = []
							faceArr.push(globalUser.faceImage)
							uni.previewImage({
								urls: faceArr,
								current: faceArr[0]
							})
						} else if (index === 1) {
							// 选择  头像 上传
							uni.chooseImage({
								count: 1,
								sizeType: ["compressed"],
								sourceType: ["album"],
								success (res) {
									// 获得 临时 路径
									var tempFilePath = res.tempFilePaths[0]
									// #ifdef H5
									uni.navigateTo({
										url: "../meFace/meFace?tempFilePath=" + tempFilePath
									})
									// #endif
									// #ifndef H5
									uni.navigateTo({
										url: "../faceCrop/faceCrop?tempFilePath=" + tempFilePath
									})
									// #endif
								}
							})
						}
					}
				})
			},
			modifyNickname () {
				uni.navigateTo({
					url: "../meNickname/meNickname"
				})
			},
			modifyBirthday () {
				uni.navigateTo({
					url: "../meBirthday/meBirthday"
				})
			},
			modifySex () {
				uni.navigateTo({
					url: "../sex/sex"
				})
			}
		}
	}
</script>

<style>
	@import url('./meInfo.css')
</style>
