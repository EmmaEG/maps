import React from 'react';
import {Button, StyleSheet, TextInput, View} from 'react-native';
import MapLibreGL from '@maplibre/maplibre-react-native';
import axios from 'axios';

export const App = () => {
  MapLibreGL.setAccessToken(null);


  const MAPTILER_API_KEY = 'KEY';
  const API_KEY = 'KEY';

  const [address, setAddress] = React.useState('');
  const [lat, setLat] = React.useState<number>(0);
  const [lon, setLon] = React.useState<number>(0);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/search?key=${API_KEY}&q=${address}&format=json`,
      );
      console.log(response.data.length);
      if (response.data.length >= 0) {
        
        const {lon, lat} = response.data[0];
        const longitude = parseFloat(lon);
        const latitude = parseFloat(lat);
        setLat(latitude);
        setLon(longitude);
        setAddress('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.page}>
      <TextInput
        style={styles.input}
        placeholder="Ingrese una dirección"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Buscar" onPress={handleSearch} />
      <View style={styles.container}>
        <MapLibreGL.MapView
          style={styles.map}
          styleURL={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_API_KEY}`}
          logoEnabled={false}
          attributionPosition={{bottom: 8, right: 8}}>
          <MapLibreGL.Camera
            zoomLevel={3}
            animationMode={'flyTo'}
            animationDuration={1100}
            centerCoordinate={[-60.13195196353277, -37.14984035]} // coordinate for BSAS
          />
          {lat !== 0 && lon !== 0 ? (
            <View>
              <MapLibreGL.PointAnnotation id={'1'} coordinate={[lon, lat]} />
            </View>
          ) : null}
        </MapLibreGL.MapView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '80%',
  },
  map: {
    flex: 1,
  },
  image: {
    width: 25,
    height: 25,
  },
  input: {
    width: '80%',
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
});
