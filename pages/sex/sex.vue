<template>
	<view class="page page-fill">
		<form @submit="formSubmitSex">
			<view class="page-block" style="margin-top: 20upx">
				<radio-group class="radio-sex" @change="sexChange">
					<label class="radio-single">
						<radio value="1" :checked="sex === 1"/> 男
					</label>
					<label class="radio-single">
						<radio value="0" :checked="sex === 0"/> 女
					</label>
				</radio-group>
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
				sex: "-1",
				globalUserInfo: {}
			}
		},
		onLoad () {
			var _this = this
			var globalUserInfo = _this.globalUser("globalUser")
			this.globalUserInfo = globalUserInfo
			this.sex = this.globalUserInfo.sex
		},
		methods: {
			sexChange (e) {
				this.sex = e.detail.value
			},
			formSubmitSex () {
				var _this = this
				uni.request({
					url: serverUrl("user/modifyUserinfo"),
					data: {
						"userId": _this.globalUserInfo.id,
						"sex": _this.sex
					},
					header: {
						"headerUserId": _this.globalUserInfo.id,
						"headerUserToken": _this.globalUserInfo.userUniqueToken
					},
					method: "POST",
					success(res) {
						var resData = res.data;
						// console.log(typeof(resData));
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

.radio-sex {
	display: flex;
	flex-direction: column;
}

.radio-single {
	padding: 20upx 20upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
