<template>
	<view class="page page-fill">
		<form @submit="formSubmitBirthday">
			<view class="page-block" style="margin-top: 20upx">
				<picker mode="date" @change="dateChange">
					<view class="birth-input">{{birthday}}</view>
				</picker>
			</view>
			
			<button form-type="submit" type="primary" class="submitBtn">提交</button>
		</form>
	</view>
</template>

<script>
	import { serverUrl } from "../../common/common.js"
	export default {
		data() {
			return {
				birthday: "",
				globalUserInfo: {}
			}
		},
		onLoad () {
			var globalUserInfo = this.globalUser("globalUser")
			this.globalUserInfo = globalUserInfo
			this.birthday = globalUserInfo.birthday
		},
		methods: {
			formSubmitBirthday () {
				var _this = this
				uni.request({
					url: serverUrl("user/modifyUserinfo"),
					data: {
						"userId": _this.globalUserInfo.id,
						"birthday": _this.birthday
					},
					header: {
						"headerUserId": _this.globalUserInfo.id,
						"headerUserToken": _this.globalUserInfo.userUniqueToken
					},
					method: "POST",
					success(res) {
						var resData = res.data
						if (resData.status === 200) {
							var userInfo = resData.data
							uni.setStorageSync("globalUser", userInfo)
							uni.navigateBack({
								delta: 1
							})
						} else if (resData.status === 520 || resData.status === 500) {
							uni.showToast({
								title: res.data.msg,
								image: "../../static/icos/error.png",
								duration: 2000
							})
						}
					}
				})
			},
			dateChange (e) {
				this.birthday = e.detail.value
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

.birth-input {
	background-color: white;
	height: 80upx;
	line-height: 80upx;
	padding-left: 20upx;
}

.birthday {
	background-color: white;
	height: 80upx;
	padding-left: 20upx;
	padding-top: 30upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
