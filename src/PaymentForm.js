import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  initStripe,
  CardField,
  useConfirmPayment,
  StripeProvider,
} from '@stripe/stripe-react-native';
import {useNavigation} from '@react-navigation/native';

import PaymentService from './api/payment';

const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51IBtHIGU6n2jo013IVGUzmmNAvmSGYJAx2JhXFxfkbjVvDznlxS2gblepUbneCGgiMPevhjOIIUTRlwHAW3Wblly00gY0RmiYx';
const STRIPE_SERVER_KEY =
  'sk_test_51IBtHIGU6n2jo0139xXNhXe2Fs1dTUexLFgUd3VLf1dc2YGModWyWtW72ueoe8asLbnOvCnoS41rzBBAWjxjkvYl00jPk6k0J6';

//4000 0000 0000 3220 12/25 123
const Payment = () => {
  const navigation = useNavigation();
  const {confirmPayment, loading} = useConfirmPayment();

  useEffect(() => {
    const initialize = async () => {
      await initStripe({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
      });
    };
    initialize();
  }, []);

  const handlePayPress = async () => {
    const response = await fetch(
      `http://127.0.0.1:4242/payment/createPaymentIntent`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          paymentMethodType: 'card',
          currency: 'eur',
        }),
      },
    );

    // console.log('!@#!@#!@#!@#!@#!@#!@#', await response.json());
    const {clientSecret} = await response.json();

    const {error, paymentIntent} = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails: {name: 'JYS', email: 'runnway@naver.com'},
    });

    if (error) {
      console.log(error, error.message);
      Alert.alert('Error', `${error.message}`);
    } else if (paymentIntent) {
      Alert.alert('Success');
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <TouchableOpacity
            style={{
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
            }}
            onPress={() => {
              navigation.navigate('Main');
            }}>
            <Text>Go To Main</Text>
          </TouchableOpacity>
          <CardField
            postalCodeEnabled={false}
            placeholder={{number: '4242 4242 4242 4242'}}
            cardStyle={{
              backgroundColor: '#FFFFFF',
              textColor: '#000000',
            }}
            style={{
              width: '100%',
              height: 50,
              marginVertical: 30,
            }}
          />
        </ScrollView>

        <TouchableOpacity
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
          }}
          disabled={loading}
          onPress={handlePayPress}>
          <Text>SDK결제하기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </StripeProvider>
  );
};

export default Payment;
