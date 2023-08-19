import React from 'react';
import { View } from 'react-native';

const ProgressBar = ({ percentage }) => {
  return (
    <View style={{
      width: '50%',
      height: 10,
      backgroundColor: '#ddd',
      borderRadius: 5,
      overflow: 'hidden',
      marginTop: 20
    }}>
      <View style={{
        width: `${percentage}%`,
        height: '100%',
        backgroundColor: 'green',
        borderRadius: 5,
      }}></View>
    </View>
  );
};

export default ProgressBar;
