---
title: Flutter学习笔记3 - 基础控件
description: Flutter 基础控件笔记：StatelessWidget、StatefulWidget 以及常用 Widget。
pubDate: 2020-02-05 20:14:39
lang: zh-cn
tags:
  - flutter
cover: https://tva1.sinaimg.cn/large/006tNbRwgy1gbjk29ezokj30yo0euaak.jpg
---

## Widget

在Flutter里，所有UI控件都叫Widget，包括基本的文本、按钮、图片，还有容器、布局，以及动画等等都通过`Widget`抽象类实现的。

Widget下面可分为两种子类，一种是无状态的，继承自`StatelessWidget`，只负责展示信息，没有交状态变化。`StatelessWidget`的构造方法只有一个`BuildContext`参数，context记录了widget树的上下文信息，可以通过context查找到指定特征的widget。

``` dart
class TestWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Widget();
  }
}
```



另一种是有状态的，继承自`StatefulWidget`，它比`StatelessWidget`多了一个`State`参数，State记录了widget的各种状态信息，当State发现变化时，会调用setState()方法通知Flutter framework，再次调用build方法重新构建widget树，从而达到更新UI的目的。

```dart
class TestWidget extends StatefulWidget {
  @override
  State createState() {
    return _ControlWidgetState();
  }
}

class _ControlWidgetState extends State<TestWidget> {
  int _counter = 0;
  @override
  Widget build(BuildContext context) {
		return Center(
    	child: RaisedButton(
      	child: Text("button " + _counter),
        onPressed: (){
          setState((){	// 调用setState()后build()方法会被重新调用
            _counter++;
          })
        }
      )
    );
  }
}
```



## 文本展示

Flutter提供的文本展示控件叫`Text`，可以设置文本字体大小、粗细、颜色等样式。`Text`控件不能指定自身尺寸，其宽高根据内容自适应。另外，还可以使用`TextSpan`组合不同样式的文本。

Text常用参数

``` dart
const Text(
  ...
  this.data, {// 文本内容
  this.style, // 文本样式，包括字体大小、颜色、粗细、背景色等
  this.textAlign, // 对齐方式
  this.overflow,  // 设置文本截断方式
  this.textScaleFactor, // 放大倍数
  this.maxLines, // 最大行数，默认是1
  ...
})
```

TextStyle常用参数

```dart
const TextStyle({
	...
  this.color,	// 字体色
  this.backgroundColor, // 背景色
  this.fontSize, // 字体大小
  this.fontWeight, // 粗细
  this.letterSpacing, // 字母间距
  this.height,	// 行高
  this.background, // 背景色
	this.shadows, // 阴影
	String fontFamily, // 字体
	...
  })
```

TextSpan常用参数

``` dart
const TextSpan({
  TextStyle style, // 通用样式
  Sting text,
  List<TextSpan> children, // 嵌套子TestSpan，
  GestureRecognizer recognizer, // 响应的手势
});
```

示例代码

```dart
Text(
  "Hello world！ " * 10,
  maxLines: 3,	
  textAlign: TextAlign.left,
  textScaleFactor: 1.5, 
	style: TextStyle(
		color: Colors.blue,
		fontSize: 17.0,
		fontWeight: FontWeight.bold,
	)
);

Text.rich(TextSpan(
  style: TextStyle(
  	fontSize: 20.0,
  )
	children: <Widget> [
    TextSpan(
    text: "Domain:"
    ),
    TextSpan(
    	text: "https://www.songjiaqiang.cn",
      style: TextStyle(
	      color: Colors.blue
      ),
      recognizer: _tapRecognizer
    )
  ]
));

```

## 图片展示

Flutter提供的图片展示控件有两个，一个是`Icon`，用于展示内置的矢量图标，另一个是`Image` ，用于加载标量图片。

### Image

系统内置了四种加载图片的方式，分别是项目资源，磁盘文件、网络、内存。

Image常用参数

