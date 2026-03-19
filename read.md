# wordcloud2.js APIs

## 功能检测

    WordCloud.isSupported

如果浏览器不提供 wordcloud2.js 运行所需的必要功能，此属性将评估为 `false`。

## 最小字体大小

某些浏览器对最小字体大小有偏好设置，这些设置也会影响 canvas。
wordcloud2.js 通过缩放画布来解决这个问题，但您可能有兴趣了解该偏好设置的值。检测到的值可通过以下方式访问：

	WordCloud.minFontSize

## 停止渲染

有时我们需要停止 wordcloud2.js 渲染，以优化组件渲染性能，特别是在一些前端库如 'React' 中。
在这种情况下，您可以调用以下函数：

	WordCloud.stop

```js
useEffect(() => {
  ...
  return () => {
    // 停止渲染
    WordCloud.stop();
  };
}, [deps]);
```

## 使用方法

    WordCloud(elements, options);

`elements` 是 canvas 的 DOM 元素，例如 `document.getElementById('my_canvas')` 或 jQuery 中的 `$('#my_canvas')[0]`。
它也可以是 DOM 元素的数组。如果传递的是 `<canvas>` 元素，词云将在其上生成图像；如果是其他元素，词云将创建 `<span>` 元素并填充它。

根据应用场景，您可能希望创建图像（高保真但交互有限）或使用 DOM 创建"云"以进行进一步样式设计。

## 选项

作为 `options` 对象的属性，可用选项如下：

### 展示

* `list`：要在画布上绘制的单词/文本列表，以二维数组形式，格式为 `[word, size]`。
	* 例如：`[['foo', 12], ['bar', 6]]`
	* 可选地，您可以发送额外数据作为数组元素，格式为 `[word, size, data1, data2, ... ]`，然后可在 `click`、`hover` 交互的回调函数以及 fontWeight、color 和 classes 回调中使用这些数据。
	* 例如：`[['foo', 12, 'http://google.com?q=foo'], ['bar', 6, 'http://google.com?q=bar']]`。
* `fontFamily`：使用的字体。
* `fontWeight`：使用的字体粗细，可以是例如 `normal`、`bold` 或 `600`，或者是一个 `callback(word, weight, fontSize, extraData)` 函数，为列表中的每个项目指定不同的字体粗细。
* `color`：文本颜色，可以是任何 CSS 颜色，或者是一个 `callback(word, weight, fontSize, distance, theta)` 函数，为列表中的每个项目指定不同的颜色。
  您还可以使用内置关键字指定颜色：`random-dark` 和 `random-light`。如果是 DOM 云，颜色也可以是 `null`，以禁用在 span 元素中硬编码颜色（允许您在类级别自定义）。
* `classes`：对于 DOM 云，允许用户定义 span 元素的类。可以是普通类字符串（将相同的类应用于每个 span），或者是 `callback(word, weight, fontSize, extraData)` 函数，用于每个 span 的类定义。
  在 canvas 云或等于 `null` 时，此选项无效。
* `minSize`：在画布上绘制的最小字体大小。
* `weightFactor`：为列表中每个单词的 `size` 调用的函数或要乘以的数字。
* `clearCanvas`：在开始前用背景颜色绘制整个画布并将其视为空。
* `backgroundColor`：背景颜色。

### 尺寸

* `gridSize`：用于标记画布可用性的网格大小（以像素为单位）—— 网格大小越大，单词之间的间隙越大。
* `origin`："云"的原点，格式为 `[x, y]`。
* `drawOutOfBound`：设置为 `true` 以允许单词部分绘制在画布外。允许绘制大于画布大小的单词。
* `shrinkToFit`：设置为 `true` 以缩小单词以适应画布。如果 `drawOutOfBound` 设置为 `false`，效果最佳。 :warning: 此单词现在的 `weight` 会更低。

### 掩码

* `drawMask`：通过绘制正方形来可视化网格，以掩盖已绘制的区域。
* `maskColor`：掩码正方形的颜色。
* `maskGapWidth`：掩码正方形之间的间隙宽度。

### 时间

* `wait`：使用 `setTimeout` 在开始绘制下一个项目之前等待 *x* 毫秒。
* `abortThreshold`：如果循环中的调用超过 *x* 毫秒（并阻塞浏览器），立即中止。
* `abort`：中止时调用的回调函数。

### 旋转

* `minRotation`：如果单词应该旋转，文本应旋转的最小旋转角度（以弧度为单位）。
* `maxRotation`：如果单词应该旋转，文本应旋转的最大旋转角度（以弧度为单位）。将两个值设置为相等以保持所有文本在一个角度。
* `rotationSteps`：强制使用定义数量的角度。在 -90°/90° 范围内将值设置为 2 意味着仅使用 -90、0 或 90。

### 随机性

* `shuffle`：打乱要绘制的点，以便相同的列表和设置每次都会产生不同的结果。
* `rotateRatio`：单词旋转的概率。将数字设置为 1 以始终旋转。

### 形状

* `shape`：要绘制的"云"的形状。可以是任何表示为回调函数的极坐标方程，或当前存在的关键字。
可用的预设形状有 `circle`（默认）、`cardioid`（苹果或心形曲线，最著名的极坐标方程）、`diamond`、`square`、`triangle-forward`、`triangle`（`triangle-upright` 的别名）、`pentagon` 和 `star`。
* `ellipticity`：wordcloud2.js 应绘制的形状的"扁平度"程度。

### 交互

* `hover`：当光标进入或离开单词占据的区域时调用的回调。回调将接收参数 `callback(item, dimension, event)`，其中 `event` 是原始 `mousemove` 事件。
* `click`：当用户点击单词时调用的回调。回调将接收参数 `callback(item, dimension, event)`，其中 `event` 是原始 `click` 事件。

## 事件

您可以监听从 canvas 元素触发的这些自定义 DOM 事件，而不是使用回调来采取适当的行动。
取消前两个事件会导致操作立即停止。

* `wordcloudstart`
* `wordclouddrawn`
* `wordcloudstop`
* `wordcloudabort`

wordcloud2.js 本身会在 `wordcloudstart` 事件时停止。