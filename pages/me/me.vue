<template>
	<view class="page page-fill">
		<view class="header">
			<view v-if="userIsLogin">
				<image :src="userInfo.faceImage" class="face"></image>
			</view>
			<view v-else>
				<image src="http://122.152.205.72:88/group1/M00/00/05/CpoxxFw_-5-AFyVyAABLIH8xBTw233.png" class="face"></image>
			</view>
			<view class="info-wapper" v-if="userIsLogin">
				<view class="nickname">
					{{userInfo.nickname}}
				</view>
				<view class="nav-info">ID: {{userInfo.id}}</view>
			</view>
			<view class="info-wapper" v-else>
				<navigator url="../registerLogin/registerLogin">
					<view class="nickname">
						登陆/注册
					</view>
				</navigator>
			</view>
			<view class="set-wapper" v-if="userIsLogin">
				<navigator url="../meInfo/meInfo">
					<image src="../../static/icos/settings.png" class="settings"></image>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userIsLogin: false,
				userInfo: {}
			}
		},
		onShow () {
			var _this = this
			var globalUser = _this.globalUser("globalUser")
			if (globalUser != null ) {
				_this.userIsLogin = true
				_this.userInfo = globalUser
			} else {
				_this.userIsLogin = false
				_this.userInfo = {}
			}
		},
		methods: {
			
		}
	}
</script>

<style>
@import url('./me.css')
</style>