``` dart
const Image({
  ...
  this.width, //图片的宽
  this.height, //图片高度
  this.color, //图片的混合色值
  this.colorBlendMode, //混合模式
  this.fit, //填充模式
  this.alignment = Alignment.center, //对齐方式
  this.repeat = ImageRepeat.noRepeat, //重复方式
  ...
})

```

图片填充模式

``` dart 
enum BoxFit {
  none,	// 按图片真实尺寸显示
  fill, // 拉伸图片填充容器
  contain, // 完全显示在容器内，如果图片尺寸比容器小，放大图片
  scaleDown, // 完全显示在容器内，如果图片尺寸比容器小，不放大
  cover, // 图片缩放到正好可以覆盖容器的大小
  fitWidth, // 图片水平方向填充容器，垂直方向等比缩放
  fitHeight, // 图片垂直方向填充容器，水平方向等比缩放
}
```

加载图片方式

``` dart
Image.asset("asset/path");
Image.file("/file/path");
Image.network("http://domain.com/image/url");
Image.memory(bytes) //  AssetBundle().load("/file/path"); byteData.buffer.asUint8List();
```

代码示例

```dart
Image.network( // 默认最大缓存数量是1000，最大缓存空间为100M，不做数据持久化
  "https://res.klook.com/image/upload/v1464854586/web3.0/mobile.jpg",
  width: 200,
  height: 100,
  fit: BoxFit.fill,
  color: Colors.blue,
  colorBlendMode: BlendMode.difference,
)
```

### Icon

Icon是一种字体图标，可以像字体一样设置文本样式，也可以通过TextSpan和文本混用，相对于Image具有体积小，矢量性的好处。

系统提供了一套Material风格的字体图标，可在pubspec.yaml文件配置启用。

``` yaml
flutter:
  uses-material-design: true
```

自定义图标字体

Step1：导入图片字体文件到工程目录，比如"fonts/iconfont.ttf"

Setp2：在`pubspec.yaml`文件配置自定义字体

``` yaml
fonts:
  - family: myIcon  #指定一个字体名
    fonts:
      - asset: fonts/iconfont.ttf
```

Step3：创建图标引用工具类

``` dart
class MyIcons{
  // book 图标
  static const IconData book = const IconData(
      0xe614, 
      fontFamily: 'myIcon', 
      matchTextDirection: true
  );
  // 微信图标
  static const IconData wechat = const IconData(
      0xec7d,  
      fontFamily: 'myIcon', 
      matchTextDirection: true
  );
}
```

Step4：使用字体图标

``` dart
Icon(Icons.accessible, color: Colors.green),
Icon(MyIcons.book, color: Colors.blue,),
```

## 按钮

Flutter提供了多个基本的Material按钮控件，比如`FlatButton`、`RaiseButton`、`IconButton`。可以设置按钮的基本样式和按压事件`onPressed`，自带`icon`构造函数可以直接设置带图标的按钮，自定义按钮内部布局可以使用child参数配置。

常用参数

``` dart
const RaisedButton({
    @required VoidCallback onPressed, // 点击事件
    VoidCallback onLongPress,	 // 长按事件
    Color textColor, //文本颜色
    Color disabledTextColor, // enabled=false时的文本颜色
    Color color,  // 按钮颜色
    Color disabledColor,  // enabled=false时的按钮颜色 
    Color highlightColor, // 高亮状态的按钮颜色
    EdgeInsetsGeometry padding, //内边距
    Widget child, //子控件
  }) 
```

代码示例

```dart
RaisedButton(
	child: Text("Button"),
	onLongPress: () => print("Loog Pressed Button"),
),

FlatButton.icon(
  icon: Icon(Icons.info),
  label: Text("Info"),
	onPressed: () => print("Pressed Button"),
),
```

## 输入框

Flutter提供的文本输入框叫`TextField`，通过`InputDecoration`设置文本的信息，通过`TextEditingController`监听文本框事件。

TextField的基础参数

