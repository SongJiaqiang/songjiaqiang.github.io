---
title: Flutter项目实践 - Evo音乐播放器（1）
description: 用 Flutter 重写 EvoRadio：创建项目、左右滑屏，以及做成环境音乐播放器的过程。
pubDate: 2020-04-08 00:44:26
lang: zh-cn
tags:
  - flutter
  - evo
cover: https://tva1.sinaimg.cn/large/00831rSTgy1gdlout454uj30v90istak.jpg
---

## 项目背景

2020年1月份换了新工作，由于工作需要，开始了[Flutter](https://flutter.dev/)的学习之旅，另一方面，自己也认为Flutter是未来移动项目界面开发的一大利器，具体优点这里就不赘述了，总之是很值得移动和web端开发的同行们学习的。

年后的紧张工作也告一段落了，利用清明几天假期，做一个Demo程序来检验一下学习成果，当然，以后还会持续更新，将flutter的一些实用的特性用在这个项目中。

为什么选择重写[EvoRadio](https://github.com/SongJiaqiang/EvoRadio)，EvoRadio是我2016年刚开始学习Swift时的实践项目，到现在已经年久失修，而且我对环境音乐也比较感兴趣，几乎每天都在用，在github上也得到了60多位朋友的star支持。但是问题也是很多的，比如没有适配iPhone X系列的刘海屏，播放控制不灵敏，听歌操作太复杂等等。所以，选择重写EvoRadio就是要简化音乐播放的流程，优化播放质量，让它成为一个“不仅仅是个Flutter Demo”的app，简化而不简单。

我给它重新命名为`Evo`，UI参考豆瓣FM，我会一步步记录下自己的开发步骤，读者也可以根据步骤来完成项目。

Let's Go！

## 创建项目

### Create repo

首先在我自己的github下创建了一个Evo项目，地址是：https://github.com/SongJiaqiang/Evo，然后克隆到本地。

### New project

我使用的IDE是Miscrosoft Visual Code，简称VSCode，使用快捷键Shift+Command+P，输入`flutter`，选择New Project，然后输入项目名称`evo`，就可以得到一个hello world项目了。

注：开发环境安装请参照官方教程：https://flutter.dev/docs/get-started/install/macos

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163609.jpg" alt="CEDF8F03-A93C-4BA9-B98E-67EC79A16F8B" style="zoom:50%;" />

关闭VSCode，将evo项目文件拷贝到git目录。

打开Terminal客户端，我使用的是iTerm，进入evo根目录，使用`flutter run`运行app，也可以直接在VSCode上运行。如果你的电脑打开了多个设备，包括手机、模拟器，可能会让你选择设备id。如果你的设备上安装有多个flutter项目，还会提示你选择appid，具体命令如下，根据自己的实际情况配置即可。

`flutter run -d <deviceID> --app-id <appID>`

因为我偏爱使用真机调试，我的真机设备是iPhone，所以这里还会遇到一个签名的问题，命令行会提示你选择电脑上已安装的证书，也可以直接打开iOS宿主项目进行配置，目录是`ios/Runner.xcworkspace`。配置签名同时，也顺手修改了一下appid。

由于我用的Xcode版本是11.4，所以还会出现一个Framework链接的问题，解决方案flutter官方已经给出：https://flutter.dev/docs/development/ios-project-migration

```Building for iOS, but the linked and embedded framework 'App.framework' was built for iOS Simulator.```

至此，就得到了一个可持续开发的初始项目了。

git commit记录一下：

``` shell
git commit -m 'New project'
```



慢着！我们应该忽略掉一些不需要提交的文件，这里直接使用flutter项目的[gitignore](https://github.com/flutter/flutter/blob/master/.gitignore)文件，文件拷贝到evo根目录下，使用git amend重新提交一下commit。

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163511.jpg" alt="image-20200403113930571" style="zoom: 25%;" />

## 左右滑屏

### TabController

根据豆瓣FM的设计，主页是有两屏可以左右滑动的，如图

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163624.gif" alt="demo_video_01" style="zoom:25%;" />

根据这个滑动效果，我们可以使用`TabController`，也可以自定义`ScrollView`，简单起见我们采用`TabController`来实现，具体代码如下，请使用下面代码替换你的`_MyHomePageState`类。

```dart
class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(title: Text('Evo')),
        body: TabBarView(
          children: [
            Container(
              color: Colors.redAccent,
              child: Center(
                child:
                    Text('First Page', style: TextStyle(color: Colors.white)),
              ),
            ),
            Container(
              color: Colors.greenAccent,
              child: Center(
                child:
                    Text('Second Page', style: TextStyle(color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

#### 代码解释

1. TabController是Flutter自带的tab控制器，可以用于多屏滚动效果。
2. 参考[资料](https://medium.com/@mohamedelamin/flutter-tabs-example-5dca1f06329e)



<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163659.gif" alt="demo_video_02" style="zoom:25%;" />



### TabBar

TableController有自带的Tabbar，但是不符合我们想要的效果，所以我们自定义一个TabBar吧。

我们在lib目录下创建一个新文件名`top_bar.dart`，这里存放自定义的TabBar，叫做`TopBar`，代码如下。

```dart
import 'package:flutter/material.dart';

class TopBar extends StatelessWidget implements PreferredSizeWidget {
  @override
  Size get preferredSize => Size(0, 60);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Container(
            height: 40,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Container(
                  padding: EdgeInsets.only(left: 16),
                  child: Text(
                    'EvoRadio',
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  child: Row(
                    children: <Widget>[
                      IconButton(
                        iconSize: 30,
                        icon: Icon(Icons.search, size: 24),
                        onPressed: () {},
                      ),
                      IconButton(
                        iconSize: 30,
                        icon: Icon(Icons.person_outline, size: 24),
                        onPressed: () {},
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 16),
            height: 4,
            child: Row(
              children: <Widget>[
                Container(
                  height: 4,
                  width: 4,
                  decoration: BoxDecoration(
                    color: Colors.greenAccent,
                    borderRadius: BorderRadius.all(
                      Radius.circular(2),
                    ),
                  ),
                ),
                SizedBox(width: 4),
                Container(
                  height: 4,
                  width: 16,
                  decoration: BoxDecoration(
                    color: Colors.greenAccent,
                    borderRadius: BorderRadius.all(
                      Radius.circular(2),
                    ),
                  ),
                ),
              ],
            ),
          ),
          SizedBox(height: 10),
        ],
      ),
    );
  }
}
```

接着我们使用`TopBar`替换掉main.dart中的`AppBar`

```dart
class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: TopBar(),
        body: TabBarView(),//已省略部分代码
      ),
    );
  }
}
```

#### 代码解释

1. 查看AppBar源码，我们发现它实现了`PreferredSizeWidget`，这个Widget是有一个必须实现的`preferredSize`属性，`preferredSize`决定了TopBar的高度，我们暂且设为60。参考[资料1](https://api.flutter.dev/flutter/widgets/PreferredSizeWidget-class.html)、[资料2](https://medium.com/@ketanchoyal/create-a-custom-app-bar-flutter-e32164e0be6f)
2. TopBar的布局包括一个标题，两个按钮，以及一组圆点指示器

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163708.png" alt="image-20200403142453818" style="zoom:25%;" />

接下来我们为`TopBar`添加属性，允许使用者设置左侧title和右侧功能按钮，代码如下：

top_bar.dart

```dart
class TopBar extends StatelessWidget implements PreferredSizeWidget {
  // 标题
  final String title;
  // 右侧功能按钮组合
  final List<Widget> children;
  // 标题点击事件
  final Function onTitleTapped;

