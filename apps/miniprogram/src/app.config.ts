export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/learn/index',
    'pages/learn/detail',
    'pages/service/index',
    'pages/service/rural',
    'pages/service/community',
    'pages/service/museum',
    'pages/care/index',
    'pages/survey/form',
    'pages/member/index',
    'pages/story/detail',
  ],
  subPackages: [
    {
      root: 'packageTeam',
      pages: ['pages/survey/index'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#004EA2',
    navigationBarTitleText: '语冰 AI 普惠',
    navigationBarTextStyle: 'white',
    backgroundColor: '#F6F8FA',
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#004EA2',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png',
      },
      {
        pagePath: 'pages/learn/index',
        text: '学习',
        iconPath: 'assets/icons/learn.png',
        selectedIconPath: 'assets/icons/learn-active.png',
      },
      {
        pagePath: 'pages/service/index',
        text: '服务',
        iconPath: 'assets/icons/service.png',
        selectedIconPath: 'assets/icons/service-active.png',
      },
      {
        pagePath: 'pages/member/index',
        text: '我的',
        iconPath: 'assets/icons/member.png',
        selectedIconPath: 'assets/icons/member-active.png',
      },
    ],
  },
})