``` dart 
const TextField({
  ...
  TextEditingController controller, // 编辑框控制器
  FocusNode focusNode, // 键盘焦点
  InputDecoration decoration = const InputDecoration(), // 编辑框样式，设置占位符
  TextInputType keyboardType, // 键盘类型
  TextStyle style, // 文本样式
  TextAlign textAlign = TextAlign.start, // 对齐方式
  bool autofocus = false, // 是否获得焦点
  bool obscureText = false, // 是否隐藏正在编辑的文本，用于密码输入
  int maxLines = 1, // 最大显示行数
  int maxLength, // 最大输入长度
  bool maxLengthEnforced = true,
  ValueChanged<String> onChanged, // 文本内容变化回调
  VoidCallback onEditingComplete, // 编辑结束回调
  List<TextInputFormatter> inputFormatters, // 校验输入内容格式
  bool enabled, // 是否可编辑
  this.cursorWidth = 2.0, // 光标宽度
  this.cursorRadius, // 光标圆角
  this.cursorColor, // 光标颜色
  ...
})
```

代码示例

```dart
class MessageForm extends StatefulWidget {
  @override
  State createState() {
    return _MessageFormState();
  }
}

class _MessageFormState extends State<MessageForm> {
  var _editController = TextEditingController();
  
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAignment: MainAxisAlignment.center,
      children: <Widget>[
        TextField(
          controller: _editController, // 需要控制器负责监听输入内容
          decoration: InputDecoration(
          	hintText: 'Type something',
          ),
        ),
        RaisedButton(
        	onPressed: () {
            print('_controller.text');
          }
          child: Text('Done'),
        ),
      ],
    );
  }
  
  @override 
  void dispose() {
    super.dispose();
    _editController.dispose();
  }
}
```

## 弹窗

Flutter提供的弹窗控件叫`AlertDialog`，可以设置标题、内容、按钮等属性，使用导航pop()方法退出。

常用参数

``` dart
const AlertDialog({
  Key key,
  this.title, //对话框标题组件
  this.titlePadding, // 标题填充
  this.titleTextStyle, //标题文本样式
  this.content, // 对话框内容组件
  this.contentPadding = const EdgeInsets.fromLTRB(24.0, 20.0, 24.0, 24.0), //内容的填充
  this.contentTextStyle,// 内容文本样式
  this.actions, // 对话框操作按钮组
  this.backgroundColor, // 对话框背景色
  this.elevation,// 对话框的阴影
  this.semanticLabel, //对话框语义化标签(用于读屏软件)
  this.shape, // 对话框外形
})
```

示例代码

``` dart
class TestWidget extends StatelessWidget {
  
  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAignment: MainAxisAlignment.center,
      children: <Widget>[
        RaisedButton(
          child: Text('Done'),
        	onPressed: () {
            showDialog(
            	context: context,
            	builder: (_) {	// 
              	return AlertDialog(	// 
                	title: Text('Title'),
              		content: Text('This is a Dialog'),
              		actions: <Widget> [
                		FlatButton(
                			child: Text('Cancel'),
                			onPressed: () => Navigator.of(context).pop(),
                		),
               			FlatButton(
                			child: Text('OK'),
                			onPressed: () => Navigator.of(context).pop(),
                		),
              		],
            		),
              }
            );
          },
        ),
      ],
    );
  }
}
```

## 更多控件

Flutter还提供了很多基础控件，比如单选框`Switch`、复选框`Checkbox`、进度指示器`LinearProgressIndicator`等等，就不一一列举了。

不过Flutter很多控件平时是用不到的，因此也被认为是过度设计了。



## 参考资料

Flutter中文网：https://book.flutterchina.club/chapter3/

Flutter学习指南 - UI布局和控件：https://juejin.im/post/5bd54b7be51d456c430e35f6

获取图片bytes：https://github.com/flutter/flutter/issues/17038

颜色混合模式：https://wenku.baidu.com/view/11635cf3ba0d4a7302763a95.html?re=view

Material Design Icons：https://material.io/resources/icons/?style=baseline