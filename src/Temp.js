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
  useStripe,
  PaymentIntents,
  useConfirmPayment,
} from '@stripe/stripe-react-native';
import {useNavigation} from '@react-navigation/native';

import PaymentService from './api/payment';

const STRIPE_PUBLISHABLE_KEY =
  'pk_test_51IBtHIGU6n2jo013IVGUzmmNAvmSGYJAx2JhXFxfkbjVvDznlxS2gblepUbneCGgiMPevhjOIIUTRlwHAW3Wblly00gY0RmiYx';
const STRIPE_SERVER_KEY =
  'sk_test_51IBtHIGU6n2jo0139xXNhXe2Fs1dTUexLFgUd3VLf1dc2YGModWyWtW72ueoe8asLbnOvCnoS41rzBBAWjxjkvYl00jPk6k0J6';

const Payment = () => {
  const [load, setLoading] = useState(true);
  const [pm, setPM] = useState('');
  const [cs, setCS] = useState('');
  const [pi, setPI] = useState('');
  const navigation = useNavigation();
  const {createPaymentMethod, handleCardAction} = useStripe();
  const {confirmPayment, loading} = useConfirmPayment();

  useEffect(() => {
    const initialize = async () => {
      await initStripe({
        publishableKey: STRIPE_PUBLISHABLE_KEY,
        urlScheme: '',
        setUrlSchemeOnAndroid: true,
      });
      setLoading(false);
    };
    initialize();
  }, []);

  const callNoWebhookPayEndpoint = async ({
    useStripeSdk,
    paymentMethodId,
    currency,
    items,
    paymentIntentId,
  }) => {
    const data =
      paymentIntentId !== ''
        ? {paymentIntentId}
        : {useStripeSdk, paymentMethodId, currency, items};
    const response = await fetch(`${API_URL}/pay-without-webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  };

  const handleConfirm = async () => {
    try {
      const result = await confirmPayment(cs, {
        type: 'Card',
        paymentMethodId: pm,
      });

      console.log(JSON.stringify(result));
    } catch (e) {
      console.log(e);
    }
  };

  const handlePayPress = async () => {
    setLoading(true);
    // 1. Gather customer billing information (ex. email)
    const billingDetails = {
      email: 'email@stripe.com',
      phone: '+48888000888',
      addressCity: 'Houston',
      addressCountry: 'US',
      addressLine1: '1459  Circle Drive',
      addressLine2: 'Texas',
      addressPostalCode: '77063',
    }; // mocked data for tests

    // 2. Create payment method
    const {paymentMethod, error} = await createPaymentMethod({
      type: 'Card',
      billingDetails,
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      setLoading(false);
      return;
    }
    if (!paymentMethod) {
      setLoading(false);
      return;
    }

    // 3. call API to create PaymentIntent
    const paymentIntentResult = await callNoWebhookPayEndpoint({
      useStripeSdk: true,
      paymentMethodId: paymentMethod.id,
      currency: 'usd', // mocked data
      items: [{id: 'id'}],
    });

    console.log(
      '!@#!@#!@#!@#!@#!@#!@#!@#!@#!@#!@#!@#!@#!@',
      paymentIntentResult,
    );

    const {
      client_secret,
      error: paymentIntentError,
      requiresAction,
    } = paymentIntentResult;

    if (paymentIntentError) {
      // Error during creating or confirming Intent
      Alert.alert('Error222', paymentIntentError);
      return;
    }

    // if (client_secret) {
    //   // Payment succedeed
    //   Alert.alert('Success', 'The payment was confirmed successfully!');
    // }

    if (client_secret) {
      // 4. if payment requires action calling handleCardAction
      const {error: cardActionError, paymentIntent} = await handleCardAction(
        client_secret,
      );

      if (cardActionError) {
        Alert.alert(
          `Error code: ${cardActionError.code}`,
          cardActionError.message,
        );
      } else if (paymentIntent) {
        if (
          paymentIntent.status === PaymentIntents.Status.RequiresConfirmation
        ) {
          // 5. Call API to confirm intent
          await confirmIntent(paymentIntent.id);
        } else {
          // Payment succedeed
          Alert.alert('Success', 'The payment was confirmed successfully!');
        }
      }
    }

    setLoading(false);
  };

  const getPM = async () => {
    const card = {
      number: '4000002500003155',
      // number: '4242424242424242',
      exp_month: 12,
      exp_year: 2022,
      cvc: '123',
    };
    const result = await PaymentService.createPaymentMethod(card);
    setPM(result.data.id);
  };
  const getPI = async () => {
    const result = await PaymentService.createPaymentIntent({
      payment_method: pm,
    });

    setPI(result.data.id);
    setCS(result.data.client_secret);
  };

  return loading ? (
    <ActivityIndicator size={'large'} />
  ) : (
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
          onCardChange={cardDetails => {
            console.log('cardDetails', cardDetails);
          }}
          onFocus={focusedField => {
            console.log('focusField', focusedField);
          }}
        />
        <TouchableOpacity
          onPress={getPM}
          style={{
            height: 50,
            borderWidth: 1,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>pm : {pm}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={getPI}
          style={{
            height: 50,
            borderWidth: 1,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>cs : {cs}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            borderWidth: 1,
            marginBottom: 10,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>pi : {pi}</Text>
        </TouchableOpacity>
      </ScrollView>
      <TouchableOpacity
        style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
        }}
        onPress={handleConfirm}>
        <Text>결제하기</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
        }}
        onPress={handlePayPress}>
        <Text>SDK결제하기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Payment;
