<template>
	<view class="page page-fill">
		<form @submit="formSubmitNickName">
			<view class="page-block" style="margin-top: 20upx;">
				<input 
					type="text"
					name="nickname"
					:value="globalUserInfo.nickname"
					class="input"
					placeholder="请输入昵称"
					placeholder-class="graywords"
					maxlength="10"
					>
			</view>
			
			<button type="primary" form-type="submit" class="submitBtn">提交</button>
		</form>
	</view>
</template>

<script>
	import { serverUrl } from "../../common/common.js"
	export default {
		data() {
			return {
				globalUserInfo: {}
			}
		},
		onLoad () {
			var _this = this
			var globalUserInfo = _this.globalUser("globalUser")
			_this.globalUserInfo = globalUserInfo
		},
		methods: {
			formSubmitNickName (e) {
				var _this = this
				var nickname = e.detail.value.nickname
				uni.request({
					url: serverUrl('user/modifyUserinfo'),
					data: {
						"userId": _this.globalUserInfo.id,
						"nickname": nickname
					},
					header: {
						"headerUserId": _this.globalUserInfo.id,
						"headerUserToken": _this.globalUserInfo.userUniqueToken,
					},
					method: "POST",
					success (res) {
						var resData = res.data
						if (resData.status == 200) {
							// 获得最新的用户数据
							var userInfo = resData.data;
							uni.setStorageSync("globalUser", userInfo);
							uni.navigateBack({
								delta: 1
							})
						} else if (resData.status == 502 || resData.status == 500) {
							uni.showToast({
								title: res.data.msg,
								image: "../../static/icos/error.png",
								duration: 2000
							})
						}
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
}

.graywords {
	color: #EAEAEA;
}

.input {
	height: 80upx;
	line-height: 80upx;
	width: 500upx;
	margin-left: 40upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
