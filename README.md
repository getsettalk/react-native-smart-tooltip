![owntooltipimage](https://github.com/user-attachments/assets/8e0bdab6-056e-4626-bbf6-6e84b5005a25)

# react-native-smart-tooltip

A lightweight, auto-positioning tooltip for React Native. It automatically calculates the position of the target element and opens the tooltip where there is available space (top or bottom), ensuring it never gets clipped off the screen.

Zero dependencies. Built entirely using React Native's native `Animated` API to avoid Reanimated layout conflicts.

## Features
-  **Auto-positioning**: Automatically decides whether to show above or below the element.
-  **Edge-safe**: Prevents the tooltip from bleeding outside the screen boundaries.
-  **Smart Pointer**: The triangle arrow always points exactly to the center of your target icon/text.
-  **Zero external dependencies**: No `react-native-reanimated` required.

## Installation

```
npm install react-native-smart-tooltip
```
or if you use yarn:

```
yarn add react-native-smart-tooltip
```

# Basic Usage
Simply wrap the component you want to trigger the tooltip with the `<Tooltip>` component.

```
import React from 'react';
import { View, Text } from 'react-native';
import Tooltip from 'react-native-smart-tooltip';

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      <Tooltip content="Automatically backs up your data every night.">
        <View style={{ padding: 10, backgroundColor: '#e0e0e0', borderRadius: 8 }}>
          <Text>Backup Info</Text>
        </View>
      </Tooltip>

    </View>
  );
};

export default App;

```


| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `content` | `string` | **Required** | The text to show inside the tooltip bubble. |
| `children` | `React.ReactNode` | **Required** | The trigger element (e.g., Icon, Button, Text). |
| `backgroundColor` | `string` | `#333333` | Background color of the tooltip and arrow. |
| `textColor` | `string` | `#FFFFFF` | Color of the tooltip text. |
| `textAlign` | `'left' \| 'center' \| 'right'` | `'left'` | Alignment of the text inside the bubble. |
| `borderRadius` | `number` | `8` | Border radius of the tooltip container. |
| `maxWidth` | `number` | `280` | Maximum width of the tooltip before text wraps to a new line. |
| `containerStyle` | `ViewStyle` | `undefined` | Additional styles for the tooltip container. |
| `textStyle` | `TextStyle` | `undefined` | Additional styles for the text. |


## Important Note for Android
To ensure the tooltip measures the trigger element accurately on Android, the Tooltip component automatically wraps your children in a Pressable with collapsable={false}. Ensure your child component doesn't block touches.


## License
MIT © Sujeet Kumar
