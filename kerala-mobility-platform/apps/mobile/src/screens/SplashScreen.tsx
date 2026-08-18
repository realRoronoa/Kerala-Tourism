import React from 'react';
import SplashIntro from '../components/SplashIntro';

export default function SplashScreen({ navigation }: { navigation: any }) {
  return (
    <SplashIntro
      onFinish={() => {
        navigation.replace('Login');
      }}
    />
  );
}