  @override
  final Size preferredSize;

  TopBar({
    @required this.title, // title为必须属性
    this.children,
    this.onTitleTapped,
  }) : preferredSize = Size.fromHeight(60.0);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Container(
            height: 40,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Container(
                  padding: EdgeInsets.only(left: 16),
                  child: Text(
                    title,	// 使用外部传入的title
                    style: TextStyle(
                      color: Colors.black,
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                Container(
                  child: Row(
                    children: children != null ? children : [], // 使用外部传入的children
                  ),
                ),
              ],
            ),
          ),
          // 已省略部分代码
        ],
      ),
    );
  }
}

```

main.dart

```dart
class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: TopBar(
          title: 'EvoRadio',
          onTitleTapped: () {
            print('Tap title');
          },
          children: <Widget>[
            IconButton(
              iconSize: 30,
              icon: Icon(Icons.search, size: 24),
              onPressed: () {},
            ),
            IconButton(
              iconSize: 30,
              icon: Icon(Icons.person_outline, size: 24),
              onPressed: () {},
            ),
          ],
        ),
				// 已省略部分代码
      ),
    );
  }
}
```

#### 代码解释

1. 为TopBar添加title属性，用于设置TopBar的标题
2. 为TopBar添加children属性，用于设置TopBar右侧功能按钮
3. 为TopBar添加onTitleTapped属性，用于设置点击标题的回调事件



再接下来，我们将`TopBar`的位置指示器和标题跟`TabBarView`的切换关联起来，代码如下：

top_bar.dart

```dart
import 'package:flutter/material.dart';

class TopBar extends StatelessWidget implements PreferredSizeWidget {
  // 标题
  final String title;
  // 右侧功能按钮组合
  final List<Widget> children;
  // 标题点击事件
  final Function onTitleTapped;
  // 指示器长度
  final int indicatorLength;
  // 指示器下标
  final int indicatorIndex;

  @override
  final Size preferredSize;

