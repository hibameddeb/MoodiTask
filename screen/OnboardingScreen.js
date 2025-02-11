import React from 'react';
import { StyleSheet, Button, TouchableOpacity, Text, View, Image } from 'react-native';
import { useFonts } from 'expo-font';
import Onboarding from 'react-native-onboarding-swiper';

const Skip = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}> 
    <Text style={{fontSize:18 ,fontFamily:'montserrat.regular' }}>Skip</Text>
  </TouchableOpacity>
 
);

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}> 
    <Text style={{fontSize:18 ,fontFamily:'montserrat.regular'}}> Done</Text>
  </TouchableOpacity>
);

const Dots = ({ selected }) => {
  let backgroundColor = selected ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)'; 
  return (
    <View
      style={{
        width: 5,
        height: 5,
        marginHorizontal: 3,
        backgroundColor,
        
      }}
    />
  );
};

const OnboardingScreen = ({ navigation }) => { 
  const [fontsLoaded] = useFonts({
      'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
      'montserrat.regular': require('../assets/fonts/montserrat.regular.ttf'),
    });
  return (
    <Onboarding
      SkipButtonComponent={Skip}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace("Welcome")}
      onDone={() => navigation.navigate("Welcome")}
      pages={[
        {
          backgroundColor: '#fff',
          image: <Image style={styles.image} source={require('../assets/im1.png')} />,
          title:'Empower your mind to adapt, grow, and achieve.',
          subtitle: ' The tools for transformation are now at your fingertips!',
          TitleStyles: styles.title,
          subTitleStyles: styles.subtitle,
        },
        {
          backgroundColor: '#fff',
          image: <Image style={styles.image} source={require('../assets/im2.png')} />,
          title:'Stay on top of your tasks!',
          subtitle: 'Easily check off items and keep track of your progress step by step',
          TitleStyles: styles.title,
          subTitleStyles: styles.subtitle,
        },
        {
          backgroundColor: '#fff',
          image: <Image style={styles.image} source={require('../assets/im3.png')} />,
          title:'Track your mood with ease!',
          subtitle: ' Tap to record how you are feeling and gain insights into your emotional well-being.',
          TitleStyles: styles.title,
          subTitleStyles: styles.subtitle,
          
        },
        {
          backgroundColor: '#fff',
          image: <Image style={styles.image} source={require('../assets/im4.png')} />,
          title: 'Secure your data effortlessly !  ',
          subtitle: 'Enjoy peace of mind knowing your information is safe with us.',
          TitleStyles: styles.title,
          subTitleStyles: styles.subtitle,
          
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:'montserrat.regular'
  },
  image:{
    width: 300,
    height: 300,
    

  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily:'',
    fontFamily:'montserrat.regular'
  },
  title:{
    fontFamily:'montserrat.regular',
  }
});

export default OnboardingScreen;
