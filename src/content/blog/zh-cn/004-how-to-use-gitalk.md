---
title: 如何为Hexo配置Gitalk评论系统
description: 在 Hexo 博客里接入 Gitalk 评论系统的步骤和踩坑。
pubDate: 2020-02-02 19:58:37
lang: zh-cn
tags:
  - hexo
  - gitalk
cover: https://tva1.sinaimg.cn/large/006tNbRwgy1gbid1frk33j30go0b4q33.jpg
---

搭建博客少不了评论系统，选择有很多，初略对比了一下`Gitment`、`Gitalk`、`Valine`，最终选择了Gitalk。
官方地址：https://github.com/gitalk/gitalk

## 搭建过程
### step1:
注册Github Application，申请OAuth登录授权，地址是https://github.com/settings/applications/new，
注册成功之后获得`Client ID`和`Client Secret`。
- Application name：网站名称
- HomePage URL：仓库地址，建议使用当前网站的仓库地址，也可以使用其它仓库地址
- Authorization callback URL：网站主页地址
![Register_Github_Application_Token](https://tva1.sinaimg.cn/large/006tNbRwgy1gbibrleri9j30s00u0dje.jpg)


### step2:
打开当前主题下的`_config.yml`文件，这里使用的是`themes/butterfly`。
找到或添加以下模板，并填入相应内容，然后重新部署网站。
``` yml
gitalk:
  enable: true # 开启gitalk
  client_id: xxx # setp1注册获得的Client ID
  client_secret: xxx  # setp1注册获得的Client Secret
  repo: songjiaqiang.github.io # 网站仓库名称，和setp1中的HomePage URL对应。注意只要填名称，不是网址
  owner: SongJiaqiang # 仓库创建者
  admin: SongJiaqiang # 仓库管理员，多管理员使用数组，如['SongJiaqiang', 'Jarvis']
  language: en # 评论框语言，如en , zh-CN , zh-TW
  count: true # 是否显示评论总数
```

### setp3：
打开博客网站，再打开任一文章，拉到底部就能看到Gitalk的评论框了。
点击登录按钮登录评论者的git账号，即可对文章进行评论。
![create_comment](https://tva1.sinaimg.cn/large/006tNbRwgy1gbic8hs92dj31f40le40c.jpg)
评论结果会出现在setp1填写的仓库地址的issues中。
![comment_in_issues](https://tva1.sinaimg.cn/large/006tNbRwgy1gbic92xdqgj31km0cg0v5.jpg)
同时站长也可以在Issues中直接回复评论，评论会出现在网站中。
![reply_comment_in_issues](https://tva1.sinaimg.cn/large/006tNbRwgy1gbicelsjafj31680aamy8.jpg)
![reply_comment_in_website](https://tva1.sinaimg.cn/large/006tNbRwgy1gbicf7eldqj31g409sgmb.jpg)


## 遇到的问题
Q：点击评论组件中的github登录按钮，重定向失败，地址栏变成
`# https://songjiaqiang.com/?error=redirect_uri_mismatch&error_description=The+redirect_uri+MUST+match+the+registered+callback+URL+for+this+application.&error_uri=https%3A%2F%2Fdeveloper.github.com%2Fapps%2Fmanaging-oauth-apps%2Ftroubleshooting-authorization-request-errors%2F%23redirect-uri-mismatch`
A：`_config.yml`文件中配置的repo填错了，不是填仓库地址，应该填仓库名称。

Q：评论组件无法显示历史评论内容，出现错误提示`Error: Not Found.`
A：注册Github Application时HomePage URL填错了，不是网站主页地址，应该是仓库地址。