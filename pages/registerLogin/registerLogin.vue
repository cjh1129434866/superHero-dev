<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/icos/default-face.png" class="face"></image>
			</view>
			
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" placeholder-class="graywords"/>
			</view>
			
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords"/>
			</view>
			
			<button type="primary"  form-type="submit" style="margin-top: 60upx;width: 90%;">注册/登录</button>
	  </form>
		
		<!-- 第三方登录H5不支持，所以隐藏掉 -->
		<!-- #ifndef H5 -->
			<view class="third-wapper">
				<view class="third-line">
					<view class="single-line">
						<view class="line"></view>
					</view>
					
					<view class="third-words">第三方账号登录</view>
					
					<view class="single-line">
						<view class="line"></view>
					</view>
				</view>
				
				<view class="third-icos-wapper">
					<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
					<!-- #ifdef APP-PLUS -->
						<image src="../../static/icos/weixin.png" data-logintype="weixin" @click="appOAuthLogin"  class="third-ico"></image>
						<image src="../../static/icos/QQ.png" data-logintype="qq" @click="appOAuthLogin"  class="third-ico" style="margin-left: 80upx;"></image>
						<image src="../../static/icos/weibo.png" data-logintype="sinaweibo" @click="appOAuthLogin" class="third-ico" style="margin-left: 80upx;"></image>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
						<button open-type='getUserInfo' @getuserinfo="wxLogin" class="third-btn-ico">
						</button>
					<!-- #endif -->
				</view>
			</view>
	  <!-- #endif -->
	</view>
</template>

<script>
	import { serverUrl } from "../../common/common.js"
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			formSubmit (e) {
				//val _this = this
				var username = e.detail.value.username
				var password = e.detail.value.password
				uni.request({
					url: serverUrl('user/registOrLogin'),
					data: {
						"username": username,
						"password": password
					},
					method: "POST",
					success: (res) => {
						var userInfo
						if (res.data.status === 200) {
							userInfo = res.data.data
							// 把数据存储到 本地 缓存当中
							uni.setStorageSync("globalUser", userInfo)
							// 注册登陆成功 页面跳转
							uni.switchTab({
								url: "../me/me"
							})
						} else if (res.data.status === 500) {
							uni.showToast({
								title: res.data.msg,
								duration: 2000,
								image: "../../static/icos/error.png"
							})
						}
					}
				})
			},
			wxLogin (e) {
				// 通过微信开放能力 获得 用户的基本信息
				var userInfo = e.detail.userInfo
				// 实现微信登陆 
				uni.login({
					provider: "weixin",
					success: (loginResult) => {
						var code = loginResult.code
						// 设置登录到哪个对应的微信小程序，大家可以根据自己的后端去实现业务参数
						// [0:NEXT超英预告][1:超英预告][2:NEXT学院电影预告]
						uni.request({
							url: serverUrl('stu/mpWXLogin/' + code),
							method: "POST",
							data: {
								"avatarUrl": userInfo.avatarUrl,
								"nickName": userInfo.nickName,
								"whichMP": 1
							},
							success: function (res) {
								// 这里的 微信登陆后端 逻辑 要自己实现，目前没有做这一个工作，所已微信登陆 不成功
								uni.showToast({
									title: "登陆失败，微信登陆要自己实现后台逻辑",
									duration: 2000
								})
							 //  var userInfo = res.data.data
								// uni.setStorageSync("globalUser", userInfo)
								// uni.switchTab({
								// 	url: "../me/me"
								// })
							}
						})
					}
				})
			},
			// app的 第三方登陆
			appOAuthLogin(e) {
				var _this = this
				var loginType = e.currentTarget.dataset.logintype
				uni.login({
					provider: loginType,
					success: (res) => {
						// 授权登陆成功之后 获取 用户信息
						uni.getUserInfo({
							provider: loginType,
							success: (info) => {
								// console.log(JSON.stringify(info))
								var userInfo = info.userInfo
								var face = ''
								var nickname = ''
								var openIdOrUid = ''
								if (loginType == 'weixin') {
									face = userInfo.avatarUrl
									nickname = userInfo.nickName
									openIdOrUid = userInfo.openId
								} else if (loginType == 'qq') {
									face = userInfo.figureurl_qq_2
									nickname = userInfo.nickName
									openIdOrUid = userInfo.openId
								} else if (loginType == 'sinaweibo') {
									face = userInfo.avatar_large
									nickname = userInfo.nickname
									openIdOrUid = userInfo.id
								}
								// 调用开发者 后台 执行 一键登录 或 注册
								uni.request({
									url: serverUrl('appUnionLogin/' + loginType),
									data: {
										"face": face,
										"nickname": nickname,
										"openIdOrUid": openIdOrUid
									},
									method: "POST",
									success (res) {
										if (res.data.status === 200) {
											var userInfo = res.data.data
											uni.setStorageSync("globalUser", userInfo)
											uni.switchTab({
												url: "../me/me"
											})
										}
									}
								})
							}
						})
					}
				})
			}
		}
	}
</script>

<style>
@import url('./registerLogin.css')
</style>