  TopBar({
    @required this.title, // title为必须属性
    this.children,
    this.onTitleTapped,
    @required this.indicatorLength,
    this.indicatorIndex = 0,
  }) : preferredSize = Size.fromHeight(60.0);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.end,
        mainAxisSize: MainAxisSize.max,
        children: <Widget>[
          Container(
            height: 40,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Container(
                  padding: EdgeInsets.only(left: 16),
                  child: GestureDetector(
                    onTap: onTitleTapped,
                    child: Text(
                      title,
                      style: TextStyle(
                        color: Colors.black,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
                Container(
                  child: Row(children: children != null ? children : []),
                ),
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.only(left: 16),
            height: 4,
            child: _buildIndicator(indicatorLength, indicatorIndex, 4),
          ),
          SizedBox(height: 10),
        ],
      ),
    );
  }

  Widget _buildIndicator(int length, int index, double height) {
    double normalWidth = height;
    double maxWidth = normalWidth * 4;

    List<Widget> children = [];
    for (var i = 0; i < length; i++) {
      double itemWidth = index == i ? maxWidth : normalWidth;
      double itemHeight = normalWidth;
      double itemSpacing = normalWidth;

      // add spacing
      if (i > 0) {
        children.add(SizedBox(width: itemSpacing));
      }

      // add item
      var item = Container(
        width: itemWidth,
        height: itemHeight,
        decoration: BoxDecoration(
          color: Colors.greenAccent,
          borderRadius: BorderRadius.all(Radius.circular(itemHeight / 2)),
        ),
      );
      children.add(item);
    }
    return Row(children: children);
  }
}
```

main.dart

```dart
class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  TabController _tabController;
  int _currentIndex;
  String _topBarTitle;

  final List<String> _topBarTitles = ['First Page', 'Second Page'];

