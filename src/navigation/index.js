import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// screen
import PaymentForm from '../PaymentForm';
import Main from '../Main';

const Stack = createNativeStackNavigator();

const StripeTestNavi = ({initialRouter = 'Main'}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouter}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Main" component={Main} headerMode="none" />
        <Stack.Screen
          name="Payment"
          component={PaymentForm}
          headerMode="none"
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StripeTestNavi;
