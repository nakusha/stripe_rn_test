import React from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Main = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1}}>
      <View>
        <TouchableOpacity
          style={{
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
          }}
          onPress={() => {
            navigation.navigate('Payment');
          }}>
          <Text>Go to Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Main;