  @override
  void initState() {
    super.initState();

    _currentIndex = 0;
    _topBarTitle = _topBarTitles.first;

    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(_handleTabController);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: TopBar(
          title: _topBarTitle,
          onTitleTapped: () {
            print('Tap title');
          },
          indicatorLength: 2,
          indicatorIndex: _currentIndex,
          children: <Widget>[
            IconButton(
              iconSize: 30,
              icon: Icon(Icons.search, size: 24),
              onPressed: () {},
            ),
            IconButton(
              iconSize: 30,
              icon: Icon(Icons.person_outline, size: 24),
              onPressed: () {},
            ),
          ],
        ),
        body: TabBarView(
          controller: _tabController,
          children: [
            Container(
              color: Colors.redAccent,
              child: Center(
                child: Text(
                  _topBarTitles[0],
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
            Container(
              color: Colors.greenAccent,
              child: Center(
                child: Text(
                  _topBarTitles[1],
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _handleTabController() {
    final int index = _tabController.index;

    setState(() {
      _currentIndex = index;
      _topBarTitle = _topBarTitles[index];
    });
  }
}
```

#### 代码解释

1. 新增了`indicatorLength`表示位置指示器的长度。
2. 新增了`indicatorIndex`表示位置指示器当前位置。
3. 封装指示器的创建方法`_buildIndicator`，根据具体的指示器长度、位置、高度生成指示器控件。
4. 为`_MyHomePageState`新增`_currentIndex`和`_topBarTitle`两个状态值，用于同步`TopBar`的标题和指示器位置。
5. 为`TabBarView`设置`_tabController`，并添加监听，获取当前的page下标，同步到`TopBar`。
6. `TopBar`内容切换没有使用动画，有点生硬，后续再完善。

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163722.gif" alt="demo_video_03" style="zoom: 25%;" />

左右滑屏简单的完成了，我们先提个git记录。

``` shell
git commit -m 'Add TopBar as a navigation bar.'
```



## 推荐页

推荐页是滑屏第二个页面，是一个简单的列表页，下面是豆瓣FM的效果图。

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163735.gif" alt="demo_video_04" style="zoom:25%;" />

### 列表

首先实现列表的主体框架，新建`tab_recommend_page.dart`文件，代码如下：

``` dart
import 'package:flutter/material.dart';

class TabRecommendPage extends StatefulWidget {
  @override
  _TabRecommendPageState createState() => _TabRecommendPageState();
}

class _TabRecommendPageState extends State<TabRecommendPage> {
  @override
  Widget build(BuildContext context) {
    return ListView.builder(
        itemCount: 20,
        itemBuilder: (_, index) {
          return TabRecommendPageCell();
        });
  }
}

class TabRecommendPageCell extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(left: 20, right: 20, top: 16, bottom: 16),
      child: Column(
        children: <Widget>[
          Container(
            child: Column(
              children: <Widget>[
                Container(
                  padding: EdgeInsets.only(left: 16),
                  child: Row(
                    children: <Widget>[
                      Expanded(
                        child: Text(
                          '我想和你虚度时光',
                          maxLines: 2,
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  height: 30,
                  padding: EdgeInsets.only(left: 16),
                  child: Row(
                    children: <Widget>[
                      ClipOval(
                        child: Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            color: Colors.greenAccent,
                            borderRadius: BorderRadius.all(Radius.circular(16)),
                          ),
                          child: Image.network(
                              'https://img9.doubanio.com/icon/ul129958703-1.jpg'),
                        ),
                      ),
                      SizedBox(width: 8),
                      RichText(
                        text: TextSpan(
                          style: TextStyle(color: Colors.black, fontSize: 12),
                          children: <TextSpan>[
                            TextSpan(text: '来自'),
                            TextSpan(
                              text: ' Evo官方 ',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            TextSpan(text: '的推荐'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 8),
                ClipRRect(
                  clipBehavior: Clip.antiAlias,
                  borderRadius: BorderRadius.all(Radius.circular(8)),
                  child: Container(
                    height: 260,
                    decoration: BoxDecoration(
                      color: Colors.pinkAccent,
                    ),
                    child: Column(
                      children: <Widget>[
                        Container(
                          child: Image.network(
                            'https://p2.music.126.net/PJz3X_y5Il564dV27jHQeg==/2535473815844119.jpg',
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: <Widget>[
                            Container(
                              height: 60,
                              padding: EdgeInsets.only(left: 16),
                              child: Center(
                                child: Container(
                                  width: 36,
                                  height: 36,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius:
                                        BorderRadius.all(Radius.circular(18)),
                                  ),
                                  child: GestureDetector(
                                    child: Icon(
                                      Icons.headset,
                                      color: Colors.black,
                                    ),
                                    onTap: () {},
                                  ),
                                ),
                              ),
                            ),
                            Container(
                              height: 60,
                              padding: EdgeInsets.only(right: 16),
                              child: Row(
                                children: <Widget>[
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(16)),
                                    ),
                                    child: GestureDetector(
                                      child: Icon(
                                        Icons.share,
                                        color: Colors.black,
                                      ),
                                      onTap: () {},
                                    ),
                                  ),
                                  SizedBox(width: 16),
                                  Container(
                                    width: 32,
                                    height: 32,
                                    decoration: BoxDecoration(
                                      color: Colors.white,
                                      borderRadius:
                                          BorderRadius.all(Radius.circular(16)),
                                    ),
                                    child: GestureDetector(
                                      child: Icon(
                                        Icons.favorite_border,
                                        color: Colors.redAccent,
                                      ),
                                      onTap: () {},
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

#### 代码解释

1. 推荐页`TabRecommendPage`主要使用`ListView.builder`创建一个列表

2. 列表项命名为`TabRecommendPageCell`，包含标题、推荐者头像、推荐者名称、推荐合集封面、试听按钮、分享按钮和收藏按钮。

3. FM的Cell有个三角遮罩，暂时简化掉。

    

ListView第一个展示当前日期和星期，和其它的cell有所区别，代码如下：

```dart
class TabRecommendPageHeader extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(16),
      child: ClipRRect(
        clipBehavior: Clip.antiAlias,
        borderRadius: BorderRadius.all(Radius.circular(8)),
        child: Container(
          // height: 130,
          color: Colors.white,
          child: Stack(
            children: <Widget>[
              Positioned(
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                child: Image.network(
                  'https://hbimg.huabanimg.com/dd618f5006aaff178eaa2a1aae563fd29736a633dcd76-yBwuSb_fw658',
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                child: Container(
                  height: 130,
                  padding: EdgeInsets.symmetric(horizontal: 32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      Text(
                        '每日私享歌单',
                        style: TextStyle(color: Colors.black, fontSize: 14),
                      ),
                      Text(
                        dayOfWeekString(),
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 40,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        dateString(),
                        style: TextStyle(color: Colors.black, fontSize: 14),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String dateString() {
    final DateTime now = DateTime.now();
    return DateFormat('yyyy.MM.dd').format(now);
  }

  String dayOfWeekString() {
    final DateTime now = DateTime.now();
    return DateFormat.E().format(now);
  }
}
```

`tab_recommend_page.dart`中的`_TabRecommendPageState`变为

``` dart
class _TabRecommendPageState extends State<TabRecommendPage> {

  @override
  void didChangeDependencies() {
    loadData();
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: 20,
      itemBuilder: (_, index) {
        if (index == 0) {
          return TabRecommendPageHeader();
        } else {
          return TabRecommendPageCell();
        }
      },
    );
  }
}
```

#### 代码解释

1. `TabRecommendPageHeader`是ListView的头部信息，展示当前日期和星期，同时配有一张底图
2. 日期格式化使用了`Intl`第三方库中的`DateFormat`类，需要再文件`pubspec.yaml`中添加依赖信息`intl: ^0.16.1`

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163800.png" style="zoom:25%;" />

至此，推荐页的骨架就搭好了，git记录一下

``` shell
git commit -m 'Add TabRecommendPage'
```

### 加载数据

我们接下来为ListView配置上真实的数据，开始想抓取豆瓣FM的接口，但是太复杂了，也有其他开发者已经整理出豆瓣FM的接口，但是只有音乐频道数据，没有推荐列表的数据。所以我这里沿用EvoRadio整理出来的Lava推荐歌单的数据。

为了更好的管理文件，我们开始采用BLoC的开发模式，首先我们在lib目录下新建一个`recommend_page`目录，然后在recommend目录下分别新建ui、model、data、bloc四个文件夹，最后把`tab_recommend_page.dart`文件移到`lib/recommend/ui`目录下，同时将`TabRecommendPageCell`拆分到文件`tab_recommend_page_cell.dart`中,将`TabRecommendPageHeader`拆分到文件`tab_recommend_page_header.dart`中。

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163836.jpg" alt="5E10C91C-C551-49FA-9E1E-2F7B93FC8E00" style="zoom:25%;" />

接下来我们需要新建一个模型类来封装`TabRecommendPageCell`的数据，在model目录下新建文件模型RecommendModel，文件名`recommend_model.dart`，为RecommendModel添加几个基本的属性，然后为TabRecommendPageCell新增cellModel属性和构造方法，并且使用cellModel的字段替换cell中对应信息的位置。

代码如下：

recommend_model.dart

``` dart
class RecommendModel {
  String id;
  String title;
  String avatarUrl;
  String userName;
  String imgUrl;
}
```

tab_recommend_page_cell.dart

``` dart
import 'package:flutter/material.dart';
import 'package:evo/recommend_page/model/recommend_model.dart';

class TabRecommendPageCell extends StatelessWidget {
  final RecommendModel cellModel;

  const TabRecommendPageCell({Key key, @required this.cellModel})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.only(left: 20, right: 20, top: 16, bottom: 16),
      child: Column(
        children: <Widget>[
          Container(
            child: Column(
              children: <Widget>[
                Container(
                  padding: EdgeInsets.only(left: 16),
                  child: Row(
                    children: <Widget>[
                      Expanded(
                        child: Text(
                          cellModel.title, // 歌单名称
                          maxLines: 2,
                          style: TextStyle(
                            color: Colors.black,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  height: 30,
                  padding: EdgeInsets.only(left: 16),
                  child: Row(
                    children: <Widget>[
                      ClipOval(
                        child: Container(
                          width: 24,
                          height: 24,
                          decoration: BoxDecoration(
                            color: Colors.greenAccent,
                            borderRadius: BorderRadius.all(Radius.circular(16)),
                          ),
                          child: Image.network(cellModel.avatarUrl), // 歌单作者图片
                        ),
                      ),
                      SizedBox(width: 8),
                      RichText(
                        text: TextSpan(
                          style: TextStyle(color: Colors.black, fontSize: 12),
                          children: <TextSpan>[
                            TextSpan(text: '来自'),
                            TextSpan(
                              text: ' ${cellModel.userName} ', // 歌单作者名称
                              style: TextStyle(fontWeight: FontWeight.bold),
                            ),
                            TextSpan(text: '的推荐'),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 8),
                ClipRRect(
                  clipBehavior: Clip.antiAlias,
                  borderRadius: BorderRadius.all(Radius.circular(8)),
                  child: Container(
                    height: 260,
                    decoration: BoxDecoration(
                      color: Colors.pinkAccent,
                    ),
                    child: Column(
                      children: <Widget>[
                        Container(
                          child: Image.network(
                            cellModel.imgUrl, // 歌单图片
                            height: 200,
                            width: double.infinity,
                            fit: BoxFit.cover,
                          ),
                        ),
// 省略部分代码
```

接下来我们需要一个网络库来加载网络数据，我选择[dio](https://pub.dev/packages/dio#-installing-tab-)，在`pubspec.yaml`文件添加dio依赖，然后运行`flutter pub get`进行安装。

``` yaml
dependencies:
  flutter:
    sdk: flutter
  # iOS风格图标
  cupertino_icons: ^0.1.2

  # 多语言库，时间格式化工具
  intl: ^0.16.1
  # 网络库
  dio: ^3.0.9
```

有了网络库，我们就可以加载网络数据了，下面切换到`tab_recommend_page.dart`文件，

代码如下：

``` dart
import 'package:flutter/material.dart';
import 'package:evo/recommend_page/model/recommend_model.dart';
import 'package:evo/recommend_page/ui/tab_recommend_page_cell.dart';
import 'package:evo/recommend_page/ui/tab_recommend_page_header.dart';
import 'package:dio/dio.dart';

class TabRecommendPage extends StatefulWidget {
  @override
  _TabRecommendPageState createState() => _TabRecommendPageState();
}

class _TabRecommendPageState extends State<TabRecommendPage> {
  List<RecommendModel> dataSourceItems = [];

  @override
  void didChangeDependencies() {
    loadData();
    super.didChangeDependencies();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: dataSourceItems.length + 1,
      itemBuilder: (_, index) {
        if (index == 0) {
          return TabRecommendPageHeader();
        } else {
          return TabRecommendPageCell(cellModel: dataSourceItems[index - 1]);
        }
      },
    );
  }

  void loadData() async {
    Dio dio = Dio();
    Response<Map> response = await dio.get(
        'http://www.lavaradio.com/api/radio.listGroundPrograms.json?_pn=3&_sz=20');
    print(response.data.toString());
    if (response.data['err'] == 'hapn.ok') {
      print('Request success');
      Map resultData = response.data['data'];
      if (resultData != null) {
        print(
            'Request result data size:${resultData['size']}, total:${resultData['total']}');
        List dataList = resultData['lists'];
        if (dataList != null && dataList.length > 0) {
          List<RecommendModel> newModels = [];
          for (Map item in dataList) {
            RecommendModel model = RecommendModel();
            model.id = item['program_id'];
            model.title = item['program_name'];
            model.imgUrl = item['pic_url'];
            model.userName = item['user']['uname'];
            model.avatarUrl = item['user']['pic_url'];

            newModels.add(model);
          }

          dataSourceItems.clear();
          setState(() {
            dataSourceItems.addAll(newModels);
          });
        }
      }
    }
  }
}
```

#### 代码解释

1. 使用dio加载LavaRadio的精选歌单接口
2. 成功获取到数据后装载到`List<RecommendModel> dataSourceItems`，然后通过setState刷新页面。
3. 因为ListView有个单独header cell，所有itemCount的值是dataSourceItems.length + 1。

TopBar上面的`Second Page`看着不顺眼，先改掉吧，字体改成26号。

另外再把Second Page设置为默认显示页。

top_bar.dart

``` dart
Text(
  title,
  style: TextStyle(
    color: Colors.black,
    fontSize: 26,
    fontWeight: FontWeight.bold,
  ),
),
```

main.dart

``` dart
class _MyHomePageState extends State<MyHomePage>
    with SingleTickerProviderStateMixin {
  TabController _tabController;
  int _currentIndex; // 下标
  String _topBarTitle;

  final List<String> _topBarTitles = ['私人兆赫', '今天']; // 新title

  @override
  void initState() {
    super.initState();

    _currentIndex = 1;
    _topBarTitle = _topBarTitles[_currentIndex];
		// 初始化TabBarView长度并设置初始位置
    _tabController = TabController(length: 2, vsync: this, initialIndex: _currentIndex);
    _tabController.addListener(_handleTabController);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      initialIndex: 1,
      child: Scaffold(
        appBar: TopBar(
          title: _topBarTitle,
          onTitleTapped: () {
            print('Tap title');
          },
          indicatorLength: 2,
          indicatorIndex: _currentIndex,
          children: <Widget>[
            IconButton(
              iconSize: 30,
              icon: Icon(Icons.search, size: 24),
              onPressed: () {},
            ),
            IconButton(
              iconSize: 30,
              icon: Icon(Icons.person_outline, size: 24),
              onPressed: () {},
            ),
          ],
        ),
        body: TabBarView(
          controller: _tabController,
          children: [
            Container(
              color: Colors.redAccent,
              child: Center(
                child: Text(
                  _topBarTitles[0],
                  style: TextStyle(color: Colors.white),
                ),
              ),
            ),
            TabRecommendPage(),
          ],
        ),
      ),
    );
  }

  void _handleTabController() {
    final int index = _tabController.index;

    setState(() {
      _currentIndex = index;
      _topBarTitle = _topBarTitles[index];
    });
  }
}
```



我们预览一下当前的效果。

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163853.jpg" alt="IMG_1B941DC83DD8-1" style="zoom: 25%;" />

提交一下代码：

``` shell
git commit -m '使用dio加载网络数据'
```



### Json序列化/反序列化

接口数据除了RecommendModel封装的几个简单属性之外，还有很多需要要用到的字段，如果一个个手写出来，显然太累了，这时我们就要借助一下工具来处理一下了，接下来我们就用built_value对数据进行序列化。

参考链接 [Sample](https://www.stacksecrets.com/flutter/how-to-use-built_value-library) [Introduction](https://www.stacksecrets.com/flutter/introduction-to-built_value-library-in-dart)

首先需要在文件`pubspec.yaml`中添加built_value依赖，以及两个辅助工具的依赖`build_runner`和`built_value_generator`，运行`flutter pub. get`进行安装。

``` yaml
dependencies:
  flutter:
    sdk: flutter
  # iOS风格图标
  cupertino_icons: ^0.1.2

  # 多语言库，时间格式化工具
  intl: ^0.16.1
  # 网络库
  dio: ^3.0.9
  # JSON序列化/反序列化
  built_value: ^7.0.9

dev_dependencies:
  flutter_test:
    sdk: flutter

  # JSON序列化/反序列化 辅助工具
  build_runner: ^1.8.1
  built_value_generator: ^7.0.9
```

然后让RecommendModel实现Built抽象类，具体代码如下

``` dart
import 'package:built_value/built_value.dart';

part 'recommend_model.g.dart';

abstract class RecommendModel
    implements Built<RecommendModel, RecommendModelBuilder> {
  RecommendModel._();

  factory RecommendModel([updates(RecommendModelBuilder b)]) = _$RecommendModel;

  String get id;
  String get title;
  String get avatarUrl;
  String get userName;
  String get imgUrl;
}
```

然后在Terminal中运行一下命令，就会自动生成一个`recommend_model.g.dart`文件。

```shell
flutter packages pub run build_runner build
```

g.dart包含了模型所有属性的getter、setter和构造方法，因为是自动生成的，所以我们可以把g.dart文件加到.gitignore文件中，不需要提交git。

```yaml
# built_value
*.g.dart
```

接着我们继续把接口的数据结构也封装成模型，这里可以借助这个[json转dart](https://charafau.github.io/json2builtvalue/)代码的网站，把接口返回的json字符串转换成dart代码，然后分拆到model目录下的各个model中。下面是我处理后的结果

lava_result.dart

```dart
import 'dart:convert';

import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:evo/recommend_page/model/lava_program.dart';
import 'package:evo/recommend_page/model/lava_serializers.dart';

part 'lava_result.g.dart';

abstract class LavaResult implements Built<LavaResult, LavaResultBuilder> {
  LavaResult._();

  factory LavaResult([updates(LavaResultBuilder b)]) = _$LavaResult;

  @BuiltValueField(wireName: 'err')
  String get err;
  @BuiltValueField(wireName: 'data')
  LavaData get data;

  String toJson() {
    return json.encode(serializers.serializeWith(LavaResult.serializer, this));
  }

  static LavaResult fromJson(String jsonString) {
    return serializers.deserializeWith(
        LavaResult.serializer, jsonDecode(jsonString));
  }

  static LavaResult fromMap(Map map) {
    return serializers.deserializeWith(LavaResult.serializer, map);
  }

  static Serializer<LavaResult> get serializer => _$lavaResultSerializer;
}

abstract class LavaData implements Built<LavaData, LavaDataBuilder> {
  LavaData._();

  factory LavaData([updates(LavaDataBuilder b)]) = _$LavaData;

  @BuiltValueField(wireName: 'size')
  String get size;
  @BuiltValueField(wireName: 'total')
  int get total;
  @BuiltValueField(wireName: 'lists')
  BuiltList<LavaProgram> get lists;

  String toJson() {
    return json.encode(serializers.serializeWith(LavaData.serializer, this));
  }

  static LavaData fromJson(String jsonString) {
    return serializers.deserializeWith(
        LavaData.serializer, json.decode(jsonString));
  }

  static Serializer<LavaData> get serializer => _$lavaDataSerializer;
}
```



lava_program.dart

``` dart
import 'dart:convert';

import 'package:built_collection/built_collection.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:evo/recommend_page/model/lava_channel.dart';
import 'package:evo/recommend_page/model/lava_user.dart';
import 'package:evo/recommend_page/model/lava_serializers.dart';

part 'lava_program.g.dart';

abstract class LavaProgram implements Built<LavaProgram, LavaProgramBuilder> {
  LavaProgram._();

  factory LavaProgram([updates(LavaProgramBuilder b)]) = _$LavaProgram;

  @BuiltValueField(wireName: 'program_id')
  String get programId;
  @BuiltValueField(wireName: 'program_name')
  String get programName;
  @BuiltValueField(wireName: 'program_desc')
  String get programDesc;
  @BuiltValueField(wireName: 'uid')
  String get uid;
  @BuiltValueField(wireName: 'create_time')
  String get createTime;
  @BuiltValueField(wireName: 'modify_time')
  String get modifyTime;
  @BuiltValueField(wireName: 'song_num')
  String get songNum;
  @BuiltValueField(wireName: 'status')
  String get status;
  @BuiltValueField(wireName: 'duration')
  String get duration;
  @BuiltValueField(wireName: 'key')
  String get key;
  @BuiltValueField(wireName: 'channels')
  BuiltList<LavaChannel> get channels;
  @BuiltValueField(wireName: 'user')
  LavaUser get user;
  @BuiltValueField(wireName: 'pic_url')
  String get picUrl;

  String toJson() {
    return json.encode(serializers.serializeWith(LavaProgram.serializer, this));
  }

  static LavaProgram fromJson(String jsonString) {
    return serializers.deserializeWith(
        LavaProgram.serializer, json.decode(jsonString));
  }

  static Serializer<LavaProgram> get serializer => _$lavaProgramSerializer;
}
```



lava_channel.dart

``` dart
import 'dart:convert';

import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:evo/recommend_page/model/lava_serializers.dart';

part 'lava_channel.g.dart';

abstract class LavaChannel implements Built<LavaChannel, LavaChannelBuilder> {
  LavaChannel._();

  factory LavaChannel([updates(LavaChannelBuilder b)]) = _$LavaChannel;

  @BuiltValueField(wireName: 'recommend')
  String get recommend;
  @BuiltValueField(wireName: 'channel_id')
  String get channelId;
  @BuiltValueField(wireName: 'radio_id')
  String get radioId;
  @BuiltValueField(wireName: 'channel_name')
  String get channelName;
  @BuiltValueField(wireName: 'english_name')
  String get englishName;
  @BuiltValueField(wireName: 'channel_desc')
  String get channelDesc;
  @BuiltValueField(wireName: 'rank')
  String get rank;
  @BuiltValueField(wireName: 'color')
  String get color;
  @BuiltValueField(wireName: 'pic_url')
  String get picUrl;
  String toJson() {
    return json.encode(serializers.serializeWith(LavaChannel.serializer, this));
  }

  static LavaChannel fromJson(String jsonString) {
    return serializers.deserializeWith(
        LavaChannel.serializer, json.decode(jsonString));
  }

  static Serializer<LavaChannel> get serializer => _$lavaChannelSerializer;
}
```



lava_user.dart

``` dart
import 'dart:convert';

import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:evo/recommend_page/model/lava_serializers.dart';

part 'lava_user.g.dart';

abstract class LavaUser implements Built<LavaUser, LavaUserBuilder> {
  LavaUser._();

  factory LavaUser([updates(LavaUserBuilder b)]) = _$LavaUser;

  @BuiltValueField(wireName: 'uid')
  String get uid;
  @BuiltValueField(wireName: 'uname')
  String get uname;
  @BuiltValueField(wireName: 'user_type')
  String get userType;
  @BuiltValueField(wireName: 'pic_url')
  String get picUrl;
  String toJson() {
    return json.encode(serializers.serializeWith(LavaUser.serializer, this));
  }

  static LavaUser fromJson(String jsonString) {
    return serializers.deserializeWith(
        LavaUser.serializer, json.decode(jsonString));
  }

  static Serializer<LavaUser> get serializer => _$lavaUserSerializer;
}
```

除了上述model之外，我们还需要一个总的Serializers来处理序列化和反序列化的程序，代码如下

lava_serializers.dart

``` dart
import 'package:built_collection/built_collection.dart';
import 'package:built_value/serializer.dart';
import 'package:built_value/standard_json_plugin.dart';
import 'package:evo/recommend_page/model/lava_channel.dart';
import 'package:evo/recommend_page/model/lava_program.dart';
import 'package:evo/recommend_page/model/lava_result.dart';
import 'package:evo/recommend_page/model/lava_user.dart';

part 'lava_serializers.g.dart';

@SerializersFor(
  [
    LavaResult,
    LavaProgram,
    LavaChannel,
    LavaUser,
  ],
)

final Serializers serializers =
    (_$serializers.toBuilder()..addPlugin(StandardJsonPlugin())).build();
```

model创建完成之后，再次运行built_value的生成命令，就可以得到所有model对应的g.dart文件了。

<img src="http://q8ffj20b0.bkt.clouddn.com/blog/2020-04-07-163924.jpg" alt="FF5EBDD2-B648-43D4-A5A4-3D16CF08EA3B" style="zoom:50%;" />

最后我们改造一下接口响应数据的加载方式，就可以轻松获取到所有的接口数据了。

代码如下

``` dart
  void loadData() async {
    Dio dio = Dio();
    Response response = await dio.request(
      'http://www.lavaradio.com/api/radio.listGroundPrograms.json?_pn=3&_sz=20',
      options: Options(responseType: ResponseType.plain),
    );
    print(response.data);
    LavaResult result = LavaResult.fromJson(response.data);

    if (result.err == 'hapn.ok') {
      print('Request success');
      LavaData resultData = result.data;
      if (resultData != null) {
        print(
            'Request result data size:${resultData.size}, total:${resultData.total}');
        BuiltList<LavaProgram> dataList = resultData.lists;
        if (dataList != null && dataList.length > 0) {
          List<RecommendModel> newModels = [];
          for (LavaProgram p in dataList) {
            RecommendModel model = RecommendModel((builder) => builder
              ..id = p.programId
              ..title = p.programName
              ..imgUrl = p.picUrl
              ..userName = p.user.uname
              ..avatarUrl = p.user.picUrl);
            newModels.add(model);
          }

          dataSourceItems.clear();
          setState(() {
            dataSourceItems.addAll(newModels);
          });
        }
      }
    }
  }
}
```

代码解释

1. dio响应使用plain模式，返回json字符串
2. 使用`LavaResult.fromJson`直接把字符串转换成模型
3. 为了隔离Lava接口对UI的侵入，将LavaProgram转成RecommendModel再使用



好像网络请求放在ui里有点不妥，我们把网络请求封装一下吧。

在lib目录下新建net目录，然后再新建一个lava_api.dart文件，把接口请求放到这里来。代码如下

``` dart
import 'package:dio/dio.dart';
import 'package:evo/recommend_page/model/lava_program.dart';
import 'package:evo/recommend_page/model/lava_result.dart';
import 'package:built_collection/built_collection.dart';

class Lava {
  static Future<BuiltList<LavaProgram>> fetchRecommendPrograms() async {
    Dio dio = Dio();
    Response response = await dio.request(
      'http://www.lavaradio.com/api/radio.listGroundPrograms.json?_pn=3&_sz=20',
      options: Options(responseType: ResponseType.plain),
    );
    print(response.data);
    LavaResult result = LavaResult.fromJson(response.data);

    if (result.err == 'hapn.ok') {
      print('Request success');
      LavaData resultData = result.data;
      if (resultData != null) {
        print(
            'Request result data size:${resultData.size}, total:${resultData.total}');
        BuiltList<LavaProgram> dataList = resultData.lists;
        if (dataList != null && dataList.length > 0) {
          return dataList;
        }
      }
    }

    return null;
  }
}
```

tab_recommend_page.dart

``` dart 
  void loadData() async {
    BuiltList<LavaProgram> dataList = await Lava.fetchRecommendPrograms();
    
    if (dataList != null && dataList.length > 0) {
      List<RecommendModel> newModels = [];
      for (LavaProgram p in dataList) {
        RecommendModel model = RecommendModel((builder) => builder
          ..id = p.programId
          ..title = p.programName
          ..imgUrl = p.picUrl
          ..userName = p.user.uname
          ..avatarUrl = p.user.picUrl);
        newModels.add(model);
      }

      dataSourceItems.clear();
      setState(() {
        dataSourceItems.addAll(newModels);
      });
    }
  }
```

到此，我们就完成网络数据的加载了！git记录一下。

``` shell
git commit -m '使用built_value处理json数据'
```



