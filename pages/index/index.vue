<template>
	<view class="page">
		<!-- 轮播 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="carousel">
			<swiper-item v-for="item in carouselList" :key="item.movieId">
				<navigator open-type="navigate" :url="'../movieDetail/movieDetail?trailerId=' + item.movieId">
					<image :src="item.image" class="carousel"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		<!-- 热门超英 -->
		<view class="page-block super-hot">
			<view class="hot-title-wrapper">
				<image src="../../static/icos/hot.png" class="hot-icon"></image>
				<view class="hot-title">热门超英</view>
			</view>
		</view>
		<!--  海报  -->
		<scroll-view scroll-x="true" class="page-block hot">
		   <view class="single-poster" v-for="item in hotSuperHeroList" :key="item.id">
				 <view class="poster-wapper">
					 <navigator open-type="navigate" :url="'../movieDetail/movieDetail?trailerId=' + item.id">
						<image :src="item.cover" class="poster"></image>
					 </navigator>
					 <view class="movie-name">{{item.name}}</view>
					 <trailerStar :innerScore="item.score" :isShowInnerScore="true"></trailerStar>
				 </view>
			 </view> 
		</scroll-view>
		
		<!-- 热门预告 -->
		<view class="page-block super-hot">
			<view class="hot-title-wrapper">
				<image src="../../static/icos/interest.png" class="hot-icon"></image>
				<view class="hot-title">热门预告</view>
			</view>
		</view>
		
		<!-- 视频 -->
		<view class="hot-movies page-block">
			<video
			  v-for="item in hotTrailerList"
				:id="item.id"
				:data-playingId = "item.id"
				:key="item.id"
				:src="item.trailer" 
				:poster="item.poster"
				class="hot-movie-single"
				@play="isPlaying"
				controls>
			</video>
		</view>
		
		<!-- 猜你喜欢 -->
		<view class="page-block super-hot">
			<view class="hot-title-wrapper">
				<image src="../../static/icos/guess-u-like.png" class="hot-icon"></image>
				<view class="hot-title">猜你喜欢</view>
			</view>
		</view>
		
		<view class="page-block guess-u-like">
			<view class="single-like-movie" v-for="(item, index) in guessULikeList" :key="item.id">
				<navigator open-type="navigate" :url="'../movieDetail/movieDetail?trailerId=' + item.id">
					<image :src="item.cover" class="like-movie"></image>
				</navigator>	
				<view class="movie-desc">
					<view class="movie-title">{{item.name}}</view>
				  <trailerStar :innerScore="6.7" :isShowInnerScore="false"></trailerStar>
					<view class="movie-info">{{item.basicInfo}}</view>
					<view class="movie-info">{{item.releaseDate}}</view>
				</view>
				<view class="movie-oper" :data-index="index" @click="priaseMe">
					<image src="../../static/icos/praise.png" class="praise-icon"></image>
					<view class="praise-me">点赞</view>
					<view class="praise-me animation-opacity" :animation="animationDataArr[index]">+1</view>
				</view>
			</view>
		</view>
		
		
		
	</view>
</template>

<script>
  import { serverUrl } from "../../common/common.js"
	import trailerStar from "../../components/trailerStar.vue"
	export default {
		components: {
			trailerStar
		},
		data() {
			return {
				carouselList: [],
				hotSuperHeroList: [],
				hotTrailerList: [],
				guessULikeList: [],
				animationData: {},
				animationDataArr: [ {}, {}, {}, {}, {} ]
			}
		},
		onUnload () {
			// 页面卸载的时候 清除动画数据
			this.animationData = {}
			this.animationDataArr =  [ {}, {}, {}, {}, {} ]
		},
		// 监听用户的 下拉动作
		onPullDownRefresh () { 
			this.refreshGuessList()
		},
		onLoad() {
			// #ifdef APP-PLUS || MP-WEIXIN
			// 在页面创建的时候 ，创建一个临时的 动画对象
			this.animation = uni.createAnimation()
			// #endif
			
			// 轮播图
			uni.request({
				url: serverUrl('index/carousel/list'),
				method: "POST",
				success: (res) => {
					if (res.data.status === 200) {
						this.carouselList = res.data.data
					}
				}
			})
			
			// 热门超英
			uni.request({
				url: serverUrl("/index/movie/hot", ['type=superhero']),
				method: "POST",
				success: (res) => {
					if (res.data.status === 200) {
						this.hotSuperHeroList = res.data.data
					}
				}
			})
			
			// 超英预告
			uni.request({
				url: serverUrl("/index/movie/hot", ['type=trailer']),
				method: 'POST',
				success: (res) => {
					if (res.data.status === 200) {
						this.hotTrailerList = res.data.data
					}
				}
			})
			
			// 猜你喜欢
			this.refreshGuessList()
		},
		onHide() {
			if (this.videoContext) {
				this.videoContext.pause()
			}
		},
		methods: {
			priaseMe (e) {
				// #ifdef APP-PLUS || MP-WEIXIN
				let gIndex = e.currentTarget.dataset.index // dataset. 后面都是小写
				// 构建动画数据，并且通过step来表示动画的完成
				this.animation.translateY(-60).opacity(1).step({duration: 400})
				// 到处动画数据到view组件，实现组件的 动画效果
				this.animationData = this.animation
				this.animationDataArr[gIndex] = this.animationData.export()
				
				// 还原动画
				setTimeout(function() {
					this.animation.translateY(0).opacity(0).step({duration: 0})
					this.animationData = this.animation
					this.animationDataArr[gIndex] = this.animationData.export()
				}.bind(this), 500);
				// #endif
			},
			// 猜你喜欢 数据获取
			refreshGuessList () {
				uni.showLoading({
					mask: true
				})
				uni.showNavigationBarLoading()
				
				uni.request({
					url: serverUrl("/index/guessULike"),
					method: "POST",
					success: (res) => {
						if (res.data.status === 200) {
							this.guessULikeList = res.data.data
						}
					},
					complete: () => {
						uni.hideNavigationBarLoading()
						uni.hideLoading()
						uni.stopPullDownRefresh()
					}
				})
			},
			// 当前播放的 视频
			isPlaying (e) {
				var playingId = ""
			  if (e) {
				  playingId = e.currentTarget.dataset.playingid
					this.videoContext = uni.createVideoContext(playingId)
					var hotTrailerList = this.hotTrailerList 
					for (var i = 0; i < hotTrailerList.length; i++) {
						if (hotTrailerList[i].id !== playingId) {
							uni.createVideoContext(hotTrailerList[i].id).pause()
						}
					}
			  }
			}
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
